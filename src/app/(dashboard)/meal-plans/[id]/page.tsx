
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MealPlanDisplay } from '@/components/meal-plans/MealPlanDisplay'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock meal plan data - replace with actual API call
const mockMealPlan = {
  _id: '1',
  name: '7-Day Heart Healthy Plan',
  description: 'A comprehensive meal plan designed to support cardiovascular health with omega-3 rich foods.',
  healthCondition: 'heart-disease',
  startDate: '2024-12-15',
  endDate: '2024-12-21',
  servings: 1,
  meals: [
    {
      day: 1,
      date: '2024-12-15',
      breakfast: {
        name: 'Omega-3 Smoothie Bowl',
        description: 'A nutrient-rich smoothie bowl topped with fresh berries, chia seeds, and walnuts.',
        cookingTime: 5,
        prepTime: 10,
        servings: 1,
        ingredients: [
          { name: 'Frozen blueberries', amount: 1, unit: 'cup' },
          { name: 'Banana', amount: 1, unit: 'medium' },
          { name: 'Chia seeds', amount: 1, unit: 'tbsp' },
          { name: 'Walnuts', amount: 0.25, unit: 'cup' },
          { name: 'Almond milk', amount: 0.5, unit: 'cup' }
        ],
        instructions: [
          'Blend frozen blueberries, banana, and almond milk until smooth.',
          'Pour into a bowl and top with chia seeds and chopped walnuts.',
          'Add fresh berries if desired and serve immediately.'
        ],
        nutrition: {
          calories: 320,
          protein: 8,
          carbs: 45,
          fat: 12,
          fiber: 10,
          sugar: 25,
          sodium: 85
        },
        tips: [
          'Freeze bananas ahead of time for a thicker consistency',
          'Add a handful of spinach for extra nutrients without changing the taste'
        ]
      },
      lunch: {
        name: 'Mediterranean Quinoa Salad',
        description: 'A fresh and filling salad with quinoa, vegetables, and heart-healthy olive oil dressing.',
        cookingTime: 15,
        prepTime: 15,
        servings: 1,
        ingredients: [
          { name: 'Quinoa', amount: 0.5, unit: 'cup' },
          { name: 'Cherry tomatoes', amount: 0.5, unit: 'cup' },
          { name: 'Cucumber', amount: 0.5, unit: 'cup' },
          { name: 'Feta cheese', amount: 2, unit: 'tbsp' },
          { name: 'Olive oil', amount: 1, unit: 'tbsp' },
          { name: 'Lemon juice', amount: 1, unit: 'tbsp' }
        ],
        instructions: [
          'Cook quinoa according to package directions and let cool.',
          'Dice cucumber and halve cherry tomatoes.',
          'Mix quinoa with vegetables and crumbled feta.',
          'Whisk olive oil and lemon juice, then toss with salad.',
          'Season with salt and pepper to taste.'
        ],
        nutrition: {
          calories: 420,
          protein: 14,
          carbs: 52,
          fat: 18,
          fiber: 6,
          sugar: 8,
          sodium: 320
        },
        tips: [
          'Make extra quinoa for meal prep throughout the week',
          'Add fresh herbs like parsley or mint for extra flavor'
        ]
      },
      dinner: {
        name: 'Grilled Salmon with Asparagus',
        description: 'Heart-healthy salmon served with roasted asparagus and sweet potato.',
        cookingTime: 20,
        prepTime: 10,
        servings: 1,
        ingredients: [
          { name: 'Salmon fillet', amount: 6, unit: 'oz' },
          { name: 'Asparagus spears', amount: 1, unit: 'bunch' },
          { name: 'Sweet potato', amount: 1, unit: 'medium' },
          { name: 'Olive oil', amount: 2, unit: 'tbsp' },
          { name: 'Lemon', amount: 0.5, unit: 'piece' },
          { name: 'Garlic', amount: 2, unit: 'cloves' }
        ],
        instructions: [
          'Preheat oven to 400°F and heat grill or grill pan.',
          'Cut sweet potato into wedges and toss with 1 tbsp olive oil.',
          'Roast sweet potato for 25 minutes until tender.',
          'Season salmon with salt, pepper, and lemon juice.',
          'Grill salmon 4-5 minutes per side until flaky.',
          'Sauté asparagus with garlic in remaining olive oil for 5 minutes.'
        ],
        nutrition: {
          calories: 520,
          protein: 35,
          carbs: 38,
          fat: 22,
          fiber: 8,
          sugar: 12,
          sodium: 180
        },
        tips: [
          'Don\'t overcook the salmon - it should flake easily when done',
          'Choose wild-caught salmon when possible for better omega-3 content'
        ]
      },
      totalNutrition: {
        calories: 1260,
        protein: 57,
        carbs: 135,
        fat: 52,
        fiber: 24,
        sugar: 45,
        sodium: 585
      }
    }
    // Add more days as needed
  ],
  shoppingList: [
    {
      category: 'Proteins',
      items: [
        { name: 'Salmon fillets', quantity: '7 pieces', checked: false },
        { name: 'Feta cheese', quantity: '1 container', checked: false }
      ]
    },
    {
      category: 'Vegetables',
      items: [
        { name: 'Asparagus', quantity: '2 bunches', checked: false },
        { name: 'Cherry tomatoes', quantity: '1 pint', checked: false },
        { name: 'Cucumber', quantity: '2 pieces', checked: false },
        { name: 'Sweet potatoes', quantity: '4 medium', checked: false }
      ]
    },
    {
      category: 'Fruits',
      items: [
        { name: 'Bananas', quantity: '7 pieces', checked: false },
        { name: 'Frozen blueberries', quantity: '1 bag', checked: false },
        { name: 'Lemons', quantity: '3 pieces', checked: false }
      ]
    },
    {
      category: 'Pantry',
      items: [
        { name: 'Quinoa', quantity: '1 bag', checked: false },
        { name: 'Chia seeds', quantity: '1 container', checked: false },
        { name: 'Walnuts', quantity: '1 bag', checked: false },
        { name: 'Olive oil', quantity: '1 bottle', checked: false },
        { name: 'Almond milk', quantity: '1 carton', checked: false }
      ]
    }
  ],
  healthTips: [
    'Include fatty fish like salmon at least twice a week for optimal omega-3 intake',
    'Limit sodium to less than 2,300mg per day to help maintain healthy blood pressure',
    'Choose whole grains over refined grains to support heart health',
    'Eat a variety of colorful fruits and vegetables for antioxidants',
    'Stay hydrated with at least 8 glasses of water daily'
  ]
}

export default function MealPlanPage() {
  const params = useParams()
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchMealPlan = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/meal-plans/${params.id}`)
        // const data = await response.json()
        
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMealPlan(mockMealPlan)
      } catch (error) {
        console.error('Error fetching meal plan:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMealPlan()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your meal plan...</p>
        </div>
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Meal Plan Not Found</h2>
          <p className="text-gray-600 mb-6">The meal plan you're looking for doesn't exist.</p>
          <Link href="/meal-plans">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Meal Plans
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
              <span className="text-xl font-bold text-gray-900">Meal Plan Details</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MealPlanDisplay mealPlan={mealPlan} />
        </motion.div>
      </div>
    </div>
  )
}
