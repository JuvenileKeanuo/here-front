// miniprogram/pages/group-owner/details_total.js
import {
  $wuxToptips
} from '../../dist/index'
const app = getApp()
const buttons = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    details_total: [],
    types: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'center'],
    typeIndex: 3,
    colors: ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'],
    colorIndex: 4,
    dirs: ['horizontal', 'vertical', 'circle'],
    dirIndex: 0,
    sAngle: 0,
    eAngle: 360,
    spaceBetween: 10,
    buttons,
    button_icon: app.globalData.icon_share,
    clip: ''
  },
  compareFunction: function(propertyName) {
    return function(src, tar) {
      //获取比较的值
      var v1 = src[propertyName];
      var v2 = tar[propertyName];
      if (v1 > v2) {
        return 1;
      }
      if (v1 < v2) {
        return -1;
      }
      return 0;
    };
  },
  onChange: function() {
    let that = this
    wx.setClipboardData({
      data: that.data.clip,
      success() {
        $wuxToptips().show({
          icon: 'success',
          hidden: false,
          text: '导出成功，请粘贴到电子表格中',
          duration: 3000,
          success() { },
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = JSON.parse(options.data)
    data.sort(this.compareFunction('_student_id'))
    var copytoclip = ''
    copytoclip += '姓名\t学号\t已到\t未到\n'
    for (let i of data) {
      copytoclip += i._name
      copytoclip += '\t'
      copytoclip += i._studentid
      copytoclip += '\t'
      copytoclip += i._num_checked.toString()
      copytoclip += '\t'
      copytoclip += i._num_unchecked.toString()
      copytoclip += '\n'
    }
    this.setData({
      details_total: data,
      clip: copytoclip
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

  },
  scroll: function() {

  },
  upper: function() {

  },
  lower: function() {

  },
})