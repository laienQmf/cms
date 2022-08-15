import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
let routes = [
  {
    path: '/login',
    component: re => require(['../components/main/common/Login.vue'], re)
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/main',
    component: re => require(['../components/main/index.vue'], re)
  },
]
// 自动化注册路由
let renderRouter = []
// require.context(directory, useSubdirectories, regExp, mode = 'sync')
const resourcefiles = require.context('../components/resourceComponents', true, /\.\/[a-z A-Z]{1,}\/[a-z A-Z]{1,}.vue/).keys()
const projectfiles = require.context('../components/projectComponents', true, /\.\/[a-z A-Z]{1,}\/[a-z A-Z]{1,}.vue/).keys()
const userfiles = require.context('../components/userComponents', true, /\.\/[a-z A-Z]{1,}\/[a-z A-Z]{1,}.vue/).keys()
function rgister(files, sign) {
  let routerArray = []
  files.some((item) => {
    // 获取文件路径的“ ./ ”后面的文件夹名
    let routerHead = item.match(/\.\/([a-z A-Z]{1,})/)[1]
    // 获取文件路径的“ ./ ”后面的文件夹下的文件名，不带后缀
    let fileName = item.match(/\.\/[a-z A-Z]{1,}\/([a-z A-Z]{1,}).vue/)[1]
    // 在文件名中检索，大写后的文件夹名，替换成空（因为文件名首字母是大写）
    let routerEnd = fileName.replace(routerHead.replace(routerHead[0], routerHead[0].toUpperCase()), '')
    // 最后得到小写的除开文件类型的文件名的标识
    routerEnd = routerEnd.replace(routerEnd[0], routerEnd[0].toLowerCase())
    let component;
    if (sign === 'resource') {
      component = re => require(['../components/resourceComponents' + item.slice(1,)], re)
    }
    if (sign === 'project') {
      component = re => require(['../components/projectComponents' + item.slice(1,)], re)
    }
    if (sign === 'user') {
      component = re => require(['../components/userComponents' + item.slice(1,)], re)
    }
    let showName = routerHead.replace(/[A-Z]{1}/g, (val) => ' ' + val)
    showName = showName.replace(routerHead[0], routerHead[0].toUpperCase())
    let obj = {
      path: "/" + routerHead + '-' + routerEnd,
      component,
      meta: routerHead,
      type: routerEnd,
      showName,
      // 标记分组
      class: sign
    }
    if (sign === 'project') {
      obj.path += '-proj'
    }
    // editor默认隐藏
    if (routerEnd === 'editor') {
      obj.noShow = true
      obj.active = `/${routerHead}-list`
      // project加上-proj
      if (sign === 'project') {
        obj.active = `/${routerHead}-list-proj`
      }
    }
    // 用户的默认隐藏
    if (obj.path.indexOf('accountManage-') != -1) {
      obj.noShow = true
    }
    routerArray.push(obj)
  })
  // 排序
  {
    // 排序数组
    // 资源
    let resource = ['operationRecord', 'animation', 'sound', 'music', 'reminder', 'quote', 'keyword', 'regularExercise',]
    // 项目
    let project = ['info', 'playlist', 'workout', 'reminder', 'custom']
    let array = [...routerArray]
    routerArray.some((item, index1) => {
      // path不会变动，使用path作为标识
      sign === 'resource' && resource.some((path, index2) => {
        if ((item.path === `/${path}-list` && item.class === 'resource')) {
          [array[index2], array[index1]] = [array[index1], array[index2]]
        }
      })
      sign === 'project' && project.some((path, index2) => {
        if ((item.path === `/${path}-list-proj` && item.class === 'project')) {
          if(index2 === 3 || index2 === 0){
            console.log(array[index2],array[index1])
          }
          [array[index2], array[index1]] = [array[index1], array[index2]]
        }
      })
    })
    routerArray = array
  }
  renderRouter = [...renderRouter,...routerArray]
}
rgister(resourcefiles, 'resource')
rgister(projectfiles, 'project')
rgister(userfiles, 'user')
let insertRouter = [
  // {
  //   path: "/accountManage-list",
  //   component: re => require(['../components/accountManage/AccountManageList.vue'], re),
  //   noShow: true
  // },
  // {
  //   path: "/accountManage-editor",
  //   component: re => require(['../components/accountManage/AccountManageEditor.vue'], re),
  //   noShow: true
  // },
  {
    path: '/projectHome-list',
    component: re => require(['../components/projectHome/ProjectHomeList.vue'], re)
  },
  {
    path: '/my-account',
    component: re => require(['../components/myAccount.vue'], re)
  },
]

let startRouter = [
  ...renderRouter,
  ...insertRouter
]
routes.push(
  {
    meta: 'start',
    path: '/',
    component: re => require(['../components/main/common/Home.vue'], re),
    children: startRouter
  }
)
const router = new Router({ routes })
export default router