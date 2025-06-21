import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import connectDB from '@/lib/db/mongodb'
import MealPlan from '@/models/MealPlan'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    await connectDB()

    // Build query
    const query: any = { userId: session.user.id }
    if (status !== 'all') {
      query.status = status
    }

    // Get meal plans
    const [mealPlans, total] = await Promise.all([
      MealPlan.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .select('-meals.ingredients -meals.instructions')
        .lean(),
      MealPlan.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      mealPlans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get meal plans error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meal plans' },
      { status: 500 }
    )
  }
}
