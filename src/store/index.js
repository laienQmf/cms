import Vue from 'vue'
import Vuex from 'vuex'
import base from './base'

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        // userData
        version: '1.0.0',
        username: 'ddd',
        userImg: '',
        userData: {
            "userName": "admin",
            "nickName": "admin",
            "realName": "admin",
            "status": 1,
            "email": null,
            "phone": null,
            "sex": null,
            "dept": ""
        },
        permissionTree: [],
        projectMenu:{
            info:true,
        },
        permissionPage: {
            // 判断是否为本地数据
            local: true,
            user: {
                view: true,
                add: true,
                delete: true,
                editor: true,
            },
            resource: {
                view: true,
                add: true,
                delete: true,
                editor: true,
            },
            program: {
                view: true,
                add: true,
                delete: true,
                editor: true,
            },
        },

        token: null,                //存放token
        defineNowPath: '/main',    //基础页面路由
        nowPath: '/exercise-list',          //当前页面路由
        showDom: [],         //给Tab的数据
        allDom: [],    //全部的dom
        wid: null,      //页面宽度
        hei: null,      //页面高度
        randerStyle: null,
        publicAddress: null,
        language: {},
        default_file_url: '',
        optionBase: base,
    },
    mutations: {
        modifyData(state, data) {
            state[data.name] = data.newdata
        },
        resourcePermissionAdd(state, data) {
            state.permissionPage.resource[data.name] = data.newdata
        },
        optionBaseAdd(state, data) {
            state.optionBase[data.name] = data.newdata
        },
        showDomConfig(state, obj) {
            if (obj['type'] === 'add') {
                state.showDom.push(obj.data)
            }
        }
    }
})