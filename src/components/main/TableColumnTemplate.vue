<template>
    <div class="table-cell">
        <!-- 自定义展示 -->
        <div
            class="table-input-text"
            v-if="randerItem.type === 'custom'"
            :title="randerItem.custom(scope.row)"
        >
            {{ randerItem.custom(scope.row) }}
        </div>
        <!-- text展示 -->
        <div
            :class="`table-input-text ${randerItem.jump && 'hover'}`"
            v-if="randerItem.type === 'text'"
            :title="scope.row[randerItem.modelName]"
            @click="
                randerItem.jump &&
                    $router.push(`/${pageName}-editor?id=${scope.row.id}`)
            "
            :style="randerItem.jump ? 'color:#409eff' : ''"
        >
            {{ scope.row[randerItem.modelName] }}
        </div>
        <!-- img展示 -->
        <div class="table-input-img" v-if="randerItem.type === 'img'">
            <img
                :src="$store.state.default_file_url + scope.row[randerItem.modelName]"
            />
        </div>
        <!-- select展示 -->
        <div class="table-input-select" v-if="randerItem.type === 'select'">
            {{
                $searchOptionName(
                    optionsAll[randerItem.options],
                    scope.row[randerItem.modelName]
                )
            }}
        </div>
    </div>
</template>

<script>
export default {
    props: ['scoped','randerItems'],
    computed:{
        randerItem(){
            return this.randerItems
        },
        scope(){
            return this.scoped
        }
    }
};
</script>

<style scoped>
.table-input-text,
.table-input-select,
.table-option,
.table--head-item {
    padding: 12px 4px;
    width: 100%;
    height: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 100%;
}
</style>