<template>
	<view>
        <uni-list>
            <uni-list-item :showArrow="false" title="" :note="noticeBarText"></uni-list-item>
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
            chapterName: '',
            questionSerialNumber: 0,

            chapterList: []
        }
    },
    async onShow () {
        const self = this

        // get record for notice info
        await self.getPractiseRecord()

        // Then load chapter
        self.loadChapter(0, null)

        // Force update page
        self.$forceUpdate()
    },
    methods: {
        // Same in index.vue
        async getPractiseRecord () {
            const self = this

            const res = await self.$apiRequest({
                url: self.$apiList.practiseRecord,
                method: 'GET',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            })

            if (res.code == 0) {
                if (res.data.length == 0) {
                    // goto chose subject
                    uni.navigateTo({
                        url: './chose-subject'
                    })
                } else {
                    uni.setNavigationBarTitle({
                        title: res.data.categoryName
                    });

                    // For chose-chapter page
                    self.categoryId = res.data.categoryId
                    self.categoryName = res.data.categoryName

                    // For notise bar
                    self.chapterName = res.data.chapterName
                    self.questionSerialNumber = res.data.questionSerialNumber
                }
            }
        },
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
    },
    computed: {
        noticeBarText () {
            return '当前做到《' + this.chapterName + '》第 ' + this.questionSerialNumber + ' 题'
        }
    }
}
</script>

<style>

</style>
