'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Users, Download, ChefHat, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Demo data
const demoMealPlan = {
  day1: {
    breakfast: {
      name: "Protein-Packed Greek Yogurt Bowl",
      time: "15 min",
      calories: 320,
      description: "High-protein breakfast to stabilize blood sugar"
    },
    lunch: {
      name: "Grilled Chicken & Quinoa Salad",
      time: "25 min",
      calories: 450,
      description: "Balanced meal with lean protein and complex carbs"
    },
    dinner: {
      name: "Baked Salmon with Roasted Vegetables",
      time: "30 min",
      calories: 520,
      description: "Omega-3 rich dinner for heart health"
    }
  }
}

export default function DemoMealPlanPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Demo Meal Plan
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your 7-Day Meal Plan
          </h1>
          <p className="text-xl text-gray-600">
            Here's a preview of what your personalized meal plans look like
          </p>
        </motion.div>

        {/* Day 1 Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Day 1</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(demoMealPlan.day1).map(([meal, details]) => (
              <div key={meal} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 capitalize mb-2">{meal}</h3>
                <p className="font-medium text-gray-800 mb-2">{details.name}</p>
                <p className="text-sm text-gray-600 mb-4">{details.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {details.time}
                  </span>
                  <span>{details.calories} cal</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Locked Days */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[2, 3, 4, 5, 6, 7].map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + day * 0.05 }}
              className="bg-white/50 backdrop-blur rounded-xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-600">Day {day}</p>
                  <p className="text-xs text-gray-500">Sign up to unlock</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-400 mb-4">Day {day}</h3>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready for Your Full Personalized Plan?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Get unlimited meal plans, shopping lists, and nutritionist support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
