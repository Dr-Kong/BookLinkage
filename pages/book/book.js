// pages/book/book.js
const app = getApp(),
	db = wx.cloud.database({
		throwOnNotFound: false
	}),
	_ = db.command

Page({

	/**
	 * Page initial data
	 */
	data: {
		_id: null,
		type: null,
		lastName: null,
		wxID: null,
		tel: null,
		bkName: null,
		isLegal: null,
		p: null,
		addInfo: null,
		fID: null,
		starred: null,
		showContactInfo: false
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		const that = this
		db.collection('uploads').doc(options.bkID).get({
			success(res) {
				const r = res.data[0]
				that.setData({
					_id: options.bkID,
					type: options.type,
					lastName: r.lastName,
					wxID: r.wxID,
					tel: r.telephone,
					bkName: r.bkName,
					isLegal: r.isLegal,
					p: r.price,
					addInfo: r.additionalInfo,
					fID: r.fileID,
				})
			},
			fail(err) {
				wx.showToast({
					title: '所查询的书本已被删除！',
					icon: 'none',
					success(res) {
						wx.navigateBack()
					}
				})
			}
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
		if (that.data.type != 2) {
			// check star
			db.collection('favorites').where({
				_openid: app.globalData.openID
			}).get({
				success(res) {
					const r = res.data[0].arr
					for (let i = 0; i < r.length; i++) {
						if (r[i] == that.data._id) {
							that.setData({
								starred: true
							})
						}
					}
				}
			})
			// check if sold out
			db.collection('uploads').doc(that.data._id).get({
				success(res) {
					if (res.data[0].isSoldOut) {
						wx.showToast({
							title: '此书本已经下架！',
							icon: 'none',
							success(res) {
								wx.navigateBack()
							}
						})
					}
				}
			})
		}

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
		this.onShow()
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
			bkID = that.data._id
		// whether the record exists
		var bool = false
		// set val on current page
		that.setData({
			starred: true
		})
		// set val in database
		db.collection('favorites').where({
			_openid: app.globalData.openID
		}).get({
			success(res) {
				bool = true
			}
		})
		db.collection('favorites').where({
			_openid: app.globalData.openID
		}).set({
			data: {
				arr: bool ? _.unshift(bkID) : [bkID]
			}
		})
	},

	bargain() {
		const that = this
		db.collection('uploads').doc(that.data._id).get({
			success(res) {
				// check if sold out
				if (res.data[0].isSoldOut) {
					wx.showToast({
						title: '在你浏览时，已经有人开始咨询了！',
						icon: 'none',
						success(res) {
							wx.navigateBack()
						}
					})
				} else {
					that.setData({
						showContactInfo: true
					})
					db.collection('uploads').doc(that.data._id).update({
						data: {
							isSoldOut: true
						}
					})
				}
			}
		})
	},

	preview(e) {
		const cur = e.currentTarget.dataset.i,
			cp = this.data.fID
		wx.previewImage({
			urls: cp,
			current: cp[cur]
		})
	},

	copy(e) {
		wx.setClipboardData({
			data: e.currentTarget.dataset.txt,
			success(res) {
				wx.getClipboardData({
					success(res) {
						wx.showToast({
							title: '复制成功！'
						})
					}
				})
			}
		})
	}
})