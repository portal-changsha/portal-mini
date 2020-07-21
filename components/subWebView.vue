<template>
	<view>
		<web-view id="subView" :webview-styles="webviewStyles" :src="webUrl" style="background: #fff;"></web-view>
	</view>
</template>

<script>
	export default {
		props: {
			webUrl: {
				type: String,
				require: true,
				default: 'https://www.baidu.com'
			},
			webviewStyles: {
				type: Object,
				default: () => {
					progress: {
						color: '#FF3333'
					}
				}
			}
		}
	}
</script>
