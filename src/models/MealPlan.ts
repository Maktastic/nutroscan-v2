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
