<template>
  <div class="filter-container">
    <search-cmp
      :class="{'filters-open':isFiltersOpen}"
      @toggleFilters="isFiltersOpen = !isFiltersOpen"
      v-model="filterBy.name"
      :isFiltersOpen="isFiltersOpen"
    ></search-cmp>
    <select-cmp
      :class="{'filters-open':isFiltersOpen}"
      v-model="filterBy.tags"
      :selects="tags"
      :placeholder="'Tags'"
    ></select-cmp>
    <select-cmp
      :class="{'filters-open':isFiltersOpen}"
      v-model="filterBy.creators"
      :selects="creators"
      :placeholder="'Creators'"
    ></select-cmp>
    <select-cmp
      :class="{'filters-open':isFiltersOpen}"
      v-model="filterBy.categories"
      :selects="categories"
      :placeholder="'Categories'"
    ></select-cmp>
    <transition name="fade">
      <el-date-picker
        :class="{'filters-open':isFiltersOpen}"
        v-model="dates[0]"
        type="date"
        placeholder="Start date"
        format="yyyy/MM/dd"
        value-format="yyyy-MM-dd"
        @change="goToEnd"
      ></el-date-picker>
    </transition>
    <transition name="fade">
      <el-date-picker
        :class="{'filters-open':isFiltersOpen}"
        v-model="dates[1]"
        type="date"
        ref="date-end"
        placeholder="End date"
        format="yyyy/MM/dd"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "../../services/eventbus-service.js";
import { projService } from "../../services/proj.service.js";
import searchCmp from "./search-cmp.vue";
import selectCmp from "./select-cmp.vue";

export default {
  name: "filterBy",
  data() {
    return {
      isFiltersOpen: false,
      filterBy: {
        name: "",
        categories: [],
        tags: [],
        creators: [],
        startAt: null,
        endsAt: null
      },
      categories: [],
      tags: [],
      dates: [],
      creators: []
    };
  },
  async created() {
    this.categories = projService.loadCategoties();
    this.categories = this.categories.map(category => category.category);
    // this.categories = this.categories.map(category => {return {name: category.title, value:category.category}});
    this.tags = projService.loadTags();
    const projs = this.$store.getters.projs;
    if (!projs.length) {
      await this.$store.dispatch({ type: "loadProjs" });
    }
    this.creators = await this.$store.getters.creators;
  },
  methods: {
    emitFilter() {
      if (this.$route.path !== "/projs/aroundTheWorld") {
        this.$router.push("/projs/aroundTheWorld");
      }
      if (this.dates.length) {
        this.filterBy.startAt = this.toTimestamp(this.dates[0]);
        this.filterBy.endsAt = this.toTimestamp(this.dates[1]);
      }
      eventBus.$emit("setFilter", this.filterBy);
    },
    toTimestamp(strDate) {
      var datum = Date.parse(strDate);
      return datum / 1000;
    },
    goToEnd() {
      if (!this.dates[0]) return;
      this.$refs["date-end"].focus();
    }
  },
  watch: {
    filterBy: {
      handler() {
        this.emitFilter();
      },
      deep: true
    },
    dates: {
      handler() {
        this.emitFilter();
      },
      deep: true
    }
  },
  components: {
    searchCmp,
    selectCmp
  }
};
</script>
