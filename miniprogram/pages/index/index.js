// miniprogram/pages/index/index.js
import {
  $wuxToptips
} from '../../dist/index'
var util = require('../../utils/util.js')
const app = getApp()
var hidden = true

Page({
  data: {
    animationData: {},
    plusanimationData: {},
    testText: "您还没有缺过勤",
    plusStatus: "plus",
    isFeatureHidden: hidden,
    mainPlusTap: "expand",
    list: [],
    num_unchecked: 0,
    status_text: "每次点名都到了\n请继续保持",
    go_detail_url: "",
    joined: true,
    groups_checked: [],
    checked_go: false,
    skeletons: [0, 1, 2, 3],
    isloaded: false,
    checkkey: "",
    location: {
      got: false,
    },
  },
  onReady: function() {
    hidden = true;
    this.setData({
      isFeatureHidden: hidden,
    });
  },
  onShow() {
    //初次启动判断
    var storageData = wx.getStorageSync('registered')
    if (storageData === '') {
      wx.redirectTo({
        url: '/pages/firstboot/welcome'
      })
      return
    }
    let that = this
    wx.getLocation({
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        that.setData({
          location: {
            got: res.accuracy === 0 ? false : true,
            latitude: latitude,
            longitude: longitude,
          },
        })
      },
      fail(res) {

      },
      complete(res) {
        if (that.data.location.got === false) {
          $wuxToptips().show({
            icon: 'cancel',
            hidden: false,
            text: '获取位置失败',
            duration: 3000,
            success() {},
          })
        }
        //读取剪贴板
        wx.getClipboardData({
          success(res) {
            that.setData({
              checkkey: res.data
            })
            wx.request({
              url: app.globalData.server_url + 'get_homepage',
              data: {
                OPENID: wx.getStorageSync('openid'),
                GPSLOCATION: that.data.location,
                CHECKKEY: that.data.checkkey
              },
              success(res) {
                try {
                  res.data.sort(util.compareFunction_s("last_check_time"))
                  var now = new Date()
                  var groups_data = res.data
                  var num_unchecked = 0
                  var groups_checked = []
                  var checkkeytemp = ""
                  for (let group of groups_data) {
                    group.url = '/pages/group-' + group.group_permission + '/index?strr=' + group.group_name + '&id=' + group.group_id
                    if (group.cur_checked) {
                      groups_checked.push(group.group_name)
                      checkkeytemp = group.check_key
                    }
                    num_unchecked += group.num_unchecked
                  }
                  var status_text = "每次点名都到了\n请继续保持"
                  if (num_unchecked) {
                    status_text = "有 " + num_unchecked.toString() + " 次点名没到\n别忘了去上课"
                  }
                  that.setData({
                    list: groups_data,
                    num_unchecked: num_unchecked,
                    status_text: status_text,
                    groups_checked: groups_checked,
                    isloaded: true,
                    checkkey: checkkeytemp
                  })
                  if (that.data.checkkey != '') {
                    wx.setClipboardData({
                      data: that.data.checkkey,
                      success() {
                        wx.showToast({
                          title: '签到中',
                          icon: 'none'
                        })
                      }
                    })
                  }
                  if (that.data.list.length === 0) {
                    that.setData({
                      joined: false
                    })
                  }
                  if (that.data.groups_checked.length != 0) {
                    $wuxToptips().show({
                      icon: 'success',
                      hidden: false,
                      text: '签到成功',
                      duration: 3000,
                      success() {},
                    })
                  }
                } catch (e) {
                  wx.showToast({
                    title: '加载失败',
                    icon: 'none'
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  moreLongpress: function() {
    wx.redirectTo({
      url: '/pages/firstboot/welcome',
    })
  },
  onLoad: function() {},
  //主界面按钮展开
  expand: function() {
    hidden = !hidden;
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(4, 4).step()
    const plusanimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.plusanimation = plusanimation
    plusanimation.rotate(45).step()
    this.setData({
      rotateAngle: "45deg",
      animationData: animation.export(),
      plusanimationData: plusanimation.export(),
      mainPlusTap: "shrink",
      isFeatureHidden: hidden,
    })
  },
  //主界面按钮收回
  shrink: function() {
    hidden = !hidden;
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.scale(1, 1).step()
    const plusanimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.plusanimation = plusanimation
    plusanimation.rotate(0).step()
    this.setData({
      isFeatureHidden: hidden,
      rotateAngle: "90deg",
      animationData: animation.export(),
      plusanimationData: plusanimation.export(),
      mainPlusTap: "expand",
      isFeatureHidden: hidden,
    });
  },
  changecolor: function() {
    this.setData({
      testStyle: 'background-color:#e8eff5;'
    });
  },
  //跳转小组详情
  goGroupDetail: function(e) {
    if (!this.data.isFeatureHidden)
      this.shrink()
  },
  changeback: function() {
    this.setData({
      testStyle: 'background-color:#ffffff;'
    })
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        wx.showToast({
          title: '获取openid成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      },
      fail: err => {}
    })
  },
  scroll: function() {

  },
  upper: function() {

  },
  lower: function() {

  },
})