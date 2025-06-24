import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { getUserSubscriptionStatus, getPlanLimits } from '@/lib/stripe/subscription-utils'
import type { PlanType } from '@/lib/stripe/stripe-config'

export function useSubscriptionLimits() {
  const { data: session } = useSession()
  const [limits, setLimits] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchLimits()
    }
  }, [session])

  const fetchLimits = async () => {
    try {
      const subscription = await getUserSubscriptionStatus(session!.user.id)
      const planLimits = getPlanLimits(subscription.plan as PlanType)
      setLimits({
        ...planLimits,
        currentPlan: subscription.plan || 'free',
        isActive: subscription.isActive,
      })
    } catch (error) {
      console.error('Error fetching limits:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkLimit = async (limitType: string): Promise<boolean> => {
    if (!session?.user?.id) return false
    
    const { checkPlanLimit } = await import('@/lib/stripe/subscription-utils')
    return checkPlanLimit(session.user.id, limitType)
  }

  return {
    limits,
    loading,
    checkLimit,
    refetch: fetchLimits,
  }
}
