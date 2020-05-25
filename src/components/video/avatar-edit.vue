<template>
  <section class="avatar-edit">
    <transition name="fade">
      <myVideo v-if="playVideo" @stopVideo="toggleVideo"></myVideo>
    </transition>
    <!-- Todo hendle container-img -->
    <section
      @click.stop="onClickUserProfile"
      :class="{'open-select':openSelect}"
      class="container-img-profile pointer flex j-center"
    >
      <!-- <pre>{{url}}</pre> -->
      <img
        v-if="url"
        :src="url"
        @error="OnError"
        @load="isLoad = true"
        :class="{isLoad}"
        class="avatar"
        title="Replace profile picture"
      />
      <img
        v-else-if="isLoading"
        class="avatar isLoad"
        src="../../assets/svg/rolling.svg"
        title="Replace profile picture"
      />
      <img
        v-else
        @load="isLoad = true"
        :class="{isLoad}"
        class="avatar"
        src="../../assets/svg/user-profile.svg"
        title="Set profile picture"
      />
      <img v-if="!isLoad" src="../../assets/svg/ripple.svg" class="avatar ripple-img" />
      <input ref="uploadImg" @change="uploadImg" type="file" hidden />
      <transition name="fade">
        <section class="select" @click="openSelect = !openSelect" v-if="openSelect">
          <li @click="$refs.uploadImg.click()" class="upload">Upload a photo</li>
          <li @click="toggleVideo">Turn on camera</li>
        </section>
      </transition>
    </section>
  </section>
</template>

<script>
import myVideo from "./my-video.vue";
import { eventBus } from "../../services/eventbus-service";

export default {
  props: {
    url: String,
    isLoading: Boolean
  },
  data() {
    return {
      playVideo: false,
      openSelect: false,
      isLoad: false
    };
  },
  created() {},
  mounted() {
    document
      // .querySelector(".screen")
      .addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handlePress);
  },
  beforeDestroy() {
    document
      // .querySelector(".screen")
      .removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handlePress);
  },
  methods: {
    onClickUserProfile() {
      if (window.innerHeight > window.innerWidth) {
        this.$refs.uploadImg.click();
      } else {
        this.openSelect = !this.openSelect;
      }
    },
    handleClick(event) {
      if (this.openSelect) this.openSelect = false;
    },
    handlePress(event) {
      if (event.keyCode === 27) {
        this.handleClick();
      }
    },
    uploadImg(ev) {
      eventBus.$emit("uploadImg", ev);
    },
    toggleVideo() {
      this.playVideo = !this.playVideo;
      document.body.classList.toggle("vidoe-open");
    },
    OnError(ev) {
      ev.target.src = require("../../assets/svg/user-profile.svg");
    }
  },
  components: {
    myVideo
  }
};
</script>