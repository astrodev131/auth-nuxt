<template>
  <div>
    <div class="title">
      <h2>Login</h2>
    </div>
    <div class="container form">
      <label for="uname"><b>Username</b></label>
      <input
        v-model="user.email"
        type="text"
        class="input"
        placeholder="Enter Username"
        name="uname"
        required
      />

      <label for="psw"><b>Password</b></label>
      <input
        v-model="user.password"
        type="password"
        class="input"
        placeholder="Enter Password"
        name="psw"
        required
      />

      <button @click.prevent="login" class="button">Login</button>
    </div>
    <button @click.prevent="logUserOut">logout</button>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia"; // import storeToRefs helper hook from pinia
import { useAuthStore } from "../stores/counter"; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { logUserOut } = useAuthStore();

const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const user = ref({
  email: "aaa@outglook.com",
  password: "aaaaaa",
});
const router = useRouter();

const login = async () => {
  await authenticateUser(user.value); // Wait for authentication
  if (authenticated.value) {
    // Use `.value` because it's a reactive reference
    router.push("/"); // Redirect if authenticated
  } else {
    console.error("Authentication failed");
  }
};
</script>
