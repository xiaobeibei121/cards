// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [{ "name": "推荐", "messages": ["即日起至2018年9月30日，招商银行信用卡用户使用支付宝支付，可享周末双倍积分，奖励积分上限500分。用户需在2018年9月30日前登陆掌上生活APP指定页面领取奖励积分的资格。", "即日起至2018年9月30日，招商银行信用卡用户使用支付宝支付，可享周末双倍积分，奖励积分上限500分。用户需在2018年9月30日前登陆掌上生活APP指定页面领取奖励积分的资格。"], "tag": 0 }, { "name": "招商银行", "messages": ["即日起至2018年9月30日，招商银行信用卡用户使用支付宝支付，可享周末双倍积分，奖励积分上限500分。用户需在2018年9月30日前登陆掌上生活APP指定页面领取奖励积分的资格。"], "tag": 1 }, { "name": "工商银行", "messages": ["即日起至2018年9月30日，招商银行信用卡用户使用支付宝支付，可享周末双倍积分，奖励积分上限500分。用户需在2018年9月30日前登陆掌上生活APP指定页面领取奖励积分的资格。"], "tag": 2 }],
    curDateText: "11月20",
    screenWidth: 0,
    listHeight: 0,
    shareImgPath: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        this.setData({
          screenWidth: res.screenWidth
        });
      }
    })
  },

  /**
   * 绘图
   */
  drawImage: function () {
    const that = this;

    var query = wx.createSelectorQuery();
    query.select('.list-view').boundingClientRect(function (rect) {
      console.log(rect)
      that.setData({ listHeight: rect.height});
    }).exec();
    

    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')
    const unit = this.data.screenWidth/375;
  
    context.setFontSize(25)
    context.setFillStyle("#666")
    context.fillText("11月20日刷卡指南", 15, 55)
    context.draw(false, function(){
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: unit * 375,
        height: 100,
        destWidth: unit * 375,
        destHeight: 100,
        canvasId: 'firstCanvas',
        success: function (res) {
          that.setData({
            shareImgPath: res.tempFilePath
          });
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          console.log(that.data.shareImgPath)
          //画板路径保存成功后，调用方法吧图片保存到用户相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            //保存成功失败之后，都要隐藏画板，否则影响界面显示。
            success: (res) => {
              console.log(res)
              wx.hideLoading()
              // that.setData({
              //   canvasHidden: true
              // })
            },
            fail: (err) => {
              wx.hideLoading()
              // that.setData({
              //   canvasHidden: true
              // })
            }
          })
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // //读取缓存登录
    // wx.getStorage({
    //   key: 'details',
    //   success: (res) => {
    //     this.setData({ curDateText: res.data.date.replace("-", "月"), details: res.data.details });
    //   }
    // });
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

  }
})