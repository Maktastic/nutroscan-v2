'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Clock,
  Users,
  Flame,
  Apple,
  ChevronRight,
  Download,
  Share2,
  Heart,
  Printer,
  Check,
  X,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Image from 'next/image'

interface MealPlanDisplayProps {
  mealPlan: any // You can create a proper type for this
}

export function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null)
  const [showShoppingList, setShowShoppingList] = useState(false)

  const currentDay = mealPlan.meals[selectedDay]
  const meal = selectedMeal ? currentDay[selectedMeal] : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mealPlan.name}</h1>
            <p className="text-gray-600 mt-1">{mealPlan.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(mealPlan.startDate), 'MMM d')} - {format(new Date(mealPlan.endDate), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {mealPlan.servings || 1} serving{mealPlan.servings > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      {mealPlan.healthTips && mealPlan.healthTips.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-2">Health Tips for {mealPlan.healthCondition}</p>
              <ul className="space-y-1">
                {mealPlan.healthTips.slice(0, 3).map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Day Navigation */}
      <div className="glass-card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Day</h2>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {mealPlan.meals.map((day: any, index: number) => (
            <button
              key={index}
              onClick={() => {
                setSelectedDay(index)
                setSelectedMeal(null)
              }}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedDay === index
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <div className="text-xs font-medium">Day {day.day}</div>
              <div className="text-sm mt-1">{format(new Date(day.date), 'MMM d')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Meals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['breakfast', 'lunch', 'dinner'].map((mealType) => {
          const mealData = currentDay[mealType]
          return (
            <motion.div
              key={mealType}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMeal(mealType as any)}
              className="glass-card cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 capitalize">{mealType}</h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-800">{mealData.name}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{mealData.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {mealData.cookingTime + mealData.prepTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {mealData.nutrition.calories} cal
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Nutrition Summary */}
      <div className="glass-card">
        <h3 className="font-semibold text-gray-900 mb-4">Daily Nutrition Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {currentDay.totalNutrition.calories}
            </div>
            <div className="text-sm text-gray-600">Calories</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {currentDay.totalNutrition.protein}g
            </div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {currentDay.totalNutrition.carbs}g
            </div>
            <div className="text-sm text-gray-600">Carbs</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {currentDay.totalNutrition.fat}g
            </div>
            <div className="text-sm text-gray-600">Fat</div>
          </div>
        </div>
      </div>

      {/* Shopping List Toggle */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowShoppingList(!showShoppingList)}
          variant="outline"
          className="bg-white"
        >
          <Apple className="w-4 h-4 mr-2" />
          {showShoppingList ? 'Hide' : 'View'} Shopping List
        </Button>
      </div>

      {/* Shopping List Modal */}
      <AnimatePresence>
        {showShoppingList && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-card"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Shopping List</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(
                mealPlan.shoppingList.reduce((acc: any, item: any) => {
                  if (!acc[item.category]) acc[item.category] = []
                  acc[item.category].push(item)
                  return acc
                }, {})
              ).map(([category, items]: [string, any]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-800 mb-2 capitalize">{category}</h4>
                  <ul className="space-y-1">
                    {items.map((item: any, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          defaultChecked={item.checked}
                        />
                        <span>{item.quantity} {item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedMeal && meal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <RecipeDetail meal={meal} onClose={() => setSelectedMeal(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Recipe Detail Component
function RecipeDetail({ meal, onClose }: { meal: any; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients')

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{meal.name}</h2>
          <p className="text-gray-600 mt-1">{meal.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {meal.prepTime + meal.cookingTime} minutes
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {meal.servings} servings
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {meal.nutrition.calories} calories
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {(['ingredients', 'instructions', 'nutrition'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {meal.ingredients.map((ingredient: any, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>
                      <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
              <ol className="space-y-3">
                {meal.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ol>
              
              {meal.tips && meal.tips.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Pro Tips</h4>
                  <ul className="space-y-1">
                    {meal.tips.map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-yellow-600 mr-2">💡</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Nutrition Facts</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Per serving</div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Calories</span>
                    <span className="font-bold">{meal.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Protein</span>
                    <span>{meal.nutrition.protein}g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Carbohydrates</span>
                    <span>{meal.nutrition.carbs}g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Fat</span>
                    <span>{meal.nutrition.fat}g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Fiber</span>
                    <span>{meal.nutrition.fiber}g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Sugar</span>
                    <span>{meal.nutrition.sugar}g</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Sodium</span>
                    <span>{meal.nutrition.sodium}mg</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-6 border-t">
        <Button className="flex-1">
          <Heart className="w-4 h-4 mr-2" />
          Save to Favorites
        </Button>
        <Button variant="outline" className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Print Recipe
        </Button>
      </div>
    </div>
  )
}
