<template>
  <div class="map" id="map">
    <GmapMap
      :center="coodinate"
      :zoom="15"
      :style="{ width: width, height: '600px' }"
      ref="mapRef"
      @dragend="gMapDragEnd()"
      @zoom_changed="gMapZoomChanged()"
      id="map"
    >
      <GmapInfoWindow
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      >
        <InfoWindow
          v-if="markers.length >= 1"
          :placeId="placeIdForWindow"
          :placeInfo="placeInfo"
          @open-info-window="openWindow"
        ></InfoWindow>
      </GmapInfoWindow>
      <GmapMarker
        :key="m.place_id"
        v-for="m in markers"
        :position="m.geometry.location"
        :clickable="true"
        :draggable="true"
        @click="toggleInfoWindow(m)"
      />
    </GmapMap>
  </div>
</template>

<script>
import InfoWindow from '@/components/InfoWindow.vue'
import { commonMixin } from '@/common/js/mixins'
export default {
  name: 'Map',
  mixins: [commonMixin],
  components: {
    InfoWindow
  },
  props: {
    // 餐廳列表
    places: {
      type: Array
    },
    // map寬度
    width: {
      type: String
    },
    // 列表內被點選的餐廳
    placeIdInList: {
      type: String
    }
  },
  data() {
    return {
      placeInfo: {},
      service: null,
      placeIdForWindow: '',
      currentMidx: {},
      infoWinCanOpen: true,
      infoContent: {},
      infoWindowPos: null,
      infoWinOpen: false,
      map: null,
      markers: [],
      coodinate: {
        lat: 0,
        lng: 0
      },
      distance: 0
    }
  },
  watch: {
    // 由餐廳列表回傳的placeId
    placeIdInList: {
      immediate: true,
      handler(val) {
        this.placeIdForWindow = val
        this.currentMidx = this.markers.find(each => each.place_id === val)
      }
    }
  },
  created() {
    // 取得現在位置
    this.$getLocation({})
      .then(coodinates => {
        this.coodinate = coodinates
        this.getPlace(1500, false)
      })
      .catch(error => alert(error))
  },
  mounted() {},
  computed: {
    // 地圖中心位置
    mapCoodinate() {
      if (!this.map) {
        return {
          lat: 0,
          lng: 0
        }
      }
      return {
        lat: this.map.getCenter().lat(),
        lng: this.map.getCenter().lng()
      }
    }
  },
  methods: {
    // 取得所有餐廳與現在位置的距離
    async getRoutes(placeInfo) {
      this.$emit('set-route', [])
      // const google = window.google
      // this.$refs.mapRef.$mapPromise.then(map => {
      //   console.log('getRoutes map', map)
      //   const center = map.getBounds().getCenter()
      //   this.service = new google.maps.DirectionsService()
      //   this.service.route(
      //     {
      //       origin: center,
      //       destination: placeInfo.geometry.location,
      //       travelMode: 'DRIVING'
      //     },
      //     (results, status) => {
      //       if (status === google.maps.DirectionsStatus.OK) {
      //         console.log('route status OK', results)
      //       } else if (
      //         status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT
      //       ) {
      //         console.log('route status OVER_QUERY_LIMIT ')
      //       }
      //     }
      //   )
      // })

      for (let i = 0; i < this.markers.length; i++) {
        if ((i + 1) % 10 === 0) {
          await setTimeout(() => {
            console.log('i setTimeout', i)
            // this.$refs.mapRef.$mapPromise.then(map => {
            //   const center = map.getBounds().getCenter()
            //   this.service = new google.maps.DirectionsService()
            //   this.service.route(
            //     {
            //       origin: center,
            //       destination: this.markers[i].geometry.location,
            //       travelMode: 'DRIVING'
            //     },
            //     (results, status) => {
            //       if (status === google.maps.DirectionsStatus.OK) {
            //         console.log('route status OK', results)
            //       } else if (
            //         status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT
            //       ) {
            //         console.log('route status OVER_QUERY_LIMIT ')
            //       }
            //     }
            //   )
            // })
          }, 1000)
        } else {
          console.log('i', i)
          // this.$refs.mapRef.$mapPromise.then(map => {
          //   const center = map.getBounds().getCenter()
          //   this.service = new google.maps.DirectionsService()
          //   this.service.route(
          //     {
          //       origin: center,
          //       destination: this.markers[i].geometry.location,
          //       travelMode: 'DRIVING'
          //     },
          //     (results, status) => {
          //       if (status === google.maps.DirectionsStatus.OK) {
          //         console.log('route status OK', results)
          //       } else if (
          //         status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT
          //       ) {
          //         console.log('route status OVER_QUERY_LIMIT ')
          //       }
          //     }
          //   )
          // })
        }
      }
    },
    // 取得餐廳詳細資訊後開啟InfoWindow
    openWindow(placeInfo) {
      if (Object.keys(placeInfo).length !== 0) {
        this.infoWindowPos = placeInfo.geometry.location
        this.$refs.mapRef.$mapPromise.then(map => {
          map.panTo(placeInfo.geometry.location)
        })
        this.infoWinOpen = true
      } else {
        this.infoWinOpen = false
      }
    },
    // 地圖縮放改變重新取得餐廳列表
    gMapZoomChanged() {
      this.$refs.mapRef.$mapPromise.then(map => {
        const bounds = map.getBounds()
        const center = bounds.getCenter()
        const ne = bounds.getNorthEast()
        const r = 3963.0
        const lat1 = center.lat() / 57.2958
        const lon1 = center.lng() / 57.2958
        const lat2 = ne.lat() / 57.2958
        const lon2 = ne.lng() / 57.2958
        const dis =
          r *
          Math.acos(
            Math.sin(lat1) * Math.sin(lat2) +
              Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
          )
        this.infoWinOpen = false
        this.getPlace(Math.round(dis * 1000), true)
      })
    },
    // 地圖拖移改變重新取得餐廳列表
    gMapDragEnd() {
      this.infoWinOpen = false
      this.getPlace(1500, true)
    },
    // 點擊地標後call api
    async toggleInfoWindow(marker) {
      this.infoWinOpen = !this.infoWinOpen
      this.infoWindowPos = marker.geometry.location
      await this.getPlaceInfo(marker.place_id)
    },
    // 取得附近餐廳
    getPlace(radius, newCenter) {
      this.markers = []
      const google = window.google
      this.$refs.mapRef.$mapPromise.then(map => {
        this.service = new google.maps.places.PlacesService(map)
        this.service.nearbySearch(
          {
            location: newCenter
              ? map.getBounds().getCenter()
              : { lat: this.coodinate.lat, lng: this.coodinate.lng },
            radius: radius,
            type: 'restaurant'
          },
          (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results
            ) {
              // 取得周邊餐廳
              this.markers = results
              this.getRoutes()
            }
          }
        )
      })
    },
    // 將placeId 傳給InfoWinow 取得餐廳詳細資訊
    getPlaceInfo(placeId) {
      if (this.currentMidx !== placeId) {
        this.placeIdForWindow = placeId
        const google = window.google
        this.$refs.mapRef.$mapPromise.then(map => {
          this.service = new google.maps.places.PlacesService(map)
          const request = {
            placeId: placeId,
            fields: [
              'name',
              'rating',
              'formatted_phone_number',
              'formatted_address',
              'geometry',
              'place_id'
            ]
          }

          this.service.getDetails(request, (place, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              place &&
              place.geometry &&
              place.geometry.location
            ) {
              this.placeInfo = place
              console.log('place', place)
            }
          })
        })
      }
    }
  }
}
</script>
