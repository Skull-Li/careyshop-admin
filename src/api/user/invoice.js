import request from '@/plugin/axios/request'

const url = '/v1/user_invoice'

/**
 * 获取一个发票信息
 * @param {Number} client_id
 * @param {Number} user_invoice_id
 * @returns
 */
export function getUserInvoiceItem(client_id, user_invoice_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.invoice.item',
      client_id,
      user_invoice_id
    }
  })
}

/**
 * 获取发票信息列表
 * @param {Number} client_id
 * @returns
 */
export function getUserInvoiceList(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.user.invoice.list',
      client_id
    }
  })
}

/**
 * 添加一个发票信息
 * @param {Object} data
 * @returns
 */
export function addUserInvoiceItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'add.user.invoice.item',
      ...data
    }
  })
}

/**
 * 批量删除发票信息
 * @param {Number|String} client_id
 * @param {Array} user_invoice_id
 * @returns
 */
export function delUserInvoiceList(client_id, user_invoice_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'del.user.invoice.list',
      client_id,
      user_invoice_id
    }
  })
}

/**
 * 检测是否超出最大添加数量
 * @param {Number|String} client_id
 * @returns
 */
export function checkUserInvoiceMaximum(client_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'check.user.invoice.maximum',
      client_id
    }
  })
}
