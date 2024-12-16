import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

// Define interfaces
interface UserPayloadInterface {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
}
interface validation {}
// Define reactive form data
// Define a reactive message
const invalidMsg = ref<string>("");

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    loading: false,
    userData: null as UserData | null,
    validation: null as UserData | null,
  }),
  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface) {
      this.loading = true; // Set loading to true while making the requestf

      try {
        const response = await axios.post(
          "http://localhost:5000/auth/login",
          { email, password } // Pass the destructured data here
        );

        if (response && response.data) {
          const token = useCookie("token");
          token.value = response.data.token;
          this.authenticated = true;
          this.userData = {
            name: response.data.user.name,
            email: response.data.user.email,
          };
          alert(response?.data?.message); // Show success message
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          alert(error.response?.data?.message); // Show error message
        }
        invalidMsg.value =
          error.response?.data?.errors?.[0]?.msg || "An error occurred"; // Safely handle potential errors
        console.log(invalidMsg.value); // Log the error message
      } finally {
        this.loading = false; // Set loading to false after the request is complete
      }
    },

    logUserOut() {
      const token = useCookie("token"); // useCookie hook in Nuxt 3
      this.authenticated = false; // Set authenticated state to false
      token.value = null; // Clear the token cookie
    },
  },
});
