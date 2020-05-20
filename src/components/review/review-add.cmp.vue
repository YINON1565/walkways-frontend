<template>
  <form class="add-review review flex col" v-if="review" @submit.prevent="save">
    <div class="container-title flex col bet">
      <h3  @click="scrollTo" class="container-link-img">
        <img class="link-img" src="../../assets/svg/link.svg" alt />
        <span>Add Review</span>
      </h3>
      <div class="add-rate-container flex a-center">
        <el-rate v-model="review.rate" text-color="#0b757d" :colors="colors"></el-rate>
      </div>
    </div>
    <div class="container-add-review-txt-btn flex col">
      <el-input
        ref="my-ref"
        type="textarea"
        :autosize="{ minRows: 3}"
        placeholder="Write a few words of review"
        v-model="review.txt"
      ></el-input>
      <button class="flex a-center j-center pointer">
        Send
        <img src="../../assets/svg/send.svg" alt />
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {review: Object},
  data() {
    return {
      colors: this.$store.getters.colors
    };
  },
  methods: {
    save() {
      // if (!this.review.txt) {
      //   this.$notify({
      //     title: "Warning",
      //     message: "Don't want to add a few words?",
      //     type: "warning",
      //     duration: 2500
      //   });
      //   return;
      // }
      this.$emit("save", this.review);
    },
    scrollTo(ev) {
      window.scrollTo(0, ev.target.offsetTop - 200);
      this.$refs["my-ref"].focus();
    }
  }
};
</script>