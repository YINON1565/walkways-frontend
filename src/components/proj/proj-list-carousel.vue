<template>
  <section class="carousel-proj-container">
    <section
      v-for="proj in projs"
      :key="proj._id"
      @click="openDetails(proj._id)"
      :title="proj.description.substring(0,80) +'... Click to read more!!'"
      class="carousel-proj-preview"
    >
      <img :src="proj.imgUrls[0]" />
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
            <span v-else>{{proj.position.region}},</span>
            <span>{{proj.position.country}}</span>
          </h5>
          <review-avarage-by-id class="review-avarage" :id="proj._id" />
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