import { lazy } from 'react';

// Lazy load health-related components
const LogMealPage = lazy(() => import('../../pages/LogMealPage.jsx'));
const CreateRecipePage = lazy(() => import('../../pages/CreateRecipePage.jsx'));
const SummaryPage = lazy(() => import('../../pages/RecipeSummaryPage.jsx'));
const RecipeCardRoute = lazy(() => import('../../components/RecipeCardRoute.jsx'));
const MealsOverviewPage = lazy(() => import('../../pages/MealsOverviewPage.jsx'));
const MealCardRoute = lazy(() => import('../../components/MealCardRoute.jsx'));

// Export routes as objects
export const healthRoutes = [
  { path: "/logMeal", element: LogMealPage },
  { path: "/createRecipe", element: CreateRecipePage },
  { path: "/Recipes", element: SummaryPage },
  { path: "/recipes/:id", element: RecipeCardRoute },
  { path: "/mealsOverview", element: MealsOverviewPage },
  { path: "/meals/:mealId", element: MealCardRoute },
]; 