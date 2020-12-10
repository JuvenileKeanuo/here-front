// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    //获取小组信息
    const group_info = await db.collection('groups').doc(Number(event.group_id)).get()
    //将传入的时间范围转换成毫秒并获取当前时间
    let timeoffset = event.timeoff * 1000
    let curdate = new Date().getTime() + timeoffset
    //获取小组学生列表
    let users = group_info.data._users
    let history = group_info.data._history
    console.log(users)
    /*
    //找到一个元素并删除他
    let a = users.find(function(x) {
      return x._name == "金启亮"
    })
    users.splice(users.indexOf(a), 1)
    return users.indexOf(a)
    */
    for (var i = 0; i < users.length; i++) {
      users[i]._history.push({
        date: curdate,
        checked: false
      })
      users[i]._num_unchecked++
    }
    //构造本次点名的数据
    let check_data = {
      id: group_info.data._history.length,
      date: curdate,
      geo: null,
      is_geo_check: false,
      user_checked: [],
      user_unchecked: users,
    }
    console.log('user_length', users.length)
    console.log(check_data)
    history.push(check_data)
    const writewait = await db.collection('groups').doc(Number(event.group_id)).update({
      data: {
        _last_check: curdate,
        _history: history,
        _users: users
      }
    })
    return true
  } catch (e) {
    console.error(e)
  }
}