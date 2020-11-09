import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

export default {
  // inject: ['app'],
  data () {
    return {}
  },
  methods: {
    async getAsync (name, model) {
      const json = await this.$http.get(name,
        { params: model, headers: { Authorization: `Bearer ${this.$keycloak.token}`, 'X-Requested-With': 'None' } })
      return json
    },
    async postAsync (name, model) {
      const json = await this.$http.post(name, model, {
        headers: { Authorization: `Bearer ${this.$keycloak.token}`, 'X-Requested-With': 'None' }
      })
      return json
    },
    async get (name, model, callback, errorCallback) {
      return this.$http.get(name, {
        params: model
      }).then(response => {
        if (callback) {
          callback(response.data)
        }
      }).catch(e => {
        if (errorCallback) {
          errorCallback(e)
        }
      })
    },
    async post (name, model, callback, errorCallback) {
      return this.$http.post(name, model, {
        headers: { Authorization: `Bearer ${this.$keycloak.token}` }
      }).then(response => {
        if (callback) {
          callback(response.data)
        }
      }).catch(e => {
        if (errorCallback) {
          errorCallback(e)
        }
      })
    },
    downloadFile (name, model, callback) {
      return this.$http.download.get(name, {
        params: model, headers: { Authorization: `Bearer ${this.$keycloak.token}` }
      }).then(callback)
    },
    put (name, model, callback) {
      return this.$http
        .put(name, model, { headers: { Authorization: `Bearer ${this.$keycloak.token}` } })
        .then(response => {
          // 時辰問題針對302在Ajax無法正確轉頁先暴力解決
          if (response && response.request && response.request.responseURL && response.request.responseURL.indexOf('/cascustomerlogin') !== -1) {
            location.reload()
          }
          if (callback) {
            callback(response.data)
          }
        })
    },
    delete (name, model, callback) {
      return this.$http
        .delete(name, {
          params: model,
          headers: { Authorization: `Bearer ${this.$keycloak.token}` }
        })
        .then(response => {
          // 時辰問題針對302在Ajax無法正確轉頁先暴力解決
          if (response && response.request && response.request.responseURL && response.request.responseURL.indexOf('/cascustomerlogin') !== -1) {
            location.reload()
          }
          if (callback) {
            callback(response.data)
          }
        })
    },
    isAllow (itemCode) {
      return this.$store.getters.getApplicationItemValue({
        path: this.$router.currentRoute.path,
        itemCode: itemCode
      }) === 'Y'
    },
    successMessage (name) {
      this.$q.notify({
        color: 'green',
        icon: 'warning',
        // position: 'top-right',
        position: 'top',
        message: name,
        timeout: 1200
      })
    },
    warningMessage (args) {
      this.$q.notify({
        color: args.color ? args.color : 'orange',
        icon: args.icon ? args.icon : 'warning',
        positionL: args.position ? args.position : 'bottom',
        message: args.message,
        timeout: args.timeout ? args.timeout : '1200'
      })
    },
    message (message, okNamem, cancelName) {
      this.$q.dialog({
        title: '系統提示訊息',
        message: message,
        ok: okNamem,
        cancel: cancelName,
        persistent: true
      })
    },
    confirm (message, okNamem, cancelName, callbackOk, callbackCancel) {
      this.$q.dialog({
        title: '系統提示訊息',
        message: message,
        ok: {
          color: 'primary',
          label: okNamem
        },
        cancel: {
          color: 'negative',
          label: cancelName
        },
        persistent: true
      }).onOk(() => {
        callbackOk()
        console.log('OK: click OK fuction')
      }).onCancel(() => {
        callbackCancel()
        console.log('cancel: click cancel fuction')
      })
    }
  }
}
