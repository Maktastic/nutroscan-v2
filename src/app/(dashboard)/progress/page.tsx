'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Calendar,
  Weight,
  Heart,
  Activity,
  Droplets,
  Moon,
  Plus,
  Download,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
import toast from 'react-hot-toast'

// Mock data - replace with API calls
const mockProgressData = [
  { date: subDays(new Date(), 30), weight: 85, bloodSugar: 120, bloodPressure: { systolic: 130, diastolic: 85 } },
  { date: subDays(new Date(), 25), weight: 84.5, bloodSugar: 115, bloodPressure: { systolic: 128, diastolic: 84 } },
  { date: subDays(new Date(), 20), weight: 84, bloodSugar: 110, bloodPressure: { systolic: 126, diastolic: 82 } },
  { date: subDays(new Date(), 15), weight: 83.5, bloodSugar: 108, bloodPressure: { systolic: 125, diastolic: 80 } },
  { date: subDays(new Date(), 10), weight: 83, bloodSugar: 105, bloodPressure: { systolic: 122, diastolic: 78 } },
  { date: subDays(new Date(), 5), weight: 82.5, bloodSugar: 102, bloodPressure: { systolic: 120, diastolic: 76 } },
  { date: new Date(), weight: 82, bloodSugar: 100, bloodPressure: { systolic: 118, diastolic: 75 } },
]

export default function ProgressPage() {
  const [selectedMetric, setSelectedMetric] = useState('weight')
  const [timeRange, setTimeRange] = useState('30d')
  const [showAddEntry, setShowAddEntry] = useState(false)

  const metrics = [
    { id: 'weight', label: 'Weight', icon: Weight, unit: 'kg', color: '#10b981' },
    { id: 'bloodSugar', label: 'Blood Sugar', icon: Droplets, unit: 'mg/dL', color: '#3b82f6' },
    { id: 'bloodPressure', label: 'Blood Pressure', icon: Heart, unit: 'mmHg', color: '#ef4444' },
    { id: 'activity', label: 'Activity', icon: Activity, unit: 'min', color: '#f59e0b' },
    { id: 'sleep', label: 'Sleep', icon: Moon, unit: 'hrs', color: '#8b5cf6' },
  ]

  const currentMetric = metrics.find(m => m.id === selectedMetric)

  const formatChartData = () => {
    return mockProgressData.map(entry => ({
      date: format(entry.date, 'MMM d'),
      value: selectedMetric === 'bloodPressure' 
        ? entry.bloodPressure.systolic 
        : entry[selectedMetric as keyof typeof entry] || 0
    }))
  }

  const getProgressPercentage = () => {
    const firstValue = mockProgressData[0][selectedMetric as keyof typeof mockProgressData[0]]
    const lastValue = mockProgressData[mockProgressData.length - 1][selectedMetric as keyof typeof mockProgressData[0]]
    
    if (typeof firstValue === 'number' && typeof lastValue === 'number') {
      const change = ((firstValue - lastValue) / firstValue) * 100
      return change.toFixed(1)
    }
    return '0'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your health improvements over time</p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAddEntry(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-emerald-600">
              {getProgressPercentage()}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Overall Progress</h3>
          <p className="text-sm text-gray-600 mt-1">Last 30 days improvement</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">85%</span>
          </div>
          <h3 className="font-semibold text-gray-900">Adherence Rate</h3>
          <p className="text-sm text-gray-600 mt-1">Meal plan compliance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">21</span>
          </div>
          <h3 className="font-semibold text-gray-900">Day Streak</h3>
          <p className="text-sm text-gray-600 mt-1">Consecutive days tracked</p>
        </motion.div>
      </div>

      {/* Metrics Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">Health Metrics</h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm"
              >
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
                <option value="1y">1 year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metric Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedMetric === metric.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {metric.label}
              </button>
            )
          })}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formatChartData()}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric?.color} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={currentMetric?.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                formatter={(value) => [`${value} ${currentMetric?.unit}`, currentMetric?.label]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={currentMetric?.color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h2>
        <div className="space-y-3">
          {mockProgressData.slice(-5).reverse().map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  {format(entry.date, 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  Weight: {entry.weight}kg • Blood Sugar: {entry.bloodSugar} mg/dL
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
