import { Schema, model, models } from 'mongoose'

const HealthProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  // Personal Information
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  height: {
    value: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      enum: ['cm', 'ft'],
      default: 'cm',
    },
  },
  weight: {
    value: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
  },
  // Health Conditions
  primaryHealthCondition: {
    type: String,
    required: true,
    enum: [
      'diabetes-type-2',
      'diabetes-type-1',
      'hypertension',
      'heart-disease',
      'pcos',
      'obesity',
      'high-cholesterol',
      'thyroid-issues',
      'kidney-disease',
      'ibs',
      'celiac-disease',
      'arthritis',
      'metabolic-syndrome',
      'prediabetes',
      'general-wellness',
    ],
  },
  secondaryConditions: [{
    type: String,
    enum: [
      'diabetes-type-2',
      'diabetes-type-1',
      'hypertension',
      'heart-disease',
      'pcos',
      'obesity',
      'high-cholesterol',
      'thyroid-issues',
      'kidney-disease',
      'ibs',
      'celiac-disease',
      'arthritis',
      'metabolic-syndrome',
      'prediabetes',
    ],
  }],
  // Dietary Information
  dietaryPreferences: [{
    type: String,
    enum: [
      'vegetarian',
      'vegan',
      'pescatarian',
      'keto',
      'paleo',
      'mediterranean',
      'low-carb',
      'low-fat',
      'gluten-free',
      'dairy-free',
      'halal',
      'kosher',
      'intermittent-fasting',
      'dash-diet',
      'anti-inflammatory',
    ],
  }],
  allergies: [{
    type: String,
    trim: true,
  }],
  intolerances: [{
    type: String,
    trim: true,
  }],
  // Lifestyle
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
    required: true,
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24,
  },
  stressLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very-high'],
  },
  // Goals
  goals: [{
    type: String,
    enum: [
      'weight-loss',
      'weight-gain',
      'muscle-gain',
      'improve-energy',
      'better-sleep',
      'reduce-inflammation',
      'manage-blood-sugar',
      'lower-blood-pressure',
      'improve-digestion',
      'hormone-balance',
      'reduce-cholesterol',
      'improve-mood',
    ],
  }],
  targetWeight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg',
    },
  },
  targetCalories: {
    type: Number,
    min: 1000,
    max: 5000,
  },
  // Preferences
  mealsPerDay: {
    type: Number,
    default: 3,
    min: 1,
    max: 6,
  },
  cookingTime: {
    type: String,
    enum: ['minimal', 'moderate', 'extensive'],
    default: 'moderate',
  },
  cookingSkill: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  budgetLevel: {
    type: String,
    enum: ['budget', 'moderate', 'premium'],
    default: 'moderate',
  },
  cuisinePreferences: [{
    type: String,
    enum: [
      'american',
      'mediterranean',
      'asian',
      'mexican',
      'italian',
      'indian',
      'middle-eastern',
      'japanese',
      'thai',
      'greek',
      'french',
      'spanish',
      'chinese',
      'korean',
    ],
  }],
  // Medical History (optional)
  medicalHistory: {
    medications: [{
      name: String,
      frequency: String,
    }],
    supplements: [{
      name: String,
      dosage: String,
    }],
    recentLabWork: {
      date: Date,
      notes: String,
    },
  },
  // Tracking Preferences
  trackingPreferences: {
    metricsToTrack: [{
      type: String,
      enum: [
        'weight',
        'bloodSugar',
        'bloodPressure',
        'energy',
        'mood',
        'sleep',
        'exercise',
        'waterIntake',
      ],
    }],
    reminderSettings: {
      mealReminders: {
        type: Boolean,
        default: true,
      },
      progressReminders: {
        type: Boolean,
        default: true,
      },
      reminderTime: {
        type: String,
        default: '09:00',
      },
    },
  },
  // Additional Notes
  additionalNotes: {
    type: String,
    maxlength: 1000,
  },
}, {
  timestamps: true,
})

// Indexes for performance
HealthProfileSchema.index({ userId: 1 })
HealthProfileSchema.index({ primaryHealthCondition: 1 })
HealthProfileSchema.index({ 'goals': 1 })

// Virtual for BMI calculation
HealthProfileSchema.virtual('bmi').get(function() {
  if (this.height?.value && this.weight?.value) {
    let heightInMeters = this.height.value
    let weightInKg = this.weight.value
    
    // Convert to metric if needed
    if (this.height.unit === 'ft') {
      heightInMeters = this.height.value * 30.48 / 100
    }
    if (this.weight.unit === 'lbs') {
      weightInKg = this.weight.value * 0.453592
    }
    
    const bmi = weightInKg / (heightInMeters * heightInMeters)
    return Math.round(bmi * 10) / 10
  }
  return null
})

// Virtual for BMI category
HealthProfileSchema.virtual('bmiCategory').get(function() {
  const bmi = this.bmi
  if (!bmi) return null
  
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obese'
})

// Method to calculate daily calorie needs
HealthProfileSchema.methods.calculateDailyCalories = function() {
  if (!this.height?.value || !this.weight?.value || !this.age || !this.gender || !this.activityLevel) {
    return null
  }

  let heightInCm = this.height.value
  let weightInKg = this.weight.value
  
  // Convert to metric if needed
  if (this.height.unit === 'ft') {
    heightInCm = this.height.value * 30.48
  }
  if (this.weight.unit === 'lbs') {
    weightInKg = this.weight.value * 0.453592
  }

  // Mifflin-St Jeor Equation
  let bmr
  if (this.gender === 'male') {
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * this.age) + 5
  } else {
    bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * this.age) - 161
  }

  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  }

  const tdee = bmr * activityMultipliers[this.activityLevel]

  // Adjust for goals
  if (this.goals.includes('weight-loss')) {
    return Math.round(tdee * 0.85) // 15% deficit
  } else if (this.goals.includes('weight-gain')) {
    return Math.round(tdee * 1.15) // 15% surplus
  }

  return Math.round(tdee)
}

const HealthProfile = models.HealthProfile || model('HealthProfile', HealthProfileSchema)

export default HealthProfile
