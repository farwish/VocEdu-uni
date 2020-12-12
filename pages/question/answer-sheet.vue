<template>
	<view>
        <button v-if="openStatus == 0" size="mini" class="tabBtn" type="primary" @click="categoryOpen()">开通科目</button>

        <uni-grid :column="8" @change="gridClicked" class="gridCustom">
            <uni-grid-item v-for="(item, idx) in questionList" :index="item.id" :class="item.done ? 'questionDone' : ''">
                <text class="text">{{ idx + 1 }}</text>
            </uni-grid-item>
        </uni-grid>

        <tabbar></tabbar>
	</view>
</template>

<script>
import uniGrid from "@/components/uni-grid/uni-grid.vue"
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
import tabbar from "pages/question/components/tabbar";
export default {
    components: {uniGrid, uniGridItem, tabbar},
    data() {
        return {
            questionList: null,
            openStatus: 1,
        }
    },
    async onShow () {
        const self = this

        const pid = uni.getStorageSync('pid')
        const name = uni.getStorageSync('chapterName')

        uni.setNavigationBarTitle({
            title: name
        })

        const questionRes = await self.$apiRequest({
            url: self.$apiList.questionIndex,
            method: 'GET',
            header: {
                Authorization: 'Bearer ' + self.$store.state.member.memberToken
            },
            data: {
                pid: pid,
            }
        })

        if (questionRes.code == 0 && questionRes.data) {
            uni.setStorageSync('questionList', JSON.stringify(questionRes.data.questionList))

            self.questionList = questionRes.data.questionList
            self.openStatus = questionRes.data.openStatus
        }

        self.$forceUpdate()
    },
    methods: {
        gridClicked (e) {
            const self = this

            const questionId = e.detail.index

            self.gotoQuestionDetail(questionId)
        },
        gotoQuestionDetail (questionId) {
            const self = this

            uni.setStorageSync('qid', questionId)

            uni.navigateTo({
                url: '/pages/question/question-detail'
            })
        },
        async categoryOpen () {
            const self = this

            uni.navigateTo({
                url: '/pages/index/open-subject'
            })
        }
    }
}
</script>

<style scoped>
.gridCustom {
    text-align: center;
    line-height: 80rpx;
    margin: 20rpx;
}

.tabBtn {
    margin: 20rpx 20rpx 0 20rpx;
}

.questionDone {
    background-color: #0cba43;
}
</style>
