'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const HEALTH_CONDITIONS = [
  'general-wellness',
  'diabetes',
  'hypertension', 
  'weight-loss',
  'heart-disease'
]

const DIETARY_PREFERENCES = [
  'vegetarian',
  'vegan',
  'keto',
  'paleo',
  'mediterranean',
  'low-carb',
  'gluten-free'
]

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    healthCondition: '',
    dietaryPreferences: [] as string[],
    allergies: [] as string[],
    targetCalories: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          healthProfile: {
            condition: formData.healthCondition,
            dietaryPreferences: formData.dietaryPreferences,
            allergies: formData.allergies,
            targetCalories: formData.targetCalories ? parseInt(formData.targetCalories) : undefined
          }
        }),
      })

      if (response.ok) {
        toast.success('Account created successfully!')
        router.push('/signin')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to create account')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDietaryPreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(pref)
        ? prev.dietaryPreferences.filter(p => p !== pref)
        : [...prev.dietaryPreferences, pref]
    }))
  }

  return (
    <main className="min-h-screen gradient-bg py-12 px-4">
      <div className="glass-card w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Join NutroScan</h1>
          <p className="text-gray-600 mt-2">Create your account and health profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="healthCondition">Primary Health Goal</Label>
            <select
              id="healthCondition"
              value={formData.healthCondition}
              onChange={(e) => setFormData(prev => ({ ...prev, healthCondition: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select your primary health goal</option>
              {HEALTH_CONDITIONS.map(condition => (
                <option key={condition} value={condition}>
                  {condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Dietary Preferences (Optional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {DIETARY_PREFERENCES.map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => toggleDietaryPreference(pref)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    formData.dietaryPreferences.includes(pref)
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {pref.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="targetCalories">Target Daily Calories (Optional)</Label>
            <Input
              id="targetCalories"
              type="number"
              value={formData.targetCalories}
              onChange={(e) => setFormData(prev => ({ ...prev, targetCalories: e.target.value }))}
              placeholder="e.g., 2000"
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/signin" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
