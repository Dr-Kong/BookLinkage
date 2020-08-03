//index.js
const app = getApp(),
      db = wx.cloud.database(),
      util= require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo : app.globalData.hasUserInfo
  },
  //事件处理函数
  bindViewTap() {
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  
  onShow() {
    const that = this
    if (app.globalData.userInfo == {}) {
      wx.getUserInfo({
        success(res) {
          app.globalData.userInfo = res.userInfo
          app.globalData.hasUserInfo = true
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          util.setOpenID()
        }
      })
    } else {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: app.globalData.hasUserInfo
      })
      util.setOpenID()
    }
  },

  setUserInfo(e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.hasUserInfo = true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    util.setOpenID()
  }
})
