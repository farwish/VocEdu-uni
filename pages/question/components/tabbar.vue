<template>
    <u-tabbar :list="list" :before-switch="beforeSwitch" v-model="current" :active-color="activeColor" />
</template>

<script>
    export default {
        data() {
            return {
                current: 0,
                activeColor:'#0cba43',
                list: [{
                    iconPath: "star",
                    selectedIconPath: "star-fill",
                    text: '收藏',
                }, {
                    iconPath: "edit-pen",
                    selectedIconPath: "edit-pen-fill",
                    text: '笔记',
                }, {
                    iconPath: "grid",
                    selectedIconPath: "grid-fill",
                    text: '题卡',
                }, {
                    iconPath: "man-delete",
                    selectedIconPath: "person-delete-fill",
                    text: '纠错',
                }]
            }
        },
        methods: {
            beforeSwitch(index) {
                this.current = index
                this.$emit('beforeSwitch', index)
            }
        },
    }
</script>

