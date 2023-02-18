// pages/equipment/equipment.js
import uCharts from '../../utils/u-charts.js';
var uChartsInstance = {};
var app = getApp();
var num= 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectdate:'2023-02-06',
    dataarry:[],
    cWidth: 720,
    cHeight: 400,
    linearry:[],
    stationarry:[],
    equipmentarry:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    currentlinename:'',
    currentlinedata:[],
    xarry:[],
    ngarry:[],
    okarry:[],
    passratearry:[],
    changedata:0,
    dataTime:'',
    isshow:true,
    route:0,
    index:2
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData.userDetail);
    if(app.globalData.userDetail){
      this.setData({
        username:app.globalData.userDetail.username,
        userID:app.globalData.userDetail.userID
      });
      if(this.data.username == '朱林')
      {
        this.setData({
          route:1
        })
      }
      if(this.data.username == '蒙国仰')
      {
        this.setData({
          route:2
        })
      }
    }
    console.log(options);
    var tmpdate = new Date().toJSON().substring(0,10);
    if(options.date != null)
    {
      console.log("选择日期",options.date);
      this.setData({
        selectdate:options.date,
      });
    }
    else{
      console.log("选择日期","当前日期")
      this.setData({
        selectdate:tmpdate,
      });
    }
    // http://srv.himitdms.com/getTestStationByDate?secret=dayordersave&date=2023-02-06
    this.getalldata();
    this.timer = setInterval(function(){
      this.timechange()
        }.bind(this),1000); // 创建定时器，每个 1s 触发一次 timechange()函数
    
    this.timer2 = setInterval(function(){
      this.timechange2()
        }.bind(this),60000); // 创建定时器，每个 60s 触发一次 timechange()函数    
  },
  ToApproveMain:function(e){
    wx.navigateTo({
      url:'../approvemain/approvemain?username={{username}}&userID={{userID}}&route=' + this.data.route,
    })
  },
  timechange2:function() {
    console.log('定时获取数据,60s一次')
    this.getalldata();
  },
  timechange:function() {
    num +=1;
    this.setData({
      changedata:num,
    });
    let dataTime;
  let yy = new Date().getFullYear();
  let mm = new Date().getMonth()+1;
  let dd = new Date().getDate();
  let hh = new Date().getHours();
  let mf = new Date().getMinutes()<10?'0'+new Date().getMinutes():
    new Date().getMinutes();
  let ss = new Date().getSeconds()<10?'0'+new Date().getSeconds():
    new Date().getSeconds();
    this.setData({
      dataTime : `${yy}-${mm}-${dd} ${hh}:${mf}:${ss}`,
    });
  },
  bindequipmentChange:function(e){
    console.log("对指定设备打卡",e.detail.value);
    wx.navigateTo({
      url:'../linereport/linereport?route=1&id=' + e.detail.value
    })
  },
  getalldata:function(){
    wx.request({
      url: 'http://srv.himitdms.com/getTestStationByDate?secret=dayordersave&date=' + this.data.selectdate,
      method:"GET",
      success:(res)=>{
        console.log("获取数据",res);
        if(res.statusCode == 200){
          this.setData({
            dataarry:res.data.data,
            rcvflag:true
          });
          //获取线体名称集合
          let datas = res.data.data;
          console.log(datas);
          var tmparry= [];
          datas.forEach((item, index)=> {
            var tmp = datas[index].line_name;
              tmparry = tmparry.concat(tmp);
          });
          var arry2 = Array.from(new Set(tmparry));//数组去重
          var arry3 = [];
          arry2.forEach((item, index)=> {
            var tmp2 = parseInt(arry2[index]);
            arry3 = arry3.concat(tmp2);
          });
          console.log(arry3);
          arry3 = arry3.sort();
          console.log(arry3);
          this.setData({
            linearry:arry3,
          });
          if(this.data.currentlinename == ''){
            this.setData({
              currentlinename:arry3[0]
            });
          }
          //获取线体数据
    wx.request({
      url: 'http://srv.himitdms.com/getTestStationByDate?secret=dayordersave&date=' + this.data.selectdate,
      method:"GET",
      success:(res)=>{
        console.log("获取数据",res);
        if(res.statusCode == 200){
          this.setData({
            dataarry:res.data.data,
          });
          //获取线体名称集合
          let datas = res.data.data;
          // console.log(datas);
          var tmparry= [];
          var tmpstationarry= [];
          datas.forEach((item, index)=> {
              var tmp = datas[index].line_name;
              tmparry = tmparry.concat(tmp);
              var tmpstation = datas[index].station_name;  
              tmpstationarry = tmpstationarry.concat(tmpstation)
          });
          var arry2 = Array.from(new Set(tmparry));//数组去重
          var arry22 = Array.from(new Set(tmpstationarry));//数组去重
          
          var arry3 = [];
          arry2.forEach((item, index)=> {
            var tmp2 = parseInt(arry2[index]);
            arry3 = arry3.concat(tmp2);
          });
          // console.log(arry3);
          arry3 = arry3.sort();
          // console.log(arry3);
          this.setData({
            linearry:arry3,
            stationarry:tmpstationarry
          });

          // console.log('当前线体名称',this.data.currentlinename)
              //从中挑出选择线体的数据
          let datas22 = this.data.dataarry;
          var tmparry33 = [];
          var xarry = [];
          var oksumarry = [];
          var ngsumarry = [];
          var passratearry = [];
          datas22.forEach((item,index)=>{
            if((datas22[index].line_name == this.data.currentlinename) & (datas22[index].station_enum_name == '成品'))
            {
              tmparry33 = tmparry33.concat(datas22[index]);
              //拉取X轴数组
              // xarry = xarry.concat(datas22[index].date.substring(11,datas22[index].date.length));
              xarry = xarry.concat(datas22[index].date.substring(11,13));
            }
          });
          //正序重排X轴数组
          console.log('重排前',xarry);
          xarry = xarry.sort();
          console.log('重排后',xarry);
          xarry = Array.from(new Set(xarry));//数组去重
          console.log('去重后',xarry);
          xarry = ['00','01','02','03','04','05','06','07','08','09',
                   '10','11','12','13','14','15','16','17','18',
                   '19','20','21','22','23'];
          xarry.forEach((item,index)=>{
            var tmpoksum = 0;
            var tmpngsum = 0;
            var tmpmachcounter = 0;
            datas22.forEach((item,index2)=>{
              if((datas22[index2].line_name == this.data.currentlinename) &
              (datas22[index2].date.substring(11,13) == xarry[index]) & (datas22[index2].station_enum_name == '成品'))
            {
              tmpmachcounter = tmpmachcounter + 1;
              tmpoksum = tmpoksum + parseInt(datas22[index2].rsT_1_OK)+parseInt(datas22[index2].rsT_2_OK)+parseInt(datas22[index2].rsT_3_OK)+parseInt(datas22[index2].rsT_4_OK);

              tmpngsum = tmpngsum + parseInt(datas22[index2].rsT_1_NG1)+parseInt(datas22[index2].rsT_2_NG1)+parseInt(datas22[index2].rsT_3_NG1)+parseInt(datas22[index2].rsT_4_NG1) + 
              parseInt(datas22[index2].rsT_1_NG2)+parseInt(datas22[index2].rsT_2_NG2)+parseInt(datas22[index2].rsT_3_NG2)+parseInt(datas22[index2].rsT_4_NG2) +
              parseInt(datas22[index2].rsT_1_NG3)+parseInt(datas22[index2].rsT_2_NG3)+parseInt(datas22[index2].rsT_3_NG3)+parseInt(datas22[index2].rsT_4_NG3);
            }
            });
            oksumarry = oksumarry.concat(tmpoksum);
            ngsumarry = ngsumarry.concat(tmpngsum);
            if(tmpmachcounter == 0){
              
            }
            if(tmpngsum + tmpoksum == 0){
              passratearry = passratearry.concat('0');
            }
            else{
              var tmppassrate = ((tmpoksum / (tmpngsum + tmpoksum)) * 100).toFixed(2);
              passratearry = passratearry.concat(tmppassrate);
            }
                 
          });
        
          console.log('当前线体数据',tmparry33);
          console.log('X',xarry);
          console.log('OK',oksumarry);
          console.log('NG',ngsumarry);
          console.log('PassRate',passratearry);
          this.setData({
            currentlinedata:tmparry33,
            xarry:xarry,
            ngarry:ngsumarry,
            okarry:oksumarry,
            passratearry:passratearry
          });
          
          //排序补空
          //计算总和
          //计算良率
          //显示数据

          let res3333 = {
            categories: this.data.xarry,
            series: [
              {
                name: "良品",
                type: "column",
                data: this.data.okarry,
                color:"#00ff00",
                index: 1, // 相对应的坐标轴
              },
              {
                name: "不良",
                type: "column",
                color: "#ff0000",
                data: this.data.ngarry,
                index: 1, // 相对应的坐标轴
              },
              {
                name: "良率曲线",
                type: "line",
                style: "curve",
                color: "#0000ff",
                disableLegend: true,
                data: this.data.passratearry,
                index: 0, // 相对应的坐标轴
              }
            ]
          };
          this.drawCharts('YANHnJpyBVZGCXwvtsvoJIUsISbudkJs', res3333);
        }
      }
    });
        }
      }
    })
  },
  bindlineChange:function(e){
    console.log('改变线号', e.detail.value);
    this.setData({
      currentlinename:this.data.linearry[e.detail.value]
    });
    //获取线号对应的index
    let itemlist = this.data.equipmentarry;
    itemlist.forEach((item,index)=>{
      if(itemlist[index] == this.data.currentlinename){
        this.setData({
          index:index
        })
      }
    });
    
    //获取线体数据
    wx.request({
      url: 'http://srv.himitdms.com/getTestStationByDate?secret=dayordersave&date=' + this.data.selectdate,
      method:"GET",
      success:(res)=>{
        console.log("获取数据",res);
        if(res.statusCode == 200){
          this.setData({
            dataarry:res.data.data,
          });
          //获取线体名称集合
          let datas = res.data.data;
          // console.log(datas);
          var tmparry= [];
          var tmpstationarry= [];
          datas.forEach((item, index)=> {
              var tmp = datas[index].line_name;
              tmparry = tmparry.concat(tmp);
              var tmpstation = datas[index].station_name;  
              tmpstationarry = tmpstationarry.concat(tmpstation)
          });
          var arry2 = Array.from(new Set(tmparry));//数组去重
          var arry22 = Array.from(new Set(tmpstationarry));//数组去重
          
          var arry3 = [];
          arry2.forEach((item, index)=> {
            var tmp2 = parseInt(arry2[index]);
            arry3 = arry3.concat(tmp2);
          });
          // console.log(arry3);
          arry3 = arry3.sort();
          // console.log(arry3);
          this.setData({
            linearry:arry3,
            stationarry:tmpstationarry
          });

          // console.log('当前线体名称',this.data.currentlinename);
              //从中挑出选择线体的数据
          let datas22 = this.data.dataarry;
          var tmparry33 = [];
          var xarry = [];
          var oksumarry = [];
          var ngsumarry = [];
          var passratearry = [];
          datas22.forEach((item,index)=>{
            if((datas22[index].line_name == this.data.currentlinename) & (datas22[index].station_enum_name == '成品'))
            {
              tmparry33 = tmparry33.concat(datas22[index]);
              //拉取X轴数组
              // xarry = xarry.concat(datas22[index].date.substring(11,datas22[index].date.length));
              xarry = xarry.concat(datas22[index].date.substring(11,13));
            }
          });
          //正序重排X轴数组
          console.log('重排前',xarry);
          xarry = xarry.sort();
          console.log('重排后',xarry);
          xarry = Array.from(new Set(xarry));//数组去重
          console.log('去重后',xarry);
          xarry = ['00','01','02','03','04','05','06','07','08','09',
                   '10','11','12','13','14','15','16','17','18',
                   '19','20','21','22','23'];
          xarry.forEach((item,index)=>{
            var tmpoksum = 0;
            var tmpngsum = 0;
            var tmpmachcounter = 0;
            datas22.forEach((item,index2)=>{
              if((datas22[index2].line_name == this.data.currentlinename) &
              (datas22[index2].date.substring(11,13) == xarry[index]) & (datas22[index2].station_enum_name == '成品'))
            {
              tmpmachcounter = tmpmachcounter + 1;
              tmpoksum = tmpoksum + parseInt(datas22[index2].rsT_1_OK)+parseInt(datas22[index2].rsT_2_OK)+parseInt(datas22[index2].rsT_3_OK)+parseInt(datas22[index2].rsT_4_OK);

              tmpngsum = tmpngsum + parseInt(datas22[index2].rsT_1_NG1)+parseInt(datas22[index2].rsT_2_NG1)+parseInt(datas22[index2].rsT_3_NG1)+parseInt(datas22[index2].rsT_4_NG1) + 
              parseInt(datas22[index2].rsT_1_NG2)+parseInt(datas22[index2].rsT_2_NG2)+parseInt(datas22[index2].rsT_3_NG2)+parseInt(datas22[index2].rsT_4_NG2) +
              parseInt(datas22[index2].rsT_1_NG3)+parseInt(datas22[index2].rsT_2_NG3)+parseInt(datas22[index2].rsT_3_NG3)+parseInt(datas22[index2].rsT_4_NG3);
            }
            });
            oksumarry = oksumarry.concat(tmpoksum);
            ngsumarry = ngsumarry.concat(tmpngsum);
            if(tmpmachcounter == 0){
              
            }
            if(tmpngsum + tmpoksum == 0){
              passratearry = passratearry.concat('0');
            }
            else{
              var tmppassrate = ((tmpoksum / (tmpngsum + tmpoksum)) * 100).toFixed(2);
              passratearry = passratearry.concat(tmppassrate);
            }
                 
          });
        
          console.log('当前线体数据',tmparry33);
          console.log('X',xarry);
          console.log('OK',oksumarry);
          console.log('NG',ngsumarry);
          console.log('PassRate',passratearry);
          this.setData({
            currentlinedata:tmparry33,
            xarry:xarry,
            ngarry:ngsumarry,
            okarry:oksumarry,
            passratearry:passratearry
          });
          
          //排序补空
          //计算总和
          //计算良率
          //显示数据

          let res3333 = {
            categories: this.data.xarry,
            series: [
              {
                name: "良品",
                type: "column",
                data: this.data.okarry,
                color:"#00ff00",
                index: 1, // 相对应的坐标轴
              },
              {
                name: "不良",
                type: "column",
                color: "#ff0000",
                data: this.data.ngarry,
                index: 1, // 相对应的坐标轴
              },
              {
                name: "良率曲线",
                type: "line",
                style: "curve",
                color: "#0000ff",
                disableLegend: true,
                data: this.data.passratearry,
                index: 0, // 相对应的坐标轴
              }
            ]
          };
          this.drawCharts('YANHnJpyBVZGCXwvtsvoJIUsISbudkJs', res3333);
        }
      }
    });
  },
  bindStationChange:function(e){
    console.log("工站picker点击",e.options.value);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
      //这里的第一个 750 对应 css .charts 的 width
      const cWidth = 650 / 750 * wx.getSystemInfoSync().windowWidth;
      //这里的 500 对应 css .charts 的 height
      const cHeight = 330 / 750 * wx.getSystemInfoSync().windowWidth;
      this.setData({ cWidth, cHeight });
      // this.getServerData();
  },
  getServerData() {
    //模拟从服务器获取数据时的延时
    setTimeout(() => {
      //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      let res = {
            categories: ["2018","2019","2020","2021","2022","2023"],
            series: [
              {
                name: "良品",
                type: "column",
                data: [40,{"value":30,"color":"#f04864"},55,110,24,58]
              },
              {
                name: "不良",
                type: "column",
                data: [50,20,75,60,34,38]
              },
              {
                name: "良率曲线",
                type: "line",
                style: "curve",
                color: "#1890ff",
                disableLegend: true,
                data: [70,50,85,130,64,88]
              }
            ]
          };
      this.drawCharts('YANHnJpyBVZGCXwvtsvoJIUsISbudkJs', res);
    }, 500);
  },
  // drawCharts(id,data){
  //   const ctx = wx.createCanvasContext(id, this);
  //   uChartsInstance[id] = new uCharts({
  //       type: "mix",
  //       context: ctx,
  //       width: this.data.cWidth,
  //       height: this.data.cHeight,
  //       categories: data.categories,
  //       series: data.series,
  //       animation: true,
  //       background: "#FFFFFF",
  //       color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
  //       padding: [15,15,0,5],
  //       enableScroll: true,
  //       legend: {},
  //       xAxis: {
  //         disableGrid: true,
  //         title: "单位：年",
  //         scrollShow: true,
  //         itemCount: 3
  //       },
  //       yAxis: {
  //         disabled: false,
  //         disableGrid: false,
  //         splitNumber: 5,
  //         gridType: "dash",
  //         dashLength: 4,
  //         gridColor: "#CCCCCC",
  //         padding: 10,
  //         showTitle: false,
  //         data: [
  //           {
  //             position: "left",
  //             min: 0,
  //             max: 1000,
  //             title: "柱状图",
  //             textAlign: "left"
  //           },
  //           {
  //             position: "right",
  //             min: 0,
  //             max: 100,
  //             title: "曲线",
  //             textAlign: "left"
  //           }
  //         ]
  //       },
  //       extra: {
  //         mix: {
  //           column: {
  //             type: "stack",
  //             width: 35,
  //             activeBgColor: "#000000",
  //             activeBgOpacity: 0.08,
  //             labelPosition: "center"
  //           }
  //         }
  //       }
  //     });
  // },
  drawCharts(id,data){
    const ctx = wx.createCanvasContext(id, this);
    uChartsInstance[id] = new uCharts({
        type: "mix",
        context: ctx,
        width: this.data.cWidth,
        height: this.data.cHeight,
        categories: data.categories,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        padding: [15,15,0,5],
        legend:{show:false},
        color:["#1890FF","#91CB74","#FAC858"],
        enableScroll: true,
        xAxis: {
          disableGrid: true,
          title:'时间',
          scrollShow: true,
          itemCount: 5
        },
        yAxis: {
          disabled: false,
          disableGrid: false,
          splitNumber: 5,
          gridType: "dash",
          dashLength: 4,
          gridColor: "#CCCCCC",
          padding: 10,
          showTitle: false,
          data:[
            //data: [{min: 0}],
           {
            position: "right",
            min: 0,
            max: 130,
            title: "曲线",
            textAlign: "left"
          },
          {
            position: "left",
            min: 0,
            max: 1500,
            title: "柱状图",
            textAlign: "left"
          }
          ]
        },
        extra: {
          mix: {
            column: {
              type: "stack",
              width: 20,
              activeBgColor: "#000000",
              activeBgOpacity: 0.08,
              labelPosition: "center"
            }
          },
          tooltip:{
            bgColor:'#000000',
            bgOpacity:0.7,
            gridType:'dash',
            dashLength:8,
            gridColor:'#1890ff',
            fontColor:'#FFFFFF',
            horizentalLine:true,
            xAxisLabel:true,
            yAxisLabel:false,
            labelBgColor:'#DFE8FF',
            labelBgOpacity:0.95,
            labelAlign:'left',
            labelFontColor:'#666666'
        }
        }
      });
  },
  getIndex(e){
    console.log("uchartgetIndex事件",e);
  },
  tap(e){
    console.log("uchart点击事件",e);
    uChartsInstance[e.target.id].scrollEnd(e);
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
    //修改日期

    //查询对应的数据
  },
  touchstart(e){
    uChartsInstance[e.target.id].scrollStart(e);
  },
  touchmove(e){
    uChartsInstance[e.target.id].scroll(e);
  },
  calendarclick:function(e){
    console.log('日历点击',e);
    wx.reLaunch({
      url: '../../pages/calendar/calendar'
    });
  },
  ToScan:function(e){
    // var that = this;
    console.log('设备扫码',e);
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
    console.log("移除定时器")
    this.timer && clearInterval(this.timer);
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