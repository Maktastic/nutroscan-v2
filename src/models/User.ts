import { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'credentials'
    },
    select: false, // Don't include password by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  image: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'nutritionist'],
    default: 'user',
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'facebook'],
    default: 'credentials',
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  // Reference to health profile
  healthProfile: {
    type: Schema.Types.ObjectId,
    ref: 'HealthProfile',
  },
  // Subscription details
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
      enum: ['active', 'canceled', 'past_due', 'trialing', 'inactive'],
      default: 'inactive',
    },
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    trialEnd: Date,
  },
  // User preferences
  preferences: {
    language: {
      type: String,
      default: 'en',
    },
    timezone: {
      type: String,
      default: 'America/New_York',
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  // Additional fields
  phone: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
})

// Indexes
UserSchema.index({ role: 1 })
UserSchema.index({ 'subscription.status': 1 })
UserSchema.index({ createdAt: -1 })

// Virtual for full subscription status
UserSchema.virtual('isSubscribed').get(function() {
  return this.subscription?.status === 'active' || this.subscription?.status === 'trialing'
})

// Methods
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to generate password reset token
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')
  
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
    
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour
  
  return resetToken
}

const User = models.User || model('User', UserSchema)

export default User
