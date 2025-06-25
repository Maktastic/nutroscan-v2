import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import connectDB from '@/lib/db/mongodb'
import HealthProfile from '@/models/HealthProfile'
import User from '@/models/User'

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

    const healthProfile = await HealthProfile.findOne({ 
      userId: session.user.id 
    }).lean()

    if (!healthProfile) {
      return NextResponse.json(
        { error: 'Health profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      healthProfile,
    })
  } catch (error) {
    console.error('Get health profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health profile' },
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
    
    // Validate required fields
    if (!data.age || !data.gender || !data.primaryHealthCondition) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if health profile already exists
    const existingProfile = await HealthProfile.findOne({ 
      userId: session.user.id 
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Health profile already exists. Use PATCH to update.' },
        { status: 400 }
      )
    }

    // Create health profile
    const healthProfile = await HealthProfile.create({
      userId: session.user.id,
      // Personal Information
      age: parseInt(data.age),
      gender: data.gender,
      height: {
        value: parseFloat(data.height),
        unit: 'cm'
      },
      weight: {
        value: parseFloat(data.weight),
        unit: 'kg'
      },
      // Health Conditions
      primaryHealthCondition: data.primaryHealthCondition,
      secondaryConditions: data.secondaryConditions || [],
      // Dietary Information
      dietaryPreferences: data.dietaryPreferences || [],
      allergies: data.allergies ? 
        data.allergies.split(',').map((a: string) => a.trim()).filter(Boolean) : 
        [],
      // Lifestyle
      activityLevel: data.activityLevel,
      // Goals
      goals: data.goals || [],
      targetWeight: data.targetWeight ? {
        value: parseFloat(data.targetWeight),
        unit: 'kg'
      } : undefined,
      // Preferences
      mealsPerDay: parseInt(data.mealsPerDay) || 3,
      cookingTime: data.cookingTime || 'moderate',
      budgetLevel: data.budgetLevel || 'moderate',
    })

    // Update user's onboarding status and link health profile
    await User.findByIdAndUpdate(session.user.id, {
      onboardingCompleted: true,
      healthProfile: healthProfile._id,
    })

    return NextResponse.json({
      success: true,
      message: 'Health profile created successfully',
      healthProfile: healthProfile.toObject(),
    })
  } catch (error: any) {
    console.error('Create health profile error:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create health profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const updates = await req.json()
    
    await connectDB()

    // Update health profile
    const healthProfile = await HealthProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          // Only update provided fields
          ...(updates.age && { age: parseInt(updates.age) }),
          ...(updates.gender && { gender: updates.gender }),
          ...(updates.height && { 
            height: { 
              value: parseFloat(updates.height), 
              unit: 'cm' 
            } 
          }),
          ...(updates.weight && { 
            weight: { 
              value: parseFloat(updates.weight), 
              unit: 'kg' 
            } 
          }),
          ...(updates.primaryHealthCondition && { 
            primaryHealthCondition: updates.primaryHealthCondition 
          }),
          ...(updates.secondaryConditions && { 
            secondaryConditions: updates.secondaryConditions 
          }),
          ...(updates.dietaryPreferences && { 
            dietaryPreferences: updates.dietaryPreferences 
          }),
          ...(updates.allergies !== undefined && { 
            allergies: updates.allergies ? 
              updates.allergies.split(',').map((a: string) => a.trim()).filter(Boolean) : 
              [] 
          }),
          ...(updates.activityLevel && { 
            activityLevel: updates.activityLevel 
          }),
          ...(updates.goals && { 
            goals: updates.goals 
          }),
          ...(updates.targetWeight && { 
            targetWeight: { 
              value: parseFloat(updates.targetWeight), 
              unit: 'kg' 
            } 
          }),
          ...(updates.mealsPerDay && { 
            mealsPerDay: parseInt(updates.mealsPerDay) 
          }),
          ...(updates.cookingTime && { 
            cookingTime: updates.cookingTime 
          }),
          ...(updates.budgetLevel && { 
            budgetLevel: updates.budgetLevel 
          }),
        }
      },
      { 
        new: true,
        runValidators: true 
      }
    )

    if (!healthProfile) {
      return NextResponse.json(
        { error: 'Health profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Health profile updated successfully',
      healthProfile: healthProfile.toObject(),
    })
  } catch (error: any) {
    console.error('Update health profile error:', error)
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update health profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Delete health profile
    const result = await HealthProfile.deleteOne({ 
      userId: session.user.id 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Health profile not found' },
        { status: 404 }
      )
    }

    // Update user to remove health profile reference
    await User.findByIdAndUpdate(session.user.id, {
      $unset: { healthProfile: 1 },
      onboardingCompleted: false,
    })

    return NextResponse.json({
      success: true,
      message: 'Health profile deleted successfully',
    })
  } catch (error) {
    console.error('Delete health profile error:', error)
    return NextResponse.json(
      { error: 'Failed to delete health profile' },
      { status: 500 }
    )
  }
}
