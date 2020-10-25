<template>
	<view>
        <uni-grid :column="3" @change="gridClicked">
            <uni-grid-item v-for="item in categoryList" :index="item.id">
                <text class="text">{{ item.name }}</text>
            </uni-grid-item>
        </uni-grid>
	</view>
</template>

<script>
import uniGrid from "@/components/uni-grid/uni-grid.vue"
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
export default {
    components: {uniGrid, uniGridItem},
    data() {
        return {
            categoryList: []
        }
    },
    async onShow () {
        const self = this

        await self.loadCategory(0)
    },
    methods: {
        async gridClicked (e) {
            const self = this

            const categoryId = e.detail.index

            await self.loadCategory(categoryId)
        },
        async loadCategory (pid) {
            const self = this

            const res = await self.$apiRequest({
                url: self.$apiList.categoryIndex,
                method: 'POST',
                data: {
                    pid: pid
                },
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            })

            if (res.code == 0) {
                if (res.data.length == 0) {
                    await self.saveChosenCategory(pid)
                } else {
                    self.categoryList = res.data
                }
            }
        },
        async saveChosenCategory (categoryId) {
            const self = this

            const res = await self.$apiRequest({
                url: self.$apiList.practiseRecord,
                method: 'POST',
                data: {
                    cid: categoryId
                },
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            })

            if (res.code == 0) {
                uni.switchTab({
                    url: '/pages/index/index'
                })
            }
        }
    }
}
</script>

<style scoped>
.text {
    text-align: center;
    padding: 30px 0;
}
</style>
