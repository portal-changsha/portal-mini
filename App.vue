
<script>
	import { devBack } from '@/utils/index.js'
	import { devIsIos } from '@/utils/index.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef H5
			// window.addEventListener('pageshow', (e) => {
			// 	console.log(e)
			// 	console.log('pageshow...');
			// })
				if(devIsIos()){
					window.onpageshow = function(e) {
				        console.log("执行了onpageshow");
				        if (e.persisted || (window.performance && window.performance.navigation.type == 2)) {
				          window.location.reload();
				        }
				      };
				}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide') 
			// #ifdef H5
				// window.removeEventListener('pageshow')
			// #endif
		}
	}
</script>

<style>
	/*每个页面公共css */
	.app{
		background: $common-background-color;
	}
</style>
