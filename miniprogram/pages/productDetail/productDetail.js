// pages/productDetail/productDetail.js
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
    productPid: '',
    productInfo: [],
    customHeaderShow: true,
    bottomHeight: 0,
    Number_of_items: 1,
    ruleDataArr: [],
    currentChoose: [],
    token: '',
    isLike: false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let that = this

    wx.getStorage({
      key: 'token',

      success: res => {

        this.setData({
          token: res.data
        })


        //进入页面获取收藏商品pid
        that.findmyLike()

      }

    })






    this.setData({
      productPid: options.pid
    })




    this.getProductDetail()
    this.bottomHeightArea()


    // 绑定 MobX store
    this.storeBindings = createStoreBindings(this, {
      store, // 需要绑定的数据仓库
      fields: ['isLogin'], // 将 this.data.list 绑定为仓库中的 list ，即天气数据
      actions: [''], // 将 this.setList 绑定为仓库中的 setList action
    })

  },
  getProductDetail() {
    let options = {
      url: '/productDetail',
      data: {
        pid: this.data.productPid
      }
    }

    http.request(options).then(res => {
      // console.log(res);

      //处理商品规格
      /* [
        {
          title: '温度',
          activeIndex: 0,
          subRule: [
            {
              title: '热'
            },
            {
              title: '冷'
            }
          ]
        }
      ] */
      let data = res.data.result[0]
      data.desc = data.desc.split(/\n/);

      let ruleData = []

      let ruleName = ['cream', 'milk', 'sugar', 'tem']

      ruleName.forEach(item => {
        //获取当前大规格的子规格数据
        let subRule = data[item]

        if (!subRule) return;

        //大的规格数据, 比如 温度, 糖, ...
        let rule = {
          //大规格标题
          title: data[`${item}_desc`],
          //默认激活下标
          activeIndex: 0,
          //子规格数据
          subRule: [],
        }
        subRule.split(/\//).forEach(r => {
          rule.subRule.push({ title: r, selected: false })
        })
        ruleData.push(rule)
      })
      data.ruleData = ruleData

      this.setData({
        productInfo: data,
        ruleDataArr: ruleData,
        currentChoose: new Array(ruleData.length)
      })
      ruleData.forEach((item, index) => {
        this.data.currentChoose[index] = ruleData[index].subRule[item.activeIndex]
      })

      this.setData({
        currentChoose: this.data.currentChoose
      })
    })
  },

  bottomHeightArea() {
    let { screenHeight, safeArea } = app.globalData
    if (screenHeight && safeArea) {
      let safeBottom = screenHeight - safeArea.bottom
      this.setData({
        bottomHeight: safeBottom + 6
      })
    }
  },
  chooseType(e) {

    let { index, type, num } = e.currentTarget.dataset
    if (type.activeIndex == index) return wx.showToast({ title: '已选择该选项' });
    this.setData({
      [`productInfo.ruleData[${num}].activeIndex`]: index
    })
    this.data.currentChoose[num] = this.data.productInfo.ruleData[num].subRule[this.data.productInfo.ruleData[num].activeIndex]
    this.setData({
      currentChoose: this.data.currentChoose
    })
  },
  onChange(event) {
    // console.log(event.detail);
    this.setData({
      Number_of_items: event.detail
    })
  },
  addCart() {

    if (this.data.token.length == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
    }
    else {


      let rule = this.data.currentChoose
      //  console.log(rule);

      let r = []

      rule.forEach(item => {
        r.push(item.title)
      })

      //  console.log(r);

      wx.request({
        url: 'http://www.kangliuyong.com:10002/addShopcart',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          'tokenString': this.data.token,
          'pid': this.data.productPid,
          count: this.data.Number_of_items,
          rule: r.join('/'),


        },
        success: res => {
          console.log('添加购物车==>', res);
          wx.showToast({
            title: '添加购物车',
          })

          // this.setData({
          //   Number_of_items: this.data.Number_of_items+1
          // })

          // console.log(this.data.Number_of_items);



        }
      })


    }
  },




  paynow() {
    if (this.data.token.length == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
    }
  },
  addCollect() {

    if (!this.data.isLike) {
      if (this.data.token.length == 0) {
        wx.showToast({
          title: '请先登录',
          icon: 'error'
        })
      }
      else {
        //收藏接口
        wx.request({
          url: 'http://www.kangliuyong.com:10002/like',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
            'tokenString': this.data.token,
            'pid': this.data.productPid,
          },
          success: res => {
            if (res.data.code == 800) {
              wx.showToast({
                title: res.data.msg,
              })

              this.setData({
                isLike: true
              })
            }
          }
        })

      }


    }

    else {
      if (this.data.token.length == 0) {
        wx.showToast({
          title: '请先登录',
          icon: 'error'
        })
      }
      else {
        wx.request({
          url: 'http://www.kangliuyong.com:10002/notlike',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
            'tokenString': this.data.token,
            'pid': this.data.productPid,
          },
          success: res => {

            wx.showToast({
              title: res.data.msg,
            })

            this.setData({
              isLike: false
            })

          }
        })
      }
    }



  },

  findmyLike() {
    console.log('token==>', this.data.token);


    if (this.data.token.length > 0) {
      wx.request({
        url: 'http://www.kangliuyong.com:10002/findlike',
        method: 'GET',

        data: {
          'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
          'tokenString': this.data.token,
          'pid': this.data.productPid,
        },
        success: res => {
          console.log('商品收藏==>', res);
          if (res.data.code === 1000) {
            if (res.data.result[0].pid === this.data.productPid) {
              this.setData({
                isLike: true
              })
            }
          }

        }
      })
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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

  }
})