// components/navigationBar/navigationBar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    customTitle: String,
    HomeFlag: {
      type: Boolean,
      value: false
    },

    menuFlag: {
      type: Boolean,
      value: false
    },
    productInfoFlag: {
      type: Boolean,
      value: false
    },
    cartFlag: {
      type: Boolean,
      value: false
    },
    myFlag: {
      type: Boolean,
      value: false
    }
  },
  options: {
    styleIsolation: "isolated",
  },

  /**
   * 组件的初始数据
   */
  data: {
    titleHeight: 0,
    capsuleObj: '',
    bgColor: 'transparent'
  },
  attached() {
    this.setData({
      titleHeight: app.globalData.titleHeight,
      capsuleObj: app.globalData.capsuleObj
    })
    // console.log(this.data.titleHeight,this.data.capsuleObj.height);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    cancode() {
      wx.scanCode({
        success: res => {
          console.log(res);
        }
      })
    },
    goback() {
       wx.navigateBack()
    },
    gotoSearch(){
      wx.navigateTo({
        url: '/pages/search/search',
      })
    }
  }
})
