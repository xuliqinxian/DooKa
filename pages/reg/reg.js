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
    NewChangesAgain: '',
    success: false,
    state: ''
  },
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
                }});
                wx.reLaunch({
                  url: '../../pages/me/me'
                });
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
                this.setData({
                  userID:''
                });
                wx.showToast({
                  title: '用户ID已存在',
                  icon:'error'
                });
              }else{
                wx.showToast({
                  title: '用户ID合法',
                  icon:'success'
                })
              }
          }
          else{
            this.setData({
              userID:''
            });
            wx.showToast({
              title: '用户ID不合法',
              icon:'error'
            });
          }
      } 
    });
  },
  handleInputUserName:function (e) {
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
    console.log(e);
    this.setData({
      NewChanges: e.detail.value
    })
  },
  handleNewChangesAgain: function (e) {
    console.log(e);
    this.setData({
      NewChangesAgain: e.detail.value
    })
 
  },
  doGetCode: function () {
    var that = this;
    that.setData({
      disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
      color: '#ccc',
    })

    var phone = that.data.phone;
    var currentTime = that.data.currentTime; //把手机号跟倒计时值变例成js值
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    wx.request({
      url: '', //后端判断userID是否存在， 存在返回ture ，未被注册返回false
      method: "GET",
      success: function (res) {
        that.setData({
          state: res.data
        })
        if (phone == '') {
          warn = "号码不能为空";
        } else if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
          warn = "手机号格式不正确";
        } //手机号已被注册提示信息
         else if (that.data == false) {  //判断存在userID
           warn = "userID不存在";
         }
         else {
          wx.request({
            url: '', //填写发送验证码接口
            method: "POST",
            data: {
              coachid: that.data.phone
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data)
              that.setData({
               VerificationCode: res.data.verifycode
              })
              
 
              //当手机号正确的时候提示用户短信验证码已经发送
              wx.showToast({
                title: '短信验证码已发送',
                icon: 'none',
                duration: 2000
              });
              //设置一分钟的倒计时
              var interval = setInterval(function () {
                currentTime--; //每执行一次让倒计时秒数减一
                that.setData({
                  text: currentTime + 's', //按钮文字变成倒计时对应秒数
 
                })
                //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
                if (currentTime <= 0) {
                  clearInterval(interval)
                  that.setData({
                    text: '重新发送',
                    currentTime: 61,
                    disabled: false,
                    color: '#33FF99'
                  })
                }
              }, 100);
            }
          })
        };
        //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
        if (warn != null) {
          wx.showModal({
            title: '提示',
            content: warn
          })
          that.setData({
            disabled: false,
            color: '#33FF99'
          })
          return;
        }
      }
 
    })
 
  },
  submit: function (e) {
    var that = this
    // if (this.data.Code == '') {
    //   wx.showToast({
    //     title: '请输入验证码',
    //     image: '/images/error.png',
    //     duration: 2000
    //   })
    //   return
    // } else if (this.data.Code != this.data.VerificationCode) {
    //   wx.showToast({
    //     title: '验证码错误',
    //     image: '/images/error.png',
    //     duration: 2000
    //   })
    //   return
    // }
    // else 
    if (this.data.NewChanges == '') {
      wx.showToast({
        title: '请输入密码',
        image: '/images/error.png',
        duration: 2000
      })
      return
    } else if (this.data.NewChangesAgain != this.data.NewChanges) {
      wx.showToast({
        title: '两次密码不一致',
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
        url: app.globalData.serverurl + app.globalData.swversion + '/api/User/'+ userID + '/'+ username + '/'+ phone + '/'+ NewChanges,//getApp().globalData.baseUrl + '/Coachs/insert' ,
        method: "POST",
        success:(res) => {
          if(res.statusCode = 200){
            wx.showToast({
              title: '提交成功~',
              icon: 'loading',
              duration: 2000
            })
            console.log(res)
            that.setData({
              success: true
            })
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