<template>
  <div class="review-avarage-by-id">
    <review-avarage v-if="reviews" :reviews="reviews" />
  </div>
</template>

<script>
import reviewAvarage from "./review-avarage.cmp.vue";

export default {
  props: {
    id: String
  },
  data() {
    return {
      reviews: [],
      colors: this.$store.getters.colors
    };
  },
  async created() {
    this.reviews = await this.$store.dispatch({
      type: "loadReviews",
      id: this.id
    });
  },
  components: {
    reviewAvarage
  }
};
</script>