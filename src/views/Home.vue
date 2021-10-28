<template>
  <div class="container" id="container">
    <!-- <div :class="{ spinner: true, show: places.length < 1, home: true }">
      <div class="loader">
        <b-spinner />
        <p class="loader_text">搜尋中....請稍後</p>
      </div>
    </div> -->
    <div class="row" style="z-index: 2;">
      <div class="row col-md-12 col-sm-5 col-5">
        <div
          class="col-md-3 col-sm-12 col-12 justify-content-center"
          style="display:flex;"
        >
          <!-- 是否依照距離排列勾選框 -->
          <b-form-checkbox
            v-model="sortRadio.find(each => each.type === 'distance').check"
            @change="setSortByType('distance')"
            ><b>{{ sortRadio.find(each => each.type === 'distance').label }}</b>
          </b-form-checkbox>
          <!-- 升冪/降冪 -->
          <b-form-checkbox
            v-model="sortRadio.find(each => each.type === 'distance').sortCheck"
            name="check-button"
            switch
            @change="setSortByDescOrAsc('distance')"
            :disabled="!sortRadio.find(each => each.type === 'distance').check"
          >
            <b>{{
              sortRadio.find(each => each.type === 'distance').sortLabel
            }}</b>
          </b-form-checkbox>
        </div>
        <div
          class="col-md-3 col-sm-12 col-12 justify-content-center"
          style="display:flex;"
        >
          <!-- 是否依照價錢排列勾選框 -->
          <b-form-checkbox
            v-model="sortRadio.find(each => each.type === 'price_level').check"
            @change="setSortByType('price_level')"
            ><b>{{
              sortRadio.find(each => each.type === 'price_level').label
            }}</b>
          </b-form-checkbox>
          <!-- 升冪/降冪 -->
          <b-form-checkbox
            v-model="
              sortRadio.find(each => each.type === 'price_level').sortCheck
            "
            name="check-button"
            switch
            @change="setSortByDescOrAsc('price_level')"
            :disabled="
              !sortRadio.find(each => each.type === 'price_level').check
            "
          >
            <b>{{
              sortRadio.find(each => each.type === 'price_level').sortLabel
            }}</b>
          </b-form-checkbox>
        </div>
        <div
          class="col-md-3 col-sm-12 col-12 justify-content-center"
          style="display:flex;"
        >
          <!-- 是否依照評分排列勾選框 -->
          <b-form-checkbox
            :checked="sortRadio.find(each => each.type === 'rating').check"
            v-model="sortRadio.find(each => each.type === 'rating').check"
            @change="setSortByType('rating')"
            ><b>{{ sortRadio.find(each => each.type === 'rating').label }}</b>
          </b-form-checkbox>
          <!-- 升冪/降冪 -->
          <b-form-checkbox
            v-model="sortRadio.find(each => each.type === 'rating').sortCheck"
            name="check-button"
            switch
            @change="setSortByDescOrAsc('rating')"
            :disabled="!sortRadio.find(each => each.type === 'rating').check"
          >
            <b>{{
              sortRadio.find(each => each.type === 'rating').sortLabel
            }}</b>
          </b-form-checkbox>
        </div>
        <div
          class="col-md-3 col-sm-12 col-12 justify-content-center"
          style="display:flex;"
        >
          <!-- 是否依照名稱排列勾選框 -->
          <b-form-checkbox
            v-model="sortRadio.find(each => each.type === 'name').check"
            @change="setSortByType('name')"
            ><b>{{ sortRadio.find(each => each.type === 'name').label }}</b>
          </b-form-checkbox>
          <!-- 升冪/降冪 -->
          <b-form-checkbox
            v-model="sortRadio.find(each => each.type === 'name').sortCheck"
            name="check-button"
            switch
            @change="setSortByDescOrAsc('name')"
            :disabled="!sortRadio.find(each => each.type === 'name').check"
          >
            <b>{{ sortRadio.find(each => each.type === 'name').sortLabel }}</b>
          </b-form-checkbox>
        </div>
      </div>
      <div
        class="row col-md-2 col-sm-7 col-7 order-1 order-sm-1 order-md-2"
        :style="{
          height: listHeight,
          overflowY: 'auto',
          paddingRight: '0',
          margin: '0'
        }"
      >
        <div
          class="col-md-12 col-sm-6 col-6 place_item"
          :key="m.place_id"
          v-for="m in places"
        >
          <button
            type="button"
            class="btn btn-link"
            @click="onClickItem(m.place_id)"
          >
            {{ m.name }}
          </button>
        </div>
      </div>
      <div
        class="row col-md-10 col-sm-12 col-12 order-2 order-sm-2 order-md-1"
        id="map_container"
      >
        <Map
          :center="{ lat, lng }"
          :streetViewControl="false"
          :mapTypeControl="false"
          :fullscreenControl="true"
          :zoomControl="true"
          :width="mapWidth"
        ></Map>
        <!-- <Map :places="places" :width="mapWidth"
      :placeIdInList="placeIdInList" @set-route="setRoute" ></Map> -->
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixin } from '@/common/js/mixins'
import Map from '@/components/Map.vue'
export default {
  name: 'Home',
  mixins: [commonMixin],
  components: {
    Map
  },
  data() {
    return {
      lat: 25.0325917,
      lng: 121.5624999,
      restaurants: [],
      isLoading: true,
      sortRadio: [
        {
          type: 'distance',
          check: false,
          order: 3,
          label: '距離',
          sortLabel: '由遠到近',
          sortCheck: false
        },
        {
          type: 'price_level',
          check: false,
          order: 3,
          label: '價錢',
          sortLabel: '由高到低',
          sortCheck: false
        },
        {
          type: 'rating',
          check: false,
          order: 3,
          label: '評分',
          sortLabel: '由低到高',
          sortCheck: true
        },
        {
          type: 'name',
          check: false,
          order: 3,
          label: '名稱',
          sortLabel: '筆畫多到少',
          sortCheck: false
        }
      ],
      mapWidth: '',
      listHeight: '600px',
      originalPlaces: [], // 附近的餐廳(未經過排序)
      places: [], // 附近的餐廳(有經過排序)
      placeIdInList: '' // 選單中選取的地點
    }
  },
  created() {},
  mounted() {
    // 取得外框寬度給予google map
    this.mapWidth =
      document.getElementById('map_container').clientWidth - 15 + 'px'
    // 視窗大小改變時 改變餐廳列表之高度
    window.onresize = () => {
      this.mapWidth =
        document.getElementById('map_container').clientWidth - 15 + 'px'
      if (window.innerWidth < 768) {
        this.listHeight = '300px'
      } else {
        this.listHeight = '600px'
      }
    }
  },
  methods: {
    // 排序名稱 因包含中文字無法直接使用Array.sort()
    compareFunction(array, sort) {
      array = array.sort(function compareFunction(item1, item2) {
        return item1.name.localeCompare(item2.name)
      })
      array = array.sort((x, y) => {
        x.name.localeCompare(y.name)
      })
      const numAry = []
      const eAry = []
      const cAry = []
      array.forEach(each => {
        if (/\d+/.test(each.name.toString().substring(0, 1))) {
          numAry.push(each)
        } else if (/[a-zA-Z]+/.test(each.name.toString().substring(0, 1))) {
          eAry.push(each)
        } else {
          cAry.push(each)
        }
      })
      const returnAry = []
        .concat(numAry)
        .concat(eAry)
        .concat(cAry)
      if (sort === 'asc') {
        return returnAry
      } else {
        return returnAry.reverse()
      }
    },
    // 改變排序規則
    setSortByType(type) {
      this.placeIdInList = ''
      this.sortRadio.forEach(each => {
        each.check = false
      })
      this.sortRadio.find(
        each => each.type === type
      ).check = !this.sortRadio.find(each => each.type === type).check
      this.sortPlaceList(type)
    },
    // 改變升冪降冪排序方式
    setSortByDescOrAsc(type) {
      this.placeIdInList = ''
      this.sortRadio.find(
        each => each.type === type
      ).sortCheck = !this.sortRadio.find(each => each.type === type).sortCheck
      this.sortPlaceList(type)
    },
    sortPlaceList(type) {
      // 依照勾選順序進行排序
      let sortPlaces = []
      this.originalPlaces.forEach(each => sortPlaces.push(each))
      this.sortRadio.forEach(each => {
        if (each.check) {
          if (each.type !== 'name') {
            if (!each.sortCheck) {
              sortPlaces = sortPlaces.sort((x, y) => x[type] - y[type])
            } else {
              sortPlaces = sortPlaces.sort((x, y) => y[type] - x[type])
            }
          } else {
            if (!each.sortCheck) {
              sortPlaces = this.compareFunction(sortPlaces, 'asc')
            } else {
              sortPlaces = this.compareFunction(sortPlaces, 'desc')
            }
          }
        }
      })
      this.places = sortPlaces
    },
    // 點選餐廳列表項目 開啟IndoWindow顯示餐廳詳細資訊
    onClickItem(placeId) {
      this.placeIdInList = placeId
    },
    // 將現在位置到餐廳的距離加入餐廳列表用以排序
    setRoute(val) {
      this.places = val
      this.places.forEach(each => {
        each.distance = each.directionsInfo.routes[0].legs[0].distance.value
        each.distanceText = each.directionsInfo.routes[0].legs[0].distance.text
        if (typeof each.price_level === 'undefined') {
          each.price_level = 0
        }
      })
      this.originalPlaces = this.places
    }
  }
}
</script>
<style></style>
