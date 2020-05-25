<template>
  <div class="proj-preview">
    <router-link :to="'/proj/' + proj._id" class="proj-card flex col">
    <div class="details-img">
      <img src="../../assets/png/fully-booked.png" v-if="proj.membersApplyed.length === proj.membersNeeded && isLoad" class = "fully-booked" />
      <img
          :src="proj.imgUrls[0]"
          class="proj-img"
          :class="{isLoad}"
          @error="onErrorImg"
          @load="isLoad = true"
        />
        <img v-if="!isLoad" src="../../assets/svg/ripple.svg" class="ripple-img" :class="{isLoad}" />
    </div>
      <div class="proj-txt">
        <div class="proj-txt-header">
          <!-- <h5>{{projCategory}}</h5> -->
          <h2>{{proj.title}}</h2>
          <div class="organiztion-container">
            <h5>{{proj.organization}}</h5>
            <img src="../../assets/svg/icon.svg" />
          </div>
        </div>
        <review-avarage-by-id class="review-avarage-for-list" :id="proj._id" />
        <div class="members-needed">
          <h5>Members Applied:</h5>
          <h5>{{proj.membersApplyed.length}}/{{proj.membersNeeded}}</h5>
          <!-- <div class = "user-img" v-for="i in proj.membersNeeded">
       <img src="../../img/voulnteer.png"/>
          </div>-->
        </div>
      </div>
      <div class="footer"></div>
    </router-link>
  </div>
</template>


<script>
import reviewAvarageById from '../review/review-avarage-by-id.vue';

export default {
  name: "projPreview",
  props: {
    proj: Object
  },
  data() {
    return {
      isLoad: false
    }
  },
  methods: {
    onErrorImg(ev){
      ev.target.src = require('../../assets/svg/broken.svg')
    }
  },
  computed: {
    projCategory() {
      var category = this.proj.category;
      var categoryTxt = {
        animalsAndWildlife: "Animals & Wildlife",
        education: "Education",
        childcare: "Child Care",
        environmentalProtection: "Environmental Protection",
        farming: "Farming",
        scubaDiving: "Scuba Diving",
        humanitarian: "Humanitarian",
        healthcare: "Healthcare",
        sports: "Sports",
        art: "Art",
        humanRights: "Human Rights"
      };
      return categoryTxt[category];
    }
  },
  components: {
    reviewAvarageById
  }
};
</script>

<style scoped >
</style>
