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

interface Validation {
  email: string;
  password: string;
}
export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    loading: false,
    userData: null as UserData | null,
    validation: null as Validation | null,
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
          alert(response?.data?.message); // Show success message
        }
      } catch (error: any) {
        console.log(error.response?.data?.errors[0]?.path);
        this.validation = {
          email:
            error.response?.data?.errors[0]?.path === "email"
              ? "Please provide a valid email"
              : "",
          password:
            error.response?.data?.errors[0]?.path === "password" ||
            error.response?.data?.errors[1]?.path === "password"
              ? "Password is required"
              : "",
        };
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
