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
    GET_USER_LIKED_RECIPES,
    GET_USER_BOOKMARKED_RECIPES,
    GET_USER_COMMENTED_RECIPES,
    GET_RATING_AND_COMMENT,
    GET_AGGREGATE_RATING,
    GET_RECIPES_PREVIEW_INGREDIENT,
    GET_RECIPES_PREVIEW_STEPS,
    GET_PAYMENTS,

} from '~/graphql/queries';

export function useLatestRecipes(
    userId: UUID,
    category: string,
    title: string,
    username: string,
    preparationTime: number,
) {
    const { result, loading, error, refetch } = useQuery(GET_LATEST_RECIPES, {
        userID: userId,
        category: category,
        title: title,
        username: username,
        preparationTime: preparationTime,

    });
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

export function useLikedByUser(userId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_USER_LIKED_RECIPES, { userId: userId });

    return {
        result,
        loading,
        error,
        refetch,
    };
}

export function useCommentedByUser(userId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_USER_COMMENTED_RECIPES, { userId: userId });

    return {
        result,
        loading,
        error,
        refetch,
    };
}
export function useBookmarkedByUser(userId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_USER_BOOKMARKED_RECIPES, { userId: userId });

    return {
        result,
        loading,
        error,
        refetch,
    };
}

export function useUserRateAndComment(recipeId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_RATING_AND_COMMENT, { recipeId: recipeId });

    return {
        result,
        loading,
        error,
        refetch,
    };
}

export function useAggregateRating(recipeId: UUID) {
    const { result, loading, error, refetch } = useQuery(GET_AGGREGATE_RATING, { recipeId: recipeId });

    return {
        result,
        loading,
        error,
        refetch,
    };
}

export function usePreviewIngredients(recipe_id: Ref<string>) {
    const { result, loading, error } = useQuery(GET_RECIPES_PREVIEW_INGREDIENT, { recipe_id: recipe_id.value });

    return {
        result,
        loading,
        error
    };
}

export function usePreviewSteps(recipe_id: Ref<string>) {
    const { result, loading, error } = useQuery(GET_RECIPES_PREVIEW_STEPS, { recipe_id: recipe_id.value });

    return {
        result,
        loading,
        error
    };
}

export function usePayments(recipe_id: Ref<string>, userId: string) {
    const { result, loading, error } = useQuery(GET_PAYMENTS, { recipe_id: recipe_id.value, userId: userId });

    return {
        result,
        loading,
        error
    };
}