// User Types
export interface User {
  id: string
  email: string
  name: string
  image?: string
  role: 'user' | 'admin'
  subscription?: Subscription
  healthProfile?: HealthProfile
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HealthProfile {
  userId: string
  healthConditions: string[]
  allergies: string[]
  dietaryPreferences: string[]
  fitnessLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  goals: string[]
  medications?: string[]
  targetCalories?: number
  targetWeight?: number
  currentWeight?: number
  height?: number
  age?: number
  gender?: 'male' | 'female' | 'other'
}

export interface Subscription {
  id: string
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripePriceId: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

// Meal Plan Types
export interface MealPlan {
  id: string
  userId: string
  name: string
  description: string
  healthCondition: string
  duration: number // days
  meals: DayMealPlan[]
  shoppingList: ShoppingList
  nutritionSummary: NutritionSummary
  createdAt: Date
}

export interface DayMealPlan {
  day: number
  date: Date
  breakfast: Meal
  lunch: Meal
  dinner: Meal
  snacks?: Meal[]
  totalNutrition: NutritionInfo
}

export interface Meal {
  id: string
  name: string
  description: string
  cookingTime: number
  prepTime: number
  servings: number
  ingredients: Ingredient[]
  instructions: string[]
  nutrition: NutritionInfo
  tags: string[]
  image?: string
}

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}
