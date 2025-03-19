<template>
  <div class="text-left pl-25 sm:pl-10 lg:pl-25">
    <h1 class="text-4xl font-bold text-gray-800">
      <span class="text-orange-600">Recipe</span>
      <span class="text-gray-600">Details</span>
    </h1>
    <p class="mt-2 text-lg text-gray-500">
      Explore the delicious details of this recipe.
    </p>
  </div>
  <div class="mx-auto p-4 md:p-8 md:mr-20 md:ml-20 mb-10">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <div class="relative">
        <img :src="images[currentImage]" :alt="recipe.title"
          class="rounded-lg shadow-lg w-full h-48 md:h-[350px] object-cover" />
        <button @click="prevImage"
          class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button @click="nextImage"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
          <svg class="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <span v-for="(image, index) in images" :key="index"
            :class="{ 'bg-gray-800': index === currentImage, 'bg-gray-400': index !== currentImage }"
            class="w-2 h-2 rounded-full"></span>
        </div>
      </div>

      <div class="flex flex-col justify-center">
        <div class="flex items-center mb-5">
          <img src="/public/images/person.jpeg" alt="Profile" class="w-12 h-12 md:w-25 md:h-25 rounded-full mr-4" />
          <div>
            <h3 class="text-lg font-semibold">{{ recipe.user.username }}</h3>
            <p class="text-gray-500">{{ recipe.user.bio || 'No bio available' }}</p>
          </div>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold">{{ recipe.title }}</h2>
        <p class="text-gray-600 mt-2">{{ recipe.description }}</p>

        <div class="mt-4 flex space-x-2">
          <span class="bg-green-100 text-gray px-3 py-1 rounded-full text-sm">Categorized by {{ recipe.category
          }}</span>
        </div>

        <button @click="showPopup = true"
          class="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">
          Buy the Full Recipe
        </button>
      </div>
    </div>

    <hr class="my-8 border-t border-gray-300" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 class="text-xl md:text-2xl font-bold mb-4">INGREDIENTS</h3>
        <ul class="list-none space-y-4">
          <li v-for="(ingredient, index) in ingredients" :key="index" class="flex items-center whitespace-nowrap">
            <span class="text-gray mr-2">✔️</span> {{ ingredient.ingredient_name }}
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl md:text-2xl font-bold mb-4">INSTRUCTIONS</h3>
        <ol class="pl-6 space-y-4">
          <li v-for="(step, index) in steps" :key="index" class="relative">
            <div class="flex items-start">
              <span
                class="inline-block w-8 h-8 text-center border-2 border-light-blue-500 text-black rounded-full mr-2 flex-shrink-0">{{
                  index + 1 }}</span>
              <span class="ml-2">{{ step.description }}</span>
            </div>
            <span v-if="index < steps.length - 1" class="absolute left-4 top-8 h-3 border-l-2 border-gray-500"></span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useRecipesIngredient, useRecipesStep } from '~/composables/RecipesQuery';
definePageMeta({
  middleware: 'auth'
})

const route = useRoute();
const recipe = JSON.parse(route.query.recipe);
const recipeId = ref(recipe.id);
const { result: ingredientsResult, loading: ingredientsLoading, error: ingredientsError } = useRecipesIngredient(recipeId);
const { result: stepsResult, loading: stepsLoading, error: stepsError } = useRecipesStep(recipeId);
const ingredients = ref([]);
const steps = ref([]);

watchEffect(() => {
  if (ingredientsResult.value) {
    ingredients.value = ingredientsResult.value.ingredients;
  }
  if (stepsResult.value) {
    steps.value = stepsResult.value.recipe_steps;
  }
});

const currentImage = ref(0);
const defaultImage = "https://cdn.dribbble.com/userupload/22570626/file/original-379b4978ee41eeb352e0ddacbaa6df96.jpg?resize=800x600&vertical=center";
const images = recipe.images && recipe.images.length > 0 ? recipe.images : [defaultImage];

const prevImage = () => {
  currentImage.value = (currentImage.value - 1 + images.length) % images.length;
};

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % images.length;
};
</script>

<style scoped>
.container {
  max-width: 900px;
}

.border-light-blue-500 {
  border-color: #3b82f6;
}
</style>