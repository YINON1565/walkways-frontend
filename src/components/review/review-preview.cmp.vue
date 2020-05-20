<template>
  <div class="review-preview flex col">
    <form @submit.prevent="updateReview">
      <div class="flex col bet">
        <h3 class="review-by flex a-center">
          <img v-if="review.by.fullName === 'Anonymous'" class="avatar not-allowed" src="../../assets/svg/user-profile.svg" alt title=""/>
          <img v-else @click="$router.push(`/user/${review.by._id}`)" class="avatar pointer" :src="review.by.imgUrl" alt />
          {{reviewForUpdate.by.fullName}}
        </h3>
        <div class="flex a-center bet">
          <div v-if="isEdit" class="add-rate-container flex a-center j-center">
            <el-rate
              v-model="reviewForUpdate.rate"
              show-score
              text-color="#0b757d"
              :colors="colors"
            ></el-rate>
          </div>
          <el-rate
            v-else
            v-model="reviewForUpdate.rate"
            disabled
            show-score
            text-color="rgb(85, 136, 139)"
            :colors="colors"
          ></el-rate>

          <div v-if="loggedinUser && (review.by._id === loggedinUser._id || loggedinUser.isAdmin)">
            <img
              class="btn-img"
              title="Delete"
              @click.stop="removeReview"
              src="../../assets/svg/bin2.svg"
              alt
            />

            <img
              v-if="isEdit"
              class="btn-img"
              title="Stop update"
              @click="isEdit = !isEdit"
              src="../../assets/svg/read-mode2.svg"
              alt
            />
            <img
              v-else
              class="btn-img"
              title="Update"
              @click="isEdit = !isEdit"
              src="../../assets/svg/pen2.svg"
              alt
            />
          </div>
        </div>
      </div>
      <div v-if="isEdit" class="container-add-review-txt-btn flex col">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3}"
          placeholder="Write a few words of review"
          v-model="reviewForUpdate.txt"
        ></el-input>
        <button>
          Update
          <!-- <img class="btn-img" src="../../assets/png/edit.png" alt /> -->
        </button>
      </div>
      <p v-else>{{reviewForUpdate.txt}}</p>
    </form>
  </div>
</template>

<script>
import { eventBus } from "../../services/eventbus-service.js";

export default {
  props: ["review"],
  data() {
    return {
      reviewForUpdate: null,
      isEdit: false,
      colors: this.$store.getters.colors
    };
  },
  created() {
    this.reviewForUpdate = JSON.parse(JSON.stringify(this.review));
  },
  methods: {
    removeReview() {
      eventBus.$emit("removeReview", this.review._id);
    },
    updateReview() {
      eventBus.$emit("updateReview", this.reviewForUpdate);
    }
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  }
};
</script>