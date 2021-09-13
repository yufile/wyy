import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		allMusicId:[],
		nextMusicId: ''
	},
	mutations: {
		ALL_MUSIC(state,payload) {
			state.allMusicId = payload;
		},
		NEXT_Music_ID(state,payload) {
			for(let i=0;i<state.allMusicId.length;i++) {
				if(state.allMusicId[i].id == payload) {
					if((i+1) == state.allMusicId.length) {
						state.nextMusicId = state.allMusicId[0].id;
					}else {
						state.nextMusicId = state.allMusicId[i+1].id;
					}
				
				}
			}
		}
	}
})