'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, Clock, DollarSign, Globe, Loader2, ChefHat } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const DURATION_OPTIONS = [
  { value: 3, label: '3 Days' },
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
]

const HEALTH_CONDITIONS = [
  'Type 2 Diabetes',
  'Hypertension',
  'PCOS',
  'Heart Disease',
  'Weight Loss',
  'General Wellness',
]

export default function GenerateDemoPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    healthCondition: '',
    duration: 7,
    dietaryPreferences: [] as string[],
  })

  const handleGenerate = async () => {
    if (!formData.healthCondition) {
      toast.error('Please select a health condition')
      return
    }

    setIsGenerating(true)
    
    // Simulate generation
    setTimeout(() => {
      toast.success('Demo meal plan generated!')
      router.push('/demo-meal-plan')
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ChefHat className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Try AI Meal Planning
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience how our AI creates personalized meal plans. No sign-up required.
          </p>
        </motion.div>

        {isGenerating ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Creating Your Meal Plan
            </h2>
            <p className="text-gray-600">
              Our AI is designing personalized meals for your health needs...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Health Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Your Health Focus
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {HEALTH_CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => setFormData({ ...formData, healthCondition: condition })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.healthCondition === condition
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Plan Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, duration: option.value })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.duration === option.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleGenerate}
                size="lg"
                className="px-12"
                disabled={!formData.healthCondition}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Demo Plan
              </Button>
            </div>

            {/* Demo Notice */}
            <div className="text-center text-sm text-gray-500 pt-4">
              This is a demo. Sign up for personalized plans with full features.
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
