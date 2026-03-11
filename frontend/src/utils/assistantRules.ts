interface AssistantContext {
  selectedDestination?: string;
  origin?: string;
  distance?: number;
}

export function generateAssistantResponse(message: string, context?: AssistantContext): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('weather') || lowerMessage.includes('forecast') || lowerMessage.includes('temperature')) {
    if (context?.selectedDestination) {
      return `I can help you check the weather for ${context.selectedDestination}. The weather widget on the dashboard shows current conditions and a 5-day forecast. Look for any weather alerts to plan your trip safely.`;
    }
    return 'To check weather conditions, select a destination from the Popular Destinations section. The weather widget will show you current conditions, forecasts, and any weather alerts for your chosen location.';
  }

  if (lowerMessage.includes('destination') || lowerMessage.includes('place') || lowerMessage.includes('where')) {
    return 'Browse our Popular Destinations section to discover amazing places around the world. We have 9+ destinations including Paris, Tokyo, Bali, New York, Swiss Alps, Santorini, Dubai, Rome, and Sydney. Each destination includes detailed information, best travel times, and top attractions.';
  }

  if (lowerMessage.includes('transport') || lowerMessage.includes('travel') || lowerMessage.includes('how to get')) {
    if (context?.selectedDestination && context?.origin) {
      return `For traveling from ${context.origin} to ${context.selectedDestination}, check the Transport Comparison section. It shows options for car, train, bus, and plane with duration, cost, and eco-friendly recommendations.`;
    }
    return 'Use the Transport Comparison feature to compare different travel options. Set your origin and destination to see duration, cost, and eco-friendly options for car, train, bus, and plane travel.';
  }

  if (lowerMessage.includes('distance') || lowerMessage.includes('how far') || lowerMessage.includes('kilometer')) {
    if (context?.distance) {
      return `The distance between your origin and destination is approximately ${Math.round(context.distance).toLocaleString()} km. You can view this on the Map & Distance tab with an interactive map showing both locations.`;
    }
    return 'Visit the Map & Distance tab to calculate the distance between any two locations. You can set your origin and destination to see the exact distance in kilometers on an interactive map.';
  }

  if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('expense') || lowerMessage.includes('money')) {
    return 'Track your travel expenses in the Budget section. Set budgets for different categories like accommodation, food, activities, and transport. Add expenses as you go to monitor your spending and stay within budget.';
  }

  if (lowerMessage.includes('note') || lowerMessage.includes('document') || lowerMessage.includes('save')) {
    return 'Use the Travel Notes feature to organize all your trip information. Create notes for itineraries, bookings, important contacts, and travel documents. Categorize them for easy access during your trip.';
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what can you')) {
    return 'I can help you with:\n• Weather forecasts and alerts\n• Popular destination recommendations\n• Transport options and comparisons\n• Distance calculations between locations\n• Budget tracking tips\n• Travel notes organization\n\nJust ask me about any of these topics!';
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! I am your Route Rover travel assistant. I can help you plan your trip by providing information about destinations, weather, transport options, distances, and more. What would you like to know?';
  }

  return 'I am here to help you plan your trip! Ask me about weather conditions, popular destinations, transport options, distance calculations, budget tracking, or travel notes. What would you like to know?';
}
