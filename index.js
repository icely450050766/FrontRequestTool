/**
 * developer icely(panyanbing@bigo.sg)
 */
const FrontTool = require('./lib/FrontTool')

// 挂载到window，兼容在<script>引用
window.FrontTool = FrontTool.default

module.exports = FrontTool