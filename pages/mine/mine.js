// pages/mine/mine.js
const app = getApp(),
      util= require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    a: app
  },

  to_upload() {
    wx.navigateTo({
      url: '../upload/upload',
    })
  },

  to_about() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  to_history() {
    wx.navigateTo({
      url: '../history/history',
    })
  },

  to_feedback() {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },

  to_starred() {
    wx.navigateTo({
      url: '../starred/starred',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  setUserInfo(e) {
    const res = e.detail
    util.setUserInfo(res)
    util.setOpenID(res)
    this.setData({app: getApp()})
  }
})