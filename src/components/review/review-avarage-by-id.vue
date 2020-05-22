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
    // const proj = await this.$store.dispatch({type: 'loadProj', projId: this.id})
    // // if (proj.rate) proj.rate = await {average:  this.reviews.reduce((a,b) => a + b.rate, 0) / (this.reviews.length), length: this.reviews.length}
    // console.log('rate:', proj.rate);
    // // await this.$store.dispatch({type:'saveProj', proj})
  },
  components: {
    reviewAvarage
  }
};
</script>