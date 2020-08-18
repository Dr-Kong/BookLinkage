// pages/mine/mine.js
const app = getApp(),
	util = require('../../utils/util.js')

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		a: app
	},

	onShow() {
		if (app.globalData.userInfo == null) {
			wx.getSetting().then(r => {
				if (r.authSetting['scope.userInfo']) {
					return wx.getUserInfo()
				} else {
					return Promise.reject()
				}
			}).then(res => {
				util.setUserInfo(res)
				return util.setOpenID(res)
			}).then(() => {
				this.setData({
					a: getApp()
				})
			})
		} else if (this.data.a.globalData.userInfo == null) {
			this.setData({
				a: getApp()
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

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
		if (res.userInfo == null) {
			return
		}
		wx.showLoading({
			title: '登录中',
		})
		util.setOpenID(res).then(() => {
			util.setUserInfo(res)
			this.setData({
				a: getApp()
			})
			wx.hideLoading()
		})
	},

	loginReminder() {
		wx.showToast({
			title: '请登录以使用此功能',
			icon: 'none'
		})
	}
})