// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var isUserExists = await db.collection('users').where({
    _id: wxContext.OPENID
  }).get()
  if (isUserExists.data.length == 0) {
    const tempadd = await db.collection('users').add({
      data: {
        _id: wxContext.OPENID,
        _groups: [],
        _name: event.name,
        _studentid: event.studentID
      }
    })
    isUserExists = await db.collection('users').where({
      _id: wxContext.OPENID
    }).get()
  }

  return isUserExists.data[0]._id
}