/* eslint-disable */
import Vue from 'vue'
import router from '../../routes'

/*
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCFYQKvQgLwUG-xlh78kmNQnubAfoxXgMU",
    authDomain: "gamespot-6c6c8.firebaseapp.com",
    projectId: "gamespot-6c6c8",
    storageBucket: "gamespot-6c6c8.appspot.com",
    messagingSenderId: "820183967013",
    appId: "1:820183967013:web:e1a25eac28f2d9ab9066cc"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 */

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
    },
    getters: {
        isAuth(state) {
            return !!state.token;
        },
        isLoading(state) {
            return state.loading;
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
        }
    }
}

export default admin;
