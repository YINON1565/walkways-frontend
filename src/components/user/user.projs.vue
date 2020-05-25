<template>
  <router-link :to="'/proj/' + proj._id" class="proj-container">
    <!-- <img class="proj-minimal-img" :class="{isLoad}" :src="proj.imgUrls[0]" alt @load="load" /> -->
    <img class="proj-minimal-img" :class="{isLoad}" :src="proj.imgUrls[0]" alt="" @load="isLoad = true">
    <img class="proj-minimal-img isLoad" v-if="!isLoad" src="../../assets/svg/ripple.svg"  />

    <img
      class="proj-flag"
      :src="`https://www.countryflags.io/${proj.position.short_country}/shiny/64.png`"
      alt
    />
  </router-link>
</template>
<script>
export default {
  props: ["proj"],

  data() {
    return {
      timeOut: null,
      fullName: null,
      user: null,
      review: null,
      projApplied: null,
      audioNotification: null,
      projs: null,
      isLoad: false
    };
  },
  methods: {
    load(){
      setTimeout(()=> {
        this.isLoad = true
      },1000)
    }
  }
};
</script>