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
		bkList: null
	},

	/**
	 * Lifecycle function--Called when page load
	 */
	onLoad(options) {
		this.setData({
			type: options.type
		})
		this.setBkList()
	},

	/**
	 * Lifecycle function--Called when page is initially rendered
	 */
	onReady: function () {

	},

	/**
	 * Lifecycle function--Called when page show
	 */
	onShow: function () {

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
	onPullDownRefresh: function () {

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

	setBkList() {
		const t = this.data.type,
			arr = ['uploads', 'favorites', 'bargains'],
			that = this
		db.collection(arr[t]).where({
			_openid: app.globalData.openID
		}).get({
			success(res) {
				if (t == 0) {
					// list of uploads
					that.setData({
						bkList: res.data
					})
				} else {
					// list of favorites of bargains
					const bkIDList = res.data[0].arr
					var temp = []
					for (let i = 0; i < bkIDList.length; i++) {
						db.collection('uploads').doc(bkIDList[i]).get({
							success(r) {
								temp.push(r.data)
							}
						})
					}
					that.setData({
						bkList: temp
					})
				}
			}
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
			a = [null, 'favorites', 'bargains']
		t = this.data.type
		if (t == 0) {
			// remove in uploads
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