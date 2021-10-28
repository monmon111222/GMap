import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGeoLocation from 'vue-browser-geolocation'
import * as VueGoogleMaps from 'vue2-google-maps'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueResource from 'vue-resource'
import './styles/style.css'
Vue.config.productionTip = false
Vue.use(VueGeoLocation)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDcmVP-lB6GPsXHZkkYYTB818azw8FPf_E',
    libraries: ['geometry', 'places'],
    region: 'TW',
    lanuage: 'zh-TW'
  },
  installComponents: true
})
Vue.use(VueResource)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
