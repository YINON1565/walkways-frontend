<template>
  <form class="login-form flex col" @submit.prevent="$emit('login', credentials)">
    <h1>Log-in</h1>
    <input ref="username" type="text" v-model="credentials.username" required />
    <input type="password" v-model="credentials.password" required />
    <button type="submit">Login</button>
    <h3>
      Don't have an account?
      <span class="login-link" @click.stop="$emit('goToSignup')">Signup</span>
    </h3>
  </form>
</template>

<script>
export default {
    props: {
        credentials: Object
    }
}
</script>