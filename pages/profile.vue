<template>
  <div class="bg-gray-100 py-8 px-4">
    <div class="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
      <div class="flex items-center gap-6 border-b border-gray-300 pb-6">
        <img
          :src="AggregateDataResult?.users[0]?.profile ? AggregateDataResult.users[0].profile : 'https://as1.ftcdn.net/jpg/06/33/54/78/1000_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.webp'"
          alt="Profile Picture" class="w-36 h-36 rounded-full border-4 border-gray-300" />
        <div class="border-l-2 border-gray-300 h-36"></div>

        <div class="flex-1">
          <h1 class="text-2xl font-bold">{{ AggregateDataResult?.users[0]?.username }}</h1>
          <p class="text-gray-500">Ethiopia</p>
          <p class="mt-2 text-gray-600">
            {{ AggregateDataResult?.users[0]?.bio }}
          </p>
        </div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <div>
          <h2 class="text-xl font-bold text-gray-700">Posts</h2>
          <p class="text-gray-500">{{ AggregateDataResult?.users[0]?.userRecipes_aggregate?.aggregate?.count }}</p>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-700">BookMarked</h2>
          <p class="text-gray-500">{{ AggregateDataResult?.users[0]?.bookmarks_aggregate?.aggregate?.count }}</p>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-700">Liked Recipes</h2>
          <p class="text-gray-500">{{ AggregateDataResult?.users[0]?.likes_aggregate?.aggregate?.count }}</p>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-700">Comments</h2>
          <p class="text-gray-500">{{ AggregateDataResult?.users[0]?.comments_aggregate?.aggregate?.count }}</p>
        </div>
      </div>

      <div class="mt-8 border-b border-gray-200">
        <ul class="flex">
          <li class="mr-4 pb-2 border-b-2 border-orange-500 text-orange-500 font-medium cursor-pointer">
            Posted
          </li>
          <li class="pb-2 mr-4 text-gray-500 cursor-pointer">BookMarked</li>
          <li class="pb-2 mr-4 text-gray-500 cursor-pointer">Liked</li>
        </ul>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        <div v-for="(recipe, index) in RecipeByUserResult?.recipes" :key="recipe.id"
          class="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow cursor-pointer"
          @click="redirectToUpdateRecipe(recipe.id)">
          <img :src="recipe.images && recipe.images.length > 0 ? recipe.images[0] : defaultImage" :alt="recipe.title"
            class="w-full h-full object-cover" />
          <div class="text-center mt-2 text-sm font-medium text-gray-700">
            {{ recipe.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { methods } from '../data/recipesMethods.js';
import { useRecipeByUser, useAggregateData } from '../composables/RecipesQuery';
import { useRouter } from 'vue-router';

definePageMeta({
  middleware: 'auth'
})

var userID;

try {
  userID = methods.getUserIdFromToken();
  if (!userID) {
    console.log("User Not Authorized: ", err.message,);
  }
} catch (err) {
  console.log("Error Getting Token: ", err.message);
}

const { result: RecipeByUserResult, loading: RecipeByUserLoading, error: RecipeByUserError, refetch } = useRecipeByUser(userID);
const { result: AggregateDataResult, loading: AggregateDataLoading, error: AggregateDataError } = useAggregateData(userID);
const defaultImage = "https://cdn.dribbble.com/userupload/22570626/file/original-379b4978ee41eeb352e0ddacbaa6df96.jpg?resize=800x600&vertical=center";


const router = useRouter();
const redirectToUpdateRecipe = (recipeId) => {
  if (recipeId) {
    router.push({ path: '/update-recipe', query: { recipeId: recipeId } });
  }
};
</script>

<style scoped>
body {
  font-family: "Arial", sans-serif;
}
</style>