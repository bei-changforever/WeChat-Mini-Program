import { observable,action } from 'mobx-miniprogram';
// npm i --save mobx-miniprogram@4.13.2 mobx-miniprogram-bindings@1.2.1
export const store = observable({
  numA:1,
  numB:2,
  phoneInfo: '',
  isLogin: false,
  token: '',
  address: '',
  userChooseAddress: '',

  // 计算属性
  get sum(){
      return this.numA + this.numB
  },
  // actions 方式，用来修改store中的数据
  updatePhoneInfo:action(function(step){
    this.phoneInfo = step
  }) ,
  updateLogin:action(function(val){
    this.isLogin = val
  }),
  updateToken:action(function(val){
    this.token = val
  }),
  updateAddress:action(function(val){
    this.address = val
  }),
  updateuserChooseAddress:action(function(val) {
    this.userChooseAddress = val
  })
})