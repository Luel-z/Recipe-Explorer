<template>
    <div class="min-h-screen flex flex-col">
        <div class="flex-grow flex items-center justify-center px-4">
            <div class="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-hidden">
                <div class="lg:w-1/2 h-[300px] lg:h-auto">
                    <img src="/images/details1.jpg" alt="Sign Up Image" class="h-full w-full object-cover" />
                </div>
                <div class="w-full lg:w-1/2 max-w-md lg:ml-8 p-6">
                    <h2 class="text-3xl font-semibold mb-6 text-gray-800">SIGN UP</h2>
                    <form @submit.prevent="signUp" method="POST">
                        <div class="mb-4">
                            <label for="name" class="block text-gray-600 font-medium mb-2">Name *</label>
                            <input type="text" id="name" v-model="name" placeholder="Enter your name"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                        </div>
                        <div class="mb-4">
                            <label for="email" class="block text-gray-600 font-medium mb-2">Email *</label>
                            <input type="email" id="email" v-model="email" placeholder="Enter your email"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                        </div>
                        <div class="mb-4">
                            <label for="password" class="block text-gray-600 font-medium mb-2">Password *</label>
                            <input type="password" id="password" v-model="password" placeholder="Enter your password"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                        </div>
                        <div class="mb-4">
                            <label for="bio" class="block text-gray-600 font-medium mb-2">Bio</label>
                            <textarea id="bio" v-model="bio" placeholder="Tell us about yourself"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                rows="2"></textarea>
                        </div>
                        <div class="mb-6">
                            <label for="profile_image" class="block text-gray-600 font-medium mb-2">Profile
                                Image</label>
                            <input type="file" id="profile_image" @change="handleFileUpload"
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                        </div>
                        <div>
                            <button type="submit"
                                class="w-full px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { REGISTER_MUTATION } from "@/graphql/mutations";

const name = ref('');
const email = ref('');
const password = ref('');
const bio = ref('');
const profile = ref('');

const { mutate: registerUser, error } = useMutation(REGISTER_MUTATION);

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = () => {
            profile.value = reader.result.split(',')[1];
        };
        reader.onerror = () => {
            console.error("Error Occurred While Encoding Image");
        };
        reader.readAsDataURL(file);
    } else {
        console.warn("No file selected");
    }
};

const signUp = async () => {
    try {
        const { data, errors } = await registerUser({
            name: name.value,
            email: email.value,
            password: password.value,
            bio: bio.value,
            profile: profile.value,
        });
        if (errors) {
            throw new Error(errors[0].message);
        }
        alert('Registration successful', data.register.message);
        navigateTo('/login');

    } catch (err) {
        console.error('Registration failed', err.message);
    }
};
</script>


<style scoped>
body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}
</style>