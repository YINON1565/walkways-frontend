<template>
  <transition name="fade">
    <div class="login-page height-container">
      <form v-if="credentials && !isSignup" class="flex col" @submit.prevent="login">
        <h1>Log-in</h1>
        <input ref="username" class="my-form" type="text" v-model="credentials.username" placeholder="User Name" required  />
        <input type="password" v-model="credentials.password" placeholder="Password" required />
        <button class="login-btn" type="submit">Login</button>
        <h3>
          Don't have an account?
          <span class="login-link" @click.stop="isSignup = true">Signup</span>
        </h3>
      </form>
      <form v-if="newUserCred && isSignup" class="flex col" @submit.prevent="signup">
        <h1>Sign-UP</h1>
        <section class="signup-form flex col">
          <avatar-edit :url="newUserCred.imgUrl" :isLoading="isLoading" />
          <section class="flex col">
            <input
              ref="fullName"
              type="text"
              v-model="newUserCred.fullName"
              placeholder="Full Name"
              required
            />
            <input
              ref="username"
              type="text"
              v-model="newUserCred.username"
              placeholder="User Name"
              required
            />
            <input
              ref="password"
              type="password"
              v-model="newUserCred.password"
              placeholder="Password"
              required
            />

            <button>Sign-Up</button>
            <h3 style="display:block; height:5px;" class="flex a-center j-center">
              Go back to
              <span class="login-link" @click.stop="isSignup = false">Login</span>
            </h3>
          </section>
        </section>
      </form>
    </div>
  </transition>
</template>

<script>
import avatarEdit from "../components/video/avatar-edit.vue";
import { eventBus } from "../services/eventbus-service.js";

export default {
  name: "Login",
  data() {
    return {
      credentials: null,
      isSignup: false,
      isLoading: false
    };
  },
  async created() {
    (this.credentials = { username: "", password: "" })
  },
  mounted() {
    this.$refs.username.focus();
    eventBus.$on("uploadImg", this.uploadImg);
  },
  destroyed() {
    eventBus.$off("uploadImg", this.uploadImg);
  },

  methods: {
    async login() {
      var user = await this.$store.dispatch({
        type: "login",
        credentials: this.credentials
      });
      if (user !== "err") {
        this.$notify({
          title: "Success",
          message: `${user.fullName} login successfully!`,
          type: "success",
          duration: 2500
        });
        this.goBack();
        eventBus.$emit("connectSockets");
      } else {
        this.$notify({
          title: "Warning",
          message: "The username or password is incorrect",
          type: "warning",
          duration: 2500
        });
        this.reset();
        this.$refs.username.focus();
      }
    },
    async signup() {
      
      if (this.newUserCred.fullName.length < 3) {
        this.$notify({
          title: "Warning",
          message: "Full-Name is too short",
          type: "warning",
          duration: 2500
        });
        this.$refs.fullName.focus();
        return;
      }
      if (this.newUserCred.username.length < 3) {
        this.$notify({
          title: "Warning",
          message: "Username is too short",
          type: "warning",
          duration: 2500
        });
        this.$refs.username.focus();
        return;
      }
      if (this.newUserCred.password.length < 3) {
        this.$notify({
          title: "Warning",
          message: "Password is too short",
          type: "warning",
          duration: 2500
        });
        this.$refs.password.focus();
        return;
      }
      var user = await this.$store.dispatch({
        type: "signup",
        newUserCred: this.newUserCred
      });
      this.goBack();
      eventBus.$emit("connectSockets");
    },
    reset() {
      this.credentials.username = "";
      this.credentials.password = "";
    },
    goBack() {
      this.$router.go(-1);
    },
    async uploadImg(ev) {
      var newUserCred = JSON.parse(JSON.stringify(this.newUserCred))
      this.isLoading = true
      newUserCred.imgUrl = null 
      this.$store.dispatch({type:'setNewUserCred', newUserCred})
        var imgUrl = await this.$store.dispatch({
          type: "addImg",
          imgEv: ev
        });
      this.isLoading = false
      newUserCred.imgUrl = imgUrl
      this.$store.dispatch({type:'setNewUserCred', newUserCred})
    },
    async removeUser(userId) {
      var msg = await this.$store.dispatch({ type: "removeUser", userId });
    }
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    newUserCred(){      
      return JSON.parse(JSON.stringify(this.$store.getters.newUserCred));
    }
  },
  components: {
    avatarEdit
  }
};
</script>
