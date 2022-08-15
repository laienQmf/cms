import https from './httpStore'
import router from '../router'
import { Loading } from 'element-ui'
import { Message } from 'element-ui'
import qs from 'querystring'
const axios_1 = https.axios_1
const axios_2 = https.axios_2
const showImg = https.default_img_url
const imgUploadUrl = https.imgUploadUrl


// load是否要load状态 ，customBox是否进行返回提示
let request = (url,data,func,method,Load = false,customBox = true,) => {
    let loading;
    if(Load){
        loading = Loading.service()
    }
    axios_1({
        method: method || 'post',
        url,
        params: method === 'get'? data:null,
        data: method === 'get'? null:data,
    }).then((res) => {
        if(Load){
            loading.close()
        }
        // token超时
        if(res.data.code === 1001){
            localStorage.removeItem('token')
            router.push('/login')
        }
        if(res.data.code != 200){
            Message({message:res.data.message,type:'warning'})
        }
        if(res.data.code === 200 && customBox){
            Message({message:res.data.message,type:'success'})
        }
        func(res.data.code === 200 ?res:'error')
    }).catch(() => {
        if(Load){
            loading.close()
        }
        func('error')
        // Message({message:"request error " + res,type:'error'})
        throw 'Error'
    })
}
let request2 = (url,data,func,method) => {
    axios_2({
        method: method || 'post',
        url,
        params: method === 'get'? data:null,
        data: method === 'get'? null:data,
    }).then((data) => {
        func(data)
    }).catch((data) => {
        Message({message:"服务器错误"+data,type:'error'})
        func(data,'error')
        throw data
    })
}

axios_1.interceptors.request.use(config => {
    config.headers['token'] = localStorage.getItem('token')
    config.headers['projId'] = sessionStorage.getItem('projectId') || ''
    if(config.data && config.data.formData){
        config.data.formData = ''
        config.data = qs.stringify(config.data)
    }
    return config
})
export default {
    request,showImg,imgUploadUrl,request2
}