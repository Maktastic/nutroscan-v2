'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CreditCard,
  Calendar,
  Download,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUserSubscriptionStatus } from '@/lib/stripe/subscription-utils'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/stripe-config'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function BillingSettingsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  // Check for success/cancel params
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription activated successfully!')
    } else if (searchParams.get('canceled') === 'true') {
      toast.error('Subscription canceled')
    }
  }, [searchParams])

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscription()
    }
  }, [session])

  const fetchSubscription = async () => {
    try {
      const status = await getUserSubscriptionStatus(session!.user.id)
      setSubscription(status)
    } catch (error) {
      toast.error('Failed to load subscription details')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setPortalLoading(true)

    try {
      const response = await fetch('/api/stripe/portal-session', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      window.location.href = data.url
    } catch (error: any) {
      toast.error(error.message || 'Failed to open billing portal')
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  const currentPlan = subscription?.plan 
    ? SUBSCRIPTION_PLANS[subscription.plan as keyof typeof SUBSCRIPTION_PLANS]
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and billing details</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
          {subscription?.status === 'trialing' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Free Trial
            </span>
          )}
        </div>

        {currentPlan ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">{currentPlan.name} Plan</h3>
                <p className="text-sm text-gray-600 mt-1">
                  ${currentPlan.price}/month
                </p>
              </div>
              <div className="text-right">
                {subscription.status === 'active' ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Active
                  </div>
                ) : subscription.status === 'trialing' ? (
                  <div className="flex items-center text-blue-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Trial ends {format(subscription.trialEnd, 'MMM d, yyyy')}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="w-5 h-5 mr-2" />
                    {subscription.status}
                  </div>
                )}
              </div>
            </div>

            {/* Plan Features */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
              <ul className="space-y-2">
                {currentPlan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Billing Info */}
            {subscription.currentPeriodEnd && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {subscription.cancelAtPeriodEnd ? 'Subscription ends' : 'Next billing date'}
                  </span>
                  <span className="font-medium text-gray-900">
                    {format(subscription.currentPeriodEnd, 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
            <p className="text-gray-600 mb-6">
              Choose a plan to unlock all features
            </p>
            <Button onClick={() => window.location.href = '/pricing'}>
              View Plans
            </Button>
          </div>
        )}
      </div>

      {/* Manage Subscription Button */}
      {currentPlan && (
        <div className="glass-card">
          <h3 className="font-semibold text-gray-900 mb-4">Manage Subscription</h3>
          <p className="text-sm text-gray-600 mb-6">
            Update your payment method, change your plan, or cancel your subscription
          </p>
          <Button
            onClick={handleManageSubscription}
            disabled={portalLoading}
            variant="outline"
          >
            {portalLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Open Billing Portal
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Billing History */}
      <div className="glass-card">
        <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Billing history will appear here after your first payment</p>
        </div>
      </div>

      {/* Download Invoice Button */}
      <div className="glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Need an invoice?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Download invoices for your records or expense reports
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
}
