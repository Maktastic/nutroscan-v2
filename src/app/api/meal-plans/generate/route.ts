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
