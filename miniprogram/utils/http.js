const ui = require('./ui')
const BASE_URL = 'http://www.kangliuyong.com:10002'
/**
 * 网络请求request
 * obj.data 请求接口需要传递的数据
 * obj.showLoading 控制是否显示加载Loading 默认为false不显示
 * obj.contentType 默认为 application/json
 * obj.method 请求的方法  默认为GET
 * obj.url 请求的接口路径 
 * obj.message 加载数据提示语
 */

const request = (options) => {
  return new Promise(function (resolve, reject) {
    if (options.showLoading) {
      ui.showLoading(options.message ? options.message : '加载中...');
    }
    let data = {}
    if (options.data) {
      data = options.data
    }
    let contentType = 'application/json';
    if (options.contentType) {
      contentType = options.contentType
    }
    let method = 'GET'
    if (options.method) {
      method = options.method
    }
    data.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='
    wx.request({
      url: BASE_URL + options.url,
      // 请求的参数
      data: data,
      method: method,
      //添加请求头
      header: {
        "content-type": "application/json; charset=utf-8",
        // 'Content-Type': contentType,
        // 'token': wx.getStorageSync('token') //获取保存的token
      },
      //请求成功
      success: res => {
    
        // console.log('================================================')
        // console.log('==    接口地址：' + options.url);
        // console.log('==    接口参数：' + JSON.stringify(data));
        // console.log('==    请求类型：' + method);
        // console.log("==    接口状态：" + res.statusCode);
        // console.log("==    接口数据：" + JSON.stringify(res.data));
        // console.log('================================================')
        ui.hideLoading()
        resolve(res)
      },
      fail: () => {
        reject("服务器连接异常，请检查网络再试");
      },
      complete:() => {
        ui.hideLoading()
      }
    })
  })
}

module.exports = {
  request
}