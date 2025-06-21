'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  Filter,
  Search,
  ChevronRight,
  Sparkles,
  FileText,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMealPlans()
  }, [filter])

  const fetchMealPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/meal-plans?status=${filter}`)
      const data = await response.json()
      
      if (data.success) {
        setMealPlans(data.mealPlans)
      }
    } catch (error) {
      toast.error('Failed to load meal plans')
    } finally {
      setLoading(false)
    }
  }

  const filteredMealPlans = mealPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.healthCondition.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Meal Plans</h1>
          <p className="text-gray-600 mt-1">Manage and track your personalized meal plans</p>
        </div>
        
        <Link href="/meal-plans/generate">
          <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Generate New Plan
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="glass-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search meal plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {['all', 'active', 'draft', 'completed', 'archived'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Meal Plans Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMealPlans.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meal plans found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'Try adjusting your search query' : 'Create your first AI-powered meal plan'}
          </p>
          <Link href="/meal-plans/generate">
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Your First Plan
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMealPlans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/meal-plans/${plan._id}`}>
                <div className="glass-card hover:shadow-lg transition-all cursor-pointer group">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[plan.status as keyof typeof statusColors]}`}>
                      {plan.status}
                    </span>
                    {plan.aiGenerated && (
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    )}
                  </div>

                  {/* Plan Details */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {plan.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {plan.duration} days
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {plan.adherenceScore}% adherence
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">
                        Starts {format(new Date(plan.startDate), 'MMM d, yyyy')}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-gray-900">{mealPlans.length}</div>
          <div className="text-sm text-gray-600">Total Plans</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {mealPlans.filter(p => p.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Plans</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(mealPlans.reduce((acc, p) => acc + (p.adherenceScore || 0), 0) / mealPlans.length || 0)}%
          </div>
          <div className="text-sm text-gray-600">Avg Adherence</div>
        </div>
        <div className="glass-card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {mealPlans.filter(p => p.aiGenerated).length}
          </div>
          <div className="text-sm text-gray-600">AI Generated</div>
        </div>
      </div>
    </div>
  )
}
