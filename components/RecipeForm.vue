<template>
    <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Recipe Name</label>
                        <input v-model="recipe.name" type="text" placeholder="Enter your recipe name..."
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea v-model="recipe.description" rows="3"
                            placeholder="Describe your recipe in a few words..."
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Ingredients</label>
                        <div v-for="(ingredient, index) in recipe.ingredients" :key="index"
                            class="flex items-center mt-2">
                            <input v-model="recipe.ingredients[index]" type="text" placeholder="Add an ingredient..."
                                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                            <button @click="removeIngredient(index)" class="ml-2 text-red-500 hover:text-red-700">
                                ✕
                            </button>
                        </div>
                        <button @click="addIngredient" class="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
                            + Add Ingredient
                        </button>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Instructions</label>
                        <div v-for="(step, index) in recipe.instructions" :key="index" class="flex items-center mt-2">
                            <textarea v-model="recipe.instructions[index]" rows="2" placeholder="Add a step..."
                                class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                            <button @click="removeInstruction(index)" class="ml-2 text-red-500 hover:text-red-700">
                                ✕
                            </button>
                        </div>
                        <button @click="addInstruction" class="mt-2 text-sm text-indigo-600 hover:text-indigo-500">
                            + Add Step
                        </button>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Preparation Time</label>
                        <input v-model="recipe.preparation_time" type="text" placeholder="Preparation Time"
                            class="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Categories</label>
                        <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div v-for="category in predefinedCategories" :key="category.id" class="flex items-center">
                                <input type="radio" :id="category.id" :value="category.id" v-model="recipe.categories"
                                    class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                <label :for="category.id" class="ml-2 text-sm text-gray-700">{{ category.name }}</label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700">Upload Images</label>
                        <div
                            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div class="space-y-1 text-center">
                                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
                                    viewBox="0 0 48 48">
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div class="flex text-sm text-gray-600">
                                    <label for="file-upload"
                                        class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                                        <span>Upload files</span>
                                        <input id="file-upload" name="file-upload" type="file" multiple class="sr-only"
                                            @change="handleMultipleImageUpload" />
                                    </label>
                                    <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="recipe.images.length > 0" class="mb-6">
                        <h3 class="block text-sm font-medium text-gray-700 mb-4">Uploaded Images</h3>
                        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            <div v-for="(image, index) in recipe.images" :key="index" class="relative group">
                                <img :src="image" alt="Uploaded Preview"
                                    class="w-full h-24 object-cover rounded-lg shadow-md">
                                <button @click="removeImage(index)"
                                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none">
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button @click="publishRecipe" :disabled="uploadLoading"
                            class="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 flex items-center justify-center min-w-[80px]">
                            <span v-if="uploadLoading"
                                class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                            <span v-else>Publish</span>
                        </button>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Live Preview</h2>
                    <div class="space-y-4">
                        <div class="space-y-4">
                            <div v-if="recipe.images.length > 0" class="grid grid-cols-2 gap-4">
                                <img v-for="(image, index) in recipe.images" :key="index" :src="image"
                                    alt="Recipe Preview" class="w-full h-24 object-cover rounded-lg">
                            </div>
                            <div v-else
                                class="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                No Images Uploaded
                            </div>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">{{ recipe.name || "Recipe Name" }}</h3>
                        <p class="text-gray-600">{{ recipe.description || "Recipe description..." }}</p>
                        <div class="space-y-2">
                            <h4 class="text-lg font-semibold text-gray-900">Ingredients</h4>
                            <ul class="list-disc list-inside text-gray-600">
                                <li v-for="(ingredient, index) in recipe.ingredients" :key="index">{{ ingredient }}</li>
                            </ul>
                        </div>
                        <div class="space-y-2">
                            <h4 class="text-lg font-semibold text-gray-900">Instructions</h4>
                            <ol class="list-decimal list-inside text-gray-600">
                                <li v-for="(step, index) in recipe.instructions" :key="index">{{ step }}</li>
                            </ol>
                        </div>
                        <div class="space-y-2">
                            <h4 class="text-lg font-semibold text-gray-900">Categories</h4>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="category in recipe.categories" :key="category.id"
                                    class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                    {{ category.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { CREATE_RECIPE_MUTATION, UPLOAD_MUTATION } from "@/graphql/mutations";
import { useCategories } from "../composables/RecipesQuery";
import { useRouter } from "vue-router";
import { methods } from "../data/recipesMethods.js";

const router = useRouter();
const { mutate: createRecipe } = useMutation(CREATE_RECIPE_MUTATION);
const { mutate: UploadImage } = useMutation(UPLOAD_MUTATION);
const { result: categoryResult } = useCategories();

const predefinedCategories = ref([]);
const userID = methods.getUserIdFromToken();
const uploadLoading = ref(false);
const newImageFiles = ref([]);

const recipe = ref({
    name: "",
    description: "",
    preparation_time: "0",
    ingredients: [],
    instructions: [],
    categories: "",
    images: [],
});

watchEffect(() => {
    if (categoryResult.value) {
        predefinedCategories.value = categoryResult.value.categories;
    }
});


const addIngredient = () => recipe.value.ingredients.push("");
const removeIngredient = (index) => recipe.value.ingredients.splice(index, 1);
const addInstruction = () => recipe.value.instructions.push("");
const removeInstruction = (index) => recipe.value.instructions.splice(index, 1);
const removeImage = (index) => recipe.value.images.splice(index, 1);

const handleMultipleImageUpload = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    uploadLoading.value = true;

    const fileReadPromises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target.result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = () => {
                reject("Error Occurred While Encoding Image");
            };
            reader.readAsDataURL(file);
        });
    });

    Promise.all(fileReadPromises)
        .then(base64Files => {
            newImageFiles.value.push(...base64Files);
            initateUpload();
        })
        .catch(error => {
            console.error(error);
            uploadLoading.value = false;
        });
};

const initateUpload = async () => {
    try {
        for (const base64File of newImageFiles.value) {
            const { data } = await UploadImage({ file: base64File });
            if (data) {
                recipe.value.images.push(data.uploadImage.url);
            }
        }
    } catch (err) {
        console.log("Failed To Upload: " + err);
    } finally {
        uploadLoading.value = false;
        newImageFiles.value = [];
    }
};

const publishRecipe = async () => {
    try {
        if (!userID) {
            console.log("Not Authenticated")
            router.push({
                path: '/',
            });
        }
        const { data } = await createRecipe({
            title: recipe.value.name,
            description: recipe.value.description,
            preparation_time: parseInt(recipe.value.preparation_time),
            categories: recipe.value.categories,
            images: recipe.value.images,
            ingredients: recipe.value.ingredients.map(ingredient => ({
                ingredient_name: ingredient,
            })),
            steps: recipe.value.instructions.map((step, index) => ({
                step_number: index + 1,
                description: step
            }))
        });
        if (!data) {
            console.log("Error Publishing Recipe")
        }
        router.push({
            path: '/',
        });
    } catch (err) {
        console.error("Error creating recipe:", err);
    }
};
</script>

<style scoped></style>