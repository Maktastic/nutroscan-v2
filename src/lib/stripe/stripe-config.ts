import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    price: 9,
    currency: 'usd',
    interval: 'month',
    features: [
      'AI-generated meal plans',
      'Basic health condition support',
      '3 meal plans per month',
      'Mobile app access',
      'Email support',
      'Weekly progress tracking',
      'Basic nutrition analytics',
    ],
    limits: {
      mealPlansPerMonth: 3,
      healthConditions: ['diabetes-type-2', 'hypertension', 'general-wellness'],
      exportFormats: ['pdf'],
      supportType: 'email',
    },
  },
  professional: {
    name: 'Professional',
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    price: 29,
    currency: 'usd',
    interval: 'month',
    popular: true,
    features: [
      'Everything in Starter',
      'Unlimited AI meal plans',
      'All 15+ health conditions',
      'Family profiles (up to 4)',
      'Priority support',
      'Daily progress tracking',
      'Advanced analytics & insights',
      'Grocery delivery integration',
      'Nutritionist consultations (2/month)',
    ],
    limits: {
      mealPlansPerMonth: -1, // Unlimited
      healthConditions: 'all',
      familyProfiles: 4,
      exportFormats: ['pdf', 'csv', 'json'],
      supportType: 'priority',
      nutritionistConsultations: 2,
    },
  },
  enterprise: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    price: 99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Professional',
      'Unlimited family profiles',
      'White-label solution',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'HIPAA compliance tools',
      'Custom reporting',
      'Team collaboration tools',
      'Priority feature requests',
    ],
    limits: {
      mealPlansPerMonth: -1, // Unlimited
      healthConditions: 'all',
      familyProfiles: -1, // Unlimited
      exportFormats: 'all',
      supportType: 'dedicated',
      apiAccess: true,
      whiteLabel: true,
    },
  },
} as const

export type PlanType = keyof typeof SUBSCRIPTION_PLANS
