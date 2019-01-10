/**
 * developer icely(panyanbing@bigo.sg)
 * bmob: https://www.bmob.cn/app/secret/231837
 */
require('./style.scss')
const Bmob = require('hydrogen-js-sdk')

let ajaxList = [] // 进入页面后的所有ajax请求
let tipTime = null // tip setTimeout handler
let isAutoSend = false  // 是否主动上报（接口状态非200时）

class FrontRequestTool {
    // 是否是正式环境（正式环境则不显示dom，且自动上报
    constructor(appId, key, isProduction = false) {
        isProduction && (isAutoSend = true)

        if (!window.XMLHttpRequest.hadInit) {
            Bmob.initialize(appId, key)
            this.xhrIntercept()
            !isProduction && this.appendDom()
        }
        // 设置为已初始化。防止开发中的实时预览，重复初始化
        window.XMLHttpRequest.hadInit = true
    }

    // xhr拦截、重写
    xhrIntercept() {
        const self = this
        const native_XHR = window.XMLHttpRequest
        const native_XHR_open = native_XHR.prototype.open
        const native_XHR_setRequestHeader = native_XHR.prototype.setRequestHeader
        const native_XHR_send = native_XHR.prototype.send

        window.XMLHttpRequest = function () {
            let ajax = {} // 本次ajax
            let xhr = new native_XHR()

            // 打开url
            xhr.open = function (method, url) {
                ajax.method = method
                ajax.url = url
                native_XHR_open.apply(xhr, arguments)
            }

            // 设置头信息
            xhr.setRequestHeader = function (header, value) {
                if (!ajax.header) {
                    ajax.header = {}
                }
                ajax.header[header] = value
                native_XHR_setRequestHeader.apply(xhr, arguments)
            }

            // 发送请求
            xhr.send = function (body) {
                ajax.body = body
                native_XHR_send.apply(xhr, arguments)
            }

            xhr.addEventListener('loadend', function () {
                ajax.status = xhr.status
                ajax.response = xhr.response
                // console.log(ajax)

                // 过滤bmob的请求
                if (ajax.url.search('api.bmobcloud.com') === -1) {
                    ajaxList.push(ajax)

                    // 自动上报错误
                    if (+ajax.status !== 200 && isAutoSend) {
                        self.sendDataToBmob()
                    }
                }
            })

            return xhr
        }
    }

    // 把 ajaxList 保存到云数据库bmob
    sendDataToBmob() {
        // console.log(ajaxList)
        const query = Bmob.Query('ajaxListTable')
        query.set('ajaxList', ajaxList)
        query.save().then(res => {
            this.showTip(res.objectId)
        })
    }

    // 插入组件dom
    appendDom() {
        let container = document.createElement('div')
        container.className = 'front-tool-container'

        // 悬浮按钮
        let btn = document.createElement('button')
        btn.className = 'front-tool-btn'
        btn.innerText = 'front tool'
        btn.addEventListener('click', function () {
            if (modal.className.search('up') > -1) {
                mask.className = 'mask'
                modal.className = 'modal down'
            } else {
                mask.className = 'mask show'
                modal.className = 'modal up'
            }
        })
        container.appendChild(btn)

        // 蒙层
        let mask = document.createElement('div')
        container.appendChild(mask)

        // 模态框
        let modal = document.createElement('div')
        modal.className = 'modal'
        container.appendChild(modal)

        // 模态框里面的按钮
        // 上报按钮
        let sendBtn = document.createElement('button')
        sendBtn.innerText = '上报'
        sendBtn.addEventListener('click', this.sendDataToBmob.bind(this))
        modal.appendChild(sendBtn)

        // 重置，清空ajaxList
        let resetBtn = document.createElement('button')
        resetBtn.innerText = '重置'
        resetBtn.addEventListener('click', function () {
            ajaxList = []
        })
        modal.appendChild(resetBtn)

        // tip
        let tip = document.createElement('div')
        tip.id = 'frontToolTipId'
        tip.className = 'tip'
        container.appendChild(tip)

        document.body.appendChild(container)
    }

    // 上报后的tip
    showTip(content) {
        clearTimeout(tipTime)

        let frontToolTip = document.getElementById('frontToolTipId')
        frontToolTip.className = frontToolTip.className.replace(/ hide/g, '')
        frontToolTip.className += ' show'
        frontToolTip.innerText = content

        tipTime = setTimeout(() => {
            frontToolTip.className = frontToolTip.className.replace(/show/g, 'hide')
        }, 5000)
    }
}

export default FrontRequestTool
