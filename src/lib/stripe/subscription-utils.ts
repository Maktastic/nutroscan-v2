import { stripe, SUBSCRIPTION_PLANS, type PlanType } from './stripe-config'
import connectDB from '@/lib/db/mongodb'
import User from '@/models/User'

export async function createStripeCustomer(userId: string, email: string, name?: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    })

    // Update user with Stripe customer ID
    await connectDB()
    await User.findByIdAndUpdate(userId, {
      'subscription.stripeCustomerId': customer.id,
    })

    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw error
  }
}

export async function createCheckoutSession({
  userId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    await connectDB()
    const user = await User.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    // Create or get Stripe customer
    let customerId = user.subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await createStripeCustomer(userId, user.email, user.name)
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          userId,
        },
        trial_period_days: 14, // 14-day free trial
      },
      metadata: {
        userId,
      },
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return session
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}

export async function getUserSubscriptionStatus(userId: string) {
  try {
    await connectDB()
    const user = await User.findById(userId).select('subscription').lean()

    if (!user || !user.subscription?.stripeSubscriptionId) {
      return {
        isActive: false,
        plan: null,
        status: 'none',
      }
    }

    const subscription = await stripe.subscriptions.retrieve(
      user.subscription.stripeSubscriptionId
    )

    return {
      isActive: subscription.status === 'active' || subscription.status === 'trialing',
      plan: user.subscription.plan,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return {
      isActive: false,
      plan: null,
      status: 'error',
    }
  }
}

export function getPlanLimits(plan: PlanType | null) {
  if (!plan || plan === 'free') {
    return {
      mealPlansPerMonth: 1,
      healthConditions: ['general-wellness'],
      exportFormats: [],
      supportType: 'community',
    }
  }

  return SUBSCRIPTION_PLANS[plan].limits
}

export async function checkPlanLimit(userId: string, limitType: string): Promise<boolean> {
  const subscription = await getUserSubscriptionStatus(userId)
  const limits = getPlanLimits(subscription.plan as PlanType)

  switch (limitType) {
    case 'mealPlan':
      if (limits.mealPlansPerMonth === -1) return true // Unlimited
      
      // Count meal plans created this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      const MealPlan = (await import('@/models/MealPlan')).default
      const count = await MealPlan.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth },
      })
      
      return count < limits.mealPlansPerMonth
      
    case 'apiAccess':
      return limits.apiAccess === true
      
    default:
      return false
  }
}
