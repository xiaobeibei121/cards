// pages/components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toShareCard: function (event) {

      // detail对象，提供给事件监听函数
      var myEventDetail = {};
      // 触发事件的选项
      var myEventOption = {};
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('myevent', myEventDetail, myEventOption);
    }
  }
})
