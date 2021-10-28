<template>
  <div class="info_window col-12">
    <div
      :class="{
        spinner: true,
        show: Object.keys(info).length == 0,
        info_window: true
      }"
    >
      <div class="loader">
        <b-spinner small />
        <p class="loader_text">請稍後</p>
      </div>
    </div>
    <div class="col-12" style="text-align: left;">店名: {{ info.name }}</div>
    <div class="col-12" style="text-align: left;">
      地址: {{ info.formatted_address }}
    </div>
    <div class="col-12" style="text-align: left;">
      電話: {{ info.formatted_phone_number }}
    </div>
    <div class="col-12" style="text-align: left;">營業時間:</div>
    <div
      class="col-12"
      style="text-align: left;"
      :key="index"
      v-for="(m, index) in openingHours.weekday_text"
    >
      {{ m }}
    </div>
    <div class="col-12" style="text-align: left;">評分: {{ info.rating }}</div>
  </div>
</template>

<script>
import { commonMixin } from '@/common/js/mixins'
export default {
  name: 'InfoWindow',
  mixins: [commonMixin],
  props: {
    placeId: {
      type: String
    },
    placeInfo: {
      type: Object
    }
  },
  data() {
    return {
      service: null,
      info: {},
      openingHours: ['無提供']
    }
  },
  watch: {
    // 當餐廳列表項目被點選或地圖上圖標被點選時，取得該餐廳詳細資訊
    placeInfo: {
      immediate: true,
      handler(val) {
        console.log('watch placeInfo')
        if (val.place_id) {
          this.info = val
          if (typeof this.info.price_level === 'undefined') {
            this.info.price_level = 0
          }
          if (typeof this.info.opening_hours !== 'undefined') {
            this.openingHours = this.info.opening_hours
          }
          this.$emit('open-info-window', val)
        }
      }
    }
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {}
}
</script>
