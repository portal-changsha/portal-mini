<template>
<!--    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
        <a :id="sex+bodyId" @click.stop="organSelected()">
            <circle :cx="organ.cx" :cy="organ.cy" r="22" fill="#dbdbdb">
                <set attributeName="fill" to="#51a9ec" :begin="activeBegin" :end="activeEnd"/>
            </circle>
            <text :x="textX" :y="textY" fill="#333">
                {{organ.name}}
                <set attributeName="fill" to="#ffffff" :begin="activeBegin" :end="activeEnd"/>
            </text>
            <path :d="linePosition" stroke="#dbdbdb" stroke-width="1" >
                <set attributeName="stroke" to="#51a9ec" :begin="activeBegin" :end="activeEnd"/>
            </path>
        </a>
    </svg> -->
	<!-- <div> -->
		<canvas :canvas-id="sex+bodyId"></canvas>
	<!-- </div> -->
</template>
<script>
import config from './bodyItemConfig'

export default {
    inject: {
        triageBody: {
            default: ''
        }
    },
    data() {
        return {
            organ: config[this.sex + this.bodyId],
        }
    },
	mounted(){
		this.$nextTick(() =>{
			this.canvasToStyle()
		})
	},
    props: {
        textOffset: {
            default: 0,
        },
        sex: String,
        bodyId: String,
    },
    computed: {
        textX() {
            return (this.organ.cx - 14) + this.textOffset
        },
        textY() {
            return this.organ.cy + 5
        },
        linePosition() {
            return `M${this.organ.lineStartX} ${this.organ.lineStartY} L${this.organ.lineEndX} ${this.organ.lineEndY} Z`
        },
        activeBegin() {
            return `${this.sex + this.bodyId}.touchstart;`
        },
        activeEnd() {
            return `${this.sex + this.bodyId}.touchend;${this.sex}${this.bodyId}.touchcancel;`
        },
		lineStartX(){
			return this.organ.lineStartX
		},
		lineStartY(){
			return this.organ.lineStartY
		},
		lineEndX(){
			return this.organ.lineEndX
		},
		lineEndY(){
			return this.organ.lineEndY
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
		canvasToStyle(){
			const id = this.sex + this.bodyId
			const ctx = uni.createCanvasContext(id)
			// ctx.setStrokeStyle('red')
			// ctx.beginPath()
			// console.log(this.organ.lineStartX, '...', this.organ.lineStartY)
			// ctx.moveTo(this.organ.lineStartX, this.organ.lineStartY)
			// ctx.lineTo(this.organ.lineEndX, this.organ.lineEndY)
			// ctx.closePath()
			// ctx.stroke()
			// ctx.draw()
			
			// Draw coordinates
			// ctx.arc(100, 75, 50, 0, 2 * Math.PI)
			// ctx.setFillStyle('#EEEEEE')
			// ctx.fill()
			
			ctx.beginPath()
			console.log(this.lineStartX)
			ctx.moveTo(this.lineStartX, this.lineStartY)
			ctx.lineTo(this.lineEndX, this.lineEndY)
			ctx.setStrokeStyle('#dbdbdb')
			ctx.stroke()
			
			ctx.setFontSize(12)
			ctx.setFillStyle('black')
			ctx.fillText('0', 165, 78)
			ctx.fillText('0.5*PI', 83, 145)
			ctx.fillText('1*PI', 15, 78)
			ctx.fillText('1.5*PI', 83, 10)
			
			ctx.draw()
		}
    },
}
</script>
<style scoped>
	uni-canvas{
		width: auto;
		height: 50px;
	}
</style>
