<template>
  <transition name="fade">
    <div class="proj-list-filtered height-container flex col">
      <div class="main-content">
        <div class="header ratio-16-9" v-if="projsHeader">
          <img :src="projsHeader.imgUrl" />
          <div class="category-header">
            <div class="category-header-title">{{projsHeader.title}}</div>
            <div class="category-header-desc">{{projsHeader.desc}}</div>
          </div>
        </div>
        <ul>
          <li v-for="(proj) in filteredProjs" :key="proj._id">
            <proj-preview :proj="proj"></proj-preview>
          </li>
        </ul>
      </div>
      <div class="side-bar">
        <map-preview :array="filteredProjs"></map-preview>
      </div>
    </div>
  </transition>
</template>



<script>
import projPreview from "../../components/proj/proj-preview.vue";
import mapPreview from "../../components/map-preview.vue";

export default {
  name: "projsListFiltered",

  data() {
    return {
      projs: null,
      filteredProjs: null,
      projsHeader: null
    };
  },
  async created() {
    this.projs = this.$store.getters.projs;
    if (!this.projs.length) {
      this.projs = await this.$store.dispatch({ type: "loadProjs" });
    }
    this.setFilteredProjs();
  },
  methods: {
    async getHeader(filter) {
      var headerObj = await this.$store.dispatch({
        type: "getFilteredProjHeader",
        filter
      });
      if (headerObj) {
        this.projsHeader = headerObj;
      }
    },
    setFilteredProjs() {
      const filter = this.$route.params.filter;
      this.filteredProjs = this.projs.filter(proj => {
        return proj.category === filter;
      });
      this.getHeader(filter);
      window.scrollTo(0, 0);
    }
  },

  components: {
    projPreview,
    mapPreview
  },
  watch: {
    "$route.path": {
      handler() {
        this.setFilteredProjs();
      },
      deep: true
    }
  }
};
</script>

<style scoped >
</style>
