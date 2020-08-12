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
			type: options.type
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
		this.setBkList()
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
		wx.showLoading({
			title: '加载中……',
			mask: true
		})
		db.collection(arr[t]).where({
			_openid: app.globalData.openID
		}).get().then(res => {
			const r = res.data
			return new Promise(resolve => {
				if (t == 0) {
					// list of uploads
					resolve(r)
				} else {
					// empty promise
					var promise = Promise.resolve(),
						temp = []
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
					promise.then(() => {
						resolve(temp)
					})
				}
			})
		}).then(list => {
			that.setData({
				bkList: list
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
		db.collection('uploads').doc(e.currentTarget.dataset.bkID).update({
			data: {
				isSoldOut: false
			}
		})
	},

	delete(e) {
		const bkID = e.currentTarget.dataset.bkID,
			a = [null, 'favorites', 'bargains'],
			t = this.data.type
		if (t == 0) {
			// remove upload img
			db.collection('uploads').doc(bkID).get({
				success(res) {
					wx.cloud.deleteFile({
						fileList: res.data.fileID
					})
				}
			})
			// remove upload record
			db.collection('uploads').doc(bkID).remove()
			// run twice, on favorites and bargains
			for (let i = 1; i < 3; i++) {
				db.collection(a[i]).where({
					arr: _.elemMatch(bkID)
				}).update({
					data: {
						arr: _.pull(bkID)
					}
				})
			}
		} else if (t == 1) {
			db.collection('favorites').where({
				_openid: app.globalData.openID
			}).update({
				data: {
					arr: _.pull(bkID)
				}
			})
		}
	}
})