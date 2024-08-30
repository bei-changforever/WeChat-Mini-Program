// pages/login/login.js
const http = require('../../utils/http')
const ui = require('../../utils/ui')
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //登录数据
    userInfoLogin: {
      phone: '',
      password: ''
    },

    //注册数据
    userInfoRegister: {
      phone: '',
      password: '',
      nickName: ''
    },
    userInfo: {},

    //是否显示注册弹窗
    isShow: false,

    //手机号正则表达式
    phoneReg: /^1[3-9]\d{9}$/,

    //密码正则表达式(首字符为字母，可由字母数字下划线组合[6-16位])
    passwordReg: /^[A-Za-z]\w{5,15}$/,

    //昵称正则表达式(中英文组合[1-16])
    nickNameReg: /^[A-Za-z\u4e00-\u9fa5]{1,16}$/,

    //查看注册密码
    isViewRegPwd: false,

    //查看登录密码
    isViewLoginPwd: false,
      
    
  },
  onClickLeft() {
    wx.navigateBack()
    wx.showToast({ title: '返回', icon: 'none' });
  },

  onPhoneChange(event) {

  },

  onPassWordChange(event) {

  },
  showRegister() {
    this.setData({
      isShow: true
    })
  },
  onClose() {
    this.setData({
      isShow: false
    })
  },
  viewLoginPwd() {
    this.setData({
      isViewLoginPwd: !this.data.isViewLoginPwd
    })
  },
  viewRegPwd() {
    this.setData({
      isViewRegPwd: !this.data.isViewRegPwd
    })
  },

  getUserInfo(e) {
    // 判断是否获取用户信息成功
    if (e.detail.errMsg === 'getUserInfo:fail auth deny') return wx.showToast({ title: '您取消了登录授权！', })

    // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
    console.log(e.detail.userInfo)

  },
  phoneregister(event) {
    //   this.setData({
    //     ['userInfoRegister.phone']: event.detail
    //   })
  },
  passwordregister(event) {
    //   this.setData({
    //     ['userInfoRegister.password']: event.detail
    //   })
  },
  nicknameegister(event) {
    //   this.setData({
    //     ['userInfoRegister.nickName']: event.detail
    //   })
  },
  formLogin(e) {
    let { phone, password } = e.detail.value
    wx.request({
      url: 'http://www.kangliuyong.com:10002/login',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        appkey: 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        password,
        phone
      },
      success: res => {
        console.log(res);
        wx.showToast({
          title: res.data.msg,
        })
        if (res.data.code == 200) {


          wx.setStorage({
            key: 'token',
            data: res.data.token
          })

          store.updateLogin(true)

          wx.switchTab({
            url: '/pages/menu/menu',
          })
        }

      }
    })

  },
  formSubmit(e) {
    let reg_tel = /^1[3-9]\d{9}$/;
    let reg_pass = /^[A-Za-z]\w{5,15}$/;
    let reg_name = /^[A-Za-z\u4e00-\u9fa5]{1,16}$/;
    let { phone, password, nickName } = e.detail.value
    if (!reg_tel.test(phone)) {
      return wx.showToast({
        title: '手机号码格式不对',
        icon: 'error'
      })
    }
    if (!reg_pass.test(password)) {
      return wx.showToast({
        title: '密码首字符为字母，可由字母数字下划线组合',
        icon: 'error'
      })

    }
    if (!reg_name.test(nickName)) {
      return wx.showToast({
        title: '昵称可由中文组合',
        icon: 'error'
      })
    }

    // nickName: "zxy"
    // password: "b5201314"
    // phone: "13293882688"

    console.log(phone, password, nickName);

    wx.request({
      url: 'http://www.kangliuyong.com:10002/register',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'nickName': nickName,
        'password': password,
        'phone': phone
      },
      success: res => {
        console.log(res);
        if (res.data.code == 100) {
          this.data.userInfoRegister = {
            phone: '',
            password: '',
            nickName: ''
          }
          wx.showToast({
            title: '注册成功',
          })
          this.setData({
            userInfoRegister: this.data.userInfoRegister,
            isShow: false
          })
        
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      // 绑定 MobX store
      this.storeBindings = createStoreBindings(this, {
        store, // 需要绑定的数据仓库
        fields: ['isLogin'], // 将 this.data.list 绑定为仓库中的 list ，即天气数据
        actions: ['updateLogin'], // 将 this.setList 绑定为仓库中的 setList action
      })
      // console.log(store.updateLogin);
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