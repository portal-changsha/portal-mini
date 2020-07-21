<template>
	<view>
		<!-- 搜索 -->
		<section class="search-section">
			<div class="search-btn-content">
				<input class="search-input flex-item" :placeholder="tips" maxlength="20" v-model.trim="searchKeyWord">
				<span class="search-btn" @click.stop="doSearch()"></span>
			</div>
		</section>
		<scroll style="top: 3rem">
			<div v-show="searchList.length === 0"
				 class="search-noDate-pic">
				<p class="search-noDate-text">抱歉，暂未找到符合条件的结果</p>
				<p class="search-noDate-tips">试试换个关键词吧~</p>
			</div>
			<ul v-show="searchType === 0" class="list">
				<li class="list-item arr-item" v-for="(searchItem,index) in searchList" 
					:key="index" 
					:track_by="index"
					@click.stop="onSearchItemSelected(searchItem)"
					:id="'register-departDoctor-search-departList-'+index">
					<span>{{searchItem.deptName | formatDeptName}}</span>
				</li>
			</ul>
			<ul v-show="searchType === 1" class="">
				<li class="arr-row" v-for="(searchItem,index) of searchList"
					:key="index" 
					:track_by="index"
					@click.stop="onSearchItemSelected(searchItem)">
					<div class="doctor-info">
						<div class="head doc-header" v-bind:style="{backgroundImage: 'url(' + (searchItem.doctAvatar ? searchItem.doctAvatar : $consts.LOCAL_DOC_IMG) + ')'}">
						</div>
						<div class="info">
							<p class="f-large ellipsis">{{searchItem.rank}}&nbsp;{{searchItem.name}}</p>
							<p class="f-strong ellipsis" style="margin-top:0.15rem">{{searchItem.dept}}</p>
						</div>
					</div>
				</li>
			</ul>
		</scroll>
	</view>
</template>

<script>
	import { searchDoctorInHos } from '@/services/hospitals.js'
	import { getItem } from '@/utils/localStore.js'
	import { parseTime } from '@/utils/index.js'
	export default {
		data() {
			return {
				searchType: 0,
				searchList: [],
				searchKeyWord: '',
				allSubDeparts: [],
				tips: ''
			}
		},
		onLoad(){
			const query = this.$Route.query
			console.log(query)
			this.searchType = query.searchType || 0
			this.tips = this.searchType === 0 ? '输入二级科室' : '输入医生姓名'
			this.allSubDeparts = this.$store.getters.param.allSubDeparts.allSubDeparts
		},
		methods: {
			doSearch() {
				this.searchList = [];
				const searchKey = this.searchKeyWord
				if (searchKey.length === 0) {
					return;
				}
				if (this.searchType === 0) {
					// this.hasSearched = true;
					this.allSubDeparts.forEach((item) => {
						this.findDepart(searchKey, item) && this.searchList.push(item);
					});
				} else {
					//模糊查询带关键字
					// this.hasSearched = false;   //防止提前展示无数据提示
					this.loadSearchDoctor(searchKey)
				}
			},
			//精确检索默认加载500条数据给用户展示
			loadSearchDoctor(searchKey) {
				const hosInfo = getItem('selectedHospital')
				const areaInfo = getItem('selectedArea')
				searchDoctorInHos({
					orgId: hosInfo.orgId,
					hospitalId: hosInfo.id,
					areaId: areaInfo.areaId,
					keyword: searchKey || '',
					pageNo: '1',
					pageRows: '500'
				}).then((res) => {
					// this.hasSearched = true;
					if (res.resultCode !== this.$consts.RESULT_SUCCESS) {
						this.searchList = []
						return;
					}
					this.searchList = res.data || [];
				})
			},
			findDepart(key, subDepart) {
				return subDepart.deptName.indexOf(key) > -1
			},
			onSearchItemSelected(item) {
				if (this.searchType === 1) {
					this.onSelectedSubDepart(item);
				} else {
					this.$Router.push({path: '/pages/register/dateDoctorSchedule', query: {deptId: item.deptId, deptName: item.deptName}})
				}
			},

			onSelectedSubDepart(item) {
				//  跳转到该医生排班
				const hosInfo = getItem('selectedHospital')
				const areaInfo = getItem('selectedArea')
				const params = {
				  orgId: hosInfo.orgId,
				  hospitalId: hosInfo.id,
				  areaId: areaInfo.areaId,
				  deptId: item.deptId,
				  regDate: parseTime(new Date(), '{y}-{m}-{d}'),
				  doctId: item.doctId
				}
				//	记录请求的数据
				this.$store.dispatch('paramStore/updateParam', {
				  namespace: 'timeSchedule',
				  requestParams: params
				})
				//	记录当前医生数据
				this.$store.dispatch('paramStore/updateParam', {
				  namespace: 'doctorInfo',
				  doctorInfo: item
				})
				this.$Router.push({name: 'timeSchedule'})
			}
		}
	}
</script>

<style lang="scss" scoped>
.popup-search {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow-y: auto;
	text-align: left;
	color: #444;
	z-index: 4;
	list-style: none;
}
.search-line {
	border-radius: 5px;
	height: 1.6rem;
	width: 100%;
	line-height: 1.6rem;
	background: #f0f2f4;
	color: #333333;
	text-align: center;
	font-size: 0.65rem;
	border: 1px solid #c8cbce;
	.search-img {
		background-image: url($redirect-url + $img-file-path + "seach-gray-icon.png");
		height: 0.7rem;
		width: 0.7rem;
		margin-right: 0.25rem;
		background-size: contain;
		display: inline-block;
		vertical-align: middle;
	}
	.search-hint {
		display: inline-block;
	}
}

.search-input {
	border-radius: 0.25rem;
	height: 1.6rem;
	line-height: 1.6rem;
	background: $common-bg-color;
	color: $main-gray;
	font-size: 0.65rem;
	padding-left: 0.25rem;
	border: none;
}

.search-btn {
	border-radius: 0.25rem;
	width: 2rem;
	height: 1.6rem;
	line-height: 1.6rem;
	margin-left: 0.25rem;
	background-color: $main-blue;
	background-image: url($redirect-url + $img-file-path + "seach-white-icon.png");
	background-repeat: no-repeat;
	background-position: center;
	background-size: 1rem;
}

.search-noDate-pic {
	background: url($redirect-url + $img-file-path + "sousuo-bg.png") no-repeat top center;
	background-size: 5.6rem 5.6rem;
	margin: 3rem auto 0 auto;
	width: 100%;
}

.search-noDate-text {
	font-size: 0.9rem;
	text-align: center;
	height: 2rem;
	line-height: 2rem;
	padding-top: 6rem;
}

.search-noDate-tips {
	font-size: 0.65rem;
	text-align: center;
	color: $main-gray;
}
.uni-popup__wrapper-box{
	width: 100%;
	height: 100%;
}
.search-section{
	position: fixed;
	top: 0;
	width: 100%;
	left: 0;
	right: 0;
}
.search-btn-content{
	display: flex;
	padding: 0.5rem;
}
</style>
