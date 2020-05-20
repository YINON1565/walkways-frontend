<template>
  <section class="notification-container" v-if="notifications.length">
    <section class="container-title flex a-center bet">
      <img
        src="../../assets/svg/close.svg"
        @click.stop="$emit('toggleNotifications')"
        title="Close"
        class="close-popap-img pointer"
      />
      <h3>Notifications</h3>
    </section>
    <section class="notification-list">
        <notification-preview
          class="notification-preview"
          v-for="notification in notifications"
          :key="notification._id"
          :notification="notification"
          :userId="userId"
          :active="active" 
          @setActive="setActive"
        />
    </section>
  </section>
</template>

<script>
import notificationPreview from "./notification-preview.vue";

export default {
  props: {
    notifications: Array,
    userId: String
  },
  data() {
    return {
      active: '',
    }
  },
  methods: {
    scrollTo(ev, diff) {
      window.scrollTo(0, ev - diff);
    },
    setActive(emiter){
      this.active ? this.scrollTo(emiter.ev.target.offsetTop, 400) : this.scrollTo(emiter.ev.target.offsetTop, 150);
      this.active = this.active === emiter.val ? "" : emiter.val;     
    }
  },
  components: {
    notificationPreview
  }
};
</script>