// pages/mine/mine.js
const app = getApp(),
      util= require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: app.globalData.hasUserInfo
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
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.hasUserInfo = true
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    util.setOpenID()
  }
})