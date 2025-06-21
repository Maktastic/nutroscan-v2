'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Loader2,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/stripe-config'
import { getStripe } from '@/lib/stripe/stripe-client'
import toast from 'react-hot-toast'

export function PricingSection() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/pricing')
      return
    }

    setIsLoading(planName)

    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      await stripe?.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
      setIsLoading(null)
    }
  }

  const plans = [
    {
      key: 'starter',
      icon: Zap,
      color: 'emerald',
      badge: null,
    },
    {
      key: 'professional',
      icon: Sparkles,
      color: 'blue',
      badge: 'Most Popular',
    },
    {
      key: 'enterprise',
      icon: Crown,
      color: 'purple',
      badge: 'Best Value',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Health Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with a 14-day free trial. No credit card required for basic features.
              Upgrade anytime to unlock premium features.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const planData = SUBSCRIPTION_PLANS[plan.key as keyof typeof SUBSCRIPTION_PLANS]
            const Icon = plan.icon

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`h-full bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden ${
                  plan.key === 'professional' ? 'ring-2 ring-blue-500' : ''
                }`}>
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${plan.color}-400 to-${plan.color}-600 opacity-10 rounded-full -mr-16 -mt-16`} />

                  {/* Plan Icon */}
                  <div className={`w-12 h-12 bg-${plan.color}-100 rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {planData.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${planData.price}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {planData.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(planData.priceId, plan.key)}
                    disabled={isLoading === plan.key}
                    className={`w-full ${
                      plan.key === 'professional'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : ''
                    }`}
                    variant={plan.key === 'professional' ? 'default' : 'outline'}
                  >
                    {isLoading === plan.key ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Need a custom plan? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </section>
  )
}
