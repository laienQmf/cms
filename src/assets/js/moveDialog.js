import store from '../../store'
export default {
    ShowDialog(option){
        store.commit('modifyData',{
            name:'moveDialogState',
            newdata:{
                show:true,
                title:'标题',
                message:'内容',
                type:false,
                success:Function,
                cancel:Function,
                ...option
            }
        })
    }
}