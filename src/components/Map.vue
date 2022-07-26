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
      :options="{ minZoom: 12, maxZoom: 16, restriction: mapRestriction }"
      mapTypeId='satellite'
    >
      <!-- <GmapMarker
        :key="m.place_id"
        v-for="m in markers"
        :position="m.geometry.location"
        :clickable="true"
        :draggable="true"
        @click="toggleInfoWindow(m)"
      /> -->
      <GmapMarker
        :key="m.sn"
        v-for="m in testLocation"
        :position="{lat: parseFloat(m.SoilLocations[0].latitude), lng: parseFloat(m.SoilLocations[0].longitude)}"
        :clickable="false"
        :draggable="false"
        :icon="{ url: m.model === '絞接式卡車' ? require('@/static/img/final_cat_car_0.png') : m.mdel === '挖土機' ? require('@/static/img/final_volvo_0.png') : require('@/static/img/final_other_0.png')}"
      />
    </GmapMap>
  </div>
</template>

<script>
import { getLocation } from '@/api/index.js'
export default {
  name: 'Map',
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
      mapRestriction: {
        latLngBounds: {
          north: 26.097047150127677,
          south: 24.0637052123361,
          east: 121.6109608468628,
          west: 121.52070915313721
        }
      },
      mapBound: null,
      placeInfo: {},
      service: null,
      placeIdForWindow: '',
      currentMidx: {},
      infoWinCanOpen: true,
      infoContent: {},
      infoWindowPos: null,
      map: null,
      markers: [],
      coodinate: {
        lat: 0,
        lng: 0
      },
      distance: 0,
      testLocation: []
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
    getLocation({})
      .then(res => {
        // console.log('res', res.data.rows)
        this.testLocation.push(res.data.rows[0])
        this.testLocation.forEach(element => console.log(element))
      })
      .catch(error => {
        console.log(error)
      })
    // 取得現在位置
    this.$getLocation({})
      .then(coodinates => {
        this.coodinate = {
          lat: 24.99429702758789,
          lng: 121.52513885498047
        }
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
    // 地圖縮放改變重新取得餐廳列表
    gMapZoomChanged() {
      console.log('zoom')
      this.$refs.mapRef.$mapPromise.then(map => {
        console.log('gMapZoomChanged', map.getZoom())
        // map.fitBounds(this.mapBound)
        // const bounds = map.getBounds()
        // const center = bounds.getCenter()
        // const ne = bounds.getNorthEast()
        // const r = 3963.0
        // const lat1 = center.lat() / 57.2958
        // const lon1 = center.lng() / 57.2958
        // const lat2 = ne.lat() / 57.2958
        // const lon2 = ne.lng() / 57.2958
        // const dis =
        //   r *
        //   Math.acos(
        //     Math.sin(lat1) * Math.sin(lat2) +
        //       Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
        //   )
      })
    },
    // 地圖拖移改變重新取得餐廳列表
    gMapDragEnd() {
      this.$refs.mapRef.$mapPromise.then(map => {
        console.log('gMapDragEnd', map.getBounds())
        // const google = window.google
        // var bounds = new google.maps.LatLngBounds()
        // var location = new google.maps.LatLng(25.017047150127677, 121.6109608468628)
        // var location2 = new google.maps.LatLng(25.06370521233611, 121.53070915313721)
        // bounds.extend(location2)
        // bounds.extend(location)
        // map.fitBounds(bounds)
        // map.setCenter(bounds.getCenter())
      })
    },
    // 點擊地標後call api
    async toggleInfoWindow(marker) {
    }
  }
}
</script>
