
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  healthProfile: {
    condition: {
      type: String,
      enum: ['diabetes-type-2', 'hypertension', 'pcos', 'heart-disease', 'general-wellness'],
      default: 'general-wellness'
    },
    dietaryPreferences: [String],
    allergies: [String],
    targetCalories: Number,
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly-active', 'moderately-active', 'very-active'],
      default: 'moderately-active'
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    }
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', userSchema)
