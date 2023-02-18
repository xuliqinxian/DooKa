var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: '获取验证码', //按钮文字
    currentTime: 61, //倒计时
    disabled: false, //按钮是否禁用
    userID:'',
    username:'',
    phone: '', //获取到的手机栏中的值
    VerificationCode: '',
    Code: '',
    NewChanges: '',
    success: false,
    state: ''
  },
  /**
    * 获取验证码
    */
  return_home: function (e) {
    var that = this
      var NewChanges = that.data.NewChanges;
      var userID = that.data.userID;
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/User/'+ userID + '/'+ NewChanges,//getApp().globalData.baseUrl + '/Coachs/insert' ,
        method: "GET",
        success:(res) => {
          console.log("登录返回信息",res.data)
          var ret = res.data
          console.log(ret)
          if(res.statusCode == 200){
            if(ret == 1){  
              wx.showToast({
                title: '登录成功~',
                icon: 'loading',
                duration: 2000
              })
              that.setData({
                success: true
              });
              //再次获取用户详细信息
              wx.request({
                url: app.globalData.serverurl + app.globalData.swversion + '/api/User/'+ userID ,
                method: "GET",
                success:(result) => {
                  console.log("获取到用户详细信息",result);
                  app.globalData.userDetail = {
                    userID:result.data.userID,
                    username:result.data.username,
                    usertype:result.data.usertype
                  };
                  console.log(app.globalData.userDetail.username);
                  console.log("全局变量赋值完毕");
                  wx.setStorageSync('user', app.globalData.userDetail);
                  console.log("缓存赋值完毕");
                  wx.reLaunch({
                    url: '../../pages/me/me'
                  });
                }});
            }else{
              wx.showToast({
                title: '登录失败~',
                icon: 'error',
                duration: 2000
              })
            }
          }
        },
        fail:(result)=>{
          console.log(result.errMsg)
        }
      })
  },
  handleInputUserID:function (e) {
    console.log(e);
    this.setData({
      userID: e.detail.value
    })
  },
  handleBlurUserID:function(e) {
    console.log("失去焦点",e);
    console.log(app.globalData.serverurl + app.globalData.swversion + '/api/User/CheckUserIDUnique/' + e.detail.value);
    // 首先检查员工号是否存在
    wx.request({
      url: app.globalData.serverurl + app.globalData.swversion + '/api/User/CheckUserIDUnique/'  + e.detail.value, //后端判断是否已被注册， 已被注册返回1 ，未被注册返回0
      method: "GET",
      success: (res) => {
          if(res.statusCode == 200){
            console.log("用户ID查重",res)
              if(res.data == true){
                // wx.showToast({
                //   title: '用户ID已存在',
                //   icon:'success'
                // });
              }else{
                this.setData({
                  userID:''
                });
                wx.showToast({
                  title: '用户ID不存在',
                  icon:'error'
                })
              }
          }
          else{
            this.setData({
              userID:''
            });
            wx.showToast({
              title: '用户ID不存在',
              icon:'error'
            });
          }
      } 
    });
  },
  handleInputUserName: function (e) {
    console.log(e);
    this.setData({
      username: e.detail.value
    })
  },
  handleInputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  handleVerificationCode: function (e) {
    console.log(e);
    this.setData({
      Code: e.detail.value
    })
  },
  handleNewChanges: function (e) {
    console.log('新密码',e);
    this.setData({
      NewChanges: e.detail.value
    })
  },
  submit: function (e) {
    var that = this;
    if (this.data.NewChanges == '') {
      wx.showToast({
        title: '请输入密码',
        image: '/images/error.png',
        duration: 2000
      })
      return
    } else {
      that.setData({
        disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
        color: '#ccc',
      });
      var that = this
      var phone = that.data.phone;
      var NewChanges = that.data.NewChanges;
      var userID = that.data.userID;
      var username = that.data.username;
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/User/ChangePasswordPut/'+ userID + '/'+ username + '/'+ phone + '/'+ NewChanges,
        method: "PUT",
        success:(res) => {
          if(res.statusCode = 200){
            console.log("修改密码返回",res);
            if(res.data.indexOf("success") >=0)
            {
              wx.showToast({
                title: '提交成功~',
                icon: 'loading',
                duration: 2000
              });
              console.log(res);
              that.setData({
                success: true
              });
            }else{
              wx.showToast({
                title: '修改失败',
                icon: 'error',
              });
              that.setData({
                disabled: false,
                color: '#33FF99'
              })
            }
          }
        },
        fail:(result)=>{
          console.log(result.errMsg)
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
 
  }
})