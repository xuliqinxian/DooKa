// index.js
// 获取应用实例
var app = getApp();
Page({
  currentindex:0,
  data: {
    username:'未登录',
    userID:'未登录',
    useronboard:'2021/5/30',
    duty:'员工',
    dutytime:'8.5h',
    offdutyflag:true,
    currentsta:'当前未打卡',
    currentstationcode:'当前未打卡',
    retmsg:'未登录',
    scanret:'请扫场所编码',
    userInfo: {},
    isshow:false,
    hasUserInfo: false,
    list: [],
    cell_name:null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    console.log(app.globalData.userDetail);
    if(app.globalData.userDetail){
      this.setData({
        username:app.globalData.userDetail.username,
        userID:app.globalData.userDetail.userID
      });
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/GetTodayData/' + app.globalData.userDetail.userID ,
        method:"GET",
        success:(res)=>{
          console.log("获取当天打卡信息",res);
          if(res.statusCode == 200){
            let datas = res.data;
            console.log(res.data);
            if(res.data.length == 0){
              console.log('当天的打卡记录为空，获取最新打卡记录');
              //如果当天没打卡记录获取最近的一条记录
              wx.request({
                url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/GetLatestRecord/' + app.globalData.userDetail.userID ,
                method:"GET",
                success:(result)=>{
                  console.log('最新打卡记录',result);
                   let datas2 = result.data;
                   if(datas2[0].actionType == 1){
                    var element = {
                      time: datas2[0].DateTime,
                      con: app.globalData.userDetail.username + "在(" + datas2[0].stationcode + ")退卡",
                      isRedDot:true
                    };
                    this.setData({
                    currentsta: "在(" + datas2[0].stationcode + ")退卡",
                    currentstationcode:datas2[0].stationcode,
                    offdutyflag:true
                    });
                }else if(datas2[0].actionType == 0){
                  var retmsg = app.globalData.userDetail.username + "在(" + datas2[0].stationcode + ")打卡";
                  console.log(retmsg);
                    var element = {
                      time: datas2[0].DateTime,
                      con: app.globalData.userDetail.username + "在(" + datas2[0].stationcode + ")打卡",
                      isRedDot:false
                    };
                    this.setData({
                      currentsta: "在(" + datas2[0].stationcode + ")打卡",
                      currentstationcode:datas2[0].stationcode,
                      offdutyflag:false
                    });
                    app.globalData.currentstationcode = datas2[0].cell_name;
                }
                this.setData({
                  list:this.data.list.concat(element),
                });
                }
              });
            }
            else{
              datas.forEach((item, index)=> {
                console.log(index + '返回信息：' + datas[index]);
                if(datas[index].actionType == 1){
                    var retmsg = app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡";
                    var element = {
                      time: datas[index].DateTime,
                      con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡",
                      isRedDot:true
                    };
                    //最后一条记录状态更新到显示区域
                    if(index == 0){
                      this.setData({
                        currentsta: "在(" + datas[index].stationcode + ")退卡",
                        currentstationcode:datas[index].stationcode,
                        offdutyflag:true
                        });
                    }
                }else if(datas[index].actionType == 0){
                  var retmsg = "在(" + datas[index].stationcode + ")打卡";
                  console.log(retmsg);
                    var element = {
                      time: datas[index].DateTime,
                      con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")打卡",
                      isRedDot:false
                    }
                    if(index == 0){
                      this.setData({
                        currentsta: "在(" + datas[index].stationcode + ")打卡",
                        currentstationcode:datas[index].stationcode,
                        offdutyflag:false
                        });
                        app.globalData.currentstationcode = datas[index].cell_name;
                    }
                }
                this.setData({
                  list:this.data.list.concat(element)
                });
              });
            }            
          } 
        }
      });
      this.setData({
        isshow:true
      });
    }
  },
  offduty:function(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定打下班卡？',
      complete: (res) => {
        if (res.confirm) {
          console.log("用户确认下班");
          
    wx.request({
      url:  app.globalData.serverurl + app.globalData.swversion +'/api/ClockIn2/' + app.globalData.userDetail.userID,
      method:"POST",
      success:(res)=>{
        console.log("手动退卡返回",res);
        if(res.statusCode == 200){
         wx.showToast({
           title:'打下班卡成功'
         });
         let datas = res.data;
          datas.forEach( (item, index)=> {
            console.log(index + '返回信息：' + datas[index].msg);
            if(datas[index].msg.indexOf("退卡")>=0){
                var element = [{
                  time: datas[index].msgtimestamp,
                  con: datas[index].msg,
                  isRedDot:true
                }]
            }else if(datas[index].msg.indexOf("打卡")>=0)
            {
              var element = [{
                time: datas[index].msgtimestamp,
                con: datas[index].msg,
                isRedDot:false
              }]
            }
            this.setData({
              list:element.concat(this.data.list),
              currentsta: '已下班',
              currentstationcode:'已下班',
              offdutyflag:true
            });
          })
        } 
      }
    })
        }else if(res.cancel){
          return;
        }
      }
    });
 },
  ToScan:function(){
    // var that = this;
    if(app.globalData.userDetail){
      var scanret = '';
      let cell_name = '';
      wx.scanCode({
        onlyFromCamera: true,
        success :(res) =>{
          scanret = res.result;
          if(!(scanret.indexOf("DMSYY")>=0))
          {
            wx.showToast({
              title:'无效条码请重扫',
              icon:'error'
            });
            return;  
          }
          this.setData(
            {
              scanret:scanret
            }
          );
      // 获取场所码对应的场所名称
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/Cell/' + scanret,
        method:"GET",
        success:(res)=>{
          console.log("获取场所码",res);
          if(res.statusCode == 200){
            this.setData({
              cell_name:res.data.cell_name,
            });
            console.log("获取到场所码:",this.data.cell_name);
            var aaa = '确定在' + this.data.cell_name + '打卡？';
            wx.showModal({
              title: '温馨提示',
              content: aaa,
              complete: (res) => {
                if (res.confirm) {
                  console.log("用户确认打卡",this.data.cell_name);
                  try{
                    wx.request({
                      url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/'+ app.globalData.userDetail.userID + '/' + scanret,
                      method:"POST",
                      success:(res)=>{
                        console.log(app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/'+ app.globalData.userDetail.userID + '/' + scanret);
                        this.setData({
                          retmsg:res.statusCode
                        });
                        if(res.statusCode == 200){
                          let datas = res.data;
                          console.log(res.data);
                          datas.forEach( (item, index)=> {
                            console.log(index + '返回信息：' + datas[index].msg);
                            if(datas[index].msg.indexOf("重复打卡")>=0){
                              wx.showToast({
                                title:'重复卡不上传'
                              });
                              return;
                            }
                            else{
                              if(datas[index].msg.indexOf("退卡")>=0){
                                  var element = [{
                                    time: datas[index].msgtimestamp,
                                    con: datas[index].msg,
                                    isRedDot:true
                                  }];
                                  if(index == datas.length - 1){
                                    this.setData({
                                      currentsta: '在(' + this.data.cell_name + ')退卡',
                                      currentstationcode:this.data.cell_name,
                                      offdutyflag:true
                                    })
                                  }
                              }else if(datas[index].msg.indexOf("打卡")>=0)
                              {
                                  var element = [{
                                    time: datas[index].msgtimestamp,
                                    con: datas[index].msg,
                                    isRedDot:false
                                  }];
                                  if(index == datas.length - 1){
                                    this.setData({
                                      currentsta: '在(' + this.data.cell_name + ')打卡',
                                      currentstationcode:this.data.cell_name,
                                      offdutyflag:false
                                    })
                                    app.globalData.currentstationcode = this.data.cell_name;
                                  }
                              }
                            }
                              this.setData({
                              list:element.concat(this.data.list),
                            });
                            wx.showToast({
                              title:'打卡成功',
                            });
                          })
                        }
                      },
                      fail:(rest)=>{
                        console.log(rest);
                        this.setData({
                          retmsg:"执行上传失败"+rest.errMsg
                        });
                      }
                    });
                  }
                  catch(e){
                    console.log(e);
                    this.setData({
                      retmsg:e.errMsg
                    });
                  }
                }else if(res.cancel){
                  return;
                }
              }
            });
          } 
        },
        fail:(result)=>{
          console.log("获取场所码异常:",result);
          return;
        }
      });
      }
      });
    }
    else{
      wx.showModal({
        title: '温馨提示',
        content: '请先登录',
        complete: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../pages/login/login',
            })
          }else if(res.cancel){
            wx.showToast(
              {
                title: '亲，您拒绝了请求，不能使用此功能',
                icon: 'error',
                duration:2000
              }
            );
          }
        }
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady() {
    // this.getServerData();
  },
    // getServerData() {
    //   //模拟从服务器获取数据时的延时
    //   setTimeout(() => {
    //     //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    //     let res = {
    //         categories: ["维度1","维度2","维度3","维度4","维度5","维度6"],
    //         series: [
    //           {
    //             name: "成交量1",
    //             data: [90,110,165,195,187,172]
    //           },
    //           {
    //             name: "成交量2",
    //             data: [190,210,105,35,27,102]
    //           }
    //         ]
    //       };
    //     this.setData({ chartData: JSON.parse(JSON.stringify(res)) });
    //   }, 500);
    // }
})
