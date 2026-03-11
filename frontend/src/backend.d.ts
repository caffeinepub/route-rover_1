import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TravelNote {
    id: string;
    title: string;
    content: string;
    createdAt: Time;
    tripId: string;
    user: Principal;
    category: string;
}
export type Time = bigint;
export interface Expense {
    id: string;
    date: Time;
    tripId: string;
    user: Principal;
    description: string;
    category: BudgetCategory;
    amount: number;
}
export interface UserProfile {
    interests: Array<string>;
    budgetPreference: number;
    name: string;
    email: string;
    preferredDestinations: Array<string>;
}
export enum BudgetCategory {
    food = "food",
    misc = "misc",
    transport = "transport",
    activities = "activities",
    accommodation = "accommodation"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExpense(tripId: string, category: BudgetCategory, amount: number, description: string): Promise<string>;
    addTravelNote(tripId: string, title: string, content: string, category: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteTravelNoteById(noteId: string): Promise<void>;
    filterExpensesByDateRange(tripId: string, startDate: Time, endDate: Time): Promise<Array<Expense>>;
    filterNotesByCategory(tripId: string, category: string): Promise<Array<TravelNote>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExpenseSummariesByRange(tripId: string, startDate: Time, endDate: Time): Promise<Array<Expense>>;
    getExpensesByCategory(tripId: string, category: BudgetCategory): Promise<Array<Expense>>;
    getExpensesInAmountRange(tripId: string, minAmount: number, maxAmount: number): Promise<Array<Expense>>;
    getNotesWithContentLength(tripId: string, minLength: bigint): Promise<Array<TravelNote>>;
    getTripBudget(tripId: string, category: BudgetCategory): Promise<{
        category: BudgetCategory;
        amount: number;
    } | null>;
    getTripExpenses(tripId: string): Promise<Array<Expense>>;
    getTripNotes(tripId: string): Promise<Array<TravelNote>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setTripBudget(tripId: string, category: BudgetCategory, amount: number): Promise<void>;
}
