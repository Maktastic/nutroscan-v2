import { loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<any>

export const getStripe = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
    }
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}
