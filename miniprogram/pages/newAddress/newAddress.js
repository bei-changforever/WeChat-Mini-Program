// pages/newAddress/newAddress.js
import { areaList } from '@vant/area-data';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    areaList,
    show: false,
    isDefault: false,
    address: {
      name: '',
      tel: '',
      province: '',
      city: '',
      county: '',
      areaCode: '',
      addressDetail: '',
      isDefault: false
    }
    // address: {
    //   name: 姓名,
    //   tel: 电话,
    //   province: 省份,
    //   city: 市,
    //   county: 区县,
    //   addressDetail: 详细地址,
    //   areaCode: 地区编号,
    //   postalCode: 邮政编码,
    //   isDefault: 默认地址
    // }
  },
  onClickLeft(){
    wx.navigateBack()
  },
  showpop() {
    this.setData({ show: true });
  },
  confirm(event){
    console.log(event);
    let { index,values } = event.detail
    this.setData({
      ['address.province']: values[0].name,
      ['address.city']: values[1].name,
      ['address.county']: values[2].name,
      ['address.areaCode']: values[2].code
    })


  },
  onClose() {
    this.setData({ show: false });
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    
    this.setData({
      ['address.isDefault']: !this.data.address.isDefault
   });
  },
  addresssubmit(event){
    // console.log(event);
    let {name , tel  , addressDetail} = event.detail.value
 
    wx.request({
      url: 'http://www.kangliuyong.com:10002/addAddress',
      method:"POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'appkey': 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=',
        'tokenString': this.data.token,
         name,
         tel,
         addressDetail,
         province: this.data.address.province,
         city: this.data.address.city,
         county: this.data.address.county,
         areaCode: this.data.address.areaCode,
         isDefault: this.data.address.isDefault ? 1 : 0
      },
      success: res => {
        console.log(res);
        if(res.data.code == 9000) {
          wx.showToast({
            title: '保存成功',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     wx.getStorage({
       key:'token',
       success: res => {
         if(res.data) {
           this.setData({
             token: res.data
           })
         }
       }
     })
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