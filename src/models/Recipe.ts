import { Schema, model, models } from 'mongoose'

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'],
    required: true,
  },
  healthConditions: [{
    type: String,
    required: true,
  }],
  dietaryTags: [{
    type: String,
  }],
  cuisine: String,
  cookingTime: {
    type: Number,
    required: true,
  },
  prepTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  ingredients: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true },
    notes: String,
  }],
  instructions: [{
    step: { type: Number, required: true },
    instruction: { type: String, required: true },
    timing: String,
  }],
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sugar: { type: Number, required: true },
    sodium: { type: Number, required: true },
  },
  tips: [String],
  variations: [String],
  storageInstructions: String,
  image: String,
  video: String,
  source: {
    type: String,
    enum: ['ai-generated', 'user-created', 'nutritionist-approved', 'community'],
    default: 'ai-generated',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  approved: {
    type: Boolean,
    default: false,
  },
  rating: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 },
  },
  favorites: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

// Indexes
RecipeSchema.index({ name: 'text', description: 'text' })
RecipeSchema.index({ healthConditions: 1 })
RecipeSchema.index({ dietaryTags: 1 })
RecipeSchema.index({ 'rating.average': -1 })
RecipeSchema.index({ createdAt: -1 })

const Recipe = models.Recipe || model('Recipe', RecipeSchema)

export default Recipe
