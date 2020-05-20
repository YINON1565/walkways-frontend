<template>
  <transition name="fade">
    <div class="proj-apply">
      <section class="container-title flex bet">
        <img
          src="../../assets/svg/close.svg"
          @click.stop="$emit('toggleApply')"
          title="Close"
          class="close-popap-img pointer"
        />
        <h1>Apply now</h1>
      </section>
      <form class="form-apply" @submit.prevent="applyToProj">
        <el-input
          class="input-txt-apply"
          type="textarea"
          :autosize="{ minRows: 3}"
          placeholder="Write something about yourelf :)"
          v-model="request.txt"
        ></el-input>
        <el-input-number
          class="input-number-apply"
          v-model="request.memebersApllied"
          :min="1"
          :max="this.proj.membersNeeded"
        ></el-input-number>
        <button>Send request!</button>
      </form>
    </div>
  </transition>
</template>

<script>
import socketService from "../../services/socket.service.js";
import { utilService } from "../../services/util.service.js";
import { eventBus } from "../../services/eventbus-service.js";

export default {
  name: "projApply",
  props: {
    proj: Object,
    user: Object
  },
  data() {
    return {
      request: {}
    };
  },
  created() {
    this.request = {
        _id: utilService.makeId(),
        proj: {
          _id: this.proj._id,
          createdById: this.proj.createdBy._id,
          title: this.proj.title
        },
        from: {
          _id: this.user._id,
          fullName: this.user.fullName
        },
        to: {
          _id: this.proj.createdBy._id,
          fullName: this.proj.createdBy.fullName
        },
        memebersApllied: null,
        txt: null,
        isApproved: false
      }
  },
  methods: {
    applyToProj() {
      socketService.emit("applyToProj", this.request);
      this.$emit("toggleApply");
    }
  }
};
</script>

