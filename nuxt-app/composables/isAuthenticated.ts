import { ref } from 'vue';
var isAuthenticated = ref(false);
export default function useAuth() {
    return {
        isAuthenticated,
    };
}