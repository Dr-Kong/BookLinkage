// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(),
	_ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	/* const wxContext = cloud.getWXContext()
	return {
		event,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	} */
	if (event.where == null) {
		return await db.collection(event.collection).get()
	} else {
		return await db.collection(event.collection).where(event.where).get()
	}
}