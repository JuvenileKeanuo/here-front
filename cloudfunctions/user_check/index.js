// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//临时信息
const temp_user_id = 'o5p-A4qJxiOI2gaiwxRA4Ye2iceg'

const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    //获取小组信息
    const group_info = await db.collection('groups').doc(Number(event.group_id)).get()
    //时间对比
    const cur_time = new Date()
    const last_check_time = new Date(group_info.data._last_check)

    if (cur_time > last_check_time) {
      //时间超过点名截至时间
      return -1
    } else {
      //点名成功 开始处理逻辑
      let users = group_info.data._users
      //找到user表并更改
      let cur_user = users.find(function(x) {
        return x._id == wxContext.OPENID
      })
      console.log(cur_user)
      let cur_user_index = users.indexOf(cur_user)
      if (cur_user._history[cur_user._history.length - 1].checked) {
        return 2
      }
      cur_user._history[cur_user._history.length - 1].checked = true
      cur_user._num_checked++;
      cur_user._num_unchecked--;

      //找到group_history表更改
      let group_history = group_info.data._history
      let group_history_user = group_history[group_history.length - 1].user_unchecked.find(function(x) {
        return x._id == wxContext.OPENID
      })
      group_history[group_history.length - 1].user_unchecked.splice(group_history[group_history.length - 1].user_unchecked.indexOf(group_history_user), 1)
      group_history[group_history.length - 1].user_checked.push(group_history_user)

      const writewait = await db.collection('groups').doc(Number(event.group_id)).update({
        data: {
          _users: users,
          _history: group_history
        }
      })
      return 1
    }
    console.log(group_info)
  } catch (e) {
    //未知错误
    return -2
  }
}