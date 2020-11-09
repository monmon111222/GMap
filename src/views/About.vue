<template>
  <div>
    <GmapMap
      ref="gmap"
      :center="getCenter()"
      :zoom="11"
      style="height: 500pxmargin: 0px -8px"
      class="no-padding"
      :options="getOptions()"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in getMarkers()"
        :position="m.position"
        :clickable="true"
        :draggable="false"
        :title="m.title"
        :icon="m.icon"
        @click="clicked()"
      />
    </GmapMap>
  </div>
</template>
<script>
export default {
  name: 'SiteMap',
  props: [],
  methods: {
    getOptions () {
      return {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false
      }
    },
    clicked () {
      // after click
    },
    getCenter () {
      return {
        lat: 25.041305599999998,
        lng: 121.5463424
      }
    },
    getMarkers () {
      // generating markers for site map
      var markers = []
      // remove this after lat long received from api.
      const tempLatLong = [
        { lat: 37.9068361, lng: -122.116971 },
        { lat: 37.9168362, lng: -122.076972 },
        { lat: 37.9268363, lng: -122.136973 },
        { lat: 37.9368364, lng: -122.146974 },
        { lat: 37.9468365, lng: -122.106975 },
        { lat: 37.9568366, lng: -122.166976 },
        { lat: 37.9668367, lng: -122.176977 },
        { lat: 37.9768368, lng: -122.016978 },
        { lat: 37.9868369, lng: -122.196979 }
      ]
      for (let i = 0; i < tempLatLong.length; i++) {
        markers.push({
          position: tempLatLong[i],
          title: 'test title'
        })
      }
      return markers
    }
  },
  components: {},
  created () {},
  mounted () {
  }
}
</script>
<style scoped></style>
