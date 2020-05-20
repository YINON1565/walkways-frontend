<template>
  <div class="container-map" v-if="array">
    <!-- <section v-if="object && object.username">
      <transition name="fade">
        <img
          v-if="isShow"
          :style="`top:${y}px; left:${x}px`"
          class="img-on-map-container"
          :src="object.imgUrl"
          alt
        />
      </transition>
    </section> -->
    <!-- <section v-else-if="object"> -->
    <section v-if="array.length > 1">
      <transition name="fade">
        <marker-card
          :proj="object"
          v-if="isShow"
          title="Click to view project details"
          @click.native="openDetails(object._id)"
          class="img-on-map-container"
          :style="`top:${y}px; left:${x}px`"
        />
      </transition>
    </section>
    <GmapMap ref="mapRef" class="map" :center="center" :zoom="zoom" map-type-id="terrain">
      <!-- <GmapMap class="map" v-if="position" :center="position" :zoom="zoomSize" map-type-id="terrain"> -->
      <GmapMarker
        :class="{'not-allowed': array.length === 1}"
        :key="index"
        v-for="(m, index) in array"
        :ref="`marker${index}`"
        :position="{lat:m.position.lat,lng:m.position.lng}"
        :clickable="true"
        :draggable="false"
        :icon="markerOptions"
        @click="openImg(m, index, $event)"
      />
      <!-- <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :ref="`marker${index}`"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :icon="markerOptions"
        @click="openImg(m, index, $event)"
      />-->
    </GmapMap>
  </div>
</template>
<script>
import markerCard from "./marker-card.vue";

const mapMarker = require("../assets/png/airport.png");

export default {
  props: {
    array: Array
  },
  center: {},
  zoom: null,
  // props: {
  //   position: null,
  //   markers: Array,
  //   zoomSize: null
  // },
  data() {
    return {
      markerOptions: {
        url: mapMarker,
        size: { width: 60, height: 90, f: "px", b: "px" },
        scaledSize: { width: 40, height: 45, f: "px", b: "px" }
      },
      object: null,
      x: 0,
      y: 0,
      isShow: false
    };
  },
  created() {
    
    this.center = {
      lat: 33.886917,
      lng: 9.537499
    };
    this.zoom = 1.5;
    // this.setZoomAndCenter();
  },
  methods: {
    setZoomAndCenter() {

      if (this.array) {
        if (this.array.length > 1) {
          this.center = {
            lat: 33.886917,
            lng: 9.537499
          };
          this.zoom = 1.5;
        } else {
          this.center = {
            lat: this.array[0].position.lat,
            lng: this.array[0].position.lng
          };
          this.zoom = 12;
        }
      setTimeout(() => { 
        this.$refs.mapRef.$mapPromise.then(map => {
          map.panTo(this.center);
          map.setZoom(this.zoom);
        });
       }, 1);

      }
    },
    openImg(m, index, $event) {
      this.$refs.mapRef.$mapPromise.then(map => {
        map.panTo({ lat: m.position.lat, lng: m.position.lng });
      });
      if (this.zoom < 12) {
        var x = setInterval(() => {
          this.updateZoom();
          if (this.zoom >= 12) clearInterval(x);
        }, 40);
      }

      setTimeout(() => {
        this.x = $event.tb.screenX;
        this.y = $event.tb.screenY;
        this.isShow = true;
        this.object = m;
      }, 1);
    },
    updateZoom() {
      this.zoom = this.zoom + 0.5;
      this.$refs.mapRef.$mapPromise.then(map => {
        map.setZoom(this.zoom);
      });
    },
    holdImg() {
      this.isShow = true;
    },
    handlePress(event) {
      if (!this.isShow) return
      if (event.keyCode === 27 ) {
        this.closeImg();
      }
      if (event.keyCode === 13) {
        this.openDetails(this.proj._id);
      }
    },
    closeImg() {
      if (!this.isShow) return;
      this.setZoomAndCenter();
      this.isShow = false;
    },
    openDetails(id) {
      this.$router.push("/proj/" + id);
    }
  },
  mounted() {
    document.addEventListener("click", this.closeImg);
    document.addEventListener("keydown", this.handlePress);
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeImg);
    document.removeEventListener("keydown", this.handlePress);
  },
  components: {
    markerCard
  },
  watch: {
   array: {
      handler() {
        if (this.array && this.isShow) return
        this.setZoomAndCenter();
      },
     deep: true
    }
  }
};
</script>
