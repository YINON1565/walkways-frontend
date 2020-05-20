<template>
  <transition name="fade">
    <div class="proj-details-container width-container height-container" v-if="proj && reviews">
      <div v-if="isSaveLoading" class="save-loading">
        <img src="../../assets/svg/rolling2.svg" alt />
      </div>
      <div class="proj-details">
        <div class="main-content-details-contianer">
          <!-- TITLE OF PROJECT-->
          <h1 v-if="editMode" class="title-proj" :class="{'edit-mode':editMode}">
            <textarea v-model="proj.title" rows="1" placeholder="Project Title"></textarea>
            <img src="../../assets/svg/pen2.svg" alt="Edit" />
          </h1>
          <h1 v-else class="title-proj">{{proj.title}}</h1>

          <!-- IMAGES GALERY OF PROJECT-->
          <input ref="uploadImg" @input="uploadImg" type="file" hidden />
          <section v-if="isLoading" class="upload-new-img-btn flex col a-center j-center">
            <img class="rolling2-loader" src="../../assets/svg/rolling2.svg" alt />
            <p>Wait a few moments</p>
          </section>
          <div v-else-if="proj.imgUrls.length" class="img-proj-container ratio-16-9">
            <el-carousel indicator-position="outside">
              <el-carousel-item v-for="(imgUrl, index) in proj.imgUrls" :key="index">
                <img @click="setCurrImg(index)" :src="imgUrl" />
                <div v-if="editMode" class="edit-img-container-btn">
                  <div title="Delete this image from project">
                    <img @click="removeImg(index)" src="../../assets/svg/bin.svg" alt />
                  </div>
                  <div @click="$refs.uploadImg.click()" title="Add image for your project">
                    <img src="../../assets/svg/file-upload.svg" alt />
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <section
            v-else
            class="upload-new-img-btn pointer flex a-center j-center"
            title="Add image for your project"
            @click="$refs.uploadImg.click()"
          >
            <img src="../../assets/svg/plus.svg" alt />
          </section>

          <!--CMP AVARAGE REVIEW OF PROJECT-->
          <review-avarage v-if="!editMode" class="review-avarage review" :reviews="reviews" />

          <div class="main-content-details">
            <!-- CATEGORY OF PROJECT -->
            <section v-if="editMode">
              <div @click="scrollTo" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Category</span>
                  </section>
                  <img class="edit-mode" v-if="editMode" src="../../assets/svg/pen2.svg" alt="Edit" />
                </h3>
              </div>
              <el-select
                required
                v-model="proj.category"
                filterable
                default-first-option
                placeholder="Category"
              >
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </section>

            <!--DESCRIPTION OFF PROJECT-->
            <section>
              <!--TITLE DESCRIPTION-->
              <div @click="setActive('description', $event)" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Description</span>
                  </section>
                  <img
                    v-if="!editMode"
                    :class="{'arrow-down': active === 'description'}"
                    src="../../assets/svg/downloading2.svg"
                    alt="⇧"
                  />
                  <img class="edit-mode" v-else src="../../assets/svg/pen2.svg" alt="Edit" />
                </h3>
              </div>
              <!--TXT DESCRIPTION-->
              <transition v-if="editMode" name="fade">
                <textarea
                  v-model="proj.description"
                  class="description-textarea"
                  cols="30"
                  rows="10"
                  @input="auto_grow"
                ></textarea>
              </transition>
              <transition v-else name="fade">
                <p v-if="active === 'description'">{{proj.description}}</p>
              </transition>
            </section>

            <!--REQUIEMENTS OFF PROJECT-->
            <section>
              <!--TITLE REQUIEMENTS-->
              <div @click="setActive('requirements', $event)" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Requirements</span>
                  </section>
                  <img
                    v-if="!editMode"
                    :class="{'arrow-down': active === 'requirements'}"
                    src="../../assets/svg/downloading2.svg"
                    alt="⇧"
                  />
                  <img class="edit-mode" v-else src="../../assets/svg/pen2.svg" alt="Edit" />
                </h3>
              </div>
              <transition v-if="editMode" name="fade">
                <div class="edit-container">
                  <p>Choose a date</p>
                  <el-date-picker
                    class="date-pickar-for-desctop"
                    v-model="proj.date"
                    type="daterange"
                    unlink-panels
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                  <section class="date-pickar-for-mobile flex col">
                    <p>Start date</p>
                    <el-date-picker
                      v-model="proj.date[0]"
                      type="date"
                      placeholder="Start date"
                      format="yyyy/MM/dd"
                      value-format="yyyy-MM-dd"
                      @change="goToEnd"
                    ></el-date-picker>
                    <p>End date</p>
                    <el-date-picker
                      v-model="proj.date[1]"
                      type="date"
                      ref="date-end"
                      placeholder="End date"
                      format="yyyy/MM/dd"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                  </section>
                  <p>Members Needed</p>
                  <el-input-number v-model="proj.membersNeeded" :min="1" :max="100"></el-input-number>
                  <p>Minimum Age: {{proj.requirements.minAge}}</p>
                  <el-input-number v-model="proj.requirements.minAge" :min="14"></el-input-number>
                  <p>Language skill</p>
                  <div class="select-cmp-container">
                    <select-cmp
                      class="filters-open"
                      v-model="proj.requirements.languages"
                      :selects="languages"
                      :placeholder="'language requirements'"
                    ></select-cmp>
                  </div>
                  <p>More skills</p>
                  <div class="select-cmp-container">
                    <select-cmp
                      class="filters-open"
                      v-model="proj.requirements.otherSkills"
                      :selects="otherSkills"
                      :placeholder="'skills requirements'"
                    ></select-cmp>
                  </div>
                </div>
              </transition>

              <transition v-else name="fade">
                <div v-if="active === 'requirements'">
                  <!--DATES REQUIEMENTS-->
                  <p>
                    <span class="strong">Required Dates:</span>
                    {{proj.date[0]}} - {{proj.date[1]}}
                  </p>

                  <!--MEMBERS NEEDED REQUIEMENTS-->
                  <p>
                    <span class="strong">Members needed:</span>
                    {{proj.membersNeeded}} / {{proj.membersNeeded + proj.membersApplyed.length}}
                  </p>

                  <!--LANGUAGES REQUIEMENTS-->
                  <p v-if="proj.requirements.languages.length">
                    <span class="strong">Language control:</span>
                    <span>{{proj.requirements.languages.join(', ')}}.</span>
                  </p>

                  <!--OTHER SKILLS REQUIEMENTS-->
                  <p v-if="proj.requirements.otherSkills.length">
                    <span class="strong">Other Skills:</span>
                    <span>{{proj.requirements.otherSkills.join(', ')}}.</span>
                  </p>

                  <!--AGE REQUIEMENTS-->
                  <p>
                    <span class="strong">Minimum Age:</span>
                    {{proj.requirements.minAge}}
                  </p>
                </div>
              </transition>
            </section>

            <!--INCLUDEEDS OFF PROJECT-->
            <section>
              <div @click="setActive('tags', $event)" class="flex a-center bet">
                <!--TITLE INCLUDEEDS-->
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>What is included</span>
                  </section>
                  <img
                    v-if="!editMode"
                    :class="{'arrow-down': active === 'tags'}"
                    src="../../assets/svg/downloading2.svg"
                    alt="⇧"
                  />
                  <img class="edit-mode" v-else src="../../assets/svg/pen2.svg" alt="Edit" />
                </h3>
              </div>

              <transition v-if="editMode" name="fade">
                <div class="edit-container">
                  <div class="select-cmp-container">
                    <select-cmp
                      class="filters-open"
                      v-model="proj.tags"
                      :selects="tags"
                      :placeholder="'What\'s included'"
                    ></select-cmp>
                  </div>
                </div>
              </transition>
              <transition v-else name="fade">
                <!--TAGS INCLUDEEDS-->
                <ul v-if="active === 'tags'">
                  <li v-for="tag in proj.tags" :key="tag" class="flex a-center">
                    <img
                      :src="require('../../assets/svg/' + tag.toLowerCase().split(' ').join('-') + '.svg')"
                      alt="tag"
                    />
                    <span>{{tag}}</span>
                  </li>
                </ul>
              </transition>
            </section>

            <!--USER CREATOR PROFILE-->
            <section class="user-profile-for-details" v-if="!editMode">
              <div @click="setActive('createdBy', $event)" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Created By</span>
                  </section>
                  <img
                    v-if="!editMode"
                    :class="{'arrow-down': active === 'createdBy'}"
                    src="../../assets/svg/downloading2.svg"
                    alt="⇧"
                  />
                  <img class="edit-mode" v-else src="../../assets/svg/pen2.svg" alt="Edit" />
                </h3>
              </div>
              <transition name="fade">
                <section v-if="active === 'createdBy'" class="details-created-by flex col">
                  <router-link :to="'/user/' + proj.createdBy._id">
                    <img
                      class="avatar avatar-m"
                      :src="proj.createdBy.imgUrl"
                      :alt="proj.createdBy.fullName"
                      :title="proj.createdBy.fullName"
                    />
                  </router-link>
                  <section>
                    <p>{{proj.createdBy.fullName}}</p>
                    <p>Join: {{proj.createdBy.joinAt.date}}, {{proj.createdBy.joinAt.time}}</p>
                    <review-avarage-by-id class="review-avarage" :id="proj.createdBy._id" />
                  </section>
                </section>
              </transition>
            </section>

            <!-- ORGANIZATION OF PROJECT -->
            <section v-if="editMode || proj.organization">
              <div @click="setActive('organization', $event)" class="flex a-center bet">
                <h3 class="container-link-img flex bet">
                  <section>
                    <img class="link-img" src="../../assets/svg/link.svg" alt />
                    <span>Organization</span>
                  </section>
                  <img
                    v-if="!editMode"
                    :class="{'arrow-down': active === 'organization'}"
                    src="../../assets/svg/downloading2.svg"
                    alt="⇧"
                  />
                  <img class="edit-mode" v-else src="../../assets/svg/pen2.svg" alt="Edit" />
                </h3>
              </div>
              <transition v-if="editMode" name="fade">
                <section class="input-organization">
                  <input v-model="proj.organization" placeholder="Project organization" />
                </section>
              </transition>
              <transition v-else name="fade">
                <p v-if="active === 'organization'">{{proj.organization}}</p>
              </transition>
            </section>
          </div>
        </div>

        <!--CMP ADD REVIEW-->
        <review-add
          v-if="(loggedinUser && loggedinUser._id !== proj.createdBy._id) || !loggedinUser"
          :review="review"
          @save="saveReview"
        />

        <!--CMP LIST OFF REVIEW-->
        <review-list
          v-if="reviews && reviews.length && !editMode"
          class="reviews-container"
          :reviews="reviews"
        />

        <!--CMP LOCATION OF PROJECT IN MAP-->
        <section class="container-location">
          <div @click="scrollTo" class="flex a-center bet">
            <h3 class="container-link-img flex bet">
              <section>
                <img class="link-img" src="../../assets/svg/link.svg" alt />
                <span>Location</span>
              </section>
              <img class="edit-mode" v-if="editMode" src="../../assets/svg/pen2.svg" alt="Edit" />
            </h3>
          </div>
          <section v-if="editMode" class="search-location edit-container">
            <input
              type="search"
              placeholder="Please enter an address"
              v-model="proj.position.txtAddress"
              @keyup.enter="searchPosition(proj.position.txtAddress)"
              @blur.prevent="searchPosition(proj.position.txtAddress)"
            />
            <!-- @keydown.stop="onInputLocationPress" -->
            <svg
              @click.prevent="searchPosition(proj.position.txtAddress)"
              title="Search"
              role="presentation"
              viewBox="0 0 32 32"
              width="20"
              height="20"
              fill="none"
              stroke="#68667a"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
            >
              <circle cx="14" cy="14" r="12" />
              <path d="M23 23 L30 30" />
            </svg>
          </section>
          <p class="location-txt" v-else>
            <img src="../../assets/svg/icon-location2.svg" alt />
            <span v-if="proj.position.city">{{' ' + proj.position.city}},</span>
            <span v-if="proj.position.country">{{' ' + proj.position.country + ' '}}</span>
            <span v-if="proj.position.region">({{proj.position.region}})</span>
          </p>
          <div class="card-deatails map-container">
            <map-preview :array="[proj]"></map-preview>
          </div>
        </section>
      </div>
      <section>
        <section class="container-controller-proj-btn width-container">
          <section v-if="proj._id && editMode">
            <img @click="removeProj(proj._id)" src="../../assets/svg/bin.svg" alt="Delete" />
          </section>
          <section v-else-if="editMode">
            <img @click="reset" src="../../assets/svg/clean.svg" alt="Reset" />
          </section>
          <section v-if="editMode">
            <img @click="saveProj(proj)" src="../../assets/svg/save.svg" alt="Save" />
          </section>
          <section
            v-if="!newProjMode && loggedinUser &&
        (loggedinUser._id === proj.createdBy._id || 
        loggedinUser.isAdmin)"
            :title="editMode? 'Switch to read mode': 'Switch to edit mode'"
            @click="editMode = !editMode"
          >
            <img v-if="editMode" src="../../assets/svg/read-mode.svg" alt />
            <img v-else src="../../assets/svg/pen.svg" alt />
          </section>
          <span
            v-else-if="!newProjMode && loggedinUser &&
        (loggedinUser._id !== proj.createdBy._id || 
        !loggedinUser.isAdmin) && !isApplyOpen && (proj.membersApplyed.length < proj.membersNeeded)"
            @click.stop="toggleApply"
            :class="{'apply-open':isApplyOpen}"
          >Apply now</span>
        </section>
      </section>

      <proj-apply
        v-if="loggedinUser && !newProjMode"
        @toggleApply="toggleApply"
        :proj="proj"
        :user="loggedinUser"
        class="proj-apply"
        :class="{'apply-open':isApplyOpen}"
      ></proj-apply>
    </div>
    <div class="height-container width-contianer flex a-center j-center" v-else>
      <img class="loading-page" src="../../assets/svg/loading.svg" alt />
    </div>
  </transition>
</template>

<script>
import { eventBus } from "../../services/eventbus-service.js";
import { projService } from "../../services/proj.service.js";
import mapPreview from "../../components/map-preview.vue";
import projApply from "../../components/proj/proj-apply.cmp.vue";
import reviewList from "../../components/review/review-list.cmp.vue";
import reviewAdd from "../../components/review/review-add.cmp.vue";
import reviewAvarage from "../../components/review/review-avarage.cmp.vue";
import reviewAvarageById from "../../components/review/review-avarage-by-id.vue";
import selectCmp from "../../components/filter/select-cmp.vue";

export default {
  data() {
    return {
      ref: null,
      editMode: false,
      newProjMode: false,
      proj: null,
      isApplyOpen: false,
      // isApplyOn: false,
      review: null,
      averageRate: null,
      colors: this.$store.getters.colors,
      active: "",
      languages: ["Hebrew", "English", "Spanish"],
      otherSkills: ["Driving", "Health", "Education", "Organizer"],
      tags: [
        "Airport Taxi",
        "Housing",
        "Single Bed",
        "Double Bed",
        "Food",
        "Wifi",
        "Hot Water"
      ],
      categories: null,
      isLoading: false,
      isSaveLoading: false
    };
  },
  async created() {
    const categories = projService.loadCategoties();
    this.categories = categories.map(category => {
      return { value: category.category, label: category.title };
    });
    window.scrollTo(0, 0);
    const projId = this.$route.params.id;
    if (projId) {
      this.proj = await this.$store.dispatch({
        type: "loadProj",
        projId
      });
      await this.$store.dispatch({
        type: "loadReviews",
        id: projId,
        isSetReviews: true
      });
      this.averageRate = this.reviews.reduce((a, b) => a + b.rate, 0);
      this.review = this.getEmptyReview();
    } else {
      if (!this.loggedinUser) {
        this.$notify({
          title: "Warning",
          message: "You must register first",
          type: "warning",
          duration: 1500
        });
        this.$router.push("/login");
      }
      this.proj = projService.getEmptyProj();
      this.editMode = true;
      this.newProjMode = true;
    }
  },
  components: {
    mapPreview,
    projApply,
    reviewList,
    reviewAdd,
    reviewAvarage,
    reviewAvarageById,
    selectCmp
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    reviews() {
      return this.$store.getters.reviews;
    }
  },
  methods: {
    goToEnd() {
      if (!this.proj.date[0]) return;
      this.$refs["date-end"].focus();
    },
    async searchPosition(txt) {
      var currPosition = await this.$store.dispatch({
        type: "searchPosition",
        txt
      });
      if (currPosition) {
        this.proj.position = currPosition;
      }
    },
    scrollTo(ev) {
      window.scrollTo(0, ev.target.offsetTop - 200);
    },
    auto_grow(ev) {
      ev.target.style.height = "5px";
      ev.target.style.height = ev.target.scrollHeight + "px";
    },
    async uploadImg(ev) {
      // this.proj.imgUrls.push(require('../../assets/svg/loading.svg'));
      this.isLoading = true;
      var imgUrl = await this.$store.dispatch({
        type: "addImg",
        imgEv: ev
      });

      // this.currentImgIdx || this.currentImgIdx === 0
      // ? this.proj.imgUrls.splice(this.currentImgIdx, 1, img.url)
      // : this.proj.imgUrls.push(img.url);
      // this.currentImgIdx = null;
      // this.proj.imgUrls.splice(-1, 1);
      this.isLoading = false;
      this.proj.imgUrls.push(imgUrl);
    },
    removeImg(index) {
      this.proj.imgUrls.splice(index, 1);
    },
    async setCurrImg(idx) {
      // this.currentImgIdx = idx;
    },
    async saveProj(proj) {
      if (!proj.category) {
        this.$notify({
          title: "Warning",
          message: "You must select a category",
          type: "warning",
          duration: 1500
        });
        window.scrollTo(0, 0);
        return;
      }
      proj.startAt = this.toTimestamp(proj.date[0]);
      proj.endsAt = this.toTimestamp(proj.date[1]);
      proj.date = this.fixDate(proj.date);
      proj.createdBy = this.loggedinUser;
      if(!proj.imgUrls.length) proj.imgUrls[0] = 'https://res.cloudinary.com/tamir/image/upload/v1589967682/noImg_imojcv.jpg'
      console.log(proj);
      
      this.toggleLoading()      
      var res = await this.$store.dispatch({ type: "saveProj", proj });
      this.$notify({
        title: "Success",
        message: "The project was successfully added",
        type: "success",
        duration: 1500
      });
      this.toggleLoading();
      this.$router.push("/");
    },
    toggleLoading() {
      this.isSaveLoading = !this.isSaveLoading;
      document.body.classList.toggle("loading-active");
    },
    toTimestamp(strDate) {
      return Date.parse(strDate) / 1000;
    },
    fixDate(dates) {
      return dates.map(date => {
        return date.length > 10
          ? date
              .substring(0, 10)
              .split("-")
              .join("/")
          : date;
      });
    },
    removeProj(projId) {
      this.$store.dispatch({ type: "removeProj", projId });
      this.$notify({
        title: "Success",
        message: "Project successfully deleted",
        type: "success",
        duration: 1500
      });
      this.$router.push("/");
    },
    async saveReview(review) {
      review.by = this.loggedinUser
        ? this.loggedinUser
        : {
            _id: 1,
            fullName: "Anonymous",
            imgUrl: "../../assets/png/login.png"
          };
      var reviews = await this.$store.dispatch({
        type: "saveReview",
        review
      });
      this.review = this.getEmptyReview();
    },
    getEmptyReview() {
      return {
        txt: "",
        rate: 5,
        by: this.$store.getters.by,
        about: {
          _id: this.proj._id,
          fullName: this.proj.title,
          imgUrl: this.proj.imgUrls[0]
        }
      };
    },
    setActive(value, ev) {
      if (this.editMode) {
        this.scrollTo(ev, 150);
        return;
      }
      this.active ? this.scrollTo(ev, 400) : this.scrollTo(ev, 150);
      this.active = this.active === value ? "" : value;
    },
    toggleApply() {
      // window.scrollTo(0, 0);
      this.isApplyOpen = !this.isApplyOpen;
      document.body.classList.toggle("apply-open");
    },
    closeApply() {
      this.isApplyOpen = false;
      document.body.classList.remove("apply-open");
    },
    handlePress() {
      if (event.keyCode === 27) {
        this.closeApply();
      }
    },
    scrollTo(ev, dif = 150) {
      window.scrollTo(0, ev.target.offsetTop - dif);
    },
    reset() {
      this.proj = projService.getEmptyProj();
      window.scrollTo(0, 0);
    }
  },
  mounted() {
    document
      .querySelector(".screen")
      .addEventListener("click", this.closeApply);
    document.addEventListener("keydown", this.handlePress);
    eventBus.$on("updateReview", async review => {
      await this.saveReview(review);
    });
  },
  beforeDestroy() {
    document
      .querySelector(".screen")
      .removeEventListener("click", this.closeApply);
    document.removeEventListener("keydown", this.handlePress);
  }
};
</script>
