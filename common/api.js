import {
	baseUrl
} from './config.js';

export function toList() {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			success: res => {
				let data = res.data.list;
				// data.length = 10;
				reslove(data)
			}
		});
	})
}
export function songList(id) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/playlist/detail?id=${id}`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// http://localhost:3000/song/detail?ids=347230 歌曲详情
export function songDetail(id) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/song/detail?ids=${id}`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// http://localhost:3000/simi/song?id=347230 相似音乐
export function simiSong(id) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/simi/song?id=${id}`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// http://localhost:3000/song/url?id=33894312 获取播放地址
export function getSongUrl(id) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/song/url?id=${id}&realIP=116.25.146.177`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}

// http://localhost:3000/comment/music?id=186016&limit=1 获取评论
export function getSongComment(id) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/comment/music?id=${id}`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// http://localhost:3000/lyric?id=33894312 歌词
export function songLyric(id) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/lyric?id=${id}&realIP=116.25.146.177`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// 热搜榜 http://localhost:3000/search/hot/detail
export function hotSearch() {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/search/hot/detail`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// 搜索 http://localhost:3000/search/suggest?keywords= 海阔天空
export function searchWord(name) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/search/suggest?keywords=${name}`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// 搜索提示 http://localhost:3000/search/suggest?keywords=海阔天空&type=mobile

export function searchWordHint(name) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/search/suggest?keywords=${name}&type=mobile`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}
// 搜索展示页面 // http://localhost:3000/search?keywords=海阔天空&limit=40
export function searchWordShow(name,num = 40) {
	return new Promise(reslove => {
		uni.request({
			url: `${baseUrl}/search?keywords=${name}&limit=${num}`,
			method: 'GET',
			success: res => {
				reslove(res)
			}
		});
	})
}