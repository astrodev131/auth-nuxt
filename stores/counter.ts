import { defineStore } from "pinia";

interface UserPayloadInterface {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    loading: false,
    userData: null as UserData | null,
  }),
  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface) {
      // useFetch from nuxt 3
      const { data, pending, error }: any = await useFetch(
        "http://localhost:5000/auth/login",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: {
            email,
            password,
          },
        }
      );
      this.loading = pending;
      if (error.value) throw new Error(error.value.message);
      this.loading = pending;

      if (data.value) {
        const token = useCookie("token");
        token.value = data.value.token;
        this.authenticated = true;
        this.userData = {
          name: data.value.user.name,
          email: data.value.user.email,
        };
      }
    },
    logUserOut() {
      const token = useCookie("token"); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});
