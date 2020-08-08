const app = getApp()

/* function format_time(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(format_number)
         + '_' +
         [hour, minute, second].map(format_number)
}

function format_number(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
} */

function setOpenID(res) {
  wx.cloud.callFunction({
    name: 'getOpenID',
    data: {
      e: wx.cloud.CloudID(res.cloudID)
    },
    complete(r) {
      app.globalData.openID = r.result.openid
    }
  })
}

function setUserInfo(res) {
  app.globalData.userInfo = res.userInfo
}

const pubList = ['', 'barron', 'cambridge', 'hease', 'hodder', 'mcgraw', 'oxford', 'xdf'],
      _pubList = ['', '巴郎', '剑桥', '', '', '麦格劳', '牛津', '新东方'],
      sbjList = ['arthistory', 'biology', 'calculus', 'chemistry', 'chinese', 'computerscience',
                  'economics', 'english', 'environmentalscience', 'geograph', 'mathematics',
                  'others', 'physics', 'psychology', 'statistics', 'tok', 'unitedstateshistory'],
      _sbjList = ['艺术史', '生物', '微积分', '化学', '中文', '计算机', '经济', '英语',
                   '环境科学', '地理', '数学', '其他', '物理', '心理', '统计', '知识论', '美国历史']

module.exports = {
  pubList: pubList,
  _pubList: _pubList,
  sbjList: sbjList,
  _sbjList: _sbjList,
  setOpenID: setOpenID,
  setUserInfo: setUserInfo
}