// miniprogram/pages/group-owner/index.js
import F2 from '@antv/wx-f2'

const app = getApp()
var util = require('../../utils/util.js')

const buttons = [{
  label: '设置',
  icon: app.globalData.icon_setting,
},
{
  label: '查看统计',
  icon: app.globalData.icon_status,
},
{
  label: '发起点名',
  icon: app.globalData.icon_check,
},
]

let chart = null;

var status_chart = [];

function initChart(canvas, width, height, F2) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(status_chart)
  chart.scale('人数', {
    nice: true,
    tickInterval: 1,
  })
  chart.coord({
    transposed: false
  });
  chart.axis('人数', {
    line: null,
    grid: F2.Global._defaultAxis.grid,
    label(text, index, total) {
      const textCfg = {
        text: text / 1 + ' 人'
      };
      if (index === 0) {
        textCfg.textAlign = 'left';
      }
      if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });
  chart.axis('Date', {
    line: F2.Global._defaultAxis.line,
    grid: null
  });
  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const {
          name,
          value
        } = item;
        if (map[name]) {
          map[name].value = (value);
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });
  chart.source(status_chart)
  chart.interval().position('Date*人数').color('状态', ['#4f58a8', '#e64340']).adjust('stack');
  chart.render();
  return chart;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupname: 'test',
    id: 0,
    group_data: [],
    user_data: [],
    user_list: [],
    user_data_url: '',
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
    skeletons: [0, 1, 2, 3, 4, 5, 6],
    isloaded: false,
    isempty: false,
    opts: {
      onInit: initChart
    }
  },
  onLoad: function (options) {
    let that = this;
    let name = options.strr;
    let id = options.id
    this.setData({
      groupname: name,
      id: Number(id)
    })
  },
  onShow: function () {
    this.setData({
      isempty: false,
    })
    let that = this
    status_chart = []
    wx.request({
      url: app.globalData.server_url + 'get_groupdata',
      data: {
        OPENID: wx.getStorageSync('openid'),
        GROUPID: that.data.id
      },
      success(res) {
        var group_name = res.data._group_name
        var group_data_temp = res.data._history
        var user_data_temp = res.data._users_history
        var user_list_temp = res.data._users
        var user_data_url = '/pages/group-owner/details_total?data=' + JSON.stringify(user_data_temp)
        group_data_temp.sort(util.compareFunctionGreater("_date"))
        var chart_count = 0
        for (var i = group_data_temp.length - 1; i >= 0; i--) {
          group_data_temp[i]._date_string = util.CNDateString(new Date(group_data_temp[i]._date))
          if (chart_count < 3) {
            status_chart.push({
              Date: group_data_temp[i]._date_string,
              状态: '未到',
              人数: group_data_temp[i]._user_unchecked.length
            }, {
                Date: group_data_temp[i]._date_string,
                状态: '已到',
                人数: group_data_temp[i]._user_checked.length
              })
          }
          chart_count++
          group_data_temp[i].url = '/pages/group-owner/details_single?data=' + JSON.stringify(group_data_temp[i]) + '&id=' + that.data.id
        }
        for (var date = '\t'; chart_count != 0 && chart_count < 3; chart_count++) {
          status_chart.push({
            Date: date,
            状态: '未到',
            人数: 0
          }, {
              Date: date,
              状态: '已到',
              人数: 0
            })
          date += '\t'
        }
        status_chart.reverse()
        group_data_temp.sort(util.compareFunctionLess('_date'))
        that.setData({
          groupname: group_name,
          group_data: group_data_temp,
          user_data: user_data_temp,
          user_list: user_list_temp,
          user_data_url: user_data_url,
          skeletons: [],
        })
        if (that.data.group_data.length == 0) {
          that.setData({
            isempty: true,
          })
        }
        if (chart != null) {
          chart.changeData(status_chart)
          chart.scale('人数', {
            nice: true,
            tickInterval: 1,
          })
        }
      }
    })
  },
  onClick(e) {
    let that = this
    if (e.detail.index === 2) {
      if (this.data.user_data.length != 0) {
        wx.navigateTo({
          url: '/pages/group-owner/new_check?id=' + this.data.id,
        })
      } else {
        wx.showToast({
          title: '小组内没有成员无法点名',
          icon: 'none',
        })
      }
    }
    if (e.detail.index === 1) {
      wx.navigateTo({
        url: this.data.user_data_url
      })
    }
    if (e.detail.index === 0) {
      wx.showActionSheet({
        itemList: ['成员管理', '解散小组', '修改信息'],
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex === 0) {
              wx.navigateTo({
                url: '/pages/group-owner/user_manage?data=' + JSON.stringify(that.data.user_list) + '&id=' + that.data.id
              })
            }
            if (res.tapIndex === 1) {
              wx.showModal({
                title: '解散小组',
                content: '解散后小组不可恢复，请谨慎操作',
                confirmText: "取消",
                cancelText: "解散",
                success: function (res) {
                  if (res.confirm) {
                  } else {
                    that.dismiss()
                  }
                }
              });
            }
            if (res.tapIndex === 2) {
              wx.navigateTo({
                url: '/pages/group-owner/info_edit?id=' + that.data.id,
              })
            }
          }
        }
      });
    }
  },
  dismiss: function () {
    let that = this
    wx.request({
      url: app.globalData.server_url + 'group_dismiss',
      data: {
        OPENID: wx.getStorageSync('openid'),
        GROUPID: that.data.id
      },
      success(res) {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  },
  go_details_total: function () {
    let str = JSON.stringify(this.data.user_data)
    wx.navigateTo({
      url: '/pages/group-owner/details_total?data=' + str,
    })
  },
  newcheckTap: function () {
    wx.navigateTo({
      url: '/pages/group-owner/new_check?id=' + this.data.id,
    })
  },
  scroll: function () {

  },
  scrolltoupper: function () {

  },
  scrolltolower: function () {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange: function () {

  }
})