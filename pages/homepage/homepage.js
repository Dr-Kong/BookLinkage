//index.js
const db = wx.cloud.database({
		throwOnNotFound: false
	}),
	_ = db.command,
	util = require('../../utils/util.js'),
	pubList = util.pubList,
	sbjList = util.sbjList,
	app = getApp()

Page({
	data: {
		a: null,
		_sbjList: util._sbjList,
		sbjList: sbjList,
		pubList: pubList,
		sbj: 11,
		pub: 0,
		bl: [],
		keywords: '',
		tags: ['']
	},
	// switch to mine
	bindViewTap() {
		wx.switchTab({
			url: '../mine/mine',
		})
	},

	onLoad() {},

	onShow() {
		const that = this
		wx.showLoading({
			title: '加载中……',
			mask: true
		})
		new Promise(resolve => {
			if (app.globalData.userInfo != null) {
				resolve()
			} else {
				wx.getSetting().then(r => {
					return new Promise(res => {
						if (r.authSetting['scope.userInfo']) {
							// authorized
							wx.getUserInfo({
								success: res
							})
						} else {
							res()
						}
					})
				}).then(result => {
					return new Promise(res => {
						if (result != null) {
							util.setOpenID(result).then(() => {
								util.setUserInfo(result)
								res()
							})
						} else {
							res()
						}
					})
				}).then(() => {
					resolve()
				})
			}
		}).then(() => {
			that.setData({
				a: getApp()
			})
			that.search()
		})
	},

	onPullDownRefresh() {
		wx.stopPullDownRefresh().then(() => {
			this.onShow()
		})
	},

	setUserInfo(e) {
		const res = e.detail
		if (res.userInfo == null) {
			return
		}
		wx.showLoading({
			title: '登录中……',
			mask: true
		})
		util.setOpenID(res).then(() => {
			util.setUserInfo(res)
			this.setData({
				a: getApp()
			})
			this.search()
			wx.hideLoading()
		})
	},

	searchByKeywords(e) {
		const str = e.detail.value,
			that = this
		that.setData({
			keywords: str
		})
		var tempTags = str.split(' ')
		for (var i = 0; i < tempTags.length; i++) {
			if (i + 1 < tempTags.length &&
				tempTags.indexOf(tempTags[i], i + 1) != -1 ||
				tempTags[i] == '' ||
				tempTags[i] == ' ') {
				// remove unqualified tag
				tempTags.splice(i, 1)
				// in case of skipping element
				i--
			}
		}
		that.setData({
			tags: that.data.tags.concat(tempTags.length == 0 ? [''] : tempTags)
		})
		that.search()
	},

	searchByTags(e) {
		const val = e.detail.value
		this.setData({
			sbj: val[0] ? val[0] : 11,
			pub: val[1] ? val[1] : 0,
			tags: this.data.tags.concat([sbjList[val[0]], pubList[val[1]]])
		})
		this.search()
	},

	search() {
		const that = this,
			kw = that.data.tags,
			openID = app.globalData.openID
		var temp = [],
			i = kw.length - 2
		wx.showLoading({
			title: '获取书本信息中……',
		})
		wx.cloud.callFunction({
			name: 'get',
			data: {
				collection: 'uploads',
				case: 2,
				openID: openID,
				keyWord: kw[i + 1]
			}
		}).then(res => {
			temp = res.result.data
			while (i > 0 && temp.length > 0) {
				const cur = kw[i]
				for (let j = 0; j < temp.length; j++) {
					if (temp[j].tags.indexOf(cur) == -1) {
						temp.splice(j, 1)
					}
				}
				i--
			}
			that.setData({
				bl: temp
			})
			wx.hideLoading()
		})
	},

	hideKeyboard() {
		wx.hideKeyboard()
	},

	cancelSearch() {
		this.setData({
			sbj: 11,
			pub: 0,
			keywords: '',
			tags: ['']
		})
		this.search()
	}
})