import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './assets/all.css'
import ElementUI, { Loading } from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'  //英文包
import 'element-ui/lib/theme-chalk/index.css'
import './assets/cross-icon/iconfont.css'
import store from './store'
import axios from './requests/index.js'
import single from "./assets/js/single";
import md5 from 'md5'
import qs from 'querystring'
import sortable from 'sortablejs'
store.commit('modifyData', { name: 'allDom', newdata: single.getPageData(router) })  //初始化页面节点


// 公用组件注册
Vue.component('page-editer', re => require(['./components/EditerTemplate.vue'], re))
Vue.component('page-list', re => require(['./components/ListTemplate.vue'], re))
Vue.component('my-svg', re => require(['./components/main/common/MySvg.vue'], re))
Vue.component('upload-file', re => require(['./components/main/FileUploadPop.vue'], re))
// 载入语言
{
  let language = require('./assets/json/language.json')
  let type = localStorage.language || 'English'
  store.commit('modifyData', { name: 'language', newdata: language[type] })
}

Vue.use(ElementUI, { locale })

Object.keys(axios).some((item) => { Vue.prototype['$' + item] = axios[item] })

Vue.prototype.$loading = Loading
Vue.prototype.$sortable = sortable
Vue.use(ElementUI)

// 对象深复制
function $deepCopy(data) {
  if (!data && (data != false) && (data != 0)) { throw `数据为空 => ${data}` }
  let container = null;
  if (data.constructor === Array) {
    container = []
    data.some((item, index) => {
      if (typeof item === 'object') {
        container[index] = $deepCopy(item)
      } else {
        container[index] = item
      }
    })
  }
  if (data.constructor === Object) {
    container = {}
    Object.keys(data).some((item) => {
      if (typeof data[item] === 'object' && data[item] != null) {
        container[item] = $deepCopy(data[item])
      } else {
        container[item] = data[item]
      }
    })
  }
  if (data.constructor != Object && data.constructor != Array) {
    container = data
  }
  return container
}
// 通过key查找到对应的对象数组的value
function $searchOptionName(options, value) {
  let name = "";
  if (options.constructor != Array || !options) {
    // console.log(options)
    // throw '类型不为Array'
    return true
  }
  options.some((item) => {
    if (item.value == value) {
      name = item.label;
      return true;
    }
  });
  return name;
}
// Object.prototype.length = function(){ return Object.keys(this).length }
Vue.prototype.$md5 = md5
Vue.prototype.$qs = qs
Vue.prototype.$loading = ElementUI.Loading
Vue.prototype.$deepCopy = $deepCopy
Vue.prototype.$searchOptionName = $searchOptionName
Vue.prototype.$cutArray = (array, name, state, search = false) => {
  state = state || 'cut'
  // 检索为空，全返回
  if ((!name && name !== 0) || (name.constructor === Object && !name.value && name.value !== 0)) {
    // console.log(array, name, state)
    return array
  }
  const newData = []
  array.some((item, index) => {
    // index为准做切割
    if (typeof name === 'number') {
      if (state === 'cut' && index != name) { newData.push(item) }
      if (state === 'get' && index === name) { newData.push(item) }
    }
    // 用数组内容做切割
    // item 有可能是 file 之类的其他对象字典，这里用name进行判定
    else if (name.constructor === Object) {
      // 为字典数组的情况,search 为 true是 模糊查询
      if (search) {
        if (state === 'cut' && item[name.key].indexOf(name.value) === -1) { newData.push(item) }
        if (state === 'get' && item[name.key].indexOf(name.value) != -1) { newData.push(item) }
      } else {
        if (state === 'cut' && item[name.key] != name.value) { newData.push(item) }
        if (state === 'get' && item[name.key] === name.value) { newData.push(item) }
      }
    } else {
      if (search) {
        if (state === 'cut' && item.indexOf(name) === -1) { newData.push(item) }
        if (state === 'get' && item.indexOf(name) != -1) { newData.push(item) }
      } else {
        if (state === 'cut' && item != name) { newData.push(item) }
        if (state === 'get' && item === name) { newData.push(item) }
      }
    }
  })
  return newData
}
Vue.prototype.$getUserPermssion = () => {
  // console.log('diaoyong')
  return new Promise((resolve) => {
    axios.request(
      "/sys/perms/listByMe",
      {},
      (res) => {
        if (res !== "error") {
          function Permission() {
            let obj = {};
            obj.view = false;
            obj.add = false;
            obj.editor = false;
            obj.delete = false;
            return obj;
          }
          function fieldToLocal(obj) {
            if (obj.read) {
              obj.view = true;
            }
            if (obj.update) {
              obj.editor = true;
            }
            if (obj.del) {
              obj.delete = true;
            }
            Object.keys(obj).some((item) => {
              if (typeof obj[item] === "object") {
                fieldToLocal(obj[item]);
              }
            });
          }
          let data = res.data.data;
          let user = Permission(),
            resource = Permission(),
            program = Permission();
          data.some((item) => {
            // user权限配置
            if (item.permsKey.indexOf("user:") != -1) {
              let permission = item.permsKey.replace(
                "user:",
                ""
              );
              user[permission] = true;
            }
            // resource权限配置
            if (item.permsKey.indexOf("res_") != -1) {
              // resource的查看权限由是否存在子节点判定
              resource.view = true;
              let string = item.permsKey.replace(
                "res_",
                ""
              );
              // toHump
              string = string.replace(
                /_([a-z])/g,
                (all, val) => val.toUpperCase()
              );
              let array = string.split(":");
              // 传入的权限没有resource的四大权限，所以直接建立子节点
              !resource[array[0]] &&
                (resource[array[0]] = Permission());
              resource[array[0]][array[1]] = true;
            }
            // project权限配置
            if (
              item.permsKey.indexOf("proj_") != -1 ||
              item.permsKey.indexOf("proj:") != -1
            ) {
              if (item.permsKey.indexOf("proj:") != -1) {
                program[
                  item.permsKey.replace("proj:", "")
                ] = true;
              } else {
                // 如果存在proj_的状态，program有子节点，view变为true
                program.view = true;
                let string = item.permsKey.replace(
                  "proj_",
                  ""
                );
                // 匹配首个
                let id = "";
                string = string.replace(
                  /([0-9]{1,})_/,
                  (all, val) => {
                    id = parseInt(val);
                    return "";
                  }
                );
                // 资源的子节点传入是蛇形，转化成驼峰toHump
                string = string.replace(
                  /_([a-z])/g,
                  (all, val) => val.toUpperCase()
                );
                let array = string.split(":");
                // 建立项目的权限节点，项目本身只有子模块的权限，本身没有权限
                !program[id] && (program[id] = {});
                // 项目下的模块不存在的时候，初始化权限
                !program[id][array[0]] &&
                  (program[id][array[0]] =
                    Permission());
                // 给具体的权限赋值
                program[id][array[0]][array[1]] = true;
              }
            }
          });
          let permission = {
            user,
            resource,
            program,
            local: false,
          };
          fieldToLocal(permission);
          store.commit("modifyData", {
            name: "permissionPage",
            newdata: permission,
          });
          console.log(permission)
          resolve();
        }
      },
      "get",
      false,
      false
    );
  });
}
Vue.config.productionTip = false //关闭生产环境不必要警告
Vue.prototype.$renderingCheck = (permissionAll, projectMenu, routerItem) => {
  // routerItem 路由的节点，permission 当前路由的展示权限，cover项目or资源是否包含该路由
  let state = false
  if (routerItem.class === 'resource') {
    if (permissionAll[routerItem.meta]) {
      let permission = permissionAll[routerItem.meta].view
      permission && (state = true)
    }
  }
  if (routerItem.class === 'project') {
    let id = sessionStorage.getItem('projectId') || null
    if (id && permissionAll[id] && permissionAll[id][routerItem.meta]) {
      let permission = permissionAll[id][routerItem.meta].view
      permission && true && (state = true);
      // console.log(permission,projectMenu[routerItem.meta],routerItem.meta)
    }
  }
  // info 和 operationLog 不在权限控制
  if(routerItem.path === '/info-list-proj' || routerItem.meta === 'operationRecord'){ state = true }
  return state
}

// 路由守卫
router.beforeEach((to, from, next) => {
  let allow = true
  // main
  // storage中的token验证
  let localStorageToken = localStorage.getItem('token')
  if (!localStorageToken) {
    allow = false
  }
  // 没有token时允许访问的路由
  let allowArray = ['/login']
  allowArray.some(item => {
    if (to.path === item) {
      allow = true
    }
  })
  //如果没有token，并且不在允许访问中，全部拒绝
  if(!allow){
    next('/login')
    return true
  }
  // prject禁止无id访问
  {
    // 给新增放行
    if (to.fullPath === '/info-list-proj?id=add') {
      return next()
    }
    let id = sessionStorage.getItem('projectId')
    let op = router.options.routes;
    let container = [];
    op.some((item) => {
      item.meta &&
        item.meta === "start" &&
        (container = item.children);
    });
    container.filter(i => i.class === "project").some((item) => {
      // 访问project的组件并且没有id时禁止访问,跳转到home
      if (to.path === item.path && !id) {
        return next('/main')
      }
    });
  }
  if (allow) { next() } else {
    next('/login')
  }
})

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
