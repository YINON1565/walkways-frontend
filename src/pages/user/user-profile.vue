<template>
  <transition name="fade">
    <!-- <div class="user-profile width-container height-container"> -->
    <div class="user-profile width-container height-container" v-if="user">
      <div v-if="isSaveLoading" class="save-loading">
        <img src="../../assets/svg/rolling2.svg" alt />
      </div>
      <div class="main-content">
        <div>
          <div class="user-profile-inside-container flex col a-center">
            <!-- CMP AVATAR OF USER ---- EDIT-MODE-->
            <avatar-edit
              v-if="loggedinUser && (loggedinUser._id === user._id)"
              :url="loggedinUser.imgUrl"
              :isLoading="isLoading"
            />
            <!-- V-ELSE: IMG AVATAR OF USER --- SHOW-MODE-->
            <div v-else class="container-img" >
              <img class="avatar" :class="{isLoad}" :src="user.imgUrl" @load="isLoad = true" @error="onErrorImgProfile"/>
              <img class="avatar ripple-img" v-if="!isLoad" src="../../assets/svg/ripple.svg"  />
            </div>

            <div class="container-details-user flex col">
              <!-- FULLNAME  -->
              <!-- EDIT-MODE -->
              <input
                class="input-fullname"
                type="text"
                v-if="loggedinUser && (loggedinUser._id === user._id)"
                v-model="fullName"
                @input="onInputName"
              />
              <!--  SHOW-MODE -->
              <p v-else>{{user.fullName}}</p>

              <!-- JOIN-AT -->
              <p >Join At: {{user.joinAt.date}}, {{user.joinAt.time}}</p>

              <!--CMP AVARAGE REVIEW OF USER-->
              <review-avarage v-if="reviews" :reviews="reviews" />
            </div>
          </div>
          <transition name="fade">
            <section v-if="projs && projs.length">
              <div @click="scrollTo" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Projects By {{user.fullName}} Worldwide</span>
                  </section>
                  <!-- <img class="edit-mode" v-if="editMode" src="../../assets/svg/pen2.svg" alt="Edit" /> -->
                </h3>
              </div>
              <div class="user-projs-container">
                <user-projs v-for="proj in projs" :key="proj._id" :proj="proj" />
              </div>
            </section>
          </transition>

          <!--CMP NOTIFICATIONS OF USER-->
          <section
            v-if="loggedinUser && loggedinUser._id === user._id"
            class="container-notification-icon width-container"
          >
            <div
              @click="toggleNotifications"
              v-if="!isNotificationsOpen && loggedinUser"
              class="pointer"
              :class="{'not-allowed':!loggedinUser.notifications.length}"
            >
              <img src="../../assets/svg/notification.svg" alt />
              <span>{{loggedinUser.notifications.length}}</span>
            </div>
          </section>
          <transition name="fade">
            <notification-list
              :class="{'notifications-open':isNotificationsOpen}"
              v-if="loggedinUser && loggedinUser.notifications"
              :notifications="loggedinUser.notifications"
              :userId="loggedinUser._id"
              @toggleNotifications="toggleNotifications"
            />
          </transition>
        </div>
      </div>

      <!--CMP ADD REVIEW-->
      <review-add
        v-if="!loggedinUser || (loggedinUser && loggedinUser._id !== user._id)"
        :review="review"
        @saveReview="saveReview"
      />

      <!--CMP LIST REVIEWS-->
      <review-list v-if="reviews && reviews.length" :reviews="reviews" />

      <!--CMP LOCATION OF USER-->

      <div @click="scrollTo" class="flex a-center bet">
        <h3 class="container-link-img flex bet">
          <section>
            <img class="link-img" src="../../assets/svg/link.svg" alt />
            <span>Location</span>
          </section>
          <!-- <img class="edit-mode" v-if="editMode" src="../../assets/svg/pen2.svg" alt="Edit" /> -->
        </h3>
      </div>
      <map-preview class="map" v-if="user" :array="[user]"></map-preview>
    </div>

    <!--PAGE LOADING-->
    <div class="height-container" v-else>
      <!-- <img class="loading-page" src="../../assets/svg/loading.svg" alt /> -->
    </div>
  </transition>
</template>
<script>
import { eventBus } from "../../services/eventbus-service.js";
import { userService } from "../../services/user.service.js";
import socketService from "../../services/socket.service.js";
import mapPreview from "../../components/map-preview.vue";
import reviewList from "../../components/review/review-list.cmp.vue";
import reviewAdd from "../../components/review/review-add.cmp.vue";
import reviewAvarage from "../../components/review/review-avarage.cmp.vue";
import notificationList from "../../components/notification/notification-list.vue";
import avatarEdit from "../../components/video/avatar-edit.vue";
import userProjs from "../../components/user/user.projs.vue";

export default {
  name: "UserProfile",
  data() {
    return {
      timeOut: null,
      fullName: null,
      user: null,
      review: null,
      projApplied: null,
      projs: null,
      isLoading: false,
      isNotificationsOpen: false,
      isSaveLoading: false,
      isLoad: false
    };
  },
  async created() {
    await this.setCurrUser()
    this.review = this.getEmptyReview();
  },
  mounted() {
    eventBus.$on("deleteNotification", this.deleteNotification);
    eventBus.$on("onApprove", this.onApprove);
    eventBus.$on("onDecline", this.onDecline);
    eventBus.$on("uploadImg", this.uploadImg);
    document
      .querySelector(".screen")
      .addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handlePress);
  },
  beforeDestroy() {
    eventBus.$off("deleteNotification", this.deleteNotification);
    eventBus.$off("onApprove", this.onApprove);
    eventBus.$off("onDecline", this.onDecline);
    eventBus.$off("uploadImg", this.uploadImg);
    document
      .querySelector(".screen")
      .removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handlePress);
  },
  methods: {
    async setCurrUser(){
    window.scrollTo(0, 0);
        this.toggleLoading()
    const userId = this.$route.params.id;
    const user = await userService.getById(userId);
    this.user = JSON.parse(JSON.stringify(user));
    this.imgUrl = this.user.imgUrl;
    await this.$store.dispatch({
      type: "loadReviews",
      id: userId,
      isSetReviews: true
    });
      this.toggleLoading()
    this.fullName = this.user.fullName;
    this.projs = await this.$store.dispatch({
      type: "loadProjs",
      filterBy: { id: userId }
    });

    },
    async saveReview(review) {
      await this.$store.dispatch({
        type: "saveReview",
        review
      });
      this.review = this.getEmptyReview();
    },
    getEmptyReview() {
      return {
        txt: "",
        rate: null,
        by: this.$store.getters.by,
        about: {
          _id: this.user._id,
          fullName: this.user.fullName,
          imgUrl: this.user.imgUrl
        }
      };
    },
    onApprove(notification) {
      socketService.emit("approve", notification);
      this.spliceNotification(notification);
    },
    onDecline(notification) {
      socketService.emit("decline", notification);
      this.spliceNotification(notification);
    },
    async deleteNotification(notification) {
      await this.spliceNotification(notification);
      this.updateUser();
    },
    spliceNotification(notification) {
      const idx = this.user.notifications.findIndex(
        currProj => currProj._id === notification._id
      );
      this.user.notifications.splice(idx, 1);
      this.$store.commit({ type: "setUser", user: this.user });
    },
    async updateUser() {
      var updatedUser = await this.$store.dispatch({
        type: "updateUser",
        user: this.user
      });
    },
    toggleNotifications() {
      if (!this.loggedinUser && !this.loggedinUser.notifications.length && !this.isNotificationsOpen)
        return;
      this.isNotificationsOpen = !this.isNotificationsOpen;
      document.body.classList.toggle("notifications-open");
    },
    async uploadImg(ev) {
      this.user.imgUrl = null;
      this.isLoading = true;
      var imgUrl = await this.$store.dispatch({
        type: "addImg",
        imgEv: ev
      });
      this.isLoading = false;
      this.user.imgUrl = imgUrl;
      await this.updateUser();
    },
    onErrorImgProfile(ev){
      this.isLoad = true
      ev.target.src = require("../../assets/svg/user-profile.svg")
    },
    handleClick(event) {
      if (!this.isNotificationsOpen) return;
      this.toggleNotifications();
    },
    handlePress(event) {
      if (event.keyCode === 27) {
        this.handleClick();
      }
    },
    scrollTo(ev) {
      window.scrollTo(0, ev.target.offsetTop - 200);
    },
    toggleLoading() {
      this.isSaveLoading = !this.isSaveLoading;
      document.body.classList.toggle("loading-active");
    },
    onInputName(){
        if (this.timeOut) {
          clearTimeout(this.timeOut);
          this.timeOut = null;
        }
        this.timeOut = setTimeout(() => {
          this.user.fullName = this.fullName;
          this.updateUser();
        }, 1000);
    },
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    reviews() {
      return this.$store.getters.reviews;
    }
  },
  components: {
    mapPreview,
    reviewList,
    reviewAdd,
    reviewAvarage,
    notificationList,
    avatarEdit,
    userProjs
  },
  watch: {
    loggedinUser() {
      if (!this.loggedinUser) {
        this.$router.push("/");
      }
    },
    user() {},
    // fullName: {
    //   handler() {
    //     if (
    //       !this.loggedinUser ||
    //       (this.loggedinUser && this.loggedinUser._id !== this.user._id )
    //     ) {
    //       return;
    //     }
    //     if (this.timeOut) {
    //       clearTimeout(this.timeOut);
    //       this.timeOut = null;
    //     }
    //     this.timeOut = setTimeout(() => {
    //       this.user.fullName = this.fullName;
    //       this.updateUser();
    //     }, 3000);
    //   },
    //   deep: true
    // },
    "loggedinUser.notifications": {
      handler() {
        if (
          !this.loggedinUser.notifications.length &&
          this.isNotificationsOpen
        ) {
          this.toggleNotifications();
        }
      },
      deep: true
    },
    "$route.path": {
      handler() {
        this.setCurrUser();
      },
      deep: true
    }
  }
};
</script>