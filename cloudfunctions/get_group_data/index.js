// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const group_info = await db.collection('groups').doc(Number(event.group_id)).get()
    return group_info
  } catch (e) {
    return -1
  }
}