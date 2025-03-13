import { useQuery } from '@vue/apollo-composable';
import type { UUID } from 'crypto';
import type { Ref } from 'vue';
import {
    GET_LATEST_RECIPES,
    GET_RECIPES_INGREDIENT,
    GET_RECIPES_STEPS,
    GET_CATEGORIES,
    GET_RECIPES,
    GET_RECIPES_TITLE,
    GET_AGGREGATE,
} from '~/graphql/queries';

export function useLatestRecipes(userId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_LATEST_RECIPES, { userID: userId });
    return {
        result,
        loading,
        error,
        refetch,
    };
}

export function useRecipesIngredient(recipe_id: Ref<string>) {
    const { result, loading, error } = useQuery(GET_RECIPES_INGREDIENT, { recipe_id: recipe_id.value });

    return {
        result,
        loading,
        error
    };
}

export function useRecipesStep(recipe_id: Ref<string>) {
    const { result, loading, error } = useQuery(GET_RECIPES_STEPS, { recipe_id: recipe_id.value });

    return {
        result,
        loading,
        error
    };
}

export function useCategories() {
    const { result, loading, error } = useQuery(GET_CATEGORIES);

    return {
        result,
        loading,
        error
    };
}

export function useRecipes(recipeId: string) {
    const { result, loading, error } = useQuery(GET_RECIPES, {
        recipe_id: recipeId
    });

    return {
        result,
        loading,
        error,
    };
}

export function useAggregateData(userId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_AGGREGATE, { userId: userId });

    return {
        result,
        loading,
        error,
        refetch,
    };
}

export function useRecipeByUser(userId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_RECIPES_TITLE, { userId: userId });

    return {
        result,
        loading,
        error,
        refetch,
    };
}