// pages/linereport/linereport.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linearry:['L1','L2','L3','L4','L5','L6','L7',
              'L8','L9','L10','L11','L12','L13','L14',
              'L5','L16','L17','L18','L19','L20'],
    missiondegreearry:['金牌','银牌','铜牌','一般任务'],
    PDOrderCodearry:['RC431','RC451','RC468','RC461','RC455'],
    selectstarttime:{date:'选择日期',time:'选择时间'},
    reporttime:'',
    RepChkarry:['维修','保养'],
    stationnamearry:['测试组包','PCBA功能测试','焊锡机'],
    staarry:['OPEN','CLOSED'],
    currentlinename:'L1',
    currentstationname:'测试组包',
    currentsta:'OPEN',    
    currentPDOrderCode:'RC431',
    currentRepChk:'维修',
    currentmissiondegree:'金牌',
    username:'',
    userID:'',
    username_reporter:'',
    userID_reporter:'',
    issue_description:'',
    issue_cause:'',
    issue_solution:'',
    recheck_userID:'',
    recheck_username:'',
    recheck_reply:'',
    date:'',  
    num: 1,  
    minusStatus: 'disabled',
    loseother:'',
    showrecheck:false,
    islock:false,
    Recordid:''
  },
/* 点击减号 */  
bindMinus: function() {  
  var num = this.data.num;  
  // 如果大于1时，才可以减  
  if (num > 1) {  
      num --;  
  }  
  // 只有大于一件的时候，才能normal状态，否则disable状态  
  var minusStatus = num <= 1 ? 'disabled' : 'normal';  
  // 将数值与状态写回  
  this.setData({  
      num: num,  
      minusStatus: minusStatus  
  });  
},
/* 点击加号 */  
bindPlus: function() {  
  var num = this.data.num;  
  // 不作过多考虑自增1  
  num ++;  
  // 只有大于一件的时候，才能normal状态，否则disable状态  
  var minusStatus = num < 1 ? 'disabled' : 'normal';  
  // 将数值与状态写回  
  this.setData({  
      num: num,  
      minusStatus: minusStatus  
  });  
},  
/* 输入框事件 */  
bindManual: function(e) {  
  var num = e.detail.value;  
  // 将数值与状态写回  
  this.setData({  
      num: num  
  });  
},
handleLoseOtherChanges:function(e){
  console.log('受影响其它',e);
  this.setData({
    loseother:e.detail.value
  });
},
handleRelayChanges:function(e){
  console.log('审核意见',e);
  this.setData({
    recheck_reply:e.detail.value
  });
},
handleRechkerIDChanges:function(e){
  console.log('审核人工号',e);
  this.setData({
    recheck_userID:e.detail.value
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('产线异常打卡加载',options);
    var date = new Date().toJSON().substring(0,10);
    //var tmptime = time;
    this.setData({
      date:date
    })
    if(options.route == 1){
        // selectstarttime
        let time;
      // let yy = new Date().getFullYear();
      // let mm = new Date().getMonth()+1;
      // let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10?'0'+new Date().getMinutes():
        new Date().getMinutes();
      let ss = new Date().getSeconds()<10?'0'+new Date().getSeconds():
        new Date().getSeconds();
        // time = `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`;
        time = `${hh}:${mf}:${ss}`;
        var selectstarttime = {date,time};
        console.log('时间',selectstarttime);
        this.setData({
          islock:false,
          selectstarttime:selectstarttime,
          currentlinename: this.data.linearry[options.id]
        });
    }else if(options.route == 2){
      this.setData({
        islock:true,
        showrecheck:true,
        Recordid:options.Recordid
      });
      //获取指定Reordid的记录
      wx.request({
        url: 'https://www.himitdms.com:3001/V2/api/LineExcepReport2/' + this.data.Recordid,
        method:'GET',
        success:(res)=>{
          console.log("获取指定Recordid的打卡信息",res);
          if(res.statusCode == 200){
            let datas = res.data;
            console.log(res.data);     
            if(res.data.indexOf("error") >=0){
              console.log("异常",res);
            }   
            else{
              let datasss = res.data;
              datasss.forEach( (item, index)=> {
                this.setData({
                  currentlinename:datasss[index].linename,
                  currentmissiondegree:datasss[index].mission_level,
                  currentstationname:datasss[index].ownner_department,
                  currentRepChk:datasss[index].rep_chk,
                  loseother:datasss[index].lose_other_time,
                  num:datasss[index].lose_time,
                  currentPDOrderCode:datasss[index].pd_order_code,
                  userID_reporter:datasss[index].ownner_userID,
                  issue_description:datasss[index].issue_description,
                  username:datasss[index].applier_username,
                  userID:datasss[index].charge_man_userID,
                  reporttime:datasss[index].report_time,
                  issue_cause:datasss[index].issue_cause,
                  currentsta:datasss[index].issue_sta,
                  recheck_userID:app.globalData.userDetail.userID,
                  recheck_username:app.globalData.userDetail.username,
                  showrecheck:true
                });
                // this.setData({
                //   currentlinename:datasss[index].linename,
                //   showrecheck:true
                // });
              })
            }
          }
        }
      });
    }
    else{

    }
  },
  ApproveIt:function(e){
    console.log('https://www.himitdms.com:3001/V2/api/LineExcepReport2/' + this.data.Recordid + '/' + this.data.currentsta + '/' + this.data.recheck_userID + '/' + this.data.recheck_username + '/' + this.data.recheck_reply);
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/LineExcepReport2/' + this.data.Recordid + '/' + this.data.currentsta + '/' + this.data.recheck_userID + '/' + this.data.recheck_username + '/' + this.data.recheck_reply,
      method:"PUT",
      success:(res)=>{
        console.log("审批线体报告返回",res);
        if(res.statusCode == 200){
          wx.showToast({
            title: '提交成功',
          });
          wx.reLaunch({
            url:'../approvemain/approvemain?route=2',
          });
        } 
      }
    })
  },
  bindPDOrderCodeChange:function(e){
    console.log(e.detail.value);
    this.setData({
      currentPDOrderCode:this.data.PDOrderCodearry[e.detail.value]
    });
  },
  bindStaChange:function(e){
    console.log(e.detail.value);
    this.setData({
      currentsta:this.data.staarry[e.detail.value]
    });
  },
  bindstationChange:function(e){
    console.log(e.detail.value);
    this.setData({
      currentstationname:this.data.stationnamearry[e.detail.value]
    });
  },
  bindRepChkChange:function(e){
    console.log(e.detail.value);
    this.setData({
      currentRepChk:this.data.RepChkarry[e.detail.value]
    });
  },
  bindDateChange1:function(e){
    console.log("开始时间选择",e)
    var time = this.data.selectstarttime.time;
    var date = e.detail.value;
    var tmp = {date,time};
    this.setData({
      selectstarttime:tmp,
    })
  },
  bindTimeChange1:function(e){
    console.log("开始时间选择",e)
    var date = this.data.selectstarttime.date;
    var time = e.detail.value + ":00";
    var tmp = {date,time};
    this.setData({
      selectstarttime:tmp,
    })
  },
  bindLineChange:function(e){
    console.log(e.detail.value);
    this.setData({
      currentlinename:this.data.linearry[e.detail.value]
    });
  },
  bindStationnameChange:function(e){
    console.log(e.detail.value);
    this.setData({
      currentstationname:this.data.stationnamearry[e.detail.value]
    });
  },
  handlesolutionChanges:function(e){
    console.log("改善对策",e);
    this.setData({
      issue_solution:e.detail.value,
    })
  },
  handledescChanges:function(e){
    console.log("问题描述",e);
    this.setData({
      issue_description:e.detail.value,
    })
  },
  handlecauseChanges:function(e){
    console.log("原因分析",e);
    this.setData({
      issue_cause:e.detail.value,
    })
  },
  handleOwnnerChanges:function(e){
    console.log("责任人工号",e);
    this.setData({
      userID:e.detail.value,
    });
    //根据工号查到姓名
  },
  handleBlurOwnner:function (e) {
    // 获取姓名
      //再次获取用户详细信息
      var tmpuserID = e.detail.value;
      wx.request({
      url: app.globalData.serverurl + app.globalData.swversion + '/api/User/'+ tmpuserID,
      method: "GET",
      success:(result) => {
        console.log("获取到用户详细信息",result);
        this.setData({
          username: result.data.username,
        })
      }});
  },
  handleReporterChanges:function(e){
    console.log("打卡人工号",e);
    this.setData({
      userID_reporter:e.detail.value,
      issue_solution:e.detail.value
    });
    //根据工号查到姓名
  },
  handleBlurReporter:function (e) {
    // 获取姓名
      //再次获取用户详细信息
      var tmpuserID = e.detail.value;
      wx.request({
      url: app.globalData.serverurl + app.globalData.swversion + '/api/User/'+ tmpuserID,
      method: "GET",
      success:(result) => {
        console.log("获取到用户详细信息",result);
        this.setData({
          username_reporter: result.data.username,
        })
      }});
  },
  handleBlurRechkerID:function (e) {
    // 获取姓名
      //再次获取用户详细信息
      var tmpuserID = e.detail.value;
      wx.request({
      url: app.globalData.serverurl + app.globalData.swversion + '/api/User/'+ tmpuserID,
      method: "GET",
      success:(result) => {
        console.log("获取到用户详细信息",result);
        this.setData({
          recheck_username: result.data.username,
        })
      }});
  },
  submitreport:function(e){
    console.log("上传打卡信息",e);
   //检查数据是否填写完整
   var warn = null;
   if (this.data.userID == '') {
    warn = "责任人工号不能空";
  } else if (this.data.issue_description == '') {
    warn = "问题描述不能空";
  }else if (this.data.issue_cause == '') {
    warn = "原因分析不能空";
  }else if (this.data.loseother == '') {
    warn = "受影响其它不能空";
  }
   if (warn != null) {
    wx.showModal({
      title: '提示',
      content: warn
    })
    // that.setData({
    //   disabled: false,
    //   color: '#33FF99'
    // })
    return;
  }
  var tmpurl = 'https://www.himitdms.com:3001/V2/api/LineExcepReport2/' + 
  this.data.issue_description + '/' + 
  this.data.issue_cause + '/' + 
  this.data.issue_solution + '/' + 
  this.data.num + '/' +
  this.data.loseother + '/' +
  this.data.username +'/'+ 
  this.data.userID + '/' +
  this.data.currentstationname + '/' +
  this.data.currentlinename+ '/' + 
  this.data.currentsta;
 console.log(tmpurl);

    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/LineExcepReport2/' + 
            this.data.issue_description + '/' + 
            this.data.issue_cause + '/' + 
            this.data.userID_reporter + '/' + 
            this.data.num + '/' +
            this.data.loseother + '/' +
            this.data.username +'/'+ 
            this.data.userID + '/' +
            this.data.currentstationname + '/' +
            this.data.currentlinename+ '/' + 
            this.data.currentsta+ '/' + 
            this.data.selectstarttime.date + ' ' + this.data.selectstarttime.time+ '/' + 
            this.data.currentRepChk + '/' + 
            this.data.currentmissiondegree + '/' + 
            this.data.currentPDOrderCode,
      method:"POST",
      success:(res)=>{
        console.log("上传打卡信息返回",res);
        if(res.statusCode == 200){
          wx.showToast({
            title: '提交成功',
          });
          wx.reLaunch({
            url: '../../pages/equipment/equipment',
          });
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