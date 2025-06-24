'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft,
  Check,
  Loader2,
  User,
  Heart,
  Apple,
  Target,
  ChefHat,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Health Profile', icon: Heart },
  { id: 3, title: 'Dietary Preferences', icon: Apple },
  { id: 4, title: 'Goals', icon: Target },
]

const HEALTH_CONDITIONS = [
  { value: 'diabetes-type-2', label: 'Type 2 Diabetes', description: 'Blood sugar management' },
  { value: 'diabetes-type-1', label: 'Type 1 Diabetes', description: 'Insulin-dependent diabetes' },
  { value: 'hypertension', label: 'Hypertension', description: 'High blood pressure' },
  { value: 'heart-disease', label: 'Heart Disease', description: 'Cardiovascular health' },
  { value: 'pcos', label: 'PCOS', description: 'Hormonal balance' },
  { value: 'obesity', label: 'Weight Management', description: 'Healthy weight loss' },
  { value: 'high-cholesterol', label: 'High Cholesterol', description: 'Lipid management' },
  { value: 'general-wellness', label: 'General Wellness', description: 'Overall health optimization' },
]

const DIETARY_PREFERENCES = [
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
  { value: 'keto', label: 'Keto', icon: '🥑' },
  { value: 'paleo', label: 'Paleo', icon: '🥩' },
  { value: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
  { value: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
  { value: 'dairy-free', label: 'Dairy Free', icon: '🥛' },
]

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'active', label: 'Very Active', description: '6-7 days/week' },
]

const GOALS = [
  { value: 'weight-loss', label: 'Lose Weight', icon: '📉' },
  { value: 'weight-gain', label: 'Gain Weight', icon: '📈' },
  { value: 'muscle-gain', label: 'Build Muscle', icon: '💪' },
  { value: 'improve-energy', label: 'More Energy', icon: '⚡' },
  { value: 'manage-blood-sugar', label: 'Blood Sugar Control', icon: '🩸' },
  { value: 'lower-blood-pressure', label: 'Lower Blood Pressure', icon: '❤️' },
  { value: 'better-sleep', label: 'Better Sleep', icon: '😴' },
  { value: 'reduce-inflammation', label: 'Reduce Inflammation', icon: '🔥' },
]

export default function OnboardingPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    // Step 1
    age: '',
    gender: '',
    height: '',
    weight: '',
    // Step 2
    primaryHealthCondition: '',
    secondaryConditions: [] as string[],
    // Step 3
    dietaryPreferences: [] as string[],
    allergies: '',
    // Step 4
    activityLevel: '',
    goals: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
          newErrors.age = 'Please enter a valid age'
        }
        if (!formData.gender) newErrors.gender = 'Please select your gender'
        if (!formData.height || parseInt(formData.height) < 1) {
          newErrors.height = 'Please enter your height'
        }
        if (!formData.weight || parseInt(formData.weight) < 1) {
          newErrors.weight = 'Please enter your weight'
        }
        break
      case 2:
        if (!formData.primaryHealthCondition) {
          newErrors.primaryHealthCondition = 'Please select your primary health focus'
        }
        break
      case 4:
        if (!formData.activityLevel) {
          newErrors.activityLevel = 'Please select your activity level'
        }
        if (formData.goals.length === 0) {
          newErrors.goals = 'Please select at least one goal'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)

    try {
      // const response = await fetch('/api/users/health-profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      // if (!response.ok) {
      //   throw new Error('Failed to save health profile')
      // }

      // Update session to mark onboarding as completed
      await update({
        ...session,
        user: {
          ...session?.user,
          onboardingCompleted: true,
        },
      })

      toast.success('Welcome to NutroScan Pro!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to complete setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Let's get to know you
              </h2>
              <p className="text-gray-600">
                This helps us personalize your meal plans
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && (
                  <p className="text-sm text-red-500 mt-1">{errors.age}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className={`w-full h-12 px-3 rounded-xl border ${
                    errors.gender ? 'border-red-500' : 'border-gray-200'
                  } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200`}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className={errors.height ? 'border-red-500' : ''}
                />
                {errors.height && (
                  <p className="text-sm text-red-500 mt-1">{errors.height}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
                )}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's your primary health focus?
              </h2>
              <p className="text-gray-600">
                We'll create meal plans specifically for your condition
              </p>
            </div>

            <div className="space-y-3">
              {HEALTH_CONDITIONS.map((condition) => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryHealthCondition: condition.value })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    formData.primaryHealthCondition === condition.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{condition.label}</div>
                  <div className="text-sm text-gray-600">{condition.description}</div>
                </button>
              ))}
            </div>

            {errors.primaryHealthCondition && (
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.primaryHealthCondition}
              </p>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Any dietary preferences?
              </h2>
              <p className="text-gray-600">
                Select all that apply (optional)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DIETARY_PREFERENCES.map((pref) => (
                <button
                  key={pref.value}
                  type="button"
                  onClick={() => {
                    const newPrefs = formData.dietaryPreferences.includes(pref.value)
                      ? formData.dietaryPreferences.filter(p => p !== pref.value)
                      : [...formData.dietaryPreferences, pref.value]
                    setFormData({ ...formData, dietaryPreferences: newPrefs })
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    formData.dietaryPreferences.includes(pref.value)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{pref.icon}</span>
                  <span className="font-medium">{pref.label}</span>
                </button>
              ))}
            </div>

            <div>
              <Label htmlFor="allergies">Any allergies or foods to avoid?</Label>
              <Input
                id="allergies"
                type="text"
                placeholder="e.g., nuts, shellfish, dairy..."
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="mt-1"
              />
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Final step: Your lifestyle & goals
              </h2>
              <p className="text-gray-600">
                Help us understand your activity level and what you want to achieve
              </p>
            </div>

            <div>
              <Label className="mb-3 block">How active are you?</Label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.activityLevel === level.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </button>
                ))}
              </div>
              {errors.activityLevel && (
                <p className="text-sm text-red-500 mt-1">{errors.activityLevel}</p>
              )}
            </div>

            <div>
              <Label className="mb-3 block">What are your health goals?</Label>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => {
                      const newGoals = formData.goals.includes(goal.value)
                        ? formData.goals.filter(g => g !== goal.value)
                        : [...formData.goals, goal.value]
                      setFormData({ ...formData, goals: newGoals })
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${
                      formData.goals.includes(goal.value)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{goal.icon}</span>
                    <span className="text-sm font-medium">{goal.label}</span>
                  </button>
                ))}
              </div>
              {errors.goals && (
                <p className="text-sm text-red-500 mt-1">{errors.goals}</p>
              )}
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <ChefHat className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to NutroScan Pro
          </h1>
          <p className="text-gray-600">
            Let's personalize your experience in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    currentStep > step.id
                      ? 'bg-emerald-600 text-white'
                      : currentStep === step.id
                      ? 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 transition-all ${
                      currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
