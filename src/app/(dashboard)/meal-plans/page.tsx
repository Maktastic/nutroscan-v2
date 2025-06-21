
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { MealPlanGenerationForm } from '@/components/forms/MealPlanGenerationForm'

export default function MealPlansPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Personalized Meal Plan
            </h1>
            <p className="text-gray-600">
              Let our AI create a meal plan tailored to your health needs and preferences.
            </p>
          </div>
          
          <div className="glass-card">
            <MealPlanGenerationForm />
          </div>
        </div>
      </div>
    </main>
  )
}
