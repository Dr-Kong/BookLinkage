// pages/history/history.js
const db = wx.cloud.database({
		throwOnNotFound: false
	}),
	app = getApp(),
	_ = db.command

Page({

	/**
	 * Page initial data
	 */
	data: {
		type: null,
		titles: ['上传历史', '我的收藏', '咨询历史'],
		bkList: []
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		this.setData({
			type: parseInt(options.type)
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
		this.setBkList()
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
	onReachBottom() {
		wx.showToast({
			title: '已加载全部书本',
			icon: 'none'
		})
	},

	/**
	 * Called when user click on the top right corner to share
	 */
	onShareAppMessage: function () {

	},

	setBkList() {
		const t = this.data.type,
			arr = ['uploads', 'favorites', 'bargains'],
			that = this
		var temp = []
		wx.showLoading({
			title: '加载中……',
			mask: true
		})
		db.collection(arr[t]).where({
			_openid: app.globalData.openID
		}).get().then(res => {
			const r = res.data
			if (t == 0) {
				// list of uploads
				temp = r
				return Promise.resolve()
			} else {
				// empty promise
				var promise = Promise.resolve()
				if (r.length != 0) {
					// list of favorites or bargains
					const bkIDList = r[0].arr
					for (let i = 0; i < bkIDList.length; i++) {
						promise = promise.then(() => {
							return new Promise(res => {
								db.collection('uploads').doc(
									bkIDList[i]
								).get().then(r => {
									temp.push(r.data)
									res()
								})
							})
						})
					}
				}
				return promise
			}
		}).then(() => {
			that.setData({
				bkList: temp
			})
			wx.hideLoading()
		})
	},

	switchList(e) {
		this.setData({
			type: e.detail.index
		})
		this.setBkList()
	},

	putAway(e) {
		const t = this.data.type,
			bkID = e.currentTarget.dataset.bkid
		wx.showLoading({
			title: '重新上架中……',
			mask: true
		})
		wx.cloud.callFunction({
			name: 'update',
			data: {
				collection: 'uploads',
				where: {
					_id: bkID
				},
				update: {
					data: {
						isSoldOut: false
					}
				}
			}
		}).then(() => {
			if (t == 0) {
				// seller deletes buyer's record
				return wx.cloud.callFunction({
					name: 'update',
					data: {
						collection: 'bargains',
						bkID: bkID,
						case: 2
					}
				})
			} else {
				// buyer deletes their own record
				return db.collection('bargains').where({
					_openid: app.globalData.openID
				}).update({
					data: {
						arr: _.pull(bkID)
					}
				})
			}
		}).then(() => {
			return wx.showToast({
				title: '上架成功',
				mask: true
			})
		}).then(() => {
			this.setBkList()
		})
	},

	delete(e) {
		const bkID = e.currentTarget.dataset.bkid,
			a = [null, 'favorites', 'bargains'],
			t = this.data.type
		wx.showLoading({
			title: '删除中……',
			mask: true
		})
		if (t == 0) {
			// remove uploaded img
			var promise = db.collection('uploads').doc(bkID).get().then(res => {
				return wx.cloud.deleteFile({
					fileList: res.data.fileID
				})
			}).then(() => {
				// remove upload record
				return db.collection('uploads').doc(bkID).remove()
			})
			// run twice, on favorites and bargains
			for (let i = 1; i < 3; i++) {
				promise = promise.then(() => {
					return wx.cloud.callFunction({
						name: 'update',
						data: {
							collection: a[i],
							bkID: bkID,
							case: 2
						}
					})
				})
			}
		} else {
			var promise = db.collection('favorites').where({
				_openid: app.globalData.openID
			}).update({
				data: {
					arr: _.pull(bkID)
				}
			})
		}
		promise.then(() => {
			return wx.showToast({
				title: '删除成功',
				mask: true
			})
		}).then(() => {
			this.setBkList()
		})
	}
})