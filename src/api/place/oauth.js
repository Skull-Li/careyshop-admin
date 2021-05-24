import request from '@/plugin/axios/request'

const url = '/v1/place_oauth'

/**
 * 添加一条授权机制
 * @param {Object} data
 * @returns
 */
export function addPlaceOAuthItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.place.oauth.item',
      ...data
    }
  })
}

/**
 * 编辑一条授权机制
 * @param {Object} data
 * @returns
 */
export function setPlaceOAuthItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.place.oauth.item',
      ...data
    }
  })
}

/**
 * 批量删除授权机制
 * @param {Number} place_oauth_id
 * @returns
 */
export function delPlaceOAuthList(place_oauth_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.place.oauth.list',
      place_oauth_id
    }
  })
}

/**
 * 获取一条授权机制
 * @param {Number} place_oauth_id
 * @returns
 */
export function getPlaceOAuthItem(place_oauth_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.place.oauth.item',
      place_oauth_id
    }
  })
}

/**
 * 获取授权机制列表
 * @param {Object} data
 * @returns
 */
export function getPlaceOAuthList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.place.oauth.list',
      ...data
    }
  })
}

/**
 * 批量设置机制状态
 * @param {Array} place_oauth_id
 * @param {Number} status
 * @returns
 */
export function setPlaceOAuthStatus(place_oauth_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.place.oauth.status',
      place_oauth_id,
      status
    }
  })
}
