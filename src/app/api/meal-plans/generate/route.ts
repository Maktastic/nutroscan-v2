import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { generateMealPlan } from '@/lib/ai/meal-plan-generator'
import { connectDB } from '@/lib/db/mongodb'
import MealPlan from '@/models/MealPlan'
import User from '@/models/User'
import { addDays, format } from 'date-fns'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const {
      duration,
      startDate,
      cookingTime,
      budgetLevel,
      cuisinePreferences,
      customNotes
    } = body

    // Generate meal plan using AI
    const mealPlanRequest = {
      healthCondition: user.healthProfile?.condition || 'general-wellness',
      dietaryPreferences: user.healthProfile?.dietaryPreferences || [],
      allergies: user.healthProfile?.allergies || [],
      daysCount: duration,
      targetCalories: user.healthProfile?.targetCalories,
      mealsPerDay: 3,
      cookingTime,
      cuisinePreferences,
      budgetLevel
    }

    const aiResponse: any = await generateMealPlan(mealPlanRequest)
    
    if (!aiResponse.success) {
      return NextResponse.json({ error: aiResponse.error }, { status: 500 })
    }

    const endDate = addDays(new Date(startDate), duration - 1)

    // Create meal plan with proper daily structure
    const meals = aiResponse.data.mealPlan.map((dayPlan: any, index: number) => {
      const dayDate = addDays(new Date(startDate), index)
      
      // Calculate daily nutrition totals
      const totalNutrition = {
        calories: (dayPlan.breakfast?.nutrition?.calories || 0) + 
                 (dayPlan.lunch?.nutrition?.calories || 0) + 
                 (dayPlan.dinner?.nutrition?.calories || 0),
        protein: (dayPlan.breakfast?.nutrition?.protein || 0) + 
                (dayPlan.lunch?.nutrition?.protein || 0) + 
                (dayPlan.dinner?.nutrition?.protein || 0),
        carbs: (dayPlan.breakfast?.nutrition?.carbs || 0) + 
               (dayPlan.lunch?.nutrition?.carbs || 0) + 
               (dayPlan.dinner?.nutrition?.carbs || 0),
        fat: (dayPlan.breakfast?.nutrition?.fat || 0) + 
             (dayPlan.lunch?.nutrition?.fat || 0) + 
             (dayPlan.dinner?.nutrition?.fat || 0),
        fiber: (dayPlan.breakfast?.nutrition?.fiber || 0) + 
               (dayPlan.lunch?.nutrition?.fiber || 0) + 
               (dayPlan.dinner?.nutrition?.fiber || 0),
        sugar: (dayPlan.breakfast?.nutrition?.sugar || 0) + 
               (dayPlan.lunch?.nutrition?.sugar || 0) + 
               (dayPlan.dinner?.nutrition?.sugar || 0),
        sodium: (dayPlan.breakfast?.nutrition?.sodium || 0) + 
                (dayPlan.lunch?.nutrition?.sodium || 0) + 
                (dayPlan.dinner?.nutrition?.sodium || 0)
      }

      return {
        day: index + 1,
        date: dayDate,
        breakfast: dayPlan.breakfast,
        lunch: dayPlan.lunch,
        dinner: dayPlan.dinner,
        totalNutrition
      }
    })

    // Save to database
    const mealPlan = new MealPlan({
      userId: session.user.id,
      name: `${duration}-Day Meal Plan for ${user.healthProfile?.condition || 'General Wellness'}`,
      description: `Personalized meal plan created on ${format(new Date(), 'MMM d, yyyy')}`,
      healthCondition: user.healthProfile?.condition || 'general-wellness',
      startDate: new Date(startDate),
      endDate,
      meals,
      shoppingList: aiResponse.data.shoppingList,
      nutritionSummary: aiResponse.data.nutritionSummary,
      healthTips: aiResponse.data.healthTips
    })

    await mealPlan.save()

    return NextResponse.json({ 
      success: true, 
      mealPlan: {
        _id: mealPlan._id,
        name: mealPlan.name,
        description: mealPlan.description
      }
    })

  } catch (error) {
    console.error('Meal plan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    )
  }
}
