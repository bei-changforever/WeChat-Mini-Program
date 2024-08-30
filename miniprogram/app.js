// app.js
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from './store/store'
App({ 
  // 全局缓存
  globalData: {},
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }
   

    //获取自定义顶部高度的相关参数
    let capsuleObj = wx.getMenuButtonBoundingClientRect();
    // console.log('==胶囊信息==');
    // console.log(capsuleObj);


    wx.getSystemInfo({
      success: res => {
        // console.log('==获取系统信息==');
        console.log(res);
        let statusBarHeight = res.statusBarHeight; //顶部状态栏高度
        let safeArea = res.safeArea //安全区域
        let screenHeight = res.screenHeight
        this.globalData.screenHeight = screenHeight
        this.globalData.safeArea = safeArea
        this.globalData.capsuleObj = capsuleObj
        this.globalData.titleHeight = statusBarHeight + capsuleObj.height + (capsuleObj.top - statusBarHeight) * 2
      }
    })





   //地理定位
   wx.authorize({ scope: 'scope.userFuzzyLocation' })
    

  },
  
});
