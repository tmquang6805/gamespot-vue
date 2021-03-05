/* eslint-disable */
import Vue from 'vue'
import router from '../../routes'

const FbConfig = {
    auth: "https://identitytoolkit.googleapis.com/v1",
    api_key: "AIzaSyCFYQKvQgLwUG-xlh78kmNQnubAfoxXgMU",
};

const admin = {
    namespaced: true,
    state: {
        token: null,
        refresh: null,
        authFailed: false,
        loading: true,
        addPostStatus: false,
        imageUploadUrl: null,
        adminPosts: [],
    },
    getters: {
        isAuth(state) {
            return !!state.token;
        },
        isLoading(state) {
            return state.loading;
        },
        getPostStatus(state) {
            return state.addPostStatus;
        },
        getImageUrl(state) {
            return state.imageUploadUrl;
        },
        getAdminPosts(state) {
            return state.adminPosts;
        }
    },
    mutations: {
        authUser(state, authData) {
            state.token = authData.idToken;
            state.refresh = authData.refreshToken;

            if (authData.type === 'signin') {
                router.push({name: 'dashboard'});
            }
        },
        setTokenToLocalStorage(state, authData) {
            localStorage.setItem("token", authData.token);
            localStorage.setItem("refresh", authData.refresh);
            localStorage.setItem("expire_at", Math.floor(Date.now() / 1000 + parseInt(authData.expire)));
        },
        authFailed(state, type) {
            state.authFailed = type !== 'reset';
        },
        logoutUser(state) {
            state.token = null;
            state.refresh = null;
        },
        removeTokenFromLocalStorage(state) {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            localStorage.removeItem("expire_at");
        },
        resetLoading(state) {
            state.loading = false;
        },
        setPostStatusToTrue(state) {
            state.addPostStatus = true;
        },
        resetPostStatus(state) {
            state.addPostStatus = false;
        },
        imageUpload(state, imageData) {
            state.imageUploadUrl = imageData.secure_url;
        },
        clearImageUpload(state) {
            state.imageUploadUrl = '';
        },
        getAdminPosts(state, posts) {
            state.adminPosts = posts
        }
    },
    actions: {
        signIn( {commit}, payload) {
            Vue.http.post(`${FbConfig.auth}/accounts:signInWithPassword?key=${FbConfig.api_key}`, {
                ...payload,
                returnSecureToken: true
            })
            .then(response => response.json())
            .then(authData => {
                commit("authUser", {
                    ...authData,
                    type: 'signin'
                });
                commit("setTokenToLocalStorage", {
                    'token': authData.idToken,
                    'refresh': authData.refreshToken,
                    'expire': authData.expiresIn,
                });
            })
            .catch(err => {
                commit("authFailed")
            });
        },
        logout({ commit }) {
            commit("logoutUser");
            commit("removeTokenFromLocalStorage");
        },
        doRefreshToken({ commit}, refreshToken) {
            Vue.http.post(`https://securetoken.googleapis.com/v1/token?key=${FbConfig.api_key}`, {
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
                .then(response => response.json())
                .then(res => {
                    commit("authUser", {
                        idToken: res.id_token,
                        refreshToken: res.refresh_token
                    });
                    commit("setTokenToLocalStorage", {
                        'token': res.id_token,
                        'refresh': res.refresh_token,
                        'expire': res.expires_in,
                    });
                    commit("resetLoading");
                })
                .catch(err => {
                    console.log(err);
                });
        },
        refreshToken({ commit, dispatch }){
            const refreshToken = localStorage.getItem("refresh");
            const expireAt = parseInt(localStorage.getItem("expire_at"));
            const now = Math.floor(parseInt(Date.now() / 1000));

            if (!refreshToken) {
                commit("resetLoading");
                return false;
            }

            if (expireAt > now) {
                commit("authUser", {
                    idToken: localStorage.getItem("token"),
                    refreshToken: localStorage.getItem("refresh"),
                });

                commit("resetLoading");
                return false;
            }

            dispatch("doRefreshToken", refreshToken);
        },
        addPost({ commit, state }, post) {
            Vue.http.post(`posts.json?auth=${state.token}`, post)
                .then(response => response.json())
                .then(response => {
                    commit("setPostStatusToTrue");
                    setTimeout(() => {
                        commit("resetPostStatus");
                    }, 3000);
                });
        },
        imageUpload({ commit }, file) {
            const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/tmquang6805/image/upload';
            const CLOUDINARY_PRESET = 'ml_default';

            let formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_PRESET);

            Vue.http.post(CLOUDINARY_URL, formData, {
                headers: {
                    'Content-type': 'Application/x-www-urlencoded'
                }
            })
            .then(response => response.json())
            .then(response => {
                commit('imageUpload', response);
            });
        },
        getAdminPosts({ commit }) {
            Vue.http.get("posts.json")
                .then(response => response.json())
                .then(res => {
                    const posts = [];

                    for (let key in res) {
                        posts.push({...res[key], id: key})
                    }
                    commit("getAdminPosts", posts.reverse());
                });
        },
        deletePost({ commit, state }, id) {
            Vue.http.delete(`posts/${id}.json?auth=${state.token}`)
                .then(() => {
                    let newPosts = [];
                    state.adminPosts.forEach(post => {
                        if (post.id !== id) {
                            newPosts.push(post);
                        }
                    });
                    commit("getAdminPosts", newPosts);
                });
        }
    }
}

export default admin;
