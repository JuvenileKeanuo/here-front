// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var waitinghandler
  //当前房间号自增1
  waitinghandler = await db.collection('sysdata').doc('groupcount').update({
    data: {
      count: db.command.inc(1)
    }
  })
  //获取当前小组号
  const groupcount = await db.collection('sysdata').doc('groupcount').get()
  //将创建好的小组号加入到创建者的小组列表里
  const wating = await db.collection('users').doc(wxContext.OPENID).update({
    data: {
      _groups: db.command.push(groupcount.data.count)
    }
  })
  const user_info = await db.collection('users').doc(wxContext.OPENID).get()
  //创建小组
  const creat_group = await db.collection('groups').add({
    data: {
      _id: groupcount.data.count,
      _group_name: event.group_name,
      _group_pass: event.group_password,
      _creator: wxContext.OPENID,
      _creator_name: user_info.data._name,
      _users: [],
      _history: [],
      _history_user: [],
      _last_check: '0'
    }
  })
  return event.group_name
}