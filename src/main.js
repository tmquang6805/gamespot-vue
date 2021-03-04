import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import router from "./routes";
import store from "@/Store/store";
import vuelidate from 'vuelidate'

import { MdCard } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'

import Button from "@/components/UI/Button";

import wysiwyg from "vue-wysiwyg"

Vue.component('app-button', Button);

/* MATERIAL */
Vue.use(MdCard);

Vue.use(VueResource);
Vue.http.options.root = '';

/* MISC */
Vue.use(vuelidate);
Vue.use(wysiwyg, {});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
