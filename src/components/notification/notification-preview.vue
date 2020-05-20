<template>
  <section class="notification-preview">
    <div
      @click="$emit('setActive', {val:notification.from._id, ev:$event})"
      class="flex a-center bet"
    >
      <h3 class="container-link-img flex bet">
        <section>
          <span>{{notification.from.fullName}}</span>
        </section>
        <img
          :class="{'arrow-down': active === notification.from._id}"
          src="../../assets/svg/downloading.svg"
          alt="⇧"
        />
      </h3>
    </div>
    <transition name="fade">
      <section v-if="active === notification.from._id">
        <div class="notification-details">
          <p>
            About:
            <span>{{notification.proj.title}}</span>
          </p>
          <p v-if="notification.proj.createdById === userId">
            Members intrested:
            <span>{{' ' + notification.memebersApllied}}</span>
          </p>
          <!-- <p v-if="notification.txt">{{notification.txt}}</p> -->
          <p>
            Message:
            <span>{{notification.txt || 'I heard about your project and I really like it, can I sign up for it?'}}</span>
          </p>
        </div>
        <div class="notification-btn">
          <section v-if="notification.proj.createdById === userId" class="flex">
            <button @click="onApprove">
              Approve
              <img src="../../assets/svg/ok2.svg" alt />
            </button>
            <button @click="onDecline">
              Decline
              <img src="../../assets/svg/close2.svg" alt />
            </button>
          </section>
          <img
            v-else
            src="../../assets/svg/bin.svg"
            alt="remove"
            title="Delete this message"
            @click.prevent="deleteNotification"
          />
        </div>
      </section>
    </transition>
  </section>
</template>

<script>
import { eventBus } from "../../services/eventbus-service.js";
import { utilService } from "../../services/util.service.js";
export default {
  props: {
    notification: Object,
    userId: String,
    active: String
  },
  methods: {
    deleteNotification() {
      eventBus.$emit("deleteNotification", this.notification);
    },
    onApprove() {
      const approve = {
        _id: utilService.makeId(),
        proj: this.notification.proj,
        from: this.notification.to,
        to: this.notification.from,
        txt:
          "We are pleased to inform you that you have been accepted for our project..!",
        isApproved: true,
        memebersApllied: this.notification.memebersApllied
      };
      eventBus.$emit("onApprove", approve);
    },
    onDecline() {
      const decline = {
        _id: utilService.makeId(),
        proj: this.notification.proj,
        from: this.notification.to,
        to: this.notification.from,
        txt: "Sorry, your application was disapproved..!",
        isApproved: false
      };
      eventBus.$emit("onDecline", decline);
    }
  }
};
</script>