import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { createPortalSession } from '@/lib/stripe/subscription-utils'
import connectDB from '@/lib/db/mongodb'
import User from '@/models/User'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()
    const user = await User.findById(session.user.id).select('subscription')

    if (!user?.subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const portalSession = await createPortalSession(
      user.subscription.stripeCustomerId,
      `${appUrl}/settings/billing`
    )

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error: any) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
