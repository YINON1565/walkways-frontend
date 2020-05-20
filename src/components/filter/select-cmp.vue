<template>
      <transition name="fade">

  <section :class="{open:isOpen}" class="select-cmp" @click.stop="isOpen = !isOpen">
    <!-- <select v-model="select" @change="search()">
      <option v-for="select in selects" :key="select" :value="select">{{select}}</option>
    </select>-->
    <!-- <input
      type="text"
      list="selects"
      v-model="select"
      @change="search()"
      placeholder="Filter by type.."
    />
    <div class="selecteds">
      <span
        class="selected"
        v-for="selected in selecteds"
        :key="selected"
        @click="removeFromList(selected)"
      >{{selected}}</span>
    </div>
    <datalist id="selects">
      <option v-for="select in selects" :key="select" :value="select">{{select}}</option>
    </datalist>-->
    <!-- <section @click="isOpen = !isOpen"> -->




    <span>
      <div v-if="selecteds.length || select.length">
        <span
          class="selected"
          v-for="selected in selecteds"
          :key="selected"
          @click.stop="removeFromList(selected)"
        >{{selected}}</span>
      </div>
      <p v-else>{{placeholder}}</p>
      <input
        :class="{active: selecteds.length}"
        type="search"
        v-model="select"
        @change="search1(select)"
        
      />
    </span>
    <transition name="fade">
      <ul v-if="isOpen" class="list-select">
        <li v-for="select in selects" :key="select" @click.stop="search1(select)">{{select.charAt(0).toUpperCase() + select.slice(1)}}</li>
      </ul>
    </transition>
    
    <!-- <span>
      <div v-if="selecteds.length || select.length">
        <span
          class="selected"
          v-for="selected in selecteds"
          :key="selected.value"
          @click.stop="removeFromList(selected)"
        >{{selected.name}}</span>
      </div>
      <p v-else>Choose {{placeholder}}..</p>
      <input
        :class="{active: selecteds.length}"
        type="search"
        v-model="txt"
        @change="inputTxtHendler(txt)"
        
      />
    </span>
    <transition name="fade">
      <ul v-if="isOpen" class="list-select">
        <li v-for="select in selects" :key="select.value" @click.stop="search1(select)">{{select.name}}</li>
      </ul>
    </transition> -->

    <!-- </section> -->
  </section>
      </transition>
</template>

<script>
export default {
  props: {
    selects: Array,
    value: Array,
    placeholder: String
  },
  data() {
    return {
      select: "",
      txt: "",
      selecteds: [],
      isOpen: false
    };
  },
  methods: {
    search() {
      this.selecteds.push(this.select);
      var idx = this.selects.findIndex(select => select === this.select);
      this.selects.splice(idx, 1);
      this.$emit("input", this.selecteds);
      this.select = "";
    },
     search1(val) {
      this.isOpen = false;
      if (!val.length) return;
      this.selecteds.push(val);
      var idx = this.selects.findIndex(select => select === val);
      if (idx !== -1) this.selects.splice(idx, 1);

      this.$emit("input", this.selecteds);
    },
    removeFromList(currSelected) {
      var idx = this.selecteds.findIndex(selected => selected === currSelected);
      var select = this.selecteds.splice(idx, 1).join("");
      this.selects.unshift(select);
      this.$emit("input", this.selecteds);
    },
    
    closeSearch() {
      this.isOpen = false;
    },
    handlePress(event) {
      if (event.keyCode === 27) {
        this.closeSearch();
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.closeSearch);
    document.addEventListener("keydown", this.handlePress);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeSearch);
    document.removeEventListener("keydown", this.handlePress);
  }
};
</script>
