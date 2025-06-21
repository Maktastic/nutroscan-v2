
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  healthProfile: {
    age: Number,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    height: Number, // in cm
    weight: Number, // in kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'very-active', 'extra-active']
    },
    condition: {
      type: String,
      enum: ['general-wellness', 'diabetes', 'heart-disease', 'hypertension', 'pcos', 'thyroid', 'kidney-disease', 'liver-disease']
    },
    dietaryPreferences: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'low-carb', 'low-fat', 'high-protein', 'gluten-free', 'dairy-free']
    }],
    allergies: [String],
    targetCalories: Number,
    goals: [{
      type: String,
      enum: ['weight-loss', 'weight-gain', 'muscle-gain', 'maintenance', 'improved-energy', 'better-digestion']
    }]
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', userSchema)
