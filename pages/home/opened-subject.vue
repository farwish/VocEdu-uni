<template>
	<view>
        <uni-list class="listCustom" v-for="item in categories">
            <uni-list-item :showArrow="false" :title="item.name" :rightText="item.pivot.expired_at" @click="saveChosenCategory(item.category_id)"></uni-list-item>
        </uni-list>
	</view>
</template>

<script>
import uList from "@/components/uni-list/uni-list.vue"
import uListItem from "@/components/uni-list-item/uni-list-item.vue"
export default {
    components: {
        uList, uListItem
    },
    data() {
        return {
            categories: []
        }
    },
    async onShow () {
        const self = this

        self.openedCategories()
    },
    methods: {
        async openedCategories () {
            const self = this

            const openedCategoryRes = await self.$apiRequest({
                url: self.$apiList.categoryOpened,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            })

            if (openedCategoryRes.code == 0) {
                self.categories = openedCategoryRes.data
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
    },
    computed: {
    }
}
</script>

<style>

</style>
