<template>
  <section class="search-cmp">
    <input
      ref="inputRef"
      :class="{active: input.length}"
      type="search"
      v-model="input"
      name="input"
      placeholder="Search For Project..."
      title="Search By name"
      @input="search"
    />
    <svg
      role="presentation"
      :class="{active: input.length}"
      viewBox="0 0 32 32"
      width="14"
      height="14"
      fill="none"
      stroke="#ffedb8"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
    >
      <circle cx="14" cy="14" r="12" />
      <path d="M23 23 L30 30" />
    </svg>
    <img
      @click="$emit('toggleFilters')"
      src="../../assets/svg/downloading2.svg"
      alt="More option"
      :title="isFiltersOpen? 'Hide search options' : 'Show search options'"
    />

    <!-- {{input}} -->
  </section>
</template>

<script>
import { eventBus } from "../../services/eventbus-service";

export default {
  props: {
    value: {
      type: String,
    },
    isFiltersOpen: Boolean
  },
  data() {
    return {
      input: this.value
    };
  },
  mounted() {
    window.scrollTo(0, 0);
    eventBus.$on("goToSearchPage", this.goToSearchPage);
    // if (this.$refs.inputRef) {
    //   this.$refs.inputRef.focus();
    // }
  },
  beforeDestroy() {
    eventBus.$off("goToSearchPage", this.goToSearchPage);
  },
  methods: {
    goToSearchPage(txt) {
        this.$refs.inputRef.focus();
        window.scrollTo(0, 0);
        this.input = txt;
        this.search();
    },
    search() {
      this.$emit("input", this.input);
    }
  }
};
</script>