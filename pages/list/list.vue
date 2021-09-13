<template>
	<view class="container">
		<music-head title="歌单" color='white' :icon="true"></music-head>
		<view class="fixbg" :style="{'background-image':'url('+ imgUrl+')'}" ></view>
		<scroll-view scroll-y="true" v-show="!isLogin">
			<view class="list-head">
				<view class="list-head-img">
					<image :src="listData.coverImgUrl" mode="widthFix"></image>
					<text class="iconfont iconyousanjiao">{{listData.playCount | playCount}}</text>
				</view>
				<view class="list-head-text">
					<view>
						{{listData.name}}
					</view>
					<view>
						<image :src="listData.creator.avatarUrl" mode="widthFix"></image><text>{{listData.creator.nickname}}</text>
					</view>
					<view>{{listData.description}}</view>
				</view>
			</view>
			<button class="list-share" open-type="share">
				<text class="iconfont iconicon-"></text> 分享给微信好友
			</button>
			<view class="list-music">
				<view class="list-music-head" @click="handleToDetail(listData.tracks[0].id)">
					<text class="iconfont iconbofang1"></text>
					<text>播放全部</text>
					<text>(共100首)</text>
				</view>
				<view class="list-music-item" @click="handleToDetail(item.id)" v-for="(item,index) in listData.tracks" :key="item.id">
					<view class="list-music-top">{{index + 1}}</view>
					<view class="list-music-song">
						<view>{{item.name}}</view>
						<view>
							<image v-if="privileges[index].flag > 60 && privileges[index].flag < 70" src="../../static/dujia.png" mode="widthFix"></image>
							<image v-if="privileges[index].maxbr == 999000" src="../../static/sq.png" mode=""></image>
							<text>{{item.ar[0].name}} - {{item.name}}</text>
						</view>
					</view>
					<text class="iconfont iconbofang"></text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import MusicHead from 'components/musichead/musichead.vue';
	import {
		songList
	} from 'common/api.js'
	import 'common/iconfont.css';
	export default {
		components: {
			MusicHead
		},
		data() {
			return {
				listData: [],
				imgUrl: '',
				privileges: [],
				isLogin: true,
				linshiId: ''
			}
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
			this.getListData(option.id)
		},
		methods: {
			getListData(id) {
				songList(id).then(res => {
					if(res.statusCode === 200) {
						this.listData = res.data.playlist;
						this.privileges = res.data.privileges;
						this.imgUrl = res.data.playlist.coverImgUrl;
						this.isLogin = false;
						this.$store.commit('ALL_MUSIC',res.data.playlist.trackIds)
						uni.hideLoading()
					}
				})
			},
			handleToDetail(id) {
				uni.navigateTo({
					url: '/pages/detail/detail?id=' + id
				})
			}
		}
	}
</script>

<style scoped>

	.list-head {
		display: flex;
		margin: 30rpx;

	}

	.list-head-img {
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
	}

	.list-head-img image {
		width: 100%;
		height: 100%;
	}

	.list-head-img text {
		position: absolute;
		right: 8rpx;
		top: 8rpx;
		font-size: 26rpx;
		color: white;
		z-index: 1;
	}

	.list-head-text {
		flex: 1;
		color: #f0f2f7;
	}

	.list-head-text view:nth-of-type(1) {
		color: #fff;
		font-size: 34rpx;
	}

	.list-head-text view:nth-of-type(2) {
		display: flex;
		margin: 20rpx 0;
		font-size: 28rpx;
		align-items: center;
	}

	.list-head-text view:nth-of-type(2) image {
		width: 50rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}

	.list-head-text view:nth-of-type(3) {
		line-height: 34rpx;
		font-size: 24rpx;
	}

	.list-share {
		width: 330rpx;
		height: 74rpx;
		margin: 0 auto;
		background-color: rgba(0, 0, 0, .4);
		border-radius: 37rpx;
		color: #fff;
		font-size: 30rpx;
		text-align: center;
		line-height: 74rpx;
	}

	.list-share text {
		margin-right: 10rpx;
	}

	.list-music {
		background-color: #fff;
		border-radius: 50rpx 50rpx 0 0;
		margin-top: 40rpx;
		overflow: hidden;
	}

	.list-music-head {
		height: 50rpx;
		margin: 30rpx 0 30rpx 22rpx;
	}

	.list-music-head text:nth-of-type(1) {
		height: 50rpx;
		font-size: 50rpx;
	}

	.list-music-head text:nth-of-type(2) {
		font-size: 30rpx;
		margin: 0 10rpx 0 26rpx;
	}

	.list-music-head text:nth-of-type(3) {
		font-size: 26rpx;
		color: #b2b2b2;
	}

	.list-music-item {
		display: flex;
		margin: 0 0 66rpx 0;
		align-items: center;
	}

	.list-music-top {
		width: 100rpx;
		text-align: center;
	}

	.list-music-song {
		flex: 1;
	}

	.list-music-song view:nth-of-type(1) {
		width: 540rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.list-music-song view:nth-of-type(2) {
		display: flex;
		align-items: center;
		margin-top: 8rpx;
	}

	.list-music-song view:nth-of-type(2) image {
		width: 30rpx;
		height: 20rpx;
		margin-right: 8rpx;
	}

	.list-music-song view:nth-of-type(2) text {
		font-size: 24rpx;
		width: 400rpx;
		color: #bfbabb;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.list-music-item text {
		font-size: 50rpx;
		margin-right: 20rpx;
	}
</style>
