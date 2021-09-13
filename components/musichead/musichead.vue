<template>
	<view class="prohibition">
		<view class="demo"
			:style="'height:' +  demo.height + 'px;' + 'padding-top:' + demo.top + 'px;padding-bottom:10rpx;color:'+ color +''">
			<view :class="{'icon-balck': iconblack}" v-if="icon" class="left" :style="'top:' + demo.top + 'px'">
				<text class="iconfont iconzuojiantou-copy" @click="BackToPreviousLevel"></text> | <text class="iconfont iconshouye" @click="backHomepage"></text>
			</view>
			<text class="title-long">{{title}}</text>
		</view>
	</view>
</template>

<script>
	import 'common/iconfont.css';
	export default {
		name: "musichead",
		props: {
			title: {
				type: String,
				default: ''
			},
			icon: {
				type: Boolean,
				default: false
			},
			color: {
				type: String,
				default: ''
			},
			iconblack: {
				type: false,
				default: ''
			}
		},
		data() {
			return {
				demo: {
					top: 0,
					height: 0
				}
			};
		},
		created() {
			this.getNavZ()
		},
		methods: {
			getNavZ() {
				const demo = uni.getMenuButtonBoundingClientRect();
				this.demo.top = demo.top;
				this.demo.height = demo.height;
			},
			BackToPreviousLevel() {
				uni.navigateBack();
			},
			backHomepage() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.demo {
		z-index: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
	}

	.left {
		float: left;
		position: absolute;
		width: max-content;
		height: max-content;
		top: 0;
		bottom: 0;
		left: 20rpx;
		margin: auto;
		width: 90px;
		height: 32px;
		line-height: 32px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		background-color: rgba(0, 0, 0, .4);
	}
	.title-long {
		width: 300rpx;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.icon-balck {color: #000; border: 1px #eaeaea solid; background-color: #fff;}
</style>
