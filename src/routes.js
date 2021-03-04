/* eslint-disable */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/Store/store";

import Home from './components/Home/Index'
import Signin from './components/Signin/Index'
import Dashboard from './components/Dashboard/Index'
import AddPost from "@/components/Dashboard/AddPost";
import ListPosts from "@/components/Dashboard/ListPosts";
import MainDashboard from "@/components/Dashboard/Main";

Vue.use(VueRouter);

const authGuard = {
    beforeEnter: (to, from, next) => {
        const redirect = () => {
            if (store.state.admin.token) {
                to.name === 'signin' ? next({name: "dashboard"}) : next();
            } else {
                to.name === 'signin' ? next() : next({name: "home"});
            }
        }

        if(store.state.admin.loading) {
            store.watch((state, getters) => getters["admin/isLoading"], () => {
                redirect();
            });
        } else {
            redirect();
        }
    }
};

const routes = [
    { path: '/', component: Home, name: "home" },
    { path: '/signin', component: Signin, name: "signin", ...authGuard },
    { path: '/dashboard', component: Dashboard, children: [
            { path: "add-post", component: AddPost, name: "add-post" },
            { path: "list-posts", component: ListPosts, name: "list-posts" },
            { path: "/", component: MainDashboard, name: "dashboard" },
        ],
        ...authGuard
    },
    { path: '*', beforeEnter: (to, from, next) => {
        next({ name: "home" })
    } }
];

export default new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(from, to, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})
