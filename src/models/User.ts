import mongoose from 'mongoose'

const healthProfileSchema = new mongoose.Schema({
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
})

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
    required: function() {
      return !this.googleId
    },
  },
  googleId: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  healthProfile: healthProfileSchema,
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', userSchema)