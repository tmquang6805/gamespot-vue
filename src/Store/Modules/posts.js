/* eslint-disable */
import Vue from "vue"

const posts = {
    namespaced: true,
    state: {
        homePosts: []
    },
    getters: {
        getAllPosts(state){
            return state.homePosts;
        }
    },
    mutations: {
        getAllPosts(state, posts) {
            state.homePosts = posts;
        }
    },
    actions: {
        getAllPosts ({commit}, payload) {
            Vue.http.get(`posts.json?orderBy="$key"&&limitToLast=${payload.limit}`)
                .then(response => response.json())
                .then(response => {
                    const posts = [];
                    for (let key in response) {
                        posts.push({...response[key], id: key});
                    }
                    commit("getAllPosts", posts.reverse());
                });
        }
    }
}

export default posts;
