
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MealPlanGenerationForm } from '@/components/forms/MealPlanGenerationForm'
import Link from 'next/link'

export default function GenerateMealPlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/meal-plans">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Meal Plans
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <ChefHat className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">Generate Meal Plan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Personalized Meal Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI nutritionist will create a customized meal plan based on your health needs, 
            preferences, and lifestyle. Let's get started!
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <MealPlanGenerationForm />
        </motion.div>
      </div>
    </div>
  )
}
