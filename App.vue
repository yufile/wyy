<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
		
		},
		onHide: function() {
		
		}
	}
</script>

<style>
	/*每个页面公共css */
	.container {
		width: 100%;
		height: calc(100vh);
		overflow: hidden;
	}
	.container scroll-view {
		height: 100%;
		padding-bottom: 100rpx;
		box-sizing: border-box;
	}
	.fixbg {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		filter: blur(20px);
		transform: scale(1.2);
		background-size: cover;
		background-position: center 0;
	}
</style>
