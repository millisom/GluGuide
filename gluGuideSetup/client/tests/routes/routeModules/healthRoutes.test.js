import { describe, it, expect, vi } from 'vitest';
import { healthRoutes } from '../../../src/routes/routeModules/healthRoutes';

// Mock React's lazy
vi.mock('react', () => ({
  lazy: vi.fn(importFn => importFn)
}));

// Mock the lazy-loaded components
vi.mock('../../../src/pages/LogMealPage.jsx', () => ({ default: () => null }));
vi.mock('../../../src/pages/CreateRecipePage.jsx', () => ({ default: () => null }));
vi.mock('../../../src/pages/RecipeSummaryPage.jsx', () => ({ default: () => null }));
vi.mock('../../../src/components/RecipeCardRoute.jsx', () => ({ default: () => null }));
vi.mock('../../../src/pages/MealsOverviewPage.jsx', () => ({ default: () => null }));
vi.mock('../../../src/components/MealCardRoute.jsx', () => ({ default: () => null }));

describe('Health Routes Module', () => {
  it('should export the correct routes', () => {
    // Check that healthRoutes is an array
    expect(Array.isArray(healthRoutes)).toBe(true);
    
    // Check the length of routes
    expect(healthRoutes.length).toBe(6);
    
    // Check specific routes
    expect(healthRoutes).toContainEqual(
      expect.objectContaining({ path: '/logMeal' })
    );
    expect(healthRoutes).toContainEqual(
      expect.objectContaining({ path: '/createRecipe' })
    );
    expect(healthRoutes).toContainEqual(
      expect.objectContaining({ path: '/Recipes' })
    );
    expect(healthRoutes).toContainEqual(
      expect.objectContaining({ path: '/recipes/:id' })
    );
    expect(healthRoutes).toContainEqual(
      expect.objectContaining({ path: '/mealsOverview' })
    );
    expect(healthRoutes).toContainEqual(
      expect.objectContaining({ path: '/meals/:mealId' })
    );
  });
  
  it('should have the correct element properties', () => {
    // Check that each route has an element property
    healthRoutes.forEach(route => {
      expect(route).toHaveProperty('element');
      expect(typeof route.element).toBe('function');
    });
  });
}); 