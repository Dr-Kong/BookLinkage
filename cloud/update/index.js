// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database(),
	_ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	// const wxContext = cloud.getWXContext()
	/* return {
		event,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	} */
	if (event.case == 2) {
		event.where = {
			arr: _.elemMatch(_.eq(event.bkID))
		}
		event.update = {
			data: {
				arr: _.pull(event.bkID)
			}
		}
	}
	if (event.where._id != null) {
		return await db.collection(event.collection).doc(
			event.where._id
		).update(event.update)
	} else {
		return await db.collection(event.collection).where(
			event.where
		).update(event.update)
	}
}