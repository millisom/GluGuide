# Use-Case Specification: Log Macros | Version 1.0

## 1. Use-Case: Log Macros  
### 1.1 Brief Description  
This supporting use case describes how the system automatically calculates and logs the macronutrient values (calories, proteins, fats, carbohydrates) for meals and recipes. This occurs when a meal or recipe is created or updated.

---

## 2. Basic Flow

### 2.1 Triggered via Meal Logging
1. The user submits a meal via **Log Meal Page**.
2. The system saves the meal to the database.
3. The system calls `recalculateMealNutrition(meal_id)` to compute macros.
4. The updated nutritional summary is stored and shown to the user.

### 2.2 Triggered via Recipe Creation
1. The user creates a new recipe via **Create Recipe Page**.
2. The system calculates the total nutritional values based on ingredient data.
3. The nutritional info is displayed in the **RecipeCard** view.

---

## 3. Narrative  

```gherkin
Feature: Macronutrient Calculation

  Scenario: Calculate macros when meal is logged
    Given a user logs a meal with food items or a recipe
    When the meal is submitted
    Then the system calculates total calories, proteins, carbs, and fats
    And stores them for the meal

  Scenario: Calculate macros when recipe is created
    Given a user adds ingredients while creating a recipe
    When the recipe is saved
    Then the system calculates and displays the nutritional info
```

---

## 4. Preconditions

- A valid list of food items (or recipe ingredients) with known nutrition data.
- API endpoint for macro calculation must be reachable.

---

## 5. Postconditions

- Total macros are stored in the meal or recipe record.
- Macros are shown in MealCard or RecipeCard views.

---

## 6. Exceptions

- If a food item has no nutrition data, it is skipped or handled gracefully.
- If the macro calculation API fails, an error message is shown (optional fallback or retry).

---
## 7. Link to SRS  
This use case is linked to the relevant section of the [Software Requirements Specification (SRS)](SRS.md).

---

## 8. CRUD Classification  
This use case performs a **READ** and **UPDATE** operation:
- Reads food item data
- Updates total nutritional values in meal or recipe records

---

## 9. Related Use Cases  
- [Log Meal](./LogMeal.md) — invokes macro logging for meals  
- [Create Recipe](./CreateRecipeUseCase.md) — invokes macro logging for recipes