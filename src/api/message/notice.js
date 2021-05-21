import request from '@/plugin/axios/request'

const url = '/v1/notice'

/**
 * 添加一个通知模板
 * @param {Object} data
 * @returns
 */
export function addNoticeItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.notice.item',
      ...data
    }
  })
}

/**
 * 编辑一个通知模板
 * @param {Object} data
 * @returns
 */
export function setNoticeItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.notice.item',
      ...data
    }
  })
}

/**
 * 批量删除通知模板
 * @param {Array} notice_id
 * @returns
 */
export function delNoticeList(notice_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.notice.list',
      notice_id
    }
  })
}

/**
 * 获取一个通知模板
 * @param {Number} notice_id
 * @returns
 */
export function getNoticeItem(notice_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.item',
      notice_id
    }
  })
}

/**
 * 获取通知模板列表
 * @param {Object} data
 * @returns
 */
export function getNoticeList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.list',
      ...data
    }
  })
}

/**
 * 批量设置模板状态
 * @param {Array} notice_id
 * @param {Number} status
 * @returns
 */
export function setNoticeStatus(notice_id, status) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.notice.status',
      notice_id,
      status
    }
  })
}

/**
 * 根据渠道获取事件列表
 * @returns
 */
export function getNoticeEvent() {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.event'
    }
  })
}

/**
 * 根据事件获取替换变量
 * @param {Number} notice_event_id
 * @returns
 */
export function getNoticeVariable(notice_event_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.notice.variable',
      notice_event_id
    }
  })
}
