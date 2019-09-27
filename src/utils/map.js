/* eslint-disable */
import QQMapWX from './qqmap-wx-jssdk.min.js'
const qqmapsdk = new QQMapWX({
  key: "R3QBZ-SM4LP-RGRDR-VZT2T-QM6I5-G5F4A"
});
const debug = false;

//  地点搜索
export function map_search(keyword) {
  return new Promise((resolve,reject) => {
    qqmapsdk.search({
      keyword: keyword,
      success:(res) => {
       debug && console.log(res)
        resolve(res)
      },
      fail: function(res) {
        debug && console.log(res)
        reject(res)
      }
    })
  })
}

//  关键词输入提示
export function map_getSuggestion(keyword) {
  return new Promise((resolve,reject) => {
    qqmapsdk.getSuggestion({
      keyword: keyword,
      region: '长沙市',
      success:(res) => {
        debug && console.log(res)
        resolve(res)
      },
      fail: function(res) {
        debug && console.log(res)
        reject(res)
      }
    })
  })
}
//  逆地址解析
// 本接口提供由坐标到坐标所在位置的文字描述的转换，输入坐标返回地理位置信息和附近poi列表。
export function mapReverseGeocoder(latitude, longitude){
  return new Promise((resolve,reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: (res) => {
        debug && console.log(res)
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res)
        reject(res)
      }
    })
  })
}

// 提供由地址描述到所述位置坐标的转换，与逆地址解析reverseGeocoder()的过程正好相反。
// 地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
export function map_geocoder(address) {
  return new Promise((resolve,reject) => {
    qqmapsdk.geocoder({
      address:address,
      success: (res) => {
        debug && console.log(res)
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res)
        reject(res)
      }
    })
  })
}
//  距离计算
export function mapCalculateDistance(from,to){
  return new Promise((resolve,reject) => {
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: from ? from : '',
      to: to,
      success: (res) => {
        debug && console.log(res)
        let result ={
          distance: 0,
          duration: 0
        }
        if(res.status === 0){
          let e = res.result.elements[0]
          result.distance = Math.ceil(e.distance)
          result.duration = Math.ceil(e.duration / 60)
        }
        resolve(result)
      },
      fail: (res) => {
        debug && console.log(res)
        reject(res)
      }
    })
  })
}
//  获取全国城市列表数据。
export function map_getCityList(){
  return new Promise((resolve,reject) => {
    qqmapsdk.getCityList({
      success: (res) => {
        debug && console.log(res)
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res)
        reject(res)
      }
    })
  })
}
//  获取城市区县
export function map_getDistrictByCityId(id){
  return new Promise((resolve,reject) => {
    qqmapsdk.getDistrictByCityId({
      id: id,
      success: (res) => {
        debug && console.log(res)
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res)
        reject(res)
      }
    })
  })
}
//  路线规划
export function direction (from, to, mode = 'driving') {
  return new Promise((resolve, reject) => {
    qqmapsdk.direction({
      mode: mode,//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      // from: from,
      to: to,
      success: function(res) {
        let obj = null
        switch (mode) {
          case "driving":
            var ret = res;
            var distance = (ret.result.routes[0].distance / 1000).toFixed(1);
            var coors = ret.result.routes[0].polyline, pl = [];
            //坐标解压（返回的点串坐标，通过前向差分进行压缩）
            var kr = 1000000;
            for (var i = 2; i < coors.length; i++) {
              coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
            }
            //将解压后的坐标放入点串数组pl中
            for (var i = 0; i < coors.length; i += 2) {
              pl.push({ latitude: coors[i], longitude: coors[i + 1] });
            }
            //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
            obj = {
              latitude: pl[0].latitude,
              longitude: pl[0].longitude,
              distance: distance,
              polyline: [{
                points: pl,
                color: "#FF0000DD",
                width: 4,
                arrowLine: true
                // arrowIconPath: '/static/'
              }],
              status: 0
            };
            break;
          case 'transit':
            console.log(res);
            var ret = res.result.routes[0];
            var count = ret.steps.length;
            var pl = [];
            var coors = [];
            //获取各个步骤的polyline
            for(var i = 0; i < count; i++) {
              if (ret.steps[i].mode == 'WALKING' && ret.steps[i].polyline) {
                coors.push(ret.steps[i].polyline);
              }
              if (ret.steps[i].mode == 'TRANSIT' && ret.steps[i].lines[0].polyline) {
                coors.push(ret.steps[i].lines[0].polyline);
              }
            }
            //坐标解压（返回的点串坐标，通过前向差分进行压缩）
            var kr = 1000000;
            for (var i = 0 ; i < coors.length; i++){
              for (var j = 2; j < coors[i].length; j++) {
                coors[i][j] = Number(coors[i][j - 2]) + Number(coors[i][j]) / kr;
              }
            }
            //定义新数组，将coors中的数组合并为一个数组
            var coorsArr = [];
            for (var i = 0 ; i < coors.length; i ++){
              coorsArr = coorsArr.concat(coors[i]);
            }
            //将解压后的坐标放入点串数组pl中
            for (var i = 0; i < coorsArr.length; i += 2) {
              pl.push({ latitude: coorsArr[i], longitude: coorsArr[i + 1] })
            }
            obj = {
              latitude: pl[0].latitude,
              longitude: pl[0].longitude,
              distance: distance,
              polyline: [{
                points: pl,
                color: "#FF0000DD",
                width: 4,
                arrowLine: true
                // arrowIconPath: '/static/'
              }],
              status: 0
            };
            break
          default:
            break
        }
        resolve(obj)
      },
      fail: function (error) {
        reject(error)
      },
      complete: function (res) {
        resolve(res)
      }
    })
  })
}
export default qqmapsdk
