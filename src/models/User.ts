
import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  email: string
  password?: string
  name: string
  role: 'user' | 'admin'
  onboardingCompleted: boolean
  profile?: {
    age?: number
    weight?: number
    height?: number
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
    dietaryRestrictions?: string[]
    healthGoals?: string[]
    allergies?: string[]
  }
  preferences?: {
    cuisineTypes?: string[]
    mealTypes?: string[]
    cookingTime?: number
    servingSize?: number
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  profile: {
    age: {
      type: Number,
      min: [1, 'Age must be at least 1'],
      max: [150, 'Age cannot exceed 150']
    },
    weight: {
      type: Number,
      min: [1, 'Weight must be at least 1 kg']
    },
    height: {
      type: Number,
      min: [1, 'Height must be at least 1 cm']
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
    },
    dietaryRestrictions: [{
      type: String,
      trim: true
    }],
    healthGoals: [{
      type: String,
      trim: true
    }],
    allergies: [{
      type: String,
      trim: true
    }]
  },
  preferences: {
    cuisineTypes: [{
      type: String,
      trim: true
    }],
    mealTypes: [{
      type: String,
      trim: true
    }],
    cookingTime: {
      type: Number,
      min: [1, 'Cooking time must be at least 1 minute']
    },
    servingSize: {
      type: Number,
      min: [1, 'Serving size must be at least 1'],
      default: 1
    }
  }
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', userSchema)
