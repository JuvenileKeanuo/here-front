// miniprogram/pages/group-owner/new_check.js
import {
  $wuxToptips
} from '../../dist/index'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    time: "12:01",
    countdowns: ["5秒","10秒","20秒", "30秒", "40秒"],
    countdownseconds: [5 ,10, 20, 30, 40],
    countdownIndex: 1,
    location: {
      got: false,
    },
    gpsCheck: false,
  },

  enterTap: function() {
    let that = this
    wx.showLoading({
      title: '点名中',
    })
    wx.request({
      url: app.globalData.server_url + 'check_new',
      data: {
        OPENID: wx.getStorageSync('openid'),
        GROUPID: that.data.id,
        TIMEOFF: that.data.countdownseconds[that.data.countdownIndex],
        GPSCHECK: that.data.gpsCheck,
        GPSLOCATION: that.data.location,
      },
      success(res) {
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  gpsswitchChange: function(e) {
    let that = this
    that.setData({
      gpsCheck: e.detail.value
    })
  },

  getTime: function(date) {
    var time = ''
    var hh = date.getHours().toString()
    if (hh.length == 1) {
      time += '0'
    }
    time += hh
    time += ':'
    var mm = date.getMinutes().toString()
    if (mm.length == 1) {
      time += '0'
    }
    time += mm
    return time
  },
  bindCountdownChange: function(e) {
    this.setData({
      countdownIndex: e.detail.value
    })
  },
  switchtapped: function() {
    let that = this
    if (that.data.location.got === false) {
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '获取位置失败',
        duration: 3000,
        success() {},
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    const that = this
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
      }
    })
    this.setData({
      id: id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})