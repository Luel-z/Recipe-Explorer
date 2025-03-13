<template>
    <div v-if="latestRecipesLoading || categoryLoading" class="flex justify-center items-center h-screen">
        <p class="text-xl font-semibold">Loading...</p>
    </div>
    <div v-else>
        <div class="container mx-auto py-10 px-4 flex flex-col items-center">
            <header class="flex flex-col sm:flex-row justify-center items-center mb-10 w-full">
                <div class="flex-1 max-w-lg relative w-full sm:w-auto">
                    <div class="flex items-center">
                        <input :type="'text'" :placeholder="searchPlaceholder" v-model="searchInput"
                            class="w-full px-4 py-3 border rounded-l-full shadow-md" />
                        <button @click="toggleSearchType"
                            class="px-4 py-3 bg-gray-200 rounded-r-full shadow-md text-sm font-semibold">
                            {{ searchType === 'title' ? 'By Creator' : 'By Title' }}
                        </button>
                    </div>
                </div>

                <div class="relative mt-4 sm:mt-0 sm:ml-4">
                    <button @click="showPreparationTimeFilter = !showPreparationTimeFilter"
                        class="px-5 py-2 rounded-md text-sm font-semibold bg-gray-200 text-gray-800">
                        Filter by Time
                    </button>
                    <div v-if="showPreparationTimeFilter" class="absolute mt-2 bg-white shadow-lg rounded-lg p-2 z-10">
                        <button v-for="time in preparationTimeOptions" :key="time.label"
                            @click="filterByPreparationTime(time.value)"
                            class="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                            {{ time.label }}
                        </button>
                    </div>
                </div>
            </header>

            <h1 class="text-3xl sm:text-5xl font-bold text-center mb-6">Explore Recipes</h1>

            <nav class="flex overflow-x-auto space-x-3 mb-6 w-full px-4 sm:px-0 sm:ml-35">
                <button v-for="category in categories" :key="category.id" @click="changeCategory(category)"
                    class="px-3 py-1 sm:px-5 sm:py-2 rounded-full text-sm font-semibold transition whitespace-nowrap"
                    :class="selected === category.name ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'">
                    {{ category.name }}
                </button>
                <button @click="selected = ''"
                    class="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-full whitespace-nowrap">
                    Clear Filter
                </button>
            </nav>

            <div class="flex flex-col lg:flex-row w-full items-start">
                <main class="flex-1 w-full">
                    <p class="text-left text-gray-600 mb-6 w-full ml-20">You have <strong>{{ totalRecipes }}</strong>
                        recipes
                        to explore</p>

                    <div class="flex flex-col min-h-[600px]">
                        <div class="flex-1">
                            <div
                                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[90%] mx-auto">
                                <div v-for="recipe in paginatedRecipes" :key="recipe.id"
                                    class="bg-white p-4 rounded-lg shadow-md cursor-pointer relative"
                                    @click="handleRecipeClick(recipe)"
                                    :class="{ 'pointer-events-none': !isAuthenticated }">
                                    <div class="absolute bottom-0 right-3">
                                        <span @click.stop="handleBookmarkClick(recipe)" :class="{
                                            'cursor-pointer': isAuthenticated,
                                            'cursor-not-allowed': !isAuthenticated,
                                            'text-orange-500': recipe.isBookmarked,
                                            'text-gray-300': !recipe.isBookmarked
                                        }">
                                            <i class="fas fa-bookmark text-2xl sm:text-3xl transform rotate-180"></i>
                                        </span>
                                    </div>

                                    <img :src="recipe.image" alt="Recipe Image"
                                        class="w-full h-48 object-cover rounded-md" />

                                    <h2 class="text-lg font-bold mt-3">{{ recipe.title }}</h2>
                                    <p class="text-gray-600 text-sm">By {{ recipe.author }} in {{ recipe.category }}</p>

                                    <div class="flex items-center mt-3 text-gray-500 text-sm space-x-4">
                                        <span @click.stop="handleLikeClick(recipe)"
                                            :class="{ 'cursor-pointer': isAuthenticated, 'cursor-not-allowed': !isAuthenticated }">
                                            <i class="fas fa-heart text-gray"></i> {{ recipe.likes }}
                                        </span>
                                        <span @click.stop="handleCommentClick(recipe)"
                                            :class="{ 'cursor-pointer': isAuthenticated, 'cursor-not-allowed': !isAuthenticated }">
                                            <i class="fas fa-comment text-gray"></i> {{ recipe.comments }}
                                        </span>
                                        <span>
                                            <i v-for="star in 5" :key="star"
                                                @click.stop="isAuthenticated ? handleRateClick(recipe, star) : null"
                                                :class="[
                                                    star <= Math.round(recipe.rating) ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300',
                                                    { 'cursor-pointer': isAuthenticated, 'cursor-not-allowed': !isAuthenticated }
                                                ]">
                                            </i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-center mt-6">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="px-4 py-2 mx-2 bg-gray-200 rounded-full">Previous</button>
                            <span v-for="page in totalPages" :key="page" @click="goToPage(page)"
                                class="px-4 py-2 mx-1 cursor-pointer rounded-full"
                                :class="currentPage === page ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'">
                                {{ page }}
                            </span>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-4 py-2 mx-2 bg-gray-200 rounded-full">Next</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useLatestRecipes, useCategories } from '../composables/RecipesQuery';
import { useMutation } from "@vue/apollo-composable";
import { data } from '../data/recipesData.js';
import { computedProperties, methods } from '../data/recipesMethods.js';
import { useHead } from '@unhead/vue';
import { LIKE_RECIPE_MUTATION, RATING_RECIPE_MUTATION, BOOKMARK_RECIPE_MUTATION } from "@/graphql/mutations";

export default defineComponent({
    data() {
        return {
            ...data(),
            searchType: 'title',
        };
    },
    computed: {
        ...computedProperties,
        searchPlaceholder() {
            return this.searchType === 'title' ? 'Search Recipes' : 'Search by Creator';
        },
        searchInput: {
            get() {
                return this.searchType === 'title' ? this.searchTitleInput : this.searchUsernameInput;
            },
            set(value) {
                if (this.searchType === 'title') {
                    this.searchTitleInput = value;
                } else {
                    this.searchUsernameInput = value;
                }
            },
        },
    },
    methods: {
        ...methods,
        toggleSearchType() {
            this.searchType = this.searchType === 'title' ? 'creator' : 'title';
        },
    },
    setup() {
        var selected = ref();
        var categories = ref([]);
        var userId = methods.getUserIdFromToken() ? methods.getUserIdFromToken() : "11111111-1111-1111-1111-111111111111"


        useHead({
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
                },
            ],
        });
        const { result: latestRecipesResult, loading: latestRecipesLoading, error: latestRecipesError, refetch } = useLatestRecipes(userId);
        const { result: categoryResult, loading: categoryLoading, error: categoryError } = useCategories();
        const { mutate: LikeRecipe } = useMutation(LIKE_RECIPE_MUTATION);
        const { mutate: RateRecipe } = useMutation(RATING_RECIPE_MUTATION);
        const { mutate: BookmarkRecipe } = useMutation(BOOKMARK_RECIPE_MUTATION);

        watchEffect(() => {
            if (categoryResult.value) {
                categories.value = categoryResult.value.categories;
            }
        });

        function changeCategory(category) {
            selected.value = category.name;
        }
        return {
            latestRecipesResult,
            latestRecipesLoading,
            latestRecipesError,
            categoryResult,
            categoryLoading,
            categoryError,
            changeCategory,
            selected,
            categories,
            LikeRecipe,
            refetch,
            RateRecipe,
            BookmarkRecipe,
        };
    },
});
</script>

<style>
body {
    background-color: #f9f9f9;
}

html,
body {
    overflow-x: hidden;
}

button {
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #e5e7eb;
}
</style>