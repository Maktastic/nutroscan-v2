import { Schema, model, models } from 'mongoose'

const ProgressTrackingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  metrics: {
    weight: Number,
    bloodSugar: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    energy: {
      type: Number,
      min: 1,
      max: 10,
    },
    mood: {
      type: Number,
      min: 1,
      max: 10,
    },
    sleep: Number, // hours
    exercise: Number, // minutes
    waterIntake: Number, // liters
  },
  symptoms: [String],
  notes: {
    type: String,
    maxlength: 1000,
  },
  mealPlanAdherence: {
    type: Number,
    min: 0,
    max: 100,
  },
  achievements: [String],
}, {
  timestamps: true,
})

// Indexes
ProgressTrackingSchema.index({ userId: 1, date: -1 })
ProgressTrackingSchema.index({ userId: 1, createdAt: -1 })

const ProgressTracking = models.ProgressTracking || model('ProgressTracking', ProgressTrackingSchema)

export default ProgressTracking
