
##  Main功能 Editor的功能和字段传参表
### 总字段表
|  字段名   | 介绍  | 变量类型 | 默认 | 必传
|  ----  | ----  | ---- |  ----  | ----  | ---- |
| render  | 所需要进行渲染的字段和组件 | Array[Object],Object字段参照rander表 | |Yes
| draftMustField  | 保存为草稿的必传校验字段 | String | | Yes
| modelData  | 被rander渲染的数据对象 | Object | |Yes
| must  | 是否为必传递 | Boolean | false |
| key  | 左侧展示名称 | String |
| type  | 字段类型 | String |
#### Rander字段表通用
|  字段名   | 介绍  | 变量类型 | 默认 |
|  ----  | ----  | ---- |  ----  | ----  | ---- |
| key  | 左侧展示名称 | String |
| type  | 字段类型 | String |
| modelName  | 上传（接收）的字段名 | String |
| must  | 是否为必传递 | Boolean | false |
| key  | 左侧展示名称 | String |
| type  | 字段类型 | String |
| point  | 右侧提示文字 | String |
##### input
|  字段名   | 介绍  | 变量类型 | 默认 |
|  ----  | ----  | ---- |  ----  | ----  | ---- |
| maxlength  | 最大长度 | String | 50 |
| placeholder  | 占位的提示文本 | String | "input" |
| format  | 限制输入的文字 | RegExp |