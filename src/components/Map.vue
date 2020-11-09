<template>
  <div class="map" id="map">
    <GmapMap
      :center="coodinate"
      :zoom="15"
      :style="{width: width, height: '600px'}"
      ref="mapRef"
      @dragend="gMapDragEnd()"
      @zoom_changed="gMapZoomChanged()"
    >
    <GmapInfoWindow :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
      <InfoWindow v-if="markers.length>=1" :placeId="placeIdForWindow"
        @open-info-window="openWindow"></InfoWindow>
    </GmapInfoWindow>
    <GmapMarker
    :key="m.place_id"
    v-for="(m) in markers"
    :position="m.geometry.location"
    :clickable="true"
    :draggable="true"
    @click="toggleInfoWindow(m,m.place_id)"
    />
    </GmapMap>
  </div>
</template>

<script>
import InfoWindow from '@/components/InfoWindow.vue'
import { commonMixin } from '@/common/js/mixins'
import { gmapApi } from 'vue2-google-maps'
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
  data () {
    return {
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
      }
    }
  },
  watch: {
    // 由餐廳列表回傳的placeId
    placeIdInList: {
      immediate: true,
      handler (val) {
        this.placeIdForWindow = val
        this.currentMidx = this.markers.find(each => each.place_id === val)
      }
    }
  },
  created () {
    // 取得現在位置
    this.$getLocation({})
      .then(coodinates => {
        this.coodinate = coodinates
        this.getPlace(1500)
      })
      .catch(error => alert(error))
  },
  mounted () {
    this.$refs.mapRef.$mapPromise.then(map => {
      this.map = map
    })
  },
  computed: {
    google: gmapApi,
    // 地圖中心位置
    mapCoodinate () {
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
    async getRoutes () {
      this.$emit('set-route', [])
      const URL = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json'
      let originCoodinate = ''
      if (this.mapCoodinate.lat === 0) {
        originCoodinate += this.coodinate.lat + ','
      } else {
        originCoodinate += this.mapCoodinate.lat + ','
      }
      if (this.mapCoodinate.lng === 0) {
        originCoodinate += this.coodinate.lng
      } else {
        originCoodinate += this.mapCoodinate.lng
      }
      for (let i = 0; i < this.markers.length; i++) {
        const destinationCoodinate = this.markers[i].geometry.location.lat + ',' + this.markers[i].geometry.location.lng
        if ((i + 1) % 10 === 0) {
          await setTimeout(() => {
            this.get(URL, { origin: originCoodinate, destination: destinationCoodinate, travelModea: 'DRIVING', key: 'API KEY' }, r => {
              if (r.status === 'OK') {
                this.markers[i].directionsInfo = r
                if (i === this.markers.length - 1) {
                  this.$emit('set-route', this.markers)
                }
              }
            }, c => {
              alert(c.statusText)
            })
          }, 1000)
        } else {
          await this.get(URL, { origin: originCoodinate, destination: destinationCoodinate, travelModea: 'DRIVING', key: 'API KEY' }, r => {
            if (r.status === 'OK') {
              this.markers[i].directionsInfo = r
            }
          }, c => {
            alert(c.statusText)
          })
        }
      }
    },
    // 取得餐廳詳細資訊後開啟InfoWindow
    openWindow (placeInfo) {
      if (Object.keys(placeInfo).length !== 0) {
        this.infoWindowPos = placeInfo.geometry.location
        this.map.setCenter(placeInfo.geometry.location)
        this.infoWinOpen = true
      } else {
        this.infoWinOpen = false
      }
    },
    // 地圖縮放改變重新取得餐廳列表
    gMapZoomChanged () {
      const bounds = this.map.getBounds()
      const center = bounds.getCenter()
      const ne = bounds.getNorthEast()
      const r = 3963.0
      const lat1 = center.lat() / 57.2958
      const lon1 = center.lng() / 57.2958
      const lat2 = ne.lat() / 57.2958
      const lon2 = ne.lng() / 57.2958
      const dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1))
      this.infoWinOpen = false
      this.getPlace(Math.round(dis * 1000))
    },
    // 地圖拖移改變重新取得餐廳列表
    gMapDragEnd (evnt) {
      this.infoWinOpen = false
      this.getPlace(1500)
    },
    // 點擊地標後call api
    async toggleInfoWindow (marker, index) {
      this.infoWinOpen = !this.infoWinOpen
      this.infoWindowPos = marker.geometry.location
      await this.getPlaceInfo(marker.place_id)
    },
    // 取得附近餐廳
    getPlace (radius) {
      const URL = 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json'
      let newCoodinate = ''
      if (this.mapCoodinate.lat === 0) {
        newCoodinate += this.coodinate.lat + ','
      } else {
        newCoodinate += this.mapCoodinate.lat + ','
      }
      if (this.mapCoodinate.lng === 0) {
        newCoodinate += this.coodinate.lng
      } else {
        newCoodinate += this.mapCoodinate.lng
      }
      this.get(URL, { location: newCoodinate, radius: radius, type: 'restaurant', key: 'API KEY' }, r => {
        this.markers = r.results
        this.getRoutes()
      }, c => {
        alert(c.statusText)
      })
    },
    // 將placeId 傳給InfoWinow 取得餐廳詳細資訊
    getPlaceInfo (placeId) {
      if (this.currentMidx !== placeId) {
        this.placeIdForWindow = placeId
      }
    }
  }
}
</script>
