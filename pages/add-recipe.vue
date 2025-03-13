<template>
    <div class="text-left pl-25 sm:pl-10 lg:pl-25">
        <h1 class="text-4xl font-bold text-gray-800">
            <span class="text-orange-600">Add</span>
            <span class="text-gray-600">Recipe</span>
        </h1>
        <p class="mt-2 text-lg text-gray-500">
            Share your culinary masterpiece with the world.
        </p>
    </div>
    <RecipeForm />
</template>

<script setup>
import RecipeForm from "~/components/RecipeForm.vue";

definePageMeta({
    middleware: 'auth'
})
</script>