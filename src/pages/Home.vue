<template>
  <transition name="fade">
    <div class="home">
       <div v-if="isLoading" class="save-loading">
        <img src="../assets/svg/rolling2.svg" alt />
      </div>
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
      <section class="about-container width-container">
        <!-- <h2>About the venture</h2> -->
        <title-link :title="'About the venture'"/>
        <h3>
          <span>{{about.substring(0, 100)}}</span>
          <span v-if="!isReadMore">... 
            <span class="read-more pointer" @click="isReadMore = !isReadMore">Read more</span>
          </span>
          <span class="more-txt" :class="{isReadMore}">
            {{about.substring(100)}}
            <span class="read-more pointer" @click="isReadMore = !isReadMore">Read less</span>
          </span>
        </h3>
      </section>

      <section>
        <title-link class="category-title width-container" :title="'Find by category'"/>
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
      </section>
      <!-- <section class="divider-container width-container">
        <h1 class="details-header">Our community Activity</h1>
        <div class="walk-ways-details">
          <h1 class="divider">
            <img src="../assets/svg/technology.svg" />Projects
            <span class="space">{{projsCount}}</span>
          </h1>
          <h1 class="divider">
            <img src="../assets/svg/communications.svg" />Feedbacks
            <span  class="space">{{reviewsCount}}</span>
          </h1>
          <h1 v-if="users" class="divider">
            <img src="../assets/svg/business.svg" />Voulnteers
            <span class="space" >{{usersCount}}</span>
          </h1>
          <h1 class="divider">
            <img  src="../assets/svg/maps-and-flags.svg" />Countries
            <span  class="space">{{countriesCount}}</span>
          </h1>
        </div>
      </section>-->
      <section class="divider-container width-container">
        <h1 class="details-header">Our community Activity</h1>
        <div class="walk-ways-details">
          <h1 class="divider">
            <img src="../assets/svg/technology.svg" />Projects
            <span v-if="projsCount" class="space">{{projsCount}}</span>
            <img v-else src="../assets/svg/rolling2.svg" alt="0" />
          </h1>
          <h1 class="divider">
            <img src="../assets/svg/communications.svg" />Feedbacks
            <span v-if="reviewsCount" class="space">{{reviewsCount}}</span>
            <img v-else src="../assets/svg/rolling2.svg" alt="0" />
          </h1>
          <h1 v-if="users" class="divider">
            <img src="../assets/svg/business.svg" />Voulnteers
            <span v-if="usersCount" class="space">{{usersCount}}</span>
            <img v-else src="../assets/svg/rolling2.svg" alt="0" />
          </h1>
          <h1 class="divider">
            <img src="../assets/svg/maps-and-flags.svg" />Countries
            <span v-if="countriesCount" class="space">{{countriesCount}}</span>
            <img v-else src="../assets/svg/rolling2.svg" alt="0" />
          </h1>
        </div>
      </section>


      <title-link class="width-container" :title="'Around-the-world'"/>

      <section class="carousel-for-desctop width-container">
        <ul v-if="currProjs.length" class="around-the-world-preview">
          <li v-for="(proj, i) in currProjs" :key="i" class="around-the-world-card">
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
        <proj-list-carousel v-if="currProjs.length" :projs="currProjs" />
        <!-- <proj-list-carousel v-if="projs.length" :projs="projsForDisplay" /> -->
        <img v-else src="../assets/svg/loading.svg" alt />
        <!-- <img src="../assets/svg/loading.svg" alt /> -->
      </section>

      <section class="width-container see-all flex">
        <router-link
          class="flex"
          title="Show more about 'around the world'"
          to="/projs/aroundTheWorld"
        >
          <p>All Projects</p>
          <img src="../assets/svg/technology.svg" alt />
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
import { gsap } from "gsap";
import titleLink from '../components/helpers/title-link.vue'

export default {
  name: "home",
  data() {
    return {
      reviews: null,
      categories: null,
      projs: [],
      users: [],
      limit: 6,
      reviewsCount: 0,
      projsCount: 0,
      usersCount: 0,
      about:
        "WalkWays is the world’s leading volunteering platform. We show you how to volunteer abroad! Search & compare the best international volunteer programs offered by volunteer organizations and local NGOs with just a few clicks.",
      isReadMore: false,
      isLoading: false,
    };
  },
  async created() {
    this.toggleLoading()
    window.scrollTo(0, 0);
    this.categories = projService.loadCategoties();
    this.reviewsCount = this.$store.getters.reviewsCount;
    if (!this.reviewsCount) {
      this.reviewsCount = await this.$store.dispatch({
        type: "loadReviewsCount"
      });
    }
    this.projsCount = this.$store.getters.projsCount;
    if (!this.projsCount) {
      this.projsCount = await this.$store.dispatch({ type: "loadProjsCount" });
    }
    this.usersCount = this.$store.getters.usersCount;
    if (!this.usersCount) {
      this.usersCount = await this.$store.dispatch({ type: "loadUsersCount" });
    }
    this.toggleLoading()
  },
  async beforeMount() {
    await this.$store.dispatch({ type: "loadProjs", limit: this.limit });
  },
  async mounted() {
    this.projs = this.$store.getters.projs;
    if (!this.projs.length) {
      this.projs = await this.$store.dispatch({ type: "loadProjs" });
    }
  },
  methods: {
    openDetails(id) {
      this.$router.push("/proj/" + id);
    },
    toggleLoading() {
      this.isLoading = !this.isLoading;
      document.body.classList.toggle("loading-active");
    },
  },
  computed: {
    currProjs() {
      return this.$store.getters.currProjs;
    },
    countriesCount() {
      return this.$store.getters.countries;
    }
    // animatedReviewsCount() {
    //   return this.reviewsCount.toFixed(0);
    // }
  },
  components: {
    markerCard,
    projListCarousel,
    titleLink
  }
  // watch: {
  //   reviewsCount:{
  //     hendler(){
  //       gsap.to(this.$data, { duration: 0.5, animatedReviewsCount: this.reviewsCount })
  //     },
  //     deep: true
  //   }

  // },
};
</script>
