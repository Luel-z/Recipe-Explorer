import { ref } from 'vue';
const isAuthenticated = ref<boolean>(false);
export default function useAuth() {
    return {
        isAuthenticated,
    };
}