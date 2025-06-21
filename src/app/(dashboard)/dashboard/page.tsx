
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChefHat, 
  TrendingUp, 
  Target, 
  Calendar,
  Plus,
  Clock,
  Flame,
  Heart,
  Award,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const quickStats = [
  {
    title: "Meals Planned",
    value: "24",
    change: "+12%",
    icon: <ChefHat className="w-5 h-5" />,
    color: "text-emerald-600"
  },
  {
    title: "Calories Today",
    value: "1,847",
    change: "Goal: 2,000",
    icon: <Flame className="w-5 h-5" />,
    color: "text-orange-600"
  },
  {
    title: "Streak Days",
    value: "12",
    change: "+3 this week",
    icon: <Award className="w-5 h-5" />,
    color: "text-purple-600"
  },
  {
    title: "Health Score",
    value: "85%",
    change: "+5%",
    icon: <Heart className="w-5 h-5" />,
    color: "text-red-600"
  }
]

const recentMealPlans = [
  {
    id: 1,
    name: "7-Day Heart Healthy Plan",
    duration: "7 days",
    status: "Active",
    progress: 60,
    startDate: "Dec 15, 2024"
  },
  {
    id: 2,
    name: "PCOS Management Plan",
    duration: "14 days",
    status: "Completed",
    progress: 100,
    startDate: "Dec 1, 2024"
  }
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const [todaysProgress, setTodaysProgress] = useState(75)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <ChefHat className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">NutroScan Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!
              </span>
              <Link href="/meal-plans/generate">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Health Dashboard
          </h1>
          <p className="text-gray-600">
            Track your nutrition journey and achieve your health goals
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{stat.title}</h3>
              <p className="text-sm text-gray-600">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Progress */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
                <span className="text-sm text-gray-600">December 16, 2024</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Daily Goal Progress</span>
                  <span className="text-sm text-gray-600">{todaysProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${todaysProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-emerald-500 h-2 rounded-full"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">3/3</div>
                    <div className="text-xs text-gray-600">Meals</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">2.1L</div>
                    <div className="text-xs text-gray-600">Water</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">45min</div>
                    <div className="text-xs text-gray-600">Exercise</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Meal Plans */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Meal Plans</h2>
                <Link href="/meal-plans">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentMealPlans.map((plan) => (
                  <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{plan.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        plan.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {plan.duration}
                      </span>
                      <span>{plan.startDate}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-emerald-500 h-1 rounded-full"
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/meal-plans/generate">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Meal Plan
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Update Goals
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Health Tip</h2>
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  💡 <strong>Hydration Reminder:</strong> Drinking water before meals can help with portion control and improve digestion. Aim for 8 glasses throughout the day!
                </p>
              </div>
            </motion.div>

            {/* Upcoming Meals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Meal</h2>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Grilled Salmon Bowl</h3>
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Dinner • 6:30 PM
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>520 cal</span>
                  <span>35g protein</span>
                  <span>25 min prep</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
