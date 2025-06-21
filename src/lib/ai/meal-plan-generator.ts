import { openai, HEALTH_CONDITION_PROMPTS } from './openai-client'
import { z } from 'zod'

// Schema for AI response validation
const MealSchema = z.object({
  name: z.string(),
  description: z.string(),
  cookingTime: z.number(),
  prepTime: z.number(),
  servings: z.number(),
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    unit: z.string(),
  })),
  instructions: z.array(z.string()),
  nutrition: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    fiber: z.number(),
    sugar: z.number(),
    sodium: z.number(),
  }),
  tips: z.array(z.string()).optional(),
})

const DayMealPlanSchema = z.object({
  breakfast: MealSchema,
  lunch: MealSchema,
  dinner: MealSchema,
  snacks: z.array(MealSchema).optional(),
})

const MealPlanResponseSchema = z.object({
  mealPlan: z.array(DayMealPlanSchema),
  shoppingList: z.array(z.object({
    category: z.string(),
    items: z.array(z.object({
      name: z.string(),
      quantity: z.string(),
      notes: z.string().optional(),
    })),
  })),
  nutritionSummary: z.object({
    averageDailyCalories: z.number(),
    averageDailyProtein: z.number(),
    averageDailyCarbs: z.number(),
    averageDailyFat: z.number(),
    averageDailyFiber: z.number(),
  }),
  healthTips: z.array(z.string()),
})

export interface MealPlanRequest {
  healthCondition: string
  dietaryPreferences: string[]
  allergies: string[]
  daysCount: number
  targetCalories?: number
  mealsPerDay: number
  cookingTime: 'minimal' | 'moderate' | 'extensive'
  cuisinePreferences?: string[]
  budgetLevel: 'budget' | 'moderate' | 'premium'
}

export async function generateMealPlan(request: MealPlanRequest) {
  try {
    const systemPrompt = HEALTH_CONDITION_PROMPTS[request.healthCondition as keyof typeof HEALTH_CONDITION_PROMPTS] || HEALTH_CONDITION_PROMPTS['general-wellness']
    
    const userPrompt = `Create a ${request.daysCount}-day meal plan with the following requirements:
    
Health Condition: ${request.healthCondition}
Dietary Preferences: ${request.dietaryPreferences.join(', ') || 'None'}
Allergies/Restrictions: ${request.allergies.join(', ') || 'None'}
Meals per Day: ${request.mealsPerDay}
Cooking Time Preference: ${request.cookingTime}
Budget Level: ${request.budgetLevel}
${request.targetCalories ? `Target Daily Calories: ${request.targetCalories}` : ''}
${request.cuisinePreferences ? `Cuisine Preferences: ${request.cuisinePreferences.join(', ')}` : ''}

Please provide:
1. Complete meal plans for ${request.daysCount} days
2. A categorized shopping list for all ingredients
3. Nutrition summary with daily averages
4. 5 specific health tips for managing ${request.healthCondition}

Format the response as a JSON object matching this structure:
{
  "mealPlan": [...], // Array of daily meal plans
  "shoppingList": [...], // Categorized shopping list
  "nutritionSummary": {...}, // Average daily nutrition
  "healthTips": [...] // Array of health tips
}

Ensure all meals are:
- Delicious and satisfying
- Nutritionally balanced for the health condition
- Respecting all dietary preferences and allergies
- Within the specified cooking time
- Budget-conscious based on the level specified`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse and validate the response
    const parsedResponse = JSON.parse(response)
    const validatedResponse = MealPlanResponseSchema.parse(parsedResponse)

    return {
      success: true,
      data: validatedResponse,
    }
  } catch (error) {
    console.error('Meal plan generation error:', error)
    
    // Fallback error handling
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid response format from AI',
        details: error.errors,
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate meal plan',
    }
  }
}

// Generate a single recipe
export async function generateRecipe(requirements: {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  healthCondition: string
  dietaryPreferences: string[]
  allergies: string[]
  maxCookingTime?: number
  cuisine?: string
}) {
  try {
    const systemPrompt = HEALTH_CONDITION_PROMPTS[requirements.healthCondition as keyof typeof HEALTH_CONDITION_PROMPTS] || HEALTH_CONDITION_PROMPTS['general-wellness']
    
    const userPrompt = `Create a single ${requirements.mealType} recipe that is:
- Suitable for ${requirements.healthCondition}
- Respects dietary preferences: ${requirements.dietaryPreferences.join(', ') || 'None'}
- Avoids allergies: ${requirements.allergies.join(', ') || 'None'}
${requirements.maxCookingTime ? `- Can be prepared in under ${requirements.maxCookingTime} minutes` : ''}
${requirements.cuisine ? `- ${requirements.cuisine} cuisine style` : ''}

Provide a complete recipe with ingredients, instructions, nutrition facts, and helpful tips.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0].message.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    const parsedRecipe = JSON.parse(response)
    const validatedRecipe = MealSchema.parse(parsedRecipe)

    return {
      success: true,
      data: validatedRecipe,
    }
  } catch (error) {
    console.error('Recipe generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate recipe',
    }
  }
}
