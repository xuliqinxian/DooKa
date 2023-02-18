// app.js
App({
  onLaunch() {
    const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })
 
        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
              })
        })
 
        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
        })

    console.log(this.globalData.serverurl);
    this.globalData.userDetail = wx.getStorageSync('user');
    console.log("加载缓存",this.globalData.userDetail);
    wx.getSetting({
      success (res) {
        console.log(res.authSetting);
        if(res.authSetting['scope.userInfo']){
          console.log("之前已经授权获取用户信息");
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log(res);
              this.globalData.userInfo = res.userInfo;
            },
            fail:(res) => {
              console.log(res.errMsg);
            }
          });
        }
        else{
          console.log("之前没有授权获取用户信息")
        }
      }
    }),
    wx.cloud.init({
      env:'asee-9gddx09z8e2fb234'
    })
  },
  globalData: {
    userInfo:null,
    userID:null,
    userDetail:null,
    swversion:'/V2',
    serverurl:'https://www.himitdms.com:3001',
    appswversion:'V1.0.17 (2023-01-13 14:54:00)',
    currentstationcode:''
  }
})
