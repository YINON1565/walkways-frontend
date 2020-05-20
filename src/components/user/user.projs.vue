<template>
<router-link :to="'/proj/' + proj._id"  class="proj-container">
  <img class="proj-minimal-img" :src="proj.imgUrls[0]" alt="">
  <img class="proj-flag" :src="`https://www.countryflags.io/${proj.position.short_country}/shiny/64.png`" alt="">
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
      projs:null
    };
  },
  async created() {}
    
    
};
</script>