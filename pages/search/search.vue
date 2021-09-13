<template>
	<view class="container">
		<music-head title="搜索" iconblack="true" icon="true"></music-head>
		<view class="search-search">
			<text class="iconfont iconsearch"></text>
			<input type="text" placeholder="搜索歌曲" v-model="searword" @confirm="handleToSearch(searword)" @input="searchHint(searword)" />
			<text v-if="searchType != 1" class="iconfont iconguanbi ky" @click="close"></text>
		</view>
		<scroll-view scroll-y="true" >
			<block v-if="searchType == 1">
				<view class="search-history" v-if="historySearch.length !== 0">
					<view class="search-history-head">
						<text>历史记录</text>
						<text class="iconfont iconlajitong" @click="ClearHistory"></text>
					</view>
					<view class="search-history-list">
						<view v-for="(item,index) in historySearch" :key="index" @tap="getHotWord(item)">{{item}}</view>
					</view>
				</view>
				<view class="search-hot">
					<view class="search-hot-head">热搜榜</view>
					<view class="search-hot-item" v-for="(item,index) in hotList" :key="index"
						@tap="getHotWord(item.searchWord)">
						<view class="search-hot-top"
							:class="{'color-one': index == 0, 'color-one':index == 1,'color-one':index == 2}">
							{{index + 1}}
						</view>
						<view class="search-hot-word">
							<view>
								{{item.searchWord}}
								<image :src="item.iconUrl" mode="aspectFit"></image>
							</view>
							<view>{{item.content}}</view>
						</view>
						<text class="search-hot-count">{{item.score}}</text>
					</view>
				</view>
			</block>
			<block v-else-if="searchType == 2">
				<view class="list-music">
					<view class="list-music-item" @click="SearchPaly(item.id)"
						v-for="(item,index) in seacrContent" :key="item.id">
						<view class="list-music-song">
							<view style="color: #45A5FF;" >{{item.name}}</view>
							<view>
								</image>
								<text>{{item.artists[0].name}} - {{item.album.name}}</text>
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
				</view>
			</block>
			<block v-else-if="searchType == 3 && isLogin == true"  >
				<view class="search-hint">
					<view class="search-hint-head"  @tap="getHotWord(searchNowWord)">搜索“ {{searchNowWord}}“</view>
					<view class="search-hint-item" @tap="getHotWord(item.keyword)" v-for="(item,index) in searchHintTop" :key="index">
						<text class="iconfont iconsearch"></text>
						<text>{{item.keyword}}</text>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import 'common/iconfont.css';
	import MusicHead from 'components/musichead/musichead.vue';
	import {
		hotSearch, // 热搜
		searchWord, // 搜索
		searchWordHint, //搜索提示
		searchWordShow
	} from "common/api.js";
	export default {
		components: {
			MusicHead
		},
		data() {
			return {
				hotList: [], // 热搜
				searword: '', // 搜索词
				historySearch: [], //历史搜索
				searchType: 1,
				searchHintTop: [], // 搜索提示词
				searchNowWord: '', // 未点击回车时的临时词
				seacrContent: [], // 搜索内容
				isLogin: false
			}
		},
		onLoad() {
			
			if(this.hotList.length == 0){
				this.getHotSearch();
			}
			let historySearch = uni.getStorageSync("historysearch");
			if (historySearch.length != 0) {
				this.historySearch = historySearch;
			}
		},
	
		methods: {
			// 热搜
			getHotSearch() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				hotSearch().then(res => {
					if (res.statusCode == 200) {
						this.hotList = res.data.data;
						uni.hideLoading();
					}
				})
			},
			// 点击获取热搜词
			getHotWord(name) {
				this.searword = name;
				this.searchType = 2;
				this.getSearchWordShow(name);
			},
			// 记录回车搜索历史记录
			handleToSearch(name) {
				if(name) {
					this.searchType = 2;
					this.historySearch.unshift(name);
					this.historySearch = [...new Set(this.historySearch)];
					if (this.historySearch.length > 10) {
						this.historySearch.length = 10;
					}
					uni.setStorage({
						key: 'historysearch',
						data: this.historySearch
					})
				}
			},
			// 清空历史记录 
			ClearHistory() {
				this.historySearch = [];
				uni.removeStorage({
					key: 'historysearch'
				})
			},
			// 搜索提示
			searchHint(name) {
				this.searchType =  3; 
				this.searchNowWord = name;
				if(!name) {
					this.searchType = 1; 
				}else {
					this.antiShake(this.searchHintTo(name),300);
				}				
			},
			// 搜索提示接口
			searchHintTo(name) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				searchWordHint(name).then(res => {
					if(res.statusCode == 200) {
						this.searchHintTop = res.data.result.allMatch;
						this.isLogin = true;
						uni.hideLoading();
					}
				})
			},
			// 获取全部搜索数据
			getSearchWordShow(name) {
				uni.showLoading({
					title: '获取中',
					mask: true
				})
				searchWordShow(name).then(res => {
					if(res.statusCode == 200) {
						this.seacrContent = res.data.result.songs;
						uni.hideLoading();
					}
				})
			},
			// 清空文本框
			close() {
				this.searchNowWord = '';
				this.searword = '';
				this.searchType = 1;
			},
			SearchPaly(id) {
				uni.navigateTo({
					url:'/pages/detail/detail?id='+id
				})
			},
			// 搜索防抖
			antiShake(fun, wait) {
				let timer = null;
				return function() {
					if (timer) clearTimeout(timer)
					timer = setTimeout(() => {
						fun.apply(this,arguments)
					}, wait)
				}
			}
		}
	}
</script>

<style scoped>
	.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 50rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 70rpx;
	}

	.search-search text {
		margin: 0 30rpx;
		font-size: 28rpx;
	}

	.search-search input {
		flex: 1;
		padding-left: 20rpx;
	}

	.search-history {
		margin: 0 30rpx;
		font-size: 26rpx;
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}

	.search-history-list {
		display: flex;
		flex-wrap: wrap;
	}

	.search-history-list view {
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background-color: #f7f7f7;
	}

	.search-hot {
		margin: 40rpx 30rpx 0;
		font-size: 26rpx;
		padding-bottom: 140rpx;
	}

	.search-hot-head {
		margin-bottom: 36rpx;
	}

	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}

	.search-hot-top {
		color: #878787;
		margin-left: 5rpx;
		width: 55rpx;
		font-weight: bold;
	}

	.search-hot-word {
		flex: 1;
	}

	.search-hot-word view:nth-child(1) {
		font-size: 30rpx;
		color: #000000;
	}

	.search-hot-word view:nth-child(2) {
		font-size: 24rpx;
		color: #878787;
		width: 480rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
		margin-left: 10rpx;
	}

	.search-hot-count {
		color: #878787;
	}

	.color-one {
		color: #fb2222;
	}
	.list-music {
		background-color: #fff;
		margin: 40rpx 30rpx 0;
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
	.search-hint {
		margin: 0 30rpx;
	}
	.search-hint-head {
		color: #45a5ff;
		margin-bottom: 50rpx;
	}
	.search-hint-item {
		font-size: 28rpx;
		margin-bottom: 45rpx;
	}
	.search-hint-item text:nth-child(1) {
		margin-right: 20rpx;
		color: #CDCACF;
	}

</style>
