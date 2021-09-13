<template>
	<view class="container">
		<music-head :title="songs.name" color="white" :icon="true"></music-head>
		<view class="fixbg" color="white" :style="{'background-image':'url('+ songs.picUrl +')'}"></view>
		<scroll-view scroll-y="true" v-if="!isLogin">
			<view class="detail-play"  @tap="playT()">
				<image :src="songs.picUrl" mode="widthFix" :class="{'detail-play-runing': isPlayPotate}"></image>
				<text class="iconfont" :class="iconPlay"></text>
				<view></view>
			</view>
			<view class="datail-lyric">
				<view class="detail-lyric-wrap" :style="{transform:'translateY('+ -(lyricIndex-1) * 82  +'rpx)'}">
					<view class="detail-lyric-item" :class="{active: lyricIndex === index}" v-for="(item,index) in lyric" :key="index">
						{{item.lyric}}
					</view>
				</view>
			</view>
			<view class="detail-like">
				<view class="detail-like-head">
					<text>喜欢这首歌的人也听</text>
					<!-- <view>
						<text class="iconfont iconbofang"></text>
						<text>一键收听</text>
					</view> -->
				</view>
				<view class="detail-like-lyric">
					<view class="detail-like-item" v-for="(item,index) in SimiSongs" :key="item.id" @click="handToSimi(item.id)">
						<image :src="item.album.blurPicUrl" mode="widthFix"></image>
						<view class="detail-like-lyric-name">
							<text id="name">{{item.name}}</text>
							<view>
								<image src="../../static/sq.png" v-if="item.privilege.maxbr === 999000" mode="widthFix"></image>
								<text>{{item.artists[0].name}} - {{item.name}}</text>
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
				</view>
			</view>
			<view class="detail-comment">
				<view class="detail-comment-head">精彩评论</view>
				<view class="detail-comment-item" v-for="(item,index) in hotComments" :key="item.id">
					<view class="detail-comment-img">
						<image :src="item.user.avatarUrl" mode="widthFix"></image>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{item.user.nickname}}</view>
									<view style="font-size: 22rpx;">{{item.time | formattime}}</view>
								</view>
								<view class="detail-comment-like">{{item.likedCount}} <text
										class="iconfont iconlike"></text></view>
							</view>
							<view class="detail-comment-text">
								{{item.content}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import MusicHead from 'components/musichead/musichead.vue';
	import 'common/iconfont.css';
	import {
		songDetail,
		simiSong,
		getSongComment,
		getSongUrl,
		songLyric
	} from "common/api.js"
	export default {
		components: {
			MusicHead
		},
		data() {
			return {
				isLogin: true,
				// 歌曲详情
				songs: {
					name: '',
					picUrl: ''
				},
				// 相似歌曲
				SimiSongs: [],
				hotComments: [],
				// 歌词
				lyric: [],
				lyricIndex: 0,// 歌词高亮显示下标
				iconPlay: 'iconpause', //是否播放
				isPlayPotate: false, //是否旋转
				bgAudioManager:'',
				timer: ''
			}
		},
		onLoad(option) {
			
			// 歌曲详情
			this.getSongDetail(option.id);
			// 相似歌曲
			// this.getSimiSong(option.id);
			// // 评论
			// this.getSongComment(option.id);
		},
		onUnload() {
			this.clearPlayLyric(); //离开页面清除定时器 歌词
		},
		onHide() {
			this.clearPlayLyric(); //隐藏页面清除定时器 歌词
			
		},
		methods: {
			getSongDetail(id) {
				uni.showLoading({
					title: '加载中...'
				})
				this.isLogin = true;
				this.$store.commit('NEXT_Music_ID',id);
				Promise.all([songDetail(id), simiSong(id), getSongComment(id), songLyric(id),getSongUrl(id)]).then(res => {
					if (res[0].statusCode === 200) {
						this.songs.name = res[0].data.songs[0].al.name;
						this.songs.picUrl = res[0].data.songs[0].al.picUrl;
					}
					if (res[1].statusCode === 200) {
						this.SimiSongs = res[1].data.songs;
					}
					if (res[2].statusCode === 200) {
						this.hotComments = res[2].data.hotComments;
					}
					if (res[3].statusCode === 200) {
						
						let lyric = res[3].data.lrc.lyric;
						let re = /\[([^\]]+)\]([^\[]+)/g;
						let result = [];
						lyric.replace(re, ($0, $1, $2) => {
							result.push({"time": this.formatTimeToSec($1), "lyric": $2});
						})
						this.lyric = result;
					}
					if(res[4].statusCode === 200) {
						console.log(res[4])
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songs.name;
						this.bgAudioManager.coverImgUrl = this.songs.picUrl;
						this.bgAudioManager.singer = this.SimiSongs[0].artists[0].name;
						this.bgAudioManager.coverImgUrl = this.songs.picUrl;
						this.bgAudioManager.src = res[4].data.data[0].url || '';
						// 歌词滚动
						this.listenLyricIndex();
						
						this.bgAudioManager.onPlay(() => {
							this.iconPlay = 'iconpause';
							this.isPlayPotate = false;
							this.listenLyricIndex();
							
						})
						this.bgAudioManager.onPause(() => {
						this.iconPlay = 'iconbofang';
						this.isPlayPotate = true;
						this.clearPlayLyric(); // 清除定时器
						})
						this.bgAudioManager.onEnded(()=> {
							this.getSongDetail(this.$store.state.nextMusicId);
						})
					}
					uni.hideLoading()
					this.isLogin = false;
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '不可播放2s返回'
					})
					setTimeout(() => {
						uni.navigateBack()
					},2000)
				})
			},
			formatTimeToSec(value) {
				let arr = value.split(':');
				return (arr[0] *60)  + parseFloat((arr[1] * 1).toFixed(1))
			},
			playT() {
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play();
				}else {
					this.bgAudioManager.pause();
				}
				
			},
			// 歌词滚动
			listenLyricIndex() {
				clearInterval(this.timer);
				this.timer = setInterval(()=> {
					for(let i=0;i<this.lyric.length;i++) {
						if(this.bgAudioManager.currentTime > this.lyric[this.lyric.length - 1].time) {
							this.lyricIndex = this.lyric.length - 1;
							break;
						}
						// this.bgAudioManager.currentTime 是当前歌曲播放到的时间
						if(this.bgAudioManager.currentTime > this.lyric[i].time && this.bgAudioManager.currentTime < this.lyric[i+1].time) {
							this.lyricIndex = i;
						}
						
					}
				},1000)
			},
			// 清除定时器
			clearPlayLyric() {
				clearInterval(this.timer);
			},
			// 相似歌曲播放
			handToSimi(id) {
				this.getSongDetail(id);
			}
		}
	}
</script>

<style scoped>
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background-image: url(../../static/disc.png);
		background-size: cover;
		margin: 214rpx auto 0 auto;
		position: relative;
	}

	.detail-play image {
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		animation: st 10s linear infinite;
		animation-play-state: running ;
	}
	.detail-play-runing {
		animation-play-state: paused !important;
	}
	@keyframes st{
		from{ transform: rotate(0deg);}
		to{transform: rotate(360deg);}
	}

	.detail-play text {
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		color: #fff;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
	}

	.detail-play view {
		width: 230rpx;
		height: 360rpx;
		background-image: url(../../static/needle.png);
		position: absolute;
		left: 170rpx;
		right: 0;
		top: -170rpx;
		margin: auto;
		background-size: cover;
	}

	.datail-lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
		color: #535354;
	}

	.datail-lyric-wrap {}

	.detail-lyric-item {
		height: 82rpx;
		width: 90%;
		overflow: hidden;
		text-align: center;
		margin: 0 auto;
	}

	.active {
		color: #fff;
	}

	.detail-like {
		margin: 30rpx 30rpx 0;
	}
	#name {
		font-size: 30rpx;
	}
	.detail-like-head {
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		color: #fff;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.detail-like-head text {
		font-size: 36rpx;
	}

	.detail-like-head view {
		width: 170rpx;
		height: 50rpx;
		line-height: 50rpx;
		border: 1px solid #a2a2a2;
		border-radius: 25rpx;
		text-align: center;
	}

	.detail-like-head view text {
		font-size: 28rpx;
	}

	.detail-like-lyric {
		margin-bottom: 30rpx;
	}

	.detail-like-item {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.detail-like-item text {
		flex: 1;
		font-size: 70rpx;
		text-align: right;
		color: #808080;
	}

	.detail-like-item image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		margin-right: 20rpx;
	}

	.detail-like-lyric-name {}

	.detail-like-lyric-name text {
		font-size: 36rpx;
		color: #fff;
	}

	.detail-like-lyric-name {
		align-items: center;
	}

	.detail-like-lyric-name view image {
		width: 30rpx;
		margin-right: 8rpx;
	}

	.detail-like-lyric-name view text {
		display: inline-block;
		font-size: 24rpx;
		color: #b3b0af;
		width: 400rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: left;
	}

	.detail-comment {
		margin: 0 30rpx;
	}

	.detail-comment-head {
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
		color: #fff;
		justify-content: space-between;
		align-items: center;
		font-size: 36rpx;
		margin-bottom: 30rpx;
	}

	.detail-comment-item {
		margin-bottom: 28rpx;
	}

	.detail-comment-img {
		display: flex;
	}

	.detail-comment-img image {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		margin-right: 18rpx;
	}

	.detail-comment-content {
		flex: 1;
		color: #cdcacf;
	}

	.detail-comment-title {
		display: flex;
		justify-content: space-between;
	}

	.detail-comment-name view:nth-of-type(1) {
		font-size: 26rpx;
	}

	.detail-comment-like {
		font-size: 28rpx;
	}

	.detail-comment-text {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #fff;
		margin-top: 20rpx;
		border-bottom: 1px solid #939396;
		padding-bottom: 40rpx;
		text-align: justify;
	}
	.detail-lyric-wrap {
		transform: .1s;
	}
</style>
