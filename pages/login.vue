<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-grow flex items-center justify-center">
      <div class="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-hidden">

        <div class="lg:w-1/2 h-[200px] lg:h-[400px]">
          <img src="/public/images/details1.jpg" alt="Login Image" class="h-full w-full object-cover" />
        </div>

        <div class="w-full lg:w-1/2 max-w-md lg:ml-8 p-6">
          <h2 class="text-3xl font-semibold mb-6 text-gray-800">LOGIN</h2>
          <form @submit.prevent="handleLogin" method="POST">

            <div class="mb-4">
              <label for="email" class="block text-gray-600 font-medium mb-2">Email</label>
              <input type="email" id="email" v-model="email" placeholder="Enter your email"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
            </div>

            <div class="mb-6 relative">
              <label for="password" class="block text-gray-600 font-medium mb-2">Password</label>
              <input type="password" id="password" v-model="password" placeholder="Enter your password"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
              <button type="button"
                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">

              </button>
            </div>

            <div>
              <button type="submit"
                class="w-full px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                Login
              </button>
              <button type="button" @click="navigateToSignup"
                class="w-full px-4 py-2 mt-1 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
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
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import useAuth from '~/composables/isAuthenticated';
import { LOGIN_MUTATION } from "@/graphql/mutations";
import { navigateTo } from '#app';

const navigateToSignup = () => {
  navigateTo('/signup');
};

const { isAuthenticated } = useAuth();
const email = ref("");
const password = ref("");

const { mutate: login } = useMutation(LOGIN_MUTATION);

const handleLogin = async () => {
  try {
    const { datas, error } = await login({ email: email.value, password: password.value });
    isAuthenticated.value = true;
    navigateTo("/");
  } catch (error) {
    alert('Login failed:', error.message);
  }
};

</script>
