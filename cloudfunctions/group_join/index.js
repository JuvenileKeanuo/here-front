// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const groupinfo = await db.collection('groups').doc(Number(event.group_id)).get()
    const password = groupinfo.data._group_pass
    if (event.group_password == password) {
      const userinfo = await db.collection('users').doc(wxContext.OPENID).get()
      if (userinfo.data._groups.indexOf(Number(event.group_id)) == -1) {
        const wating = await db.collection('users').doc(wxContext.OPENID).update({
          data: {
            _groups: db.command.push(Number(event.group_id))
          }
        })
        const groupwaiting = await db.collection('groups').doc(Number(event.group_id)).update({
          data: {
            _users: db.command.push({
              _id: wxContext.OPENID,
              _name: userinfo.data._name,
              _student_id: userinfo.data._studentid,
              _num_checked: 0,
              _num_unchecked: 0,
              _history: []
            })
          }
        })
        return '1'
      } else {
        return '-2'
      }
    } else {
      return '-1'
    }
  } catch (e) {
    return '-1'
  }
}