// pages/book/book.js
const app = getApp(),
	db = wx.cloud.database({
		throwOnNotFound: false
	}),
	_ = db.command,
	util = require('../../utils/util')

Page({

	/**
	 * Page initial data
	 */
	data: {
		type: null,
		bkID: null,
		record: null,
		starred: false,
		showContactInfo: false
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		this.setData({
			type: parseInt(options.type),
			bkID: options.bkID
		})
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {

	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow() {
		const that = this
		wx.showLoading({
			title: '加载中……',
			mask: true
		})
		db.collection('uploads').doc(that.data.bkID).get().then(res => {
			const r = res.data
			if (r == null) {
				wx.showToast({
					title: '所查询的书本已被删除！',
					icon: 'none'
				}).then(() => {
					wx.navigateBack()
				})
			}
			that.setData({
				record: r
			})
			if (that.data.type != 2) {
				db.collection('uploads').doc(
						that.data.record._id
					).get()
					/* .then(res => {
										// check if sold out
										if (res.data.isSoldOut) {
											wx.showToast({
												title: '此书本已经下架！',
												icon: 'none'
											}).then(() => {
												wx.navigateBack()
											})
										} else {
											return Promise.resolve()
										}
									}) */
					.then(() => {
						return db.collection('favorites').where({
							_openid: app.globalData.openID
						}).get()
					}).then(res => {
						if (res.data.length != 0) {
							// check star
							const r = res.data[0].arr
							for (let i = 0; i < r.length; i++) {
								if (r[i] == that.data.record._id) {
									that.setData({
										starred: true
									})
								}
							}
						}
						wx.hideLoading()
					})
			} else {
				wx.hideLoading()
			}
		})
	},

	/**
	 * Lifecycle function--Called when page hide
	 */
	onHide: function () {

	},

	/**
	 * Lifecycle function--Called when page unload
	 */
	onUnload: function () {

	},

	/**
	 * Page event handler function--Called when user drop down
	 */
	onPullDownRefresh() {
		wx.stopPullDownRefresh().then(() => {
			this.onShow()
		})
	},

	/**
	 * Called when page reach bottom
	 */
	onReachBottom: function () {

	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {

	},

	star() {
		const that = this,
			bkID = that.data.record._id,
			s = that.data.starred
		if (app.globalData.userInfo != null) {
			// set val in database
			db.collection('favorites').where({
				_openid: app.globalData.openID
			}).get().then(res => {
				if (res.data.length == 0) {
					return db.collection('favorites').add({
						data: {
							arr: [bkID]
						}
					})
				} else {
					return db.collection('favorites').where({
						_openid: app.globalData.openID
					}).update({
						data: {
							arr: s ? _.pull(bkID) : _.unshift(bkID)
						}
					})
				}
			}).then(() => {
				wx.showToast({
					title: s ? '已取消收藏' : '收藏成功！'
				})
				// set local val
				that.setData({
					starred: !s
				})
			})
		} else {
			wx.showToast({
				title: '请登录以使用此功能',
				icon: 'none'
			})
		}
	},

	bargain() {
		const that = this,
			bkID = that.data.bkID
		/* if (app.globalData.userInfo != null) { */
		wx.showLoading({
			title: '加载中……',
			mask: true
		})
		if (that.data.type == 2) {
			that.setData({
				showContactInfo: true
			})
			wx.hideLoading()
		} else {
			/* db.collection('uploads').doc(
				that.data.bkID
			).get().then(res => {
				// check if sold out
				if (res.data.isSoldOut) {
					wx.showToast({
						title: '在你浏览时，已经有人开始咨询了！',
						icon: 'none'
					}).then(() => {
						wx.navigateBack()
					})
				} else {
					// update bk record
					return wx.cloud.callFunction({
						name: 'update',
						data: {
							collection: 'uploads',
							where: {
								_id: that.data.record._id
							},
							update: {
								data: {
									isSoldOut: true
								}
							}
						}
					})
				}
			}).then(() => {
				return  */
			db.collection('bargains').where({
					_openid: app.globalData.openID
				}).get()
				/* 
								}) */
				.then(res => {
					const r = res.data
					if (r.length == 0) {
						return db.collection('bargains').add({
							data: {
								arr: [bkID]
							}
						})
					} else if (!r[0].arr.includes(bkID)) {
						return db.collection('bargains').where({
							_openid: app.globalData.openID
						}).update({
							data: {
								arr: _.unshift(bkID)
							}
						})
					} else {
						return Promise.resolve()
					}
				}).then(() => {
					that.setData({
						showContactInfo: true
					})
					/* db.collection('userinfo').add({
						data: {
							userInfo: app.globalData.userInfo
						}
					}) */
					/* wx.cloud.callFunction({
						name: 'soldOutInform',
						data: {
							touser: this.data.record._openid,
							bkName: this.data.record.bkName,
							time: util.formatTime(new Date())
						}
					}) */
					wx.hideLoading()
				})
		}
		/* } else {
			wx.showToast({
				title: '请登录以使用此功能',
				icon: 'none'
			})
		} */
	},

	preview(e) {
		const cur = e.currentTarget.dataset.i,
			cp = this.data.record.fileID
		wx.previewImage({
			urls: cp,
			current: cp[cur]
		})
	},

	copy(e) {
		wx.setClipboardData({
			data: e.currentTarget.dataset.txt
		}).then(() => {
			return wx.getClipboardData()
		}).then(() => {
			wx.showToast({
				title: '复制成功！'
			})
		})
	}
})