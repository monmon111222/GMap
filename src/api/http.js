import axios from 'axios'
import QS from 'qs'

axios.defaults.baseURL =
  process.env.VUE_APP_API_URL || 'https://soilmove-backend.skysharp.com.tw/'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

/**
 * get
 * @param {String} url
 * @param {Object} params [參數]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * post方法
 * @param {String} url
 * @param {Object} params
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
