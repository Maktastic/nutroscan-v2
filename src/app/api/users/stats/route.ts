import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import connectDB from '@/lib/db/mongodb'
import MealPlan from '@/models/MealPlan'
import ProgressTracking from '@/models/ProgressTracking'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Get statistics
    const [
      totalMealPlans,
      activeMealPlans,
      monthlyMealPlans,
      totalProgressEntries,
      recentProgress
    ] = await Promise.all([
      MealPlan.countDocuments({ userId: session.user.id }),
      MealPlan.countDocuments({ userId: session.user.id, status: 'active' }),
      MealPlan.countDocuments({ 
        userId: session.user.id,
        createdAt: { $gte: monthStart, $lte: monthEnd }
      }),
      ProgressTracking.countDocuments({ userId: session.user.id }),
      ProgressTracking.find({ userId: session.user.id })
        .sort({ date: -1 })
        .limit(30)
        .lean()
    ])

    // Calculate adherence
    const adherenceData = recentProgress.map(entry => entry.mealPlanAdherence || 0)
    const averageAdherence = adherenceData.length > 0
      ? Math.round(adherenceData.reduce((a, b) => a + b, 0) / adherenceData.length)
      : 0

    // Calculate streaks
    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < recentProgress.length; i++) {
      const entryDate = new Date(recentProgress[i].date)
      entryDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        currentStreak++
      } else {
        break
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        mealPlans: {
          total: totalMealPlans,
          active: activeMealPlans,
          thisMonth: monthlyMealPlans,
        },
        progress: {
          totalEntries: totalProgressEntries,
          averageAdherence,
          currentStreak,
        },
        subscription: {
          plan: session.user.subscription?.plan || 'free',
          status: session.user.subscription?.status || 'inactive',
        },
      },
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}
