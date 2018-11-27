// pages/share/share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    curDateText: "",
    screenWidth: 0,
    listHeight: 0,
    listTitleRect: [],
    listDetailRect: [],
    shareImgPath: null,
    contentClass: ''
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
    const that = this;
    var query = wx.createSelectorQuery();
    //读取缓存登录
    wx.getStorage({
      key: 'details',
      success: (res) => {
        this.setData({ curDateText: res.data.date.replace("-", "月"), details: res.data.details });
        query.select('.content-view').boundingClientRect(function (rect) {
          that.setData({ listHeight: rect.height });

        }).exec();
        query.selectAll('.list-title').boundingClientRect(function (rect) {
          that.setData({ listTitleRect: rect });
        }).exec();
        query.selectAll('.list-detail').boundingClientRect(function (rect) {
          that.setData({ listDetailRect: rect });
        }).exec();

        //获取用户设备信息，屏幕宽度
        wx.getSystemInfo({
          success: res => {
            this.setData({
              screenWidth: res.screenWidth
            });
          }
        });

        that.timer = setTimeout(() => {
          that.drawImage();
          clearTimeout(that.timer);
        }, 300);
      }
    });
  },

  /**
   * 绘图
   */
  drawImage: function () {
    const that = this;

    const details = this.data.details;
    
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('firstCanvas')
    const unit = this.data.screenWidth / 375;
    context.beginPath();
    context.rect(0, 0, this.data.screenWidth, this.data.listHeight);
    context.fillStyle = "#fff";
    context.fill();

    context.setFontSize(25);
    context.setFillStyle("#666");
    context.fillText(this.data.curDateText+"日刷卡指南", 15, 55);

    const listTitleRect = this.data.listTitleRect;
    for (let i = 0; i < listTitleRect.length; i++) {
      context.setFontSize(16);
      context.setFillStyle("#333");
      context.fillText(details[i].name, 15, listTitleRect[i].top + 17);
    }

    const listDetailRect = this.data.listDetailRect;
    let index = 0;
    for (let i = 0; i < details.length; i++) {
      context.setFontSize(14);
      context.setFillStyle("#333");
      const messages = details[i].messages;
      let initY;
      for (let j = 0; j < messages.length; j++){
        initY = listDetailRect[index].top + 15;

        // 绘制圆点
        context.beginPath();
        context.arc(19, initY - 6 , 4, 0, 2 * Math.PI);
        context.fill();

        // 绘制文字
        let lineWidth = 0;
        const str = messages[j];
        const lineHeight = 20;
        const canvasWidth = this.data.screenWidth - 50;
        let lastSubStrIndex = 0;

        for (let a = 0; a < str.length; a++) {
          lineWidth += context.measureText(str[a]).width;
          if (lineWidth > canvasWidth) {//减去initX,防止边界出现的问题
            context.fillText(str.substring(lastSubStrIndex, a), 35, initY);
            initY += lineHeight;
            lineWidth = 0;
            lastSubStrIndex = a;
          }
          if (a == str.length - 1) {
            context.fillText(str.substring(lastSubStrIndex, i + a), 35, initY);
          }
        }
        index++;
      }

      if (index !== listDetailRect.length){
        // 绘制线条
        context.moveTo(15, initY + 20);
        context.lineTo(this.data.screenWidth - 15, initY + 20);
        context.setStrokeStyle("#f0f0f0");
        context.stroke();
      }
    }


    context.drawImage('../../images/qr.png',this.data.screenWidth/2 - 50, this.data.listHeight - 180, 100, 100);

    const text = "长按识别，进入刷卡指南";
    context.setFontSize(12);
    context.setFillStyle("#666");
    context.setTextAlign('center');
    context.fillText(text, (this.data.screenWidth - context.measureText(text[0]).width)/2, this.data.listHeight - 50);

    context.draw(false,function(){
      that.setData({ contentClass: 'hide'});
    });
  },

  /**
   * 保存图片
   */
  savePic: function () {
    const that = this;
    const unit = this.data.screenWidth / 375;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: unit * 375,
      height: that.data.listHeight,
      destWidth: unit * 375,
      destHeight: that.data.listHeight,
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
        // console.log(that.data.shareImgPath)
        //画板路径保存成功后，调用方法吧图片保存到用户相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          //保存成功失败之后，都要隐藏画板，否则影响界面显示。
          success: (res) => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
            that.timer = setTimeout(()=>{
              wx.hideToast();
              clearTimeout(that.timer);
            },2000);
          },
          fail: (err) => {
            wx.showToast({
              title: '保存失败',
              duration: 2000
            });
            that.timer = setTimeout(() => {
              wx.hideToast();
              clearTimeout(that.timer);
            }, 2000);
          }
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '绘制失败',
          duration: 2000
        });
        that.timer = setTimeout(() => {
          wx.hideToast();
          clearTimeout(that.timer);
        }, 2000);
      }
    })
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
    clearTimeout(this.timer);
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