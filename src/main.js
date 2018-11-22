import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'
import routes from './routes'
import VueQuillEditor from 'vue-quill-editor'
import $ from 'jquery'
//组件
import elliptical from "./pages/components/elliptical.vue"
import HS from "./pages/components/hideSearch.vue"

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueQuillEditor)
Vue.component('elliptical', elliptical)
Vue.component('HS', HS)

NProgress.configure({showSpinner: false});

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    $(window).unbind();
    if (store.state.isPackUp == false){
        store.commit('setTrue')
    }
    NProgress.start();
    if (to.path == '/') {
        next({path: '/login'})
    }
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = sessionStorage.getItem('access_token');
    if (!user && to.path != '/login') {
        next({path: '/login'})
    }
    else {
        next()
    }
})

router.afterEach(transition => {
    NProgress.done();
});

new Vue({
    el: '#app',
    template: '<App/>',
    router,
    store,
    components: {App}
}).$mount('#app')

