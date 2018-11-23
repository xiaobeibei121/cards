// pages/history/history.js
import Utils from '../../utils/util.js';
import Api from '../../utils/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curDate : "",
    dates: [],
    details: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.computeDate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function (res) {
    return {
      path: '/pages/index/index'
    }
  },

  /**
   * 计算倒数7天日期
   */
  computeDate: function () {
    const curDate = new Date().getTime();
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(curDate - 24*60*60*1000*i);
      const formatDate = Utils.formatDate(nextDate);
      const formatDay = Utils.formatDay(nextDate);
      if( i === 1) {
        const curDateText = formatDay.split('-')[0] + '月' + formatDay.split('-')[1] + '日';
          this.setData({ curDate: formatDate, curDateText: curDateText});
      }
      this.data.dates.push({ formatDate: formatDate, formatDay: formatDay});
    }
    this.setData({ dates: this.data.dates });
    this.getMains();
  },

  /**
   * 顶部导航的点击事件
   */
  navTap: function (event) {
    const curDate = event.currentTarget.dataset.date;
    if (curDate !== this.data.curDate) {
      const curDateText = curDate.split('-')[1] + '月' + curDate.split('-')[2] + '日';
      this.setData({ curDate: curDate, curDateText: curDateText });
      this.getMains();
    }
  },

  /**
   * 获取列表数据
   */
  getMains: function () {
    const that = this;
    // 上传用户信息
    wx.request({
      method: 'GET',
      url: Api.mains,
      data: {date: this.data.curDate},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(response) {
        const res = response.data;
        if (res.errorCode === 0) {
          that.setData({ details: res.data.details });
        }
      }
    });
  },
})