// pages/menu/menu.js
const amapFile = require('../../libs/amap-wx.130')
const http = require('../../utils/http')
const ui = require('../../utils/ui')
const app = getApp()
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRefresh: false,
    //index
    currentTab: 0,
    //一级栏数据
    menuDate: [],
    addressBtn: [
      {
        title: '自提',
        type: 'zt'
      },
      {
        title: '外送',
        type: 'ws'
      }
    ],
    activeType: 'zt',
    Headerheight: 0,
    //地址
    address: '',
    // 定义当前选中菜单的索引
    currentTab: 0,
    // scroll-view距离左边的距离
    sleft: 0,
    //二级栏商品数据
    currentData: [],
    isShowLocationLayer: false,//是否显示自定义授权位置弹框,
    timer: null

  },

  handleSwiper(e) {
    let { current, source } = e.detail
    if (source === 'autoplay' || source === 'touch') {
      const currentTab = current
      this.setData({
        currentTab
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获得一级栏数据
    this.getType()
    this.getHeaterHeight('#customheader')
    this.bindAuthLocation();//授权位置
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight
    })

    // 绑定 MobX store
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['address'], // 将 this.data.list 绑定为仓库中的 list ，即天气数据
      actions: ['updateAddress'], // 将 this.setList 绑定为仓库中的 setList action
    })

    // console.log(store.isLogin);


  },
  // 处理菜单切换
  handleTabChange(e) {
    let { currnet } = e.currentTarget.dataset;

    if (this.data.currentTab == currnet || currnet == undefined) return;
    this.setData({
      currentTab: currnet
    })

    //一级nav栏点击事件
    let type = e.target.dataset.type
    this.getProductByType(type)

  },
  //处理swiper 滑动事件
  handleSwiperChange(e) {

    if (this.data.timer) {
      clearTimeout(this.data.timer)
    }

    this.setData({
      currentTab: e.detail.current,
    });
    // console.log('handleSwiperChange', e, '1')
    // 在处理swiper的滑动事件中，处理sleft的值
    this.getScrollLeft()
    for (let i = 0; i < this.data.currentData.length; i++) {
      if (!this.data.currentData[i]) {

        if (this.data.currentTab == 2) {
          //  console.log('当前值已到2');
          this.getProductByType(this.data.menuDate[this.data.currentTab + 1].type, 1)
        }
        if (this.data.currentTab == 3) {
          this.getProductByType(this.data.menuDate[this.data.currentTab + 1].type, 1)
        }

      }
    }
  },
  // 处理sleft的值
  getScrollLeft() {
    const query = wx.createSelectorQuery();
    query.selectAll(".sc-item").boundingClientRect();
    query.exec(res => {
      let num = 0;
      for (let i = 0; i < this.data.currentTab; i++) {
        // console.log(res[0], 'res[0][i]')
        num += res[0][i].width;
      }
      this.setData({
        sleft: Math.ceil(num)
      })
    })
  },
  //获得地址
  getAdress(latitude, longitude) {
    //高德地图api
    const myAmapFun = new amapFile.AMapWX({ key: '29b9d1c9ae0237d216de41efcf708052' })
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: res => {
        this.setData({
          address: res[0].name + res[0].desc
        })
        store.updateAddress(res[0].name + res[0].desc)
      },
      fail: err => {
        console.log(err);
      }
    })
  },



  //获得一级nav栏数据
  getType() {
    let options = {
      url: '/type',
    }
    http.request(options).then(res => {
      res.data.result.unshift({ type: 'isHot', typeDesc: '热卖推荐' });
      this.setData({
        menuDate: res.data.result,
        currentData: new Array(res.data.result.length)
      })
    }).then(() => {
      //获得初始数据
      this.getProductByType(this.data.menuDate[this.data.currentTab].type, 0)
    })
      .then(() => {
        this.getProductByType(this.data.menuDate[this.data.currentTab + 1].type, 1)
      }).then(() => {
        this.getProductByType(this.data.menuDate[this.data.currentTab + 2].type, 2)
      })

  },


  //获得二级栏商品数据
  getProductByType(type, end) {

    let that = this
    let key = ''
    let value = ''

    if (type === 'isHot') {
      key = type;
      value = 1;
    } else {
      key = 'type';
      value = type;
    }

    let options = {
      url: '/typeProducts',
      data: {
        key,
        value
      },
    }


    if (!that.data.currentData[that.data.currentTab]) {
      wx.showLoading({
        title: '加载中',
      })
    }

    if (!end) {
      end = 0
    }
    // this.data.timer = setTimeout(() => {
    http.request(options).then(res => {

      that.data.currentData[that.data.currentTab + end] = res.data.result

      that.setData({
        currentData: that.data.currentData
      })

      wx.hideLoading()
    })

    // }, 1500)

  },


  //自适应高度
  getHeaterHeight(dom) {

    wx.createSelectorQuery().select(dom).boundingClientRect((rect) => {

      this.setData({
        Headerheight: rect.height + app.globalData.capsuleObj.height + rect.height / 2.5
      })
    }).exec()
  },
  //切换自提或外送
  choose(e) {
    if (this.data.activeType == e.target.dataset.type) return
    this.setData({
      activeType: e.target.dataset.type
    })
  },
  //位置授权
  bindCancelLocation() {
    this.setData({
      isShowLocationLayer: false,
    })
  },
  //位置授权
  bindConfirmLocation() {
    var that = this;
    //打开设置页面进行授权设置
    wx.openSetting({
      success: function (res) {
        if (res.authSetting['scope.userFuzzyLocation']) {
          //获取当前位置信息
          that.getUserLocation();
          that.setData({
            isShowLocationLayer: false,
          })
        }
      }
    });
  },
  //位置授权
  bindAuthLocation() {
    var that = this;
    //获取授权结果查看是否已授权位置
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userFuzzyLocation'] == undefined && !res.authSetting['scope.userFuzzyLocation']) //未授权位置（首次进来页面）
          that.getUserLocation();//获取当前位置信息
        else if (res.authSetting['scope.userFuzzyLocation'] === false) //未授权位置(点击官方授权弹框取消按钮后)
          that.setData({ isShowLocationLayer: true })//显示自定义授权框
        else //已授权
          that.getUserLocation();//获取当前位置信息
      }
    })
  },
  //获取用户经纬度 latitude纬度, longitude经度
  getUserLocation() {
    let that = this;
    wx.getFuzzyLocation({
      type: 'wgs84',
      success(res) {
        //经度
        const latitude = res.latitude
        //维度
        const longitude = res.longitude
        that.getAdress(latitude, longitude)
      }
    })

  },
  gotoProductDetailPage(e) {

    wx.navigateTo({
      url: `/pages/productDetail/productDetail?pid=${e.target.dataset.pid}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getHeaterHeight('#customheader')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

    this.getHeaterHeight('#customheader')
    //若用户登录了且没有位置信息，则弹出位置框
    // if (!wx.getStorageSync('address') && wx.getStorageSync('storageLogin')) {
    //   this.getUserLocation(); //获取位置
    // }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 解绑
    this.storeBindings.destroyStoreBindings()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

})