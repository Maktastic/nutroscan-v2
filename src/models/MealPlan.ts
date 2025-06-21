import { Schema, model, models } from 'mongoose'

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  unit: { type: String, required: true },
})

const NutritionSchema = new Schema({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  fiber: { type: Number, required: true },
  sugar: { type: Number, required: true },
  sodium: { type: Number, required: true },
})

const MealSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  cookingTime: { type: Number, required: true },
  prepTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  ingredients: [IngredientSchema],
  instructions: [{ type: String, required: true }],
  nutrition: { type: NutritionSchema, required: true },
  tips: [String],
  image: String,
})

const DayMealPlanSchema = new Schema({
  day: { type: Number, required: true },
  date: { type: Date, required: true },
  breakfast: MealSchema,
  lunch: MealSchema,
  dinner: MealSchema,
  snacks: [MealSchema],
  totalNutrition: NutritionSchema,
})

const ShoppingItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  category: { type: String, required: true },
  checked: { type: Boolean, default: false },
})

const MealPlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  healthCondition: {
    type: String,
    required: true,
  },
  dietaryPreferences: [String],
  duration: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  meals: [DayMealPlanSchema],
  shoppingList: [ShoppingItemSchema],
  nutritionSummary: {
    averageDailyCalories: Number,
    averageDailyProtein: Number,
    averageDailyCarbs: Number,
    averageDailyFat: Number,
    averageDailyFiber: Number,
  },
  healthTips: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft',
  },
  aiGenerated: {
    type: Boolean,
    default: true,
  },
  adherenceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
}, {
  timestamps: true,
})

// Indexes for performance
MealPlanSchema.index({ userId: 1, status: 1 })
MealPlanSchema.index({ userId: 1, startDate: -1 })
MealPlanSchema.index({ healthCondition: 1 })

const MealPlan = models.MealPlan || model('MealPlan', MealPlanSchema)

export default MealPlan
import mongoose from 'mongoose'

const mealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  healthCondition: String,
  startDate: Date,
  endDate: Date,
  meals: [{
    day: Number,
    date: Date,
    breakfast: {
      name: String,
      description: String,
      cookingTime: Number,
      prepTime: Number,
      servings: Number,
      ingredients: [{
        name: String,
        amount: Number,
        unit: String
      }],
      instructions: [String],
      nutrition: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        fiber: Number,
        sugar: Number,
        sodium: Number
      },
      tips: [String]
    },
    lunch: {
      name: String,
      description: String,
      cookingTime: Number,
      prepTime: Number,
      servings: Number,
      ingredients: [{
        name: String,
        amount: Number,
        unit: String
      }],
      instructions: [String],
      nutrition: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        fiber: Number,
        sugar: Number,
        sodium: Number
      },
      tips: [String]
    },
    dinner: {
      name: String,
      description: String,
      cookingTime: Number,
      prepTime: Number,
      servings: Number,
      ingredients: [{
        name: String,
        amount: Number,
        unit: String
      }],
      instructions: [String],
      nutrition: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        fiber: Number,
        sugar: Number,
        sodium: Number
      },
      tips: [String]
    },
    totalNutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
      sodium: Number
    }
  }],
  shoppingList: [{
    category: String,
    items: [{
      name: String,
      quantity: String,
      notes: String,
      checked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  nutritionSummary: {
    averageDailyCalories: Number,
    averageDailyProtein: Number,
    averageDailyCarbs: Number,
    averageDailyFat: Number,
    averageDailyFiber: Number
  },
  healthTips: [String]
}, {
  timestamps: true
})

export default mongoose.models.MealPlan || mongoose.model('MealPlan', mealPlanSchema)
