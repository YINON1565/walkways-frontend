<template>
  <section @click="setActive" class="flex a-center bet">
    <h2 class="container-link-img flex bet">
      <section>
        <img class="link-img" src="../../assets/svg/link.svg" alt />
        <span>{{title}}</span>
      </section>
    </h2>
  </section>
</template>

<script>
export default {
  name: 'title-link',
  props: { title: String },
  methods: {
    setActive(ev) {
      window.scrollTo(0, ev.target.offsetTop - 150)
    },
  }
};
</script>