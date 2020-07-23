<template>
	<canvas :canvas-id="'triageCanvasId'" ref="canvas"></canvas>
</template>
<script>
import config from './bodyItemConfig'

export default {
    inject: {
        triageBody: {
            default: ''
        }
    },
	data(){
		return {
			unit: 1,
			ctx: null
		}
	},
	mounted(){
		uni.getSystemInfo({
			success: (res) => {
			    this.unit= res.windowWidth/375
			}
		})
		this.$nextTick(() =>{
			this.canvasToStyle(this.unit)
		})
	},
	beforeDestroy(){
		//	要销毁了
		const dom = this.$refs.canvas.$el
		dom && dom.removeEventListener('click', (e) => {
			this.clickEvent(e)
		}, false)
	},
    props: {
        textOffset: {
            default: 0,
        },
        sex: String,
        bodyId: Array,
    },
	watch:{
		bodyId(newBody, oldBody){
			console.log(newBody, '...' , oldBody)
			console.log(this.unit)
			this.canvasToStyle(this.unit)
		}
	},
    methods: {
        organSelected() {
            if (this.bodyId === '0') {
                // 显示头部详情
                this.$emit('show-head')
                return
            }
            this.triageBody.$emit("tab-change",{crowdId:this.triageBody.crowdId,bodyId: this.bodyId},true)
        },
		canvasToStyle(unit){
			this.ctx = uni.createCanvasContext('triageCanvasId', this)
			const ctx = this.ctx
			this.bodyId.forEach(item => {
				let id = this.sex + item
				const data = config[id]
				ctx.beginPath()
				ctx.moveTo(data.lineStartX * unit, data.lineStartY * unit)
				ctx.lineTo(data.lineEndX * unit, data.lineEndY * unit)
				ctx.setStrokeStyle('#dbdbdb')
				ctx.stroke()
				//	绘制圆形
				ctx.beginPath()
				const arcX = data.cx * unit
				const arcY = data.cy * unit
				const r = 25 * unit
				ctx.fillStyle ='#dbdbdb'
				ctx.arc(arcX, arcY, r,0, 2 * Math.PI)
				ctx.setStrokeStyle('#dbdbdb')
				ctx.fill()
				ctx.stroke()
				//	绘制文字
				ctx.beginPath()
				ctx.setFontSize(14)
				ctx.setTextAlign('center')
				ctx.setFillStyle('#333333')
				ctx.fillText(data.name, arcX, (arcY+5))
				ctx.stroke()
			})
			setTimeout(() => {
				ctx.draw()
				this.clickEventLister()
			}, 300)
		},
		getEventPosition(ev){
			console.log(ev)
			let x, y;
			if (ev.layerX || ev.layerX === 0) {
				x = ev.layerX;
				y = ev.layerY;
			} else if (ev.offsetX || ev.offsetX === 0) {
				x = ev.offsetX;
				y = ev.offsetY;
			}
			return {x: x, y: y}
		},
		//对事件进行监听
		clickEventLister(){
			const dom = this.$refs.canvas
			dom.$el.addEventListener('click', (e) => {
				this.clickEvent(e)
			}, false)
		},
		isClicked(point){
			//	头部范围
			const rangeX = [5*this.unit, 70*this.unit]
			const rangeY = [0, 60*this.unit]
			const cRangeY = [30*this.unit, 100*this.unit]
			if(point.x >= rangeX[0] && point.x <= rangeX[1]){
				if(point.y >= rangeY[0] && point.y < rangeY[1]){
					//	点击了成人头部
					this.$emit('show-head')
					return
				}
				if(point.y >= cRangeY[0] && point.y <= cRangeY[1] && this.sex === 'c'){
					//	点击了儿童头部
					this.$emit('show-head')
					return
				}
			}
		},
		clickEvent(e){
			const p = this.getEventPosition(e);
			console.log(p)
		  //判断点击了
			this.isClicked(p)
		}
    },
}
</script>
<style scoped>
	uni-canvas{
		width: auto;
		height: 100%;
	}
</style>
