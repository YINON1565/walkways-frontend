<template>
  <transition name="fade">
    <div class="home">
      <div class="video-bcg">
        <video autoplay muted loop id="myVideo">
          <source src="../assets/video/heroHeader.mp4" type="video/mp4" />
        </video>
      </div>
      <div class="overlayText">
        <h3 id="welcom-txt">WalkWays</h3>
        <p>
          “The best way to find yourself is to lose yourself in the service of others.”
          <br />
          <span class="gandy">Mahatma Gandhi</span>
        </p>
      </div>
      <div class="category-container width-container">
        <router-link
          :to="'/projs/' + category.category"
          v-for="category in categories"
          :key="category.category"
          :class="category.category"
          class="category"
        >
          <img :src="category.imgUrl" />
          <div class="img-tag" :class="category.category">{{category.title}}</div>
        </router-link>
      </div>
      <section class="divider-container width-container">
        <h1 class="details-header">Our community Activity</h1>
        <div class="walk-ways-details" v-if="projs">
          <h1 class="divider">
            <img src="../assets/svg/technology.svg" />Projects
            <!-- <span class="space">{{count}}</span> -->
            <span class="space">{{allProjsLength}}</span>
          </h1>
          <h1 class="divider">
            <img src="../assets/svg/communications.svg" />Feedbacks
            <!-- <span class="space">{{count}}</span> -->
            <span class="space">{{allFeedbackLength || 0}}</span>
          </h1>
          <h1 v-if="users" class="divider">
            <img src="../assets/svg/business.svg" />Voulnteers
            <span class="space" v-if="users">{{users.length}}</span>
          </h1>
          <h1 class="divider">
            <img src="../assets/svg/maps-and-flags.svg" />Countries
            <span class="space">{{countriesCount}}</span>
          </h1>
        </div>
      </section>

      <section class="carousel-for-desctop width-container">
        <ul v-if="projs.length" class="around-the-world-preview">
          <!-- <li v-for="proj in projs" :key="proj._id" class="around-the-world-card"> -->
          <li v-for="proj in projsForDisplay" :key="proj._id" class="around-the-world-card">
            <marker-card
              :proj="proj"
              :title="proj.description.substring(0,80) +'... Click to read more!!'"
              class="proj-preview-card"
              @click.native="openDetails(proj._id)"
            />
          </li>
        </ul>
        <section v-else class="loading-container">
          <img v-for="i in 6" :key="i" src="../assets/svg/loading.svg" alt />
        </section>
      </section>

      <section class="carousel-for-mobile width-container">
        <proj-list-carousel v-if="projs.length" :projs="projsForDisplay" />
        <img v-else src="../assets/svg/loading.svg" alt />
      </section>
      <section class="width-container see-all flex">
        <router-link
          class="flex"
          title="Show more about 'around the world'"
          to="/projs/aroundTheWorld"
        >
          <p>All Projects </p>
          <img src="../assets/svg/technology.svg" alt="">
        </router-link>
      </section>
    </div>
  </transition>
</template>

<script>
import { utilService } from "../services/util.service.js";
import { projService } from "../services/proj.service.js";
import socketService from "../services/socket.service.js";
import markerCard from "../components/marker-card.vue";
import projListCarousel from "../components/proj/proj-list-carousel.vue";

// @ is an alias to /src
export default {
  name: "home",
  // props: {
  //   projs: Array,
  //   users: Array
  // },
  data() {
    return {
      reviews: null,
      categories: null,
      projs: [],
      users: []
    };
  },
  async created() {
    window.scrollTo(0, 0);
    console.log("Home");
    this.categories = projService.loadCategoties();
    this.projs = this.$store.getters.projs;
    this.users = this.$store.getters.users;
    if (!this.projs.length) {
      await this.$store.dispatch({ type: "loadProjs" });
      this.projs = this.$store.getters.projs;
    }
    if (!this.users.length) {
      await this.$store.dispatch({ type: "loadUsers" });
      this.users = this.$store.getters.users;
    }
        console.log('imgUrl createdBy');

    // var projsForChangeHtpToHttps = JSON.parse(JSON.stringify(this.projs))
    // projsForChangeHtpToHttps.forEach(async proj=> {
    //   // console.log(proj.createdBy.imgUrl)
    //   // proj.imgUrls = await proj.imgUrls.map(imgUrl=> {
    //     //  return imgUrl.replace('http://', 'https://');
    //   // })
    //   // proj.createdBy.imgUrl = await  proj.createdBy.imgUrl.replace('http://', 'https://');
    //   console.log(proj.createdBy.imgUrl)
    //   // console.log(proj.imgUrls);
    // //  await  this.$store.dispatch({type:'saveProj', proj})
      
    // })
   
  },
  methods: {
    openDetails(id) {
      this.$router.push("/proj/" + id);
    }
  },
  computed: {
    countriesCount() {
      return this.$store.getters.countries;
    },
    allProjsLength() {
      return this.$store.getters.projs.length;
    },
    allFeedbackLength() {
      return this.$store.getters.reviewsCount;
    },
    projsForDisplay() {
      // return JSON.parse(JSON.stringify(this.projs)).splice(0, 6);
      var projToDisplay = [];
      let projsCopy = JSON.parse(JSON.stringify(this.projs));

      if (projsCopy.length) {
        for (let i = 0; i < 6; i++) {
          let ranNum = utilService.getRandomInt(1, projsCopy.length);
          let proj = projsCopy[ranNum];
          let idx = projsCopy.findIndex(currProj => {
            return currProj._id === proj._id;
          });
          projToDisplay.push(proj);
          projsCopy.splice(idx, 1);
        }
      }
      return projToDisplay;
    }
  },
  watch: {
    projsForDisplay() {}
  },
  components: {
    markerCard,
    projListCarousel
  }
};
</script>
