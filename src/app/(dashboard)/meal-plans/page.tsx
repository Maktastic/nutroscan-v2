
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Users,
  ChefHat,
  Star,
  ArrowRight,
  Trash2,
  Edit,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { format } from 'date-fns'

// Mock data - replace with actual API calls
const mealPlans = [
  {
    id: '1',
    name: '7-Day Heart Healthy Plan',
    description: 'A comprehensive meal plan designed to support cardiovascular health with omega-3 rich foods.',
    healthCondition: 'heart-disease',
    duration: 7,
    startDate: new Date('2024-12-15'),
    endDate: new Date('2024-12-21'),
    status: 'active',
    totalMeals: 21,
    avgCalories: 1850,
    completedDays: 4,
    createdAt: new Date('2024-12-15')
  },
  {
    id: '2',
    name: 'PCOS Management Plan',
    description: 'Low glycemic meal plan to help manage PCOS symptoms and support hormone balance.',
    healthCondition: 'pcos',
    duration: 14,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-14'),
    status: 'completed',
    totalMeals: 42,
    avgCalories: 1750,
    completedDays: 14,
    createdAt: new Date('2024-12-01')
  },
  {
    id: '3',
    name: '3-Day Detox Plan',
    description: 'A gentle detox plan with anti-inflammatory foods to reset your digestive system.',
    healthCondition: 'general-wellness',
    duration: 3,
    startDate: new Date('2024-12-20'),
    endDate: new Date('2024-12-22'),
    status: 'upcoming',
    totalMeals: 9,
    avgCalories: 1600,
    completedDays: 0,
    createdAt: new Date('2024-12-10')
  }
]

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-blue-100 text-blue-700',
  upcoming: 'bg-yellow-100 text-yellow-700',
  paused: 'bg-gray-100 text-gray-700'
}

export default function MealPlansPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filteredPlans, setFilteredPlans] = useState(mealPlans)

  useEffect(() => {
    let filtered = mealPlans

    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(plan => plan.status === filterStatus)
    }

    setFilteredPlans(filtered)
  }, [searchTerm, filterStatus])

  const getProgressPercentage = (plan: any) => {
    return Math.round((plan.completedDays / plan.duration) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <ChefHat className="w-8 h-8 text-emerald-600" />
              </Link>
              <span className="text-xl font-bold text-gray-900">Meal Plans</span>
            </div>
            <Link href="/meal-plans/generate">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search meal plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="upcoming">Upcoming</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Meal Plans Grid */}
        {filteredPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meal plans found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first AI-powered meal plan to get started'
              }
            </p>
            <Link href="/meal-plans/generate">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[plan.status as keyof typeof statusColors]}`}>
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {plan.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {plan.duration} days
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {plan.totalMeals} meals
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{format(plan.startDate, 'MMM d')} - {format(plan.endDate, 'MMM d')}</span>
                    <span>{plan.avgCalories} cal/day</span>
                  </div>

                  {plan.status === 'active' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{getProgressPercentage(plan)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(plan)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Link href={`/meal-plans/${plan.id}`}>
                  <Button className="w-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
