<template>
  <div id="app">
    <div class="screen"></div>
    <nav-bar />
    <router-view />
    <main-footer />
  </div>
</template>

<script>
import navBar from "./components/nav-bar.vue";
import mainFooter from "./components/footer/main-footer.vue";
import { eventBus } from "./services/eventbus-service.js";
import { utilService } from "./services/util.service.js";
import socketService from "./services/socket.service.js";
import { projService } from "./services/proj.service.js";

export default {
  name: "App",
  data() {
    return {
      audioNotification: null,
      user: null
    };
  },
  async created() {
    console.log("app created!");
    socketService.setup();
    this.connectSockets();
    this.audioNotification = new Audio(
      require("./assets/audio/notification.mp3")
    );
    // TODO: TRANSFER TO HOME
    await this.$store.dispatch({ type: "loadReviewsCount" });
  },
  mounted() {
    eventBus.$on("connectSockets", () => this.connectSockets());
    eventBus.$on("disconnectSockets", () => this.disconnectSockets());
    eventBus.$on("removeReview", (reviewId)=> this.removeReview(reviewId));
    document.title = this.loggedinUser
      ? `(${this.loggedinUser.notifications.length}) Walkways`
      : "Walkways";
  },
  destroyed() {
    eventBus.$off("connectSockets", () => this.connectSockets());
    eventBus.$off("disconnectSockets", () => this.disconnectSockets());
    eventBus.$off("removeReview", (reviewId)=> this.removeReview(reviewId));
    if (this.loggedinUser) this.disconnectSockets();
    socketService.terminate();
  },
  methods: {
    connectSockets() {
      this.user = JSON.parse(JSON.stringify(this.$store.getters.loggedinUser));
      if (!this.user) return;
      console.log("conect socket!");
      socketService.on(`updatedUser ${this.user._id}`, this.updateUser);
    },
    disconnectSockets() {
      this.user = JSON.parse(JSON.stringify(this.$store.getters.loggedinUser));
      if (!this.user) return;
      console.log("disconect socket!");
      socketService.off(`updatedUser ${this.user._id}`, this.updateUser);
    },
    async removeReview(reviewId){
        await this.$store.dispatch({
        type: "removeReview",
        reviewId
      });
    },
    updateUser(updatedUser) {
      if (updatedUser) {
        this.$store.commit({type:'setUser', user: updatedUser})
        this.audioNotification.play();
      } else {
        console.log("ERROR IN UPDATE USER");
      }
    }
  },
  computed: {
    msg() {
      return this.$store.getters.msg;
    }
  },
  components: {
    navBar,
    mainFooter
  }
};
</script>

<style>
</style>

