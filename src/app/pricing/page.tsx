'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Sparkles, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const plans = [
  {
    name: 'Starter',
    price: 9,
    description: 'Perfect for getting started',
    icon: Zap,
    features: [
      '3 meal plans per month',
      'Basic health conditions',
      'Mobile app access',
      'Email support',
      'PDF exports'
    ],
    notIncluded: [
      'Unlimited meal plans',
      'All health conditions',
      'Priority support',
      'API access'
    ]
  },
  {
    name: 'Professional',
    price: 29,
    description: 'Most popular choice',
    icon: Sparkles,
    popular: true,
    features: [
      'Unlimited meal plans',
      'All 15+ health conditions',
      'Family profiles (up to 4)',
      'Priority support',
      'Advanced analytics',
      'Nutritionist consultations',
      'All export formats',
      'Shopping list app'
    ],
    notIncluded: [
      'White-label solution',
      'API access'
    ]
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For teams and clinics',
    icon: Crown,
    features: [
      'Everything in Professional',
      'Unlimited profiles',
      'White-label solution',
      'API access',
      'Custom integrations',
      'Dedicated manager',
      'HIPAA compliance tools',
      'Custom reporting'
    ],
    notIncluded: []
  }
]

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleSelectPlan = (planName: string) => {
    if (!session) {
      router.push(`/auth/signup?plan=${planName.toLowerCase()}`)
    } else {
      router.push(`/settings/billing?upgrade=${planName.toLowerCase()}`)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your health journey
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const price = billingPeriod === 'yearly' 
              ? Math.floor(plan.price * 0.8) 
              : plan.price

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl ${
                  plan.popular ? 'ring-2 ring-emerald-500 shadow-xl' : 'shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">${price}</span>
                    <span className="text-gray-600">
                      /{billingPeriod === 'yearly' ? 'mo' : 'month'}
                    </span>
                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-emerald-600 mt-1">
                        Billed ${plan.price * 12 * 0.8} yearly
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700'
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {/* Features */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-3">Includes:</p>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.notIncluded.length > 0 && (
                      <div className="pt-4 border-t">
                        <ul className="space-y-3">
                          {plan.notIncluded.map((feature) => (
                            <li key={feature} className="flex items-start opacity-50">
                              <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-500">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Questions? <Link href="/contact" className="text-emerald-600 hover:underline">Contact our team</Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
