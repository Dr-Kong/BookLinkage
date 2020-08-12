//app.js

App({
	onLaunch() {
		const that = this
		wx.cloud.init({
			env: "booklinkage-ryfw4",
			traceUser: true
		})
		/* wx.getSetting({
			success(r) {
				if (r.authSetting['scope.userInfo']) {
					wx.getUserInfo({
						success(res) {
							that.globalData.userInfo = res.userInfo
							wx.cloud.callFunction({
								name: 'getOpenID',
								data: {
									e: wx.cloud.CloudID(res.cloudID)
								},
								complete(r) {
									that.globalData.openID = r.result.openid
								}
							})
						}
					})
				}
			}
		}) */
		/* // 登录
		wx.login()
		// 获取用户信息
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success(res) {
							// 可以将 res 发送给后台解码出 unionId
							that.globalData.userInfo = res.userInfo
							if (!that.globalData.openID ) {
								wx.cloud.callFunction({
									name: 'getOpenID',
									complete: res => {
										that.globalData.openID = res.result.openId
									}
								})
							}
							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (that.userInfoReadyCallback) {
								that.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		}) */
	},
	globalData: {
		userInfo: null,
		openID: null
	}
})