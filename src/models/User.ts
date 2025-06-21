import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password?: string
  name: string
  role: 'user' | 'admin'
  provider?: 'credentials' | 'google'
  onboardingCompleted: boolean
  preferences?: {
    dietaryRestrictions: string[]
    allergies: string[]
    goals: string[]
    activityLevel: string
    budget: string
    cookingTime: string
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false, // Don't return password by default
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  preferences: {
    dietaryRestrictions: [String],
    allergies: [String],
    goals: [String],
    activityLevel: String,
    budget: String,
    cookingTime: String,
  },
}, {
  timestamps: true
})

export default mongoose.models.User || mongoose.model('User', userSchema)