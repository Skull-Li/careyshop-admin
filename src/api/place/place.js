import request from '@/plugin/axios/request'

const url = '/v1/place'

/**
 * 获取框架已支持的渠道平台
 * @returns
 */
export function getPlaceExist() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.place.exist'
    }
  })
}

/**
 * 获取某个平台下指定模块的默认配置结构
 * @param {Object} data
 * @returns
 */
export function getPlaceSetting(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.place.setting',
      ...data
    }
  })
}

/**
 * 添加一个渠道平台
 * @param {Object} data
 * @returns
 */
export function addPlaceItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.place.item',
      ...data
    }
  })
}

/**
 * 编辑一个渠道平台
 * @param {Object} data
 * @returns
 */
export function setPlaceItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.place.item',
      ...data
    }
  })
}

/**
 * 获取一个渠道平台
 * @param {Number} place_id
 * @returns
 */
export function getPlaceItem(place_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.place.item',
      place_id
    }
  })
}

/**
 * 编辑一个渠道平台
 * @param {Object} data
 * @returns
 */
export function getPlaceList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.place.list',
      ...data
    }
  })
}

/**
 * 批量删除渠道平台
 * @param {Array} place_id
 * @returns
 */
export function delPlaceList(place_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.place.list',
      place_id
    }
  })
}

/**
 * 批量设置渠道平台状态
 * @param {Array} place_id
 * @param {Number} status
 * @returns
 */
export function setPlaceStatus(place_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.place.status',
      place_id,
      status
    }
  })
}

/**
 * 获取渠道的授权机制
 * @param {Number} code
 * @returns
 */
export function getPlaceOAuth(code) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.place.oauth',
      code
    }
  })
}
