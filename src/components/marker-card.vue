<template>
  <transition name="fade">
    <div v-if="proj">
      <el-carousel class="ratio-16-9">
        <el-carousel-item v-for="url in proj.imgUrls" :key="url">
         <img src="../assets/png/fully-booked.png" v-if="proj.membersApplyed.length === proj.membersNeeded" class = "fully-booked"/>

          <img
            v-if="!isError"
            :src="url"
            class="proj-img"
            :class="{isLoad}"
            @load="isLoad = true"
            @error="isError = true"
          />
          <div class="proj-img flex a-center j-center">
            <img v-if="isError" src="../assets/svg/broken.svg" alt :class="{isError}" />
            <img v-if="!isLoad && !isError" src="../assets/svg/ripple.svg" class="ripple-img" :class="{isLoad}" />
          </div>
      
        </el-carousel-item>
      </el-carousel>
      <div class="proj-content">
        <section>
          <h4>{{proj.organization}}</h4>
          <h5>{{proj.title}}</h5>
          <div v-if="proj.position" class="world-details">
            <img
              v-if="proj.position.short_country"
              :src="`https://www.countryflags.io/${proj.position.short_country}/shiny/64.png`"
            />
            <h5 v-if="proj.position.city">{{proj.position.city}},</h5>
            <h5 v-else>{{proj.position.region}},</h5>
            <h5>{{proj.position.country}}</h5>
          </div>
        </section>
        <section class="review-avarage">
          <el-rate
            class="el-rate-avarage"
            v-if="proj.rate.average"
            v-model="proj.rate.average"
            disabled
            show-score
            text-color="#0b757d"
            :score-template="`${proj.rate.average.toFixed(1)} (${proj.rate.length})`"
            :colors="colors"
          ></el-rate>
          <el-rate
            class="el-rate-avarage"
            v-else
            disabled
            show-score
            text-color="#0b757d"
            score-template="0 (0)"
            :colors="colors"
          ></el-rate>
        </section>
        <!-- <review-avarage-by-id class="review-avarage" :id="proj._id" /> -->
      </div>
    </div>
  </transition>
</template>

<script>
import reviewAvarageById from "./review/review-avarage-by-id.vue";

export default {
  props: ["proj"],
  components: {
    reviewAvarageById
  },
  data() {
    return {
      colors: this.$store.getters.colors,
      isLoad: false,
      isError: false
    };
  }
};
</script>