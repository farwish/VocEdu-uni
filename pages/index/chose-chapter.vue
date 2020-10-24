<template>
	<view>
        <uni-list>
            <uni-list-item :showArrow="true" title="继续上次练习" note="上次做到 xx"></uni-list-item>
        </uni-list>

        <uni-list>
            <template v-for="item in chapterList">
                <uni-list-item :key="item.id" :title="item.name" @click="loadChapter(item.id)"></uni-list-item>
            </template>
        </uni-list>
	</view>
</template>

<script>
import uList from "@/components/uni-list/uni-list.vue"
import uListItem from "@/components/uni-list-item/uni-list-item.vue"
export default {
    components:{
        uList, uListItem
    },
    data() {
        return {
            chapterList: []
        }
    },
    async onShow () {
        const self = this

        self.loadChapter(0)
    },
    methods: {
        async loadChapter (pid) {
            const self = this

            // chapter its categoryName
            const name = this.$route.query.name
            uni.setNavigationBarTitle({
                title: name
            });

            // chapter its categoryId
            const cid = this.$route.query.cid

            if (cid == '' || cid == 'undefined') {
                uni.navigateTo({
                    url: '/pages/index/index'
                })
            }

            const res = await self.$apiRequest({
                url: self.$apiList.chapterIndex,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    cid: cid,
                    pid: pid
                }
            })

            if (res.code == 0) {
                if (res.data.length > 0) {
                    // assign chapter data
                    self.chapterList = res.data
                } else {
                   // last chapter request question list
                   
                }
            }

        }
    }
}
</script>

<style>

</style>
