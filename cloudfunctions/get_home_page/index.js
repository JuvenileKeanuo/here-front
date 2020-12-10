// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const userinfo = await db.collection('users').doc(wxContext.OPENID).get()
  const groups = userinfo.data._groups
  var groups_info = [];
  var group_count = 0
  for (var i = 0; i < groups.length; i++) {
    console.log(i)
    if (groups[i] == null)
      continue
    try {
      const groupinfo = await db.collection('groups').doc(groups[i]).get()
      groups_info.push(groupinfo)
      if (groups_info[group_count].data._creator == wxContext.OPENID) {
        groups_info[group_count].data._permission = 'owner'
      } else {
        groups_info[group_count].data._permission = 'user'
      }
      group_count++
    } catch (e) {

    }
  }
  return groups_info
}