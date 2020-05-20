<template>
  <div class="review-list review">
    <h3 @click="scrollTo" class="container-link-img">
      <img  class="link-img" src="../../assets/svg/link.svg" alt />
      <span>Reviews</span>
    </h3>
    <div v-for="(review, index) in reviews" :key="review._id">
      <review-preview v-if="index < limit" :review="review" />
      <h4 class="show-more" @click="limit = 100" v-if="index === limit">Show more</h4>
    </div>
    <h4 class="show-more" @click="limit = 4" v-if="limit !== 4">Show less</h4>
  </div>
</template>

<script>
import reviewPreview from "./review-preview.cmp.vue";

export default {
  name: "review-list",
  props: ["reviews"],
  components: {
    reviewPreview
  },
  data() {
    return {
      limit: 4
    };
  },
  methods: {
    scrollTo(ev) {
      window.scrollTo(0, ev.target.offsetTop - 200);
    }
  },
  created(){
    console.log(this.reviews);
    
  }
};
</script>

// @removeReview="$emit('removeReview', reviewId)"
//         @addReview="$emit('addReview', newReview)"