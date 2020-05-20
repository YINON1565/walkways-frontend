<template>
  <transition name="fade">
    <div v-if="proj">
      <el-carousel class="ratio-16-9">
        <el-carousel-item v-for="url in proj.imgUrls" :key="url">
          <img :src="url" class="proj-img" />
        </el-carousel-item>
      </el-carousel>
      <div class="proj-content">
        <section>
          <h4>{{proj.organization}}</h4>
          <h5>{{proj.title}}</h5>
          <div class="world-details">
            <img
              :src="`https://www.countryflags.io/${proj.position.short_country}/shiny/64.png`"
              v-if="proj.position.short_country"
            />
            <h5 v-if="proj.position.city">{{proj.position.city}},</h5>
            <h5 v-else>{{proj.position.region}},</h5>
            <h5>{{proj.position.country}}</h5>
          </div>
        </section>
        <review-avarage-by-id class="review-avarage" :id="proj._id" />
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
  }
};
</script>