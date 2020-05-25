<template>
  <transition name="fade">
    <div class="proj-list width-container height-container">
      <!-- <div class="proj-list width-container height-container" v-if="projs"> -->
      <filter-By class="filter-in-proj-list" />
      
      <transition name="fade">
        <div class="header ratio-16-9" v-if="!currProjs.length">
          <img src="../../assets/jpg/people.jpg" />
          <div class="page-header">
            <h1></h1>
            <h2 class="projs-title">Be the change</h2>
            <h3>Be a global volunteer abroad</h3>
          </div>
        </div>
      </transition>

      <div class="around-the-world-list">
        <marker-card
          v-for="(proj, i) in currProjs"
          :key="i"
          :proj="proj"
          :title="proj.description? proj.description.substring(0,80) +'... Click to read more!!': ''"
          class="proj-preview-card"
          @click.native="openDetails(proj._id)"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import filterBy from "../../components/filter/filter-by.vue";
import markerCard from "../../components/marker-card.vue";
import { eventBus } from "../../services/eventbus-service.js";

export default {
  name: "projList",
  data() {
    return {
      isOpen: true,
      initialVal: null,
      limit: 0,
      skip: 0,
      unitScrollY: null,
      filterBy: null,
      timeOutSetFilter: null
    };
  },
  computed: {
    currProjs() {
      return this.$store.getters.currProjs;
    }
  },
  created() {
    window.scrollTo(0, 0);
    this.setUnitScrollY();
  },
  mounted() {
    this.timeOutSetFilter = setTimeout(() => {
      this.setFilter();
    }, 100);
    eventBus.$on("setFilter", filterBy => this.setFilter(filterBy));
    window.addEventListener("scroll", this.handleScroll);

    this.initialVal !== this.currProjs.length
      ? (this.isOpen = false)
      : this.toggleHero();
  },
  beforeDestroy() {
    eventBus.$off("setFilter", filterBy => this.setFilter(filterBy));
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    setUnitScrollY() {
      if (window.innerWidth > 1000) {
        this.unitScrollY = 220;
      } else if (window.innerWidth > 750) {
        this.unitScrollY = 380;
      } else if (window.innerWidth > 485) {
        this.unitScrollY = 700;
      } else this.unitScrollY = 1250;
    },
    handleScroll() {
      if (!this.limit) return;
      if (window.scrollY > this.unitScrollY * (this.skip + 1)) {
        this.loadMoreProj();
      }
    },
    openDetails(id) {
      this.$router.push("/proj/" + id);
    },
    toggleHero() {
      this.isOpen = true;
    },
    async setFilter(filterBy = {}) {
      clearTimeout(this.timeOutSetFilter)
      // TODO:this ↓↓ is a plaster. fix is in a query() in projService of the backend
      filterBy.x = [];
      this.filterBy = filterBy;
      await window.scrollTo(0, 0);
      this.limit = 12;
      this.skip = 0;
      this.loadProjs();
    },
    async loadProjs() {
      const projs = await this.$store.dispatch({
        type: "loadProjs",
        filterBy: this.filterBy,
        limit: this.limit,
        skip: this.skip
      });
      if (projs.length < this.limit) this.limit = 0;
    },
    loadMoreProj() {
      this.skip++;
      this.limit = 4;
      this.loadProjs();
    }
  },
  components: {
    markerCard,
    filterBy
  }
};
</script>
