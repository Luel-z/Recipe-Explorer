<template>
    <div class="w-full min-h-screen flex flex-col bg-gray-100">
        <nav class="w-full flex justify-end items-center py-4 px-6">
            <div class="space-x-6 text-lg">
                <a href="/" class="px-4 py-2 text-black rounded-lg hover:bg-orange-600">Explore</a>
                <a href="/profile" class="px-4 py-2 text-black rounded-lg hover:bg-orange-600">Account</a>
                <a href="/add-recipe" class="px-4 py-2 text-black rounded-lg hover:bg-orange-600">Post</a>
                <a href="#" class="px-4 py-2 text-black rounded-lg hover:bg-orange-600">About</a>
                <a v-if="isAuthenticated" href="#" @click="handleLogout"
                    class="px-4 py-2 text-black rounded-lg hover:bg-orange-600">
                    Logout
                </a>
                <a v-else href="/login" class="px-4 py-2 text-black rounded-lg hover:bg-orange-600">
                    Login
                </a>
            </div>
        </nav>
        <NuxtPage />
        <footer class="text-center text-gray-600 py-4">
            &copy; Developed with ❤️, Minab Tech.
        </footer>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useCookie } from '#app';
import useAuth from '~/composables/isAuthenticated';

const { isAuthenticated } = useAuth();

onMounted(() => {
    const tokenCookie = useCookie('jwt');
    isAuthenticated.value = !!tokenCookie.value;
});

const handleLogout = () => {
    const tokenCookie = useCookie('jwt');
    tokenCookie.value = null;
    isAuthenticated.value = false;
    window.location.href = '/login';
};
</script>
