import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import connectDB from '@/lib/db/mongodb'
import ProgressTracking from '@/models/ProgressTracking'
import { startOfDay, endOfDay } from 'date-fns'

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
    const limit = parseInt(searchParams.get('limit') || '30')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    await connectDB()

    // Build query
    const query: any = { userId: session.user.id }
    
    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(new Date(startDate)),
        $lte: endOfDay(new Date(endDate)),
      }
    }

    const progressEntries = await ProgressTracking.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      entries: progressEntries,
    })
  } catch (error) {
    console.error('Get progress entries error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress entries' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await req.json()
    
    await connectDB()

    // Check if entry exists for the date
    const existingEntry = await ProgressTracking.findOne({
      userId: session.user.id,
      date: {
        $gte: startOfDay(new Date(data.date)),
        $lte: endOfDay(new Date(data.date)),
      },
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Entry already exists for this date. Use PATCH to update.' },
        { status: 400 }
      )
    }

    // Create progress entry
    const progressEntry = await ProgressTracking.create({
      userId: session.user.id,
      date: new Date(data.date),
      metrics: {
        weight: data.weight,
        bloodSugar: data.bloodSugar,
        bloodPressure: data.bloodPressure,
        energy: data.energy,
        mood: data.mood,
        sleep: data.sleep,
        exercise: data.exercise,
        waterIntake: data.waterIntake,
      },
      symptoms: data.symptoms || [],
      notes: data.notes,
      mealPlanAdherence: data.mealPlanAdherence,
      achievements: data.achievements || [],
    })

    return NextResponse.json({
      success: true,
      entry: progressEntry.toObject(),
    })
  } catch (error: any) {
    console.error('Create progress entry error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create progress entry' },
      { status: 500 }
    )
  }
}
