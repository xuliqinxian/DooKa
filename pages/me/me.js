// pages/me/me.js
var app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    userInfo:'',
    retmsg:'返回信息',
    avatarUrl: defaultAvatarUrl,
    userID:'',
    username:'',
    loginflag:false,
    scoreurl: '../../pages/myScore/myScore',
    settingsurl:'../../pages/logout/logout',
    qrcodeurl:'../../pages/myCode/myCode',
    inspiriturl:'../../pages/myInspirit/myInspirit',
    abouturl:'../../pages/about/about'
  },
  getUserProfile:function(e) {
    wx.getUserProfile({
      desc: '用于打卡', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          isShow:false,
          userInfo: res.userInfo,
          retmsg:res.userInfo.nickName 
        });
        app.userInfo = res.userInfo;
        console.log("获取到了数据并保存到全局",app.userInfo);
      }
    });
  },
  onChooseAvatar:function(e) {
    console.log("头像点击事件",e);
    const { avatarUrl } = e.detail; 
    this.setData({
      avatarUrl,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // console.log("me加载",app.globalData.userDetail);
    if(app.globalData.userDetail){
      this.setData({
        isShow:false,
        loginflag:true,
        userID:app.globalData.userDetail.userID,
        username:app.globalData.userDetail.username
      })
    }
    if(app.userInfo){
      // console.log(app.userInfo);
      if(app.userInfo){
        this.setData({
          isShow:true
        })
      }
      else{
        this.setData({
          isShow:false,
          userInfo:app.userInfo
        })
      }  
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
    // console.log("me页面show")
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
    // console.log("me页面关闭")
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