<template>
	<view>
        <uni-list>
            <uni-list-item :showArrow="false" title="" :note="categoryNotice"></uni-list-item>
        </uni-list>

        <uni-list>
            <template v-for="item in chapterList">
                <uni-list-item :key="item.id" :title="item.name" @click="loadChapter(item.id, item.name)"></uni-list-item>
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
            categoryId: '',
            categoryName: '',
            categoryNotice: '',

            chapterList: []
        }
    },
    async onShow () {
        const self = this

        // Init query string, categoryId, categoryName, categoryNotice
        self.categoryId = this.$route.query.cid

        self.categoryName = this.$route.query.name
        uni.setNavigationBarTitle({
            title: self.categoryName
        });

        self.categoryNotice = this.$route.query.notice

        // Then load chapter
        self.loadChapter(0, null)

        // Force update page
        self.$forceUpdate()
    },
    methods: {
        async loadChapter (pid, chapterName) {
            const self = this

            if (self.categoryId == '' || self.categoryId == 'undefined') {
                uni.navigateTo({
                    url: '/pages/index/index'
                })
            }

            const chapterRes = await self.$apiRequest({
                url: self.$apiList.chapterIndex,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    cid: self.categoryId,
                    pid: pid // chapter parent_id
                }
            })

            if (chapterRes.code == 0) {
                if (chapterRes.data.length > 0) {
                    // assign chapter data
                    self.chapterList = chapterRes.data
                } else {
                    // last chapter: pid(parent_id) as chapter_id to query questions
                    const chapterId = pid

                    uni.navigateTo({
                        url: '/pages/question/answer-sheet?cid=' + chapterId + '&name=' + chapterName
                    })
                }
            }

        }
    }
}
</script>

<style>

</style>
