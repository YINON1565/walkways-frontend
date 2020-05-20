<template>
  <div class="nav-bar-container" :class="{'scrollering': isScrollering, 'off-line':offLine}">
    <nav class="nav-bar width-container flex bet">
      <router-link to="/">
        <img class="logo" src="../assets/svg/help.svg" alt="Logo" @click="onCloseMenu"/>
      </router-link>
      <section v-if="!isProjListOpen" class="line-search-nav-bar flex a-center j-center">
        <input type="search" @input="onGoToSearchPage" placeholder="Search Project" />
        <svg
          @click="onGoToSearchPage"
          title="See All"
          role="presentation"
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
      </section>
      <div class="nav-link-container flex col" :class="{'open-menu':openMenu}">
        <section v-if="!isProjListOpen" class="line-search-nav-bar flex a-center j-center">
          <input type="search" @input="onGoToSearchPage" placeholder="Search Project" />
          <svg
            @click="onGoToSearchPage"
            title="See All"
            role="presentation"
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
        </section>
        <section class="link-container" @click="onCloseMenu">
          <router-link active-class="active" to="/" title="Home" exact>
            <img src="../assets/svg/homepage.svg" alt />
            <span>Home</span>
          </router-link>
        </section>
        <section class="link-container" @click="onCloseMenu">
          <router-link active-class="active" to="/proj" title="Let's Publish">
            <img src="../assets/svg/project.svg" alt />
            <span>Publish</span>
          </router-link>
        </section>
        <a v-if="loggedinUser" active-class="active" @click="logout" title="Logout">
          <img src="../assets/svg/log-in.svg" alt />
          <span>Logout</span>
        </a>
        <section v-else class="link-container" @click="onCloseMenu">
          <router-link to="/login" active-class="active" title="Login">
            <img src="../assets/svg/log-in.svg" alt />
            <span>Login</span>
          </router-link>
        </section>
        <section class="link-container img-user-link" @click="onCloseMenu">
          <router-link
            :to="'/user/' + loggedinUser._id"
            v-if="loggedinUser"
            class=""
            active-class="active"
          >
            <img class="img-user" :src="loggedinUser.imgUrl" :title="loggedinUser.fullName" />
            <section class="container-notification-icon">
              <img src="../assets/svg/notification.svg" alt />
              <span>{{loggedinUser.notifications.length}}</span>
            </section>
            <span>My Profile</span>
          </router-link>
        </section>
        <section class="categories-contianer">
          <a href="#" @click="toglleActive" :class="{'active': isActive}" title="Categories">
            <img src="../assets/svg/tool.svg" alt />
            <span>Categories</span>
            <img :class="{'arrow-down': isActive}" src="../assets/svg/downloading.svg" alt />
          </a>
          <transition name="fade">
            <div class="accordion-categories" v-if="isActive" @click="isActive = !isActive">
              <section class="link-container" @click="onCloseMenu">
                <router-link
                  v-for="category in categories"
                  :key="category.category"
                  :to="'/projs/' + category.category"
                >{{category.title}}</router-link>
              </section>
            </div>
          </transition>
        </section>
      </div>
      <img
        @click.stop="toggleMemu"
        class="hamburger"
        :class="{'open-menu':openMenu}"
        src="../assets/svg/menu.svg"
        alt
      />
    </nav>
  </div>
</template>

<script>
import LoginVue from "../pages/Login.vue";
import { projService } from "../services/proj.service.js";
import { eventBus } from "../services/eventbus-service";
import searchCmp from "./filter/search-cmp.vue";

export default {
  data() {
    return {
      isScrollering: false,
      openMenu: false,
      offLine: false,
      isActive: false,
      categories: null,
      isProjListOpen: false,
      txtSearch: ""
    };
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    }
  },
  methods: {
    onCloseMenu() {
      if (this.openMenu) {
        this.toggleMemu();
      }
    },
    async onGoToSearchPage(ev) {
      console.log(ev.target.value);
      if (this.openMenu) {
        this.toggleMemu();
      }
      await this.$router.push("/projs/aroundTheWorld");
      if (ev.target.value) {
        eventBus.$emit("goToSearchPage", ev.target.value);
      }
    },
    async logout() {
      eventBus.$emit("disconnectSockets");
      var res = await this.$store.dispatch({ type: "logout" });
      if (res) {
        this.$notify({
          title: "Success",
          message: "The logout operation was successful",
          type: "success",
          duration: 1500
        });
      }
      this.onCloseMenu();
    },
    handleScroll() {
      this.isScrollering = true;
      if (window.scrollY === 0) {
        this.isScrollering = false;
      }
    },
    toggleMemu() {
      console.log(123);

      this.isActive = false;
      this.openMenu = !this.openMenu;
      document.body.classList.toggle("menu-open");
    },
    handleClick(event) {
      if (this.isActive) this.isActive = false;
      if (!this.openMenu) return;
      this.toggleMemu();
    },
    handlePress(event) {
      if (event.keyCode === 27) {
        this.handleClick();
      }
    },
    toglleActive() {
      this.isActive = !this.isActive;
    }
  },
  created() {
    if (this.$route.path === "/projs/aroundTheWorld") {
      this.isProjListOpen = true;
    }
    this.categories = projService.loadCategoties();
  },
  mounted() {
    // window.addEventListener("scroll", this.handleScroll);
    document
      .querySelector(".screen")
      .addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handlePress);
  },
  beforeDestroy() {
    // window.removeEventListener("scroll", this.handleScroll);
    document
      .querySelector(".screen")
      .removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handlePress);
  },
  components: {
    searchCmp
  },
  watch: {
    loggedinUser() {
      document.title = this.loggedinUser
        ? `(${this.loggedinUser.notifications.length}) Walkways`
        : "Walkways";
    },
    "$route.path": {
      handler() {
        if (this.$route.path === "/projs/aroundTheWorld") {
          this.isProjListOpen = true;
        } else {
          this.isProjListOpen = false;
        }
      },
      deep: true
    }
  }
};
</script>

