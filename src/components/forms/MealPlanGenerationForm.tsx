"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscriptionLimits } from "@/hooks/useSubscriptionLimits";
import { UpgradePrompt } from "@/components/subscription/UpgradePrompt";

export function MealPlanGenerationForm() {
  const [formData, setFormData] = useState({
    healthCondition: "",
    dietaryPreferences: [] as string[],
    allergies: [] as string[],
    daysCount: 7,
    targetCalories: 2000,
    mealsPerDay: 3,
    cookingTime: "moderate" as "minimal" | "moderate" | "extensive",
    cuisinePreferences: [] as string[],
    budgetLevel: "moderate" as "budget" | "moderate" | "premium",
  });

  const { limits, checkLimit } = useSubscriptionLimits();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // Check meal plan limit
    const canGenerate = await checkLimit("mealPlan");

    if (!canGenerate) {
      setShowUpgradePrompt(true);
      return;
    }

    // ... existing generation logic
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch("/api/meal-plans/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Meal plan generated:", result);
        // Handle successful generation
      } else {
        console.error("Failed to generate meal plan");
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="healthCondition">Health Condition</Label>
            <Input id="healthCondition" value={formData.healthCondition} onChange={(e) => setFormData({ ...formData, healthCondition: e.target.value })} placeholder="e.g., diabetes, hypertension" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetCalories">Target Calories</Label>
            <Input id="targetCalories" type="number" value={formData.targetCalories} onChange={(e) => setFormData({ ...formData, targetCalories: parseInt(e.target.value) })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="daysCount">Number of Days</Label>
            <Input id="daysCount" type="number" min="1" max="30" value={formData.daysCount} onChange={(e) => setFormData({ ...formData, daysCount: parseInt(e.target.value) })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealsPerDay">Meals Per Day</Label>
            <Input id="mealsPerDay" type="number" min="1" max="6" value={formData.mealsPerDay} onChange={(e) => setFormData({ ...formData, mealsPerDay: parseInt(e.target.value) })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cookingTime">Cooking Time Preference</Label>
          <select
            id="cookingTime"
            value={formData.cookingTime}
            onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value as any })}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="minimal">Minimal (15 min or less)</option>
            <option value="moderate">Moderate (15-45 min)</option>
            <option value="extensive">Extensive (45+ min)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetLevel">Budget Level</Label>
          <select
            id="budgetLevel"
            value={formData.budgetLevel}
            onChange={(e) => setFormData({ ...formData, budgetLevel: e.target.value as any })}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="budget">Budget-friendly</option>
            <option value="moderate">Moderate</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <Button type="submit" disabled={isGenerating} className="w-full">
          {isGenerating ? "Generating..." : "Generate Meal Plan"}
        </Button>
      </form>
      {/* Add upgrade prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt
          feature="Unlimited meal plan generation"
          requiredPlan="professional"
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </>
  );
}
