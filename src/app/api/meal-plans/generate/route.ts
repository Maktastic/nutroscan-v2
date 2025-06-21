import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { generateMealPlan } from '@/lib/ai/meal-plan-generator'
import connectDB from '@/lib/db/mongodb'
import MealPlan from '@/models/MealPlan'
import HealthProfile from '@/models/HealthProfile'
import { addDays, startOfDay } from 'date-fns'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      duration = 7,
      startDate = new Date(),
      customPreferences,
    } = body

    await connectDB()

    // Get user's health profile
    const healthProfile = await HealthProfile.findOne({ userId: session.user.id })
    
    if (!healthProfile) {
      return NextResponse.json(
        { error: 'Please complete your health profile first' },
        { status: 400 }
      )
    }

    // Prepare meal plan request
    const mealPlanRequest = {
      healthCondition: customPreferences?.healthCondition || healthProfile.primaryHealthCondition,
      dietaryPreferences: customPreferences?.dietaryPreferences || healthProfile.dietaryPreferences,
      allergies: customPreferences?.allergies || healthProfile.allergies,
      daysCount: duration,
      targetCalories: healthProfile.targetCalories,
      mealsPerDay: healthProfile.mealsPerDay || 3,
      cookingTime: customPreferences?.cookingTime || healthProfile.cookingTime || 'moderate',
      cuisinePreferences: customPreferences?.cuisinePreferences || healthProfile.cuisinePreferences,
      budgetLevel: customPreferences?.budgetLevel || healthProfile.budgetLevel || 'moderate',
    }

    // Generate meal plan with AI
    const result = await generateMealPlan(mealPlanRequest)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate meal plan' },
        { status: 500 }
      )
    }

    // Transform AI response to database format
    const mealPlanData = result.data!
    const start = startOfDay(new Date(startDate))
    
    const meals = mealPlanData.mealPlan.map((dayPlan, index) => ({
      day: index + 1,
      date: addDays(start, index),
      breakfast: { ...dayPlan.breakfast, mealType: 'breakfast' },
      lunch: { ...dayPlan.lunch, mealType: 'lunch' },
      dinner: { ...dayPlan.dinner, mealType: 'dinner' },
      snacks: dayPlan.snacks?.map(snack => ({ ...snack, mealType: 'snack' })) || [],
      totalNutrition: {
        calories: dayPlan.breakfast.nutrition.calories + dayPlan.lunch.nutrition.calories + dayPlan.dinner.nutrition.calories,
        protein: dayPlan.breakfast.nutrition.protein + dayPlan.lunch.nutrition.protein + dayPlan.dinner.nutrition.protein,
        carbs: dayPlan.breakfast.nutrition.carbs + dayPlan.lunch.nutrition.carbs + dayPlan.dinner.nutrition.carbs,
        fat: dayPlan.breakfast.nutrition.fat + dayPlan.lunch.nutrition.fat + dayPlan.dinner.nutrition.fat,
        fiber: dayPlan.breakfast.nutrition.fiber + dayPlan.lunch.nutrition.fiber + dayPlan.dinner.nutrition.fiber,
        sugar: dayPlan.breakfast.nutrition.sugar + dayPlan.lunch.nutrition.sugar + dayPlan.dinner.nutrition.sugar,
        sodium: dayPlan.breakfast.nutrition.sodium + dayPlan.lunch.nutrition.sodium + dayPlan.dinner.nutrition.sodium,
      },
    }))

    // Transform shopping list
    const shoppingList = mealPlanData.shoppingList.flatMap(category => 
      category.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        category: category.category,
        checked: false,
      }))
    )

    // Create meal plan in database
    const mealPlan = await MealPlan.create({
      userId: session.user.id,
      name: `${duration}-Day ${healthProfile.primaryHealthCondition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Meal Plan`,
      description: `AI-generated meal plan for ${healthProfile.primaryHealthCondition} management`,
      healthCondition: healthProfile.primaryHealthCondition,
      dietaryPreferences: healthProfile.dietaryPreferences,
      duration,
      startDate: start,
      endDate: addDays(start, duration - 1),
      meals,
      shoppingList,
      nutritionSummary: mealPlanData.nutritionSummary,
      healthTips: mealPlanData.healthTips,
      status: 'active',
      aiGenerated: true,
    })

    return NextResponse.json({
      success: true,
      mealPlan: mealPlan.toObject(),
    })
  } catch (error) {
    console.error('Meal plan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    )
  }
}
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

    const aiResponse = await generateMealPlan(mealPlanRequest)
    
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
