<template>
  <transition name="fade">
    <div class="user-edit">
      <form @submit.prevent="updateUser" v-if="user">
        <input type="text" v-model="user.username" placeholder="Username" required />
        <input type="password" v-model="user.password" placeholder="Password" required />
        <input type="text" v-model="user.fullName" placeholder="FullName" required />
        <label class="proj-edit-upload-img">
          <input @change="uploadImg" type="file" hidden />
          <img :src="user.imgUrl" />
          <p class="proj-edit-upload-txt">Upload your own!</p>
        </label>
        <button>Update</button>
      </form>
    </div>
  </transition>
</template>

<script>
import { userService } from "../../services/user.service.js";

export default {
  data() {
    return {
      user: null
    };
  },
  async created() {
    const userId = this.$route.params.id;

    this.user = await userService.getById(userId);
  },
  methods: {
    async updateUser() {
      var user = await this.$store.dispatch({
        type: "updateUser",
        user: this.user
      });
      this.$router.push("/login");
    },
    async uploadImg(ev) {
      var imgUrl = await this.$store.dispatch({
        type: "addImg",
        imgEv: ev
      });
      this.user.imgUrl = imgUrl;
    }
  }
};
</script>