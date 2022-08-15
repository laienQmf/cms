
import router from '../../router'
import store from '../../store'
export default {
    getRouterName(router) {      //获取所需要被列表渲染的对象结构
        let op = router.options.routes
        let container = []
        op.some(item => {
            item.meta && item.meta === 'start' &&
                (container = item.children)
        })
        return container
    },
    getPageData(router) {             //获tabs所需要的同级节点
        let op = router.options.routes
        let container = []
        let TrueC = []
        op.some(item => {
            item.meta && item.meta === 'start' &&
                (container = item.children)
        })
        function findChilden(dom) {
            dom.some(item => {
                if (item.children) { findChilden(item.children); return }
                TrueC.push(item)
            })
        }
        findChilden(container)
        return TrueC
    },
    //切换and新增页面
    cutPage(e) { 
        let state = true;
        let alldom = store.state.allDom.concat()
        let showdom = store.state.showDom.concat()
        showdom.some(item => {
            //在渲染节点中包含该节点
            if (item.path === e) {
                state = false;
                return true
            }
        })
        if (state) {
            alldom.some(item => {
                item.path === e && (showdom.push(item))
                    && (store.commit('modifyData', { name: 'showDom', newdata: showdom }))
            })
        }
        router.push(e)
        store.commit('modifyData', { name: 'nowPath', newdata: e })
    }
}