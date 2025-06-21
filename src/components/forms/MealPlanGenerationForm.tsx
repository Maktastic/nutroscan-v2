'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Loader2,
  Sparkles,
  ChefHat,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const DURATION_OPTIONS = [
  { value: 3, label: '3 Days', description: 'Perfect for trying out' },
  { value: 7, label: '1 Week', description: 'Most popular choice' },
  { value: 14, label: '2 Weeks', description: 'Build lasting habits' },
  { value: 30, label: '1 Month', description: 'Complete transformation' },
]

const COOKING_TIME_OPTIONS = [
  { value: 'minimal', label: 'Quick & Easy', icon: '⚡', description: '15-20 minutes' },
  { value: 'moderate', label: 'Moderate', icon: '⏱️', description: '30-45 minutes' },
  { value: 'extensive', label: 'Gourmet', icon: '👨‍🍳', description: '45+ minutes' },
]

const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Budget Friendly', icon: '💰', description: '$5-8 per meal' },
  { value: 'moderate', label: 'Moderate', icon: '💵', description: '$8-12 per meal' },
  { value: 'premium', label: 'Premium', icon: '💎', description: '$12+ per meal' },
]

const CUISINE_OPTIONS = [
  'Mediterranean', 'Asian', 'Mexican', 'Italian', 
  'American', 'Indian', 'Middle Eastern', 'French'
]

export function MealPlanGenerationForm() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  
  const [formData, setFormData] = useState({
    duration: 7,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    cookingTime: 'moderate',
    budgetLevel: 'moderate',
    cuisinePreferences: [] as string[],
    customNotes: '',
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    setCurrentStep(0)

    try {
      // Simulate progress steps
      const steps = [
        'Analyzing your health profile...',
        'Selecting nutritious ingredients...',
        'Balancing macronutrients...',
        'Creating delicious recipes...',
        'Optimizing for your preferences...',
        'Finalizing your meal plan...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      const response = await fetch('/api/meal-plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan')
      }

      toast.success('Meal plan generated successfully!')
      router.push(`/meal-plans/${data.mealPlan._id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate meal plan')
      setIsGenerating(false)
    }
  }

  const progressSteps = [
    'Analyzing your health profile...',
    'Selecting nutritious ingredients...',
    'Balancing macronutrients...',
    'Creating delicious recipes...',
    'Optimizing for your preferences...',
    'Finalizing your meal plan...'
  ]

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
            <ChefHat className="w-12 h-12 text-emerald-600" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Creating Your Perfect Meal Plan
          </h3>
          <p className="text-sm text-gray-600 animate-pulse">
            {progressSteps[currentStep]}
          </p>
        </div>

        <div className="w-full max-w-xs">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-emerald-500 h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / progressSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Duration Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">How long would you like your meal plan?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, duration: option.value })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.duration === option.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold text-gray-900">{option.label}</div>
              <div className="text-xs text-gray-600 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-lg font-semibold">
          When would you like to start?
        </Label>
        <div className="relative max-w-xs">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="pl-10"
          />
        </div>
      </div>

      {/* Cooking Time */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">How much time can you spend cooking?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COOKING_TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, cookingTime: option.value })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.cookingTime === option.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-semibold text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Level */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">What's your budget preference?</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BUDGET_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, budgetLevel: option.value })}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.budgetLevel === option.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-semibold text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Preferences */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Any cuisine preferences? (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CUISINE_OPTIONS.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => {
                const newCuisines = formData.cuisinePreferences.includes(cuisine)
                  ? formData.cuisinePreferences.filter(c => c !== cuisine)
                  : [...formData.cuisinePreferences, cuisine]
                setFormData({ ...formData, cuisinePreferences: newCuisines })
              }}
              className={`p-3 rounded-lg border transition-all ${
                formData.cuisinePreferences.includes(cuisine)
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Notes */}
      <div className="space-y-2">
        <Label htmlFor="customNotes" className="text-lg font-semibold">
          Any special requests? (Optional)
        </Label>
        <textarea
          id="customNotes"
          value={formData.customNotes}
          onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
          placeholder="E.g., No spicy food, prefer organic ingredients, need nut-free options..."
          className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
        />
      </div>

      {/* AI Notice */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">AI-Powered Personalization</p>
            <p className="text-sm text-gray-600 mt-1">
              Our AI will create a meal plan specifically tailored to your health condition, 
              dietary preferences, and lifestyle needs.
            </p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleGenerate}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate My Meal Plan
        </Button>
      </div>
    </div>
  )
}
