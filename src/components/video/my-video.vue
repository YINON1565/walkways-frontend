<template>
  <section class="my-video">
    <header class="flex a-center bet">
      <img
        src="../../assets/svg/close.svg"
        @click="$emit('stopVideo')"
        title="Stop taking pictures"
      />
      <img
        src="../../assets/svg/arrows.svg"
        v-if="profile"
        @click="play"
        title="Take a picture again"
      />
    </header>
    <div class="container-canvas-video">
      <img class="profile-img" v-if="profile" :src="profile" alt />
      <video
        @loadstart="loading = true"
        @loadeddata="loading = false"
        :class="{'stop-video': profile, loading}"
        ref="video"
        autoplay
        preload="none"
        muted="muted"
      >
        <source src="../../assets/svg/loading.svg" />
      </video>
    </div>
    <canvas class="my-canvas" ref="canvas" width="400" height="300"></canvas>
    <div class="confirm-img-contianer" v-if="profile">
      <img v-if="profile" src="../../assets/svg/ok.svg" title="Confirm" @click="uploadImg" />
    </div>
    <div class="capture-img-contianer" v-else>
      <img src="../../assets/svg/image.svg" title="Take my photo" @click="capture" />
    </div>
    <footer></footer>
  </section>
</template>

<script>
import { eventBus } from "../../services/eventbus-service";
export default {
  name: "my-video",
  data() {
    return {
      video: {},
      canvas: {},
      context: {},
      profile: null,
      loading: false,
      screenWidth: null,
      vgaConstraints: {}
    };
  },
  mounted() {
    this.setVidoeCanvasWidth();
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    async setVidoeCanvasWidth() {
      if (this.video === this.$refs.video) {
        await this.stop();
      } else {
        this.video = this.$refs.video;
        this.canvas = this.$refs.canvas;
      }
      this.screenWidth = window.innerWidth;
      // this.vgaConstraints =
      //   this.screenWidth < 440
      //     ? {
      //         video: {
      //           width: { exact: this.screenWidth },
      //           height: { exact: window.innerHeight -180 }
      //         }
      //       }
      //     : { video: { width: { exact: 400 }, height: { exact: 300 } } };
      this.vgaConstraints = {
        video: { width: { exact: 400 }, height: { exact: 300 } }
      };
      this.canvas.width = this.vgaConstraints.video.width.exact;
      this.canvas.height = this.vgaConstraints.video.height.exact;
      this.context = this.canvas.getContext("2d");
      this.context.translate(this.canvas.width, 0);
      this.context.scale(-1, 1);
      this.play();
    },
    stop() {
      this.video.srcObject.getTracks().forEach(track => track.stop());
    },
    play() {
      this.profile = null;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(this.vgaConstraints)
          .then(stream => {
            this.video.srcObject = stream;
            this.video.play();
          });
      }
    },
    capture() {
      this.context.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.profile = this.canvas.toDataURL("image/png");
      this.stop();
    },
    async uploadImg() {
      eventBus.$emit("uploadImg", this.profile);
      this.$emit("stopVideo");
    }
  }
};
</script>
