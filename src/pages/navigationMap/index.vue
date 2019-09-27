<template>
  <map id="map"
       :longitude="longitude"
       :latitude="latitude"
       scale="14"
       bindmarkertap="markertap"
       :markers="markers"
       :polyline="polyline"
       show-location></map>
</template>
<script>
  import { direction } from '@/utils/map'
  import { getItem } from '@/utils/store'

  export default {
    data: function () {
      return {
        longitude: 112.93,
        latitude: 28.23,
        markers: [
          {
            id: 0,
            latitude: 28.11266,
            longitude: 112.9834,
            width: 50,
            height: 50
          }
        ],
        polyline: null,
        from: null,
        to: null
      }
    },
    created () {
    },
    components: {
    },
    computed: {
    },
    onLoad () {
      let hosItem = getItem('selectedHospital')
      this.to = {
        latitude: hosItem.latitude,
        longitude: hosItem.longitude
      }
    },
    onShow () {
      var that = this
      // 调用接口
      wx.getLocation({
        type: 'gcj02',
        success (res) {
          that.latitude = res.latitude
          that.longitude = res.longitude
          that.changeLocation()
        }
      })
    },
    methods: {
      changeLocation (res) {
        var that = this
        direction(this.from, this.to).then(function (data) {
          that.polyline = data.polyline
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
#map{
  width: 100%;
  height: 100%;
}
</style>
