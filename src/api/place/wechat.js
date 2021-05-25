import request from '@/plugin/axios/request'

const url = '/v1/wechat'

/**
 * 请求微信接口
 * @param {String} method
 * @param {Object} data
 * @returns
 */
export function requestWechat(method, data = {}) {
  return request({
    url,
    method: 'post',
    data: {
      method,
      ...data
    }
  })
}
