<template>
  <section class="carousel-proj-container">
    <section
      v-for="(proj, i) in projs"
      :key="i"
      @click="openDetails(proj._id)"
      :title="proj.description.substring(0,80) +'... Click to read more!!'"
      class="carousel-proj-preview"
    >
      <div class="ratio-card">
        <img src="../../assets/svg/broken.svg" alt :class="{isError}" />
        <img src="../../assets/png/fully-booked.png" v-if="proj.membersApplyed.length === proj.membersNeeded && isLoad" class = "fully-booked flex a-center j-center"/>
        <img
          v-if="!isError"
          :src="proj.imgUrls[0]"
          :class="{isLoad}"
          @error="isError = true"
          @load="isLoad = true"
        />
        <img v-if="!isLoad && !isError" src="../../assets/svg/ripple.svg" class="ripple-img" :class="{isLoad}" />
      </div>
      <div class="proj-content flex col bet">
        <section>
          <h3>{{proj.title}}</h3>
          <h4>{{proj.organization}}</h4>
        </section>
        <section>
          <h5 class="flex a-center">
            <img
              :src="`https://www.countryflags.io/${proj.position.short_country}/shiny/64.png`"
              v-if="proj.position.short_country"
            />
            <span v-if="proj.position.city">{{proj.position.city}},</span>
            <span v-if="proj.position.region">{{proj.position.region}},</span>
            <span v-if="proj.position.country">{{proj.position.country}}</span>
          </h5>
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
              :score-template="`0 (0)`"
              :colors="colors"
            ></el-rate>
          </section>
          <!-- <review-avarage-by-id class="review-avarage" :id="proj._id" /> -->
        </section>
      </div>
    </section>
  </section>
</template>

<script>
import reviewAvarageById from "../review/review-avarage-by-id.vue";
export default {
  props: {
    projs: Array
  },
  data() {
    return {
      colors: this.$store.getters.colors,
      isLoad: false,
      isError: false
    };
  },
  methods: {
    openDetails(id) {
      this.$router.push("/proj/" + id);
    }
  },
  components: {
    reviewAvarageById
  }
};
</script>