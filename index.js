/**
 * developer icely(panyanbing@bigo.sg)
 */
const FrontRequestTool = require('./lib/FrontRequestTool')

// 挂载到window，兼容在<script>引用
window.FrontRequestTool = FrontRequestTool.default

module.exports = FrontRequestTool