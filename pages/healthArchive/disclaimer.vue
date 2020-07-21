<template>
	<view>
		<div v-html="htmlMsg" class="disclaimer"></div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				htmlMsg: `1、由于“健康档案”信息来自用户个人在长沙市内各级公立医院和基层医疗卫生机构欧，所有信息仅作为参考和建议之用，一切以实际个人真实情况为准，用户可以通过“健康档案”查看自己从2019年开始的医疗记录。
						  <br/>
						  <br/>
						  2、“健康长沙”无法担保网络服务一定满足用户的要求，对网络的及时性、安全性、准确性都不做担保。
						  <br/>
						  <br/>
						  3、“健康长沙”不断提升用户在访问使用本公众号时的安全性，但“健康长沙”不能也不会声明或保证本公众号或服务器是不含病毒或其他有害因素；因此建议用户使用业界公认的杀毒软件以保证自身的使用安全。`
			}
		}
	}
</script>
<style lang="scss" scoped>
	.disclaimer{
		padding: 0.8rem 0.6rem 0.65rem 0.6rem;
		font-size:0.8rem;
		font-weight:400;
		color: #3C3C3C
	}
</style>