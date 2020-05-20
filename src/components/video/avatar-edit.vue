<template>
  <section class="avatar-edit">
    <transition name="fade">
      <myVideo v-if="playVideo" @stopVideo="toggleVideo"></myVideo>
    </transition>
    <section
      @click.stop="openSelect = !openSelect"
      :class="{'open-select':openSelect}"
      class="container-img container-img-profile pointer flex j-center"
    >
      <!-- <pre>{{url}}</pre> -->
      <img v-if="url" class="avatar avatar-m" :src="url" title="Replace profile picture" />
      <img
        v-else-if="isLoading"
        class="avatar avatar-m"
        src="../../assets/svg/rolling.svg"
        title="Replace profile picture"
      />
      <img
        v-else
        class="avatar avatar-m"
        src="../../assets/svg/user-profile.svg"
        title="Set profile picture"
      />
      <transition name="fade">
        <section class="select" @click="openSelect = !openSelect" v-if="openSelect">
          <label>
            <input @change="uploadImg" type="file" hidden />
            <li class="upload">Upload a photo</li>
          </label>
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
      openSelect: false
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
    }
  },
  components: {
    myVideo
  }
};
</script>