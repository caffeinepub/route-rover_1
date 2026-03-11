import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";

import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // Custom Types
  type BudgetCategory = {
    #accommodation;
    #food;
    #activities;
    #transport;
    #misc;
  };

  module BudgetCategory {
    public func toText(category : BudgetCategory) : Text {
      switch (category) {
        case (#accommodation) { "Accommodation" };
        case (#food) { "Food" };
        case (#activities) { "Activities" };
        case (#transport) { "Transport" };
        case (#misc) { "Miscellaneous" };
      };
    };
  };

  type Expense = {
    id : Text;
    user : Principal;
    tripId : Text;
    category : BudgetCategory;
    amount : Float;
    description : Text;
    date : Time.Time;
  };

  module Expense {
    public func compareByAmount(expense1 : Expense, expense2 : Expense) : Order.Order {
      Float.compare(expense1.amount, expense2.amount);
    };

    public func compareByDate(expense1 : Expense, expense2 : Expense) : Order.Order {
      Int.compare(expense1.date, expense2.date);
    };
  };

  type UserProfile = {
    name : Text;
    email : Text;
    preferredDestinations : [Text];
    interests : [Text];
    budgetPreference : Float;
  };

  type TravelNote = {
    id : Text;
    user : Principal;
    tripId : Text;
    title : Text;
    content : Text;
    category : Text;
    createdAt : Time.Time;
  };

  module TravelNote {
    public func compareByDate(note1 : TravelNote, note2 : TravelNote) : Order.Order {
      Int.compare(note1.createdAt, note2.createdAt);
    };
  };

  // Budget Management
  let budgets = Map.empty<Text, { tripId : Text; user : Principal; category : BudgetCategory; amount : Float }>();
  let expenses = Map.empty<Text, Expense>();

  // Travel Notes Management
  let travelNotes = Map.empty<Text, TravelNote>();

  // User Profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Trip ownership tracking
  let tripOwners = Map.empty<Text, Principal>();

  // Authorization State (from prefabricated auth component)
  let accessControlState = AccessControl.initState();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to check trip ownership
  private func isTripOwner(caller : Principal, tripId : Text) : Bool {
    switch (tripOwners.get(tripId)) {
      case (null) { false };
      case (?owner) { Principal.equal(owner, caller) };
    };
  };

  // Helper function to register trip ownership
  private func registerTripOwner(tripId : Text, owner : Principal) {
    switch (tripOwners.get(tripId)) {
      case (null) { tripOwners.add(tripId, owner) };
      case (?_) { /* Already registered */ };
    };
  };

  // Budget Management Functions
  public shared ({ caller }) func setTripBudget(tripId : Text, category : BudgetCategory, amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set budgets");
    };

    // Register trip ownership on first budget set
    registerTripOwner(tripId, caller);

    // Verify ownership
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can set budgets");
    };

    let budgetKey = tripId # BudgetCategory.toText(category);
    let budget = { tripId; user = caller; category; amount };
    budgets.add(budgetKey, budget);
  };

  public query ({ caller }) func getTripBudget(tripId : Text, category : BudgetCategory) : async ?{ category : BudgetCategory; amount : Float } {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can view budgets");
    };

    switch (budgets.get(tripId # BudgetCategory.toText(category))) {
      case (null) { null };
      case (?budget) { ?{ category = budget.category; amount = budget.amount } };
    };
  };

  // Expense Tracking Functions
  public shared ({ caller }) func addExpense(tripId : Text, category : BudgetCategory, amount : Float, description : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add expenses");
    };

    // Register trip ownership on first expense
    registerTripOwner(tripId, caller);

    // Verify ownership
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can add expenses");
    };

    let expenseId = caller.toText() # tripId # Time.now().toText();
    let expense : Expense = {
      id = expenseId;
      user = caller;
      tripId;
      category;
      amount;
      description;
      date = Time.now();
    };
    expenses.add(expenseId, expense);
    expenseId;
  };

  public query ({ caller }) func getTripExpenses(tripId : Text) : async [Expense] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can view expenses");
    };

    expenses.values().filter(func(expense) { expense.tripId == tripId }).toArray();
  };

  public query ({ caller }) func getExpensesByCategory(tripId : Text, category : BudgetCategory) : async [Expense] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can view expenses");
    };

    expenses.values().filter(func(expense) { expense.tripId == tripId and expense.category == category }).toArray();
  };

  public query ({ caller }) func getExpensesInAmountRange(tripId : Text, minAmount : Float, maxAmount : Float) : async [Expense] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can view expenses");
    };

    expenses.values().filter(func(expense) { expense.tripId == tripId and expense.amount >= minAmount and expense.amount <= maxAmount }).toArray();
  };

  // Travel Notes Management Functions
  public shared ({ caller }) func addTravelNote(tripId : Text, title : Text, content : Text, category : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add travel notes");
    };

    // Register trip ownership on first note
    registerTripOwner(tripId, caller);

    // Verify ownership
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can add notes");
    };

    let noteId = caller.toText() # tripId # Time.now().toText();
    let note : TravelNote = {
      id = noteId;
      user = caller;
      tripId;
      title;
      content;
      category;
      createdAt = Time.now();
    };
    travelNotes.add(noteId, note);
    noteId;
  };

  public query ({ caller }) func getTripNotes(tripId : Text) : async [TravelNote] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can view notes");
    };

    travelNotes.values().filter(func(note) { note.tripId == tripId }).toArray();
  };

  public query ({ caller }) func getNotesWithContentLength(tripId : Text, minLength : Nat) : async [TravelNote] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can view notes");
    };

    travelNotes.values().filter(func(note) { note.tripId == tripId and note.content.size() >= minLength }).toArray();
  };

  public shared ({ caller }) func deleteTravelNoteById(noteId : Text) : async () {
    switch (travelNotes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) {
        if (not Principal.equal(note.user, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can delete this note");
        };
        travelNotes.remove(noteId);
      };
    };
  };

  // Custom Filtering Functions (Protected, User or Admin)
  public query ({ caller }) func filterExpensesByDateRange(tripId : Text, startDate : Time.Time, endDate : Time.Time) : async [Expense] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can filter expenses");
    };

    expenses.values().filter(func(expense) { expense.tripId == tripId and expense.date >= startDate and expense.date <= endDate }).toArray();
  };

  public query ({ caller }) func getExpenseSummariesByRange(tripId : Text, startDate : Time.Time, endDate : Time.Time) : async [Expense] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can access expense summaries");
    };

    expenses.values().filter(func(expense) { expense.tripId == tripId and expense.date >= startDate and expense.date <= endDate }).toArray();
  };

  public query ({ caller }) func filterNotesByCategory(tripId : Text, category : Text) : async [TravelNote] {
    // Verify caller is trip owner or admin
    if (not isTripOwner(caller, tripId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only trip owner can filter notes");
    };

    travelNotes.values().filter(func(note) { note.tripId == tripId and note.category == category }).toArray();
  };
};
