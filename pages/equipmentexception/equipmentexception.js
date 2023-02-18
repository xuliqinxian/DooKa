// pages/equipmentexception/equipmentexception.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[{ name: 'rep', value: '维修' },
    { name: 'chk', value: '保养', checked: 'true' }],
    stationtypeopt:[{ name: 'FG', value: '成品' },
    { name: 'PCBA', value: '半成品', checked: 'true' }],
    dayandnightopt:[{ name: 'DAY', value: '白班' },
    { name: 'NIGHT', value: '晚班', checked: 'true' }],
    linearry:['L1','L2','L3','L4','L5','L6','L7',
              'L8','L9','L10','L11','L12','L13','L14'],
    stationnamearry:['PCBA性能测试','PCBA功能测试','焊锡机','成品全键测试','AOI','成品语音测试','终检'],
    staarry:['OPEN','CLOSED'],
    currentlinename:'L1',
    currentstationname:'成品语音测试',
    currentpdcode:'',
    currentsta:'OPEN',
    username:'',
    userID:'',
    selectdate:'选择日期',
    selectstarttime:{date:'选择日期',time:'选择时间'},
    selectclosedtime:{date:'选择日期',time:'选择时间'},
    selectrecheckobj:{date:'选择日期',time:'选择时间'},
    choosestationtype:'PCBA',
    choosedayandnight:'DAY',
    chooserepandcheck:'chk',
    issue_description:'',
    issue_cause:'',
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('产线异常打卡加载',options.id);
    var tmpdate = new Date().toJSON().substring(0,10);
    //var tmptime = time;
    this.setData({
      date:tmpdate
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
  handlePDcodeChanges:function(e){
    console.log("产品型号",e);
    this.setData({
      currentpdcode:e.detail.value,
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
  radioChange1:function(e){
    //维修/保养
    console.log("维修/保养",e);
    this.setData({
      chooserepandcheck:e.detail.value,
    })
  },
  radioChange2:function(e){
    //成品/半成品
    console.log("成品/半成品",e);
    this.setData({
      choosestationtype:e.detail.value,
    })
  },
  radioChange3:function(e){
    //白班/晚班
    console.log("白班/晚班",e);
    this.setData({
      choosedayandnight:e.detail.value,
    })
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
  bindDateChange2:function(e){
    var time = this.data.selectclosedtime.time;
    var date = e.detail.value;
    var tmp = {date,time};
    this.setData({
      selectclosedtime:tmp,
    })
  },
  bindTimeChange2:function(e){
    console.log("开始时间选择",e)
    var date = this.data.selectclosedtime.date;
    var time = e.detail.value + ":00";
    var tmp = {date,time};
    this.setData({
      selectclosedtime:tmp,
    })
  },
  bindDateChange3:function(e){
    var date = e.detail.value;
    this.setData({
      selectdate:date,
    })
  },
  bindDateChange4:function(e){
    var time = this.data.selectrecheckobj.time;
    var date = e.detail.value;
    var tmp = {date,time};
    this.setData({
      selectrecheckobj:tmp,
    })
  },
  bindTimeChange4:function(e){
    console.log("开始时间选择",e)
    var date = this.data.selectrecheckobj.date;
    var time = e.detail.value + ":00";
    var tmp = {date,time};
    this.setData({
      selectrecheckobj:tmp,
    })
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
  }else if (this.data.currentpdcode == '') {
    warn = "产品型号不能空";
  }else if ((this.data.selectstarttime.date == '选择日期') | (this.data.selectclosedtime.date == '选择日期' | this.data.selectdate == '选择日期')){
    warn = "日期不能空";
  }
  else if ((this.data.selectstarttime.time == '选择时间') | (this.data.selectclosedtime.time == '选择时间')){
    warn = "时间不能空";
  }
  // else if ((this.data.selectstarttime.date == '选择日期') | (this.data.selectclosedtime.date == '选择日期') | (this.data.selectrecheckobj.date == '选择日期')){
  //   warn = "日期不能空";
  // }
  // else if ((this.data.selectstarttime.time == '选择时间') | (this.data.selectclosedtime.time == '选择时间') | (this.data.selectrecheckobj.time == '选择时间')){
  //   warn = "时间不能空";
  // }
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
    wx.request({
      url: 'https://www.himitdms.com:3001/V2/api/LineExcepReport/' + 
            this.data.issue_description + '/' + 
            this.data.issue_cause + '/' + 
            this.data.username +'/'+ 
            this.data.userID + '/' +
            this.data.chooserepandcheck + '/' + 
            // this.data.selectstarttime.date + '/' + 
            // this.data.selectclosedtime.date + '/' + 
            this.data.selectstarttime.date + ' ' + this.data.selectstarttime.time +'/'+ 
            this.data.selectclosedtime.date + ' ' + this.data.selectclosedtime.time +'/'+ 
            this.data.currentlinename+ '/' + 
            this.data.currentpdcode + '/' + 
            this.data.choosestationtype+'/'+ 
            this.data.currentstationname + '/' + 
            this.data.selectdate+ '/' + 
            this.data.choosedayandnight+ '/' +
            this.data.currentsta
            // + '/' +
            // this.data.selectrecheckobj.date
            // this.data.selectrecheckobj.date + ' ' + this.data.selectrecheckobj.time
            ,
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