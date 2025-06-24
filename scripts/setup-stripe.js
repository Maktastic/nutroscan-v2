// This script helps set up your Stripe products and prices
// Run: node scripts/setup-stripe.js

const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function setupStripeProducts() {
  try {
    // Create product
    const product = await stripe.products.create({
      name: 'NutroScan Pro Subscription',
      description: 'AI-powered meal planning for better health',
    })

    console.log('Product created:', product.id)

    // Create prices
    const starterPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 900, // $9.00
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 14,
      },
      nickname: 'Starter Plan',
    })

    const professionalPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 14,
      },
      nickname: 'Professional Plan',
    })

    const enterprisePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: {
        interval: 'month',
        trial_period_days: 14,
      },
      nickname: 'Enterprise Plan',
    })

    console.log('\nPrice IDs created:')
    console.log('STRIPE_STARTER_PRICE_ID=', starterPrice.id)
    console.log('STRIPE_PROFESSIONAL_PRICE_ID=', professionalPrice.id)
    console.log('STRIPE_ENTERPRISE_PRICE_ID=', enterprisePrice.id)
    console.log('\nAdd these to your .env.local file!')

    // Create webhook endpoint
    const webhook = await stripe.webhookEndpoints.create({
      url: 'https://your-domain.com/api/stripe/webhook',
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
      ],
    })

    console.log('\nWebhook endpoint created:', webhook.url)
    console.log('Webhook secret:', webhook.secret)
    console.log('Add this as STRIPE_WEBHOOK_SECRET to your .env.local')

  } catch (error) {
    console.error('Error setting up Stripe:', error)
  }
}

// Configure Stripe Customer Portal
async function configurePortal() {
  try {
    const configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'NutroScan Pro - Manage your subscription',
      },
      features: {
        customer_update: {
          enabled: true,
          allowed_updates: ['email', 'tax_id'],
        },
        invoice_history: {
          enabled: true,
        },
        payment_method_update: {
          enabled: true,
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other',
            ],
          },
        },
        subscription_pause: {
          enabled: false,
        },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price'],
          proration_behavior: 'create_prorations',
        },
      },
    })

    console.log('\nCustomer portal configured:', configuration.id)
  } catch (error) {
    console.error('Error configuring portal:', error)
  }
}

// Run setup
setupStripeProducts().then(() => configurePortal())
