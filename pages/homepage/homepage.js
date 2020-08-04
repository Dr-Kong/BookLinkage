//index.js
const db = wx.cloud.database(),
      util= require('../../utils/util.js'),
      app = getApp()

Page({
  data: {
    a: app
  },
  //事件处理函数
  bindViewTap() {
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  
  onLoad() {
    const that = this
    if (app.globalData.userInfo == null) {
      wx.getSetting({
        success(r) {
          if (r.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success(res) {
                util.setUserInfo(res)
                util.setOpenID(res)
                that.setData({a: getApp()})
              }
            })
          }
        }
      })
    } else if (that.data.a.globalData.userInfo == null) {
      that.setData({a: getApp()})
    }
  },

  setUserInfo(e) {
    const res = e.detail
    util.setUserInfo(res)
    util.setOpenID(res)
    this.setData({app: getApp()})
  }
})
