<template>
	<view class="container">
		<music-head title="榜单页面"></music-head>
			<view class="index-search" @click="searchTop()">
				<text class="iconfont iconsearch"></text>
				<input type="text" placeholder="搜索歌曲" disabled />
			</view>
			<scroll-view scroll-y="true">
				<view v-if="isLogin">
					<m-for-skeleton :avatarSize="200" :row="3" :loading="!isLogin" isarc="square"
						v-for="(item,key) in 10" :key="key">
					</m-for-skeleton>
				</view>			
				<view class="index-list" v-else>
					<view class="index-list-item" v-for="(item,index) in toList" :key="item.id"
						@click="handToList(item.id)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode="widthFix"></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-if="item.tracks != 0" v-for="(item,index) in item.tracks" :key="index">
								<view>{{index + 1}}.{{item.first}} - {{item.second}}</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		
	</view>
</template>

<script>
	import 'common/iconfont.css';
	import MusicHead from 'components/musichead/musichead.vue';
	import mForSkeleton from "components/m-for-skeleton/m-for-skeleton";
	import {
		toList
	} from 'common/api.js';
	export default {
		components: {
			MusicHead,
			mForSkeleton
		},
		data() {
			return {
				toList: [],
				isLogin: true
			}
		},
		onLoad() {
			toList().then(res => {
				if (res.length) {
					this.toList = res;
					this.isLogin = false;
				}
			})
		},
		methods: {
			handToList(id) {
				uni.navigateTo({
					url: '/pages/list/list?id=' + id
				})
			},
			searchTop() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 50rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 70rpx;
	}

	.index-search text {
		margin-left: 30rpx;
		font-size: 28rpx;
	}

	.index-search input {
		padding-left: 20rpx;
	}

	.index-list {
		margin: 0 30rpx;
		padding-bottom: 150rpx;
	}

	.index-list-item {
		display: flex;

	}

	.index-list-img {
		width: 212rpx;
		height: 212rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin: 0 22rpx 30rpx 0;
	}

	.index-list-img image {
		width: 212rpx;
		height: 212rpx;
	}

	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: #fff;
		font-size: 20rpx;
	}

	.index-list-text {
		height: 70rpx;
		line-height: 70rpx;
		font-size: 24rpx;

	}

	.index-list-text view {
		width: 400rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
