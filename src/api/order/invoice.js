import request from '@/plugin/axios/request'

const url = '/v1/invoice'

/**
 * 编辑一条票据
 * @param {Object} data
 * @returns
 */
export function setInvoiceItem(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'set.invoice.item',
      ...data
    }
  })
}

/**
 * 重置一个票据
 * @param {Number} invoice_id
 * @returns
 */
export function resetInvoiceItem(invoice_id) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'reset.invoice.item',
      invoice_id
    }
  })
}

/**
 * 根据订单号获取一条票据
 * @param {String} order_no
 * @returns
 */
export function getInvoiceOrder(order_no) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.invoice.order',
      order_no
    }
  })
}

/**
 * 获取票据列表
 * @param {Object} data
 * @returns
 */
export function getInvoiceList(data) {
  return request({
    url,
    method: 'post',
    data: {
      method: 'get.invoice.list',
      ...data
    }
  })
}
