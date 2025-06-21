import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Optional for OAuth users
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  image: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  emailVerified: Date,
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  healthProfile: {
    type: Schema.Types.ObjectId,
    ref: 'HealthProfile',
  },
  subscription: {
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripePriceId: String,
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
    },
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: Boolean,
  },
}, {
  timestamps: true,
})

const User = models.User || model('User', UserSchema)

export default User
