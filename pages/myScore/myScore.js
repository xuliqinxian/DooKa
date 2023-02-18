// pages/myScore/myScore.js
import uCharts from '../../utils/u-charts.js';
var uChartsInstance = {};
var app = getApp();
Page({
  data: {
    cWidth: 750,
    cHeight: 500,
    list: [],
    listall:[],
    date:'',
    chartdata:null,
    changeformat:[],
    changeformat2:[],
    data_arr:["日","一","二","三","四","五","六"],
    year:"",
    month:"",
    today:2 //这是固定2号这天打开，连续几天打卡就用数组就好了
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      list:[]
    })
    if(app.globalData.userDetail){
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/' + app.globalData.userDetail.userID + '/' + e.detail.value,
        method:"GET",
        success:(res)=>{
          console.log("获取某天打卡信息",res);
          if(res.statusCode == 200){
            let datas = res.data;
            console.log(res.data);
            datas.forEach((item, index)=> {
              console.log(index + '返回信息：' + datas[index]);
              if(datas[index].actionType == 1){
                  var retmsg = app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡";
                  var element = {
                    time: datas[index].DateTime,
                    con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡",
                    isRedDot:true
                  }
              }else if(datas[index].actionType == 0)
              {
                var retmsg = app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")打卡";
                console.log(retmsg);
                  var element = {
                    time: datas[index].DateTime,
                    con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")打卡",
                    isRedDot:false
                  }
              }
              this.setData({
                list:this.data.list.concat(element)
              });
            })
          } 
        }
      });
    }
  },
  onReady() {
    console.log('onReady执行');
    //这里的第一个 750 对应 css .charts 的 width
    const cWidth = 750 / 750 * wx.getSystemInfoSync().windowWidth;
    //这里的 500 对应 css .charts 的 height
    const cHeight = 400 / 750 * wx.getSystemInfoSync().windowWidth;
    this.setData({ cWidth, cHeight });
    //获取员工所有的打卡记录
    this.setData({
      listall:[]
    });
    if(app.globalData.userDetail){
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/GetClockReport/' + app.globalData.userDetail.userID,
        method:"GET",
        success:(res)=>{
          console.log("获取所有打卡统计信息",res);
          if(res.statusCode == 200){
            let datas = res.data.categories;
            let datas2 = res.data.ondutytime;
            datas.forEach( (item, index)=> {
              this.setData({
                changeformat:this.data.changeformat.concat(datas[index].substring(5,10))
              });
            });
            datas2.forEach( (item, index)=> {
              this.setData({
                changeformat2:this.data.changeformat2.concat(((parseInt(datas2[index]))/60).toFixed(2))
              });
            });
            this.setData({
              chartdata:{
                categories:this.data.changeformat,
                series: [
                  {
                    name: "上班卡次数",
                    type: "column",
                    color: "#91CB74",
                    data: res.data.clockinnum
                  },
                  {
                    name: "下班卡次数",
                    type: "column",
                    color: "#FAC858",
                    data: res.data.clockoutnum
                  },{
                    name: "工作时长",
                    type: "line",
                    style: "curve",
                    color: "#1890ff",
                    disableLegend: true,
                    data: this.data.changeformat2//res.data.ondutytime
                  }
                ]    
              }
            });
            this.drawCharts('column', this.data.chartdata);
          } 
        }
      });
    };
    //统计每天的打卡和退卡次数,工作时长

    //this.getServerData();
  },
  getServerData() {
    //模拟从服务器获取数据时的延时
    setTimeout(() => {
      //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
      let res = {
            categories: ["2016","2017","2018","2019","2020","2021"],
            series: [
              {
                name: "目标值",
                data: [35,36,31,33,13,34]
              },
              {
                name: "完成量",
                data: [18,27,21,24,6,28]
              },
              {
                name: "工作时长",
                type: "line",
                style: "curve",
                color: "#1890ff",
                disableLegend: true,
                data: [70,50,85,130,64,88]
              }
            ]
          };
      this.drawCharts('column', res);
    }, 500);
  },
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
        color:["#1890FF","#91CB74","#FAC858"],
        enableScroll: true,
        xAxis: {
          disableGrid: true,
          title:'日期',
          scrollShow: false,
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
          showTitle: true,
          data:[
            //data: [{min: 0}],
           {
            position: "right",
            min: 0,
            max: 24,
            title: "曲线",
            textAlign: "left"
          },
          {
            position: "left",
            min: 0,
            max: 20,
            title: "柱状图",
            textAlign: "left"
          }
          ]
        },
        extra: {
          mix: {
            column: {
              type: "stack",
              width: 20
            }
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
  showCalendar(){
    let {year,month} = this.data
    //以下两个month已经+1
    let currentMonthDays = new Date(year,month,0).getDate() //获取当前月份的天数
    let startWeek = new Date(year + '/' + month + '/' + 1).getDay(); //本月第一天是从星期几开始的
    this.setData({
      currentMonthDays,startWeek
    })
  },
    //上个月按钮
    bindPreMonth(){
      let {year,month} = this.data
      //判断是否是1月
      if(month - 1 >= 1){
        month = month - 1 
      }else{
        month = 12
        year = year - 1
      }
      this.setData({
        month,year
      })
      this.showCalendar()
    },
    //下个月按钮
  bindNextMonth(){
    let {year,month} = this.data
    //判断是否是12月
    if(month + 1 <= 12){
      month = month + 1 
    }else{
      month = 1
      year = year + 1
    }
    this.setData({
      month,year
    })
    this.showCalendar()
  },
  onLoad: function (options) {
    // 获取日期赋值给时间选择器
    var tmpdate = new Date().toJSON().substring(0,10);
    console.log(tmpdate);
    this.setData({
      date: tmpdate,
      list:[]
    })
    if(app.globalData.userDetail){
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/' + app.globalData.userDetail.userID + '/' + tmpdate,
        method:"GET",
        success:(res)=>{
          console.log("获取某天打卡信息",res);
          if(res.statusCode == 200){
            let datas = res.data;
            console.log(res.data);
            datas.forEach((item, index)=> {
              console.log(index + '返回信息：' + datas[index]);
              if(datas[index].actionType == 1){
                  var retmsg = app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡";
                  var element = {
                    time: datas[index].DateTime,
                    con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡",
                    isRedDot:true
                  }
              }else if(datas[index].actionType == 0)
              {
                var retmsg = app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")打卡";
                console.log(retmsg);
                  var element = {
                    time: datas[index].DateTime,
                    con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")打卡",
                    isRedDot:false
                  }
              }
              this.setData({
                list:this.data.list.concat(element)
              });
            })
          } 
        }
      });
    }
    let now = new Date();
    let year = now.getFullYear();
    // month获取是从 0~11
    let month = now.getMonth() + 1;
    this.setData({
      year,month
    });
    this.showCalendar();
  },
  confirmHandler: function (e) {
    var value = e.detail.value
    qrcode.makeCode(value)
},
inputHandler: function (e) {
    var value = e.detail.value
    this.setData({
        text: value
    })
},
tapHandler: function () {
    console.log('传入字符串生成qrcode',this.data.text);
    // 传入字符串生成qrcode
    qrcode.makeCode(this.data.text)
},
// 长按保存
save: function () {
    console.log('save')
    wx.showActionSheet({
        itemList: ['保存图片'],
        success: function (res) {
            console.log(res.tapIndex)
            if (res.tapIndex == 0) {
                qrcode.exportImage(function (path) {
                    wx.saveImageToPhotosAlbum({
                        filePath: path,
                    })
                })
            }
        }
    })
  },
  bindClickWeek:function(e){
  },
  bindClickDay:function(e){
    // console.log(e.currentTarget.dataset.index);
    this.setData({
      today:e.currentTarget.dataset.index
    });
    var tmpdate = this.data.year + "-" + ("0"+this.data.month).substring(0,2) + "-" + this.data.today;
    console.log(tmpdate);
    this.setData({
      date: tmpdate,
      list:[]
    })
    if(app.globalData.userDetail){
      wx.request({
        url: app.globalData.serverurl + app.globalData.swversion + '/api/ClockIn2/' + app.globalData.userDetail.userID + '/' + this.data.date,
        method:"GET",
        success:(res)=>{
          console.log("获取某天打卡信息",res);
          if(res.statusCode == 200){
            let datas = res.data;
            console.log(res.data);
            datas.forEach((item, index)=> {
              console.log(index + '返回信息：' + datas[index]);
              if(datas[index].actionType == 1){
                  var retmsg = app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡";
                  var element = {
                    time: datas[index].DateTime,
                    con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")退卡",
                    isRedDot:true
                  }
              }else if(datas[index].actionType == 0)
              {
                var retmsg = app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")打卡";
                console.log(retmsg);
                  var element = {
                    time: datas[index].DateTime,
                    con: app.globalData.userDetail.username + "在(" + datas[index].stationcode + ")打卡",
                    isRedDot:false
                  }
              }
              this.setData({
                list:this.data.list.concat(element)
              });
            })
          } 
        }
      });
    }
  }
})