<template>
	<view>
        <button size="mini" class="tabBtn" :disabled="true">题卡</button>
        <button v-if="openStatus == 0" size="mini" class="tabBtn" type="primary" @click="categoryOpen()">开通科目</button>

        <uni-grid :column="8" @change="gridClicked" class="gridCustom">
            <uni-grid-item v-for="(item, idx) in questionList" :index="item.id" :class="item.done ? 'questionDone' : ''">
                <text class="text">{{ idx + 1 }}</text>
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
            questionList: null,
            openStatus: 1,
        }
    },
    async onShow () {
        const self = this

        const cid = self.$route.query.cid
        const name = self.$route.query.name

        uni.setNavigationBarTitle({
            title: name
        });

        const questionRes = await self.$apiRequest({
            url: self.$apiList.questionIndex,
            method: 'POST',
            header: {
                Authorization: 'Bearer ' + self.$store.state.member.memberToken
            },
            data: {
                cid: cid,
            }
        })

        if (questionRes.code == 0 && questionRes.data) {
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

            const cid = self.$route.query.cid
            const name = self.$route.query.name

            uni.redirectTo({
                url: '/pages/question/question-detail?qid=' + questionId + '&cid=' + cid + '&name=' + name
            })
        },
        async categoryOpen () {
            const self = this

            const cid = self.$route.query.cid
            const name = self.$route.query.name

            uni.navigateTo({
                url: '/pages/index/open-subject?cid=' + cid + '&name=' + name
            })
        }
    }
}
</script>

<style scoped>
.gridCustom {
    text-align: center;
    line-height: 80rpx;
    margin: 0 20rpx 20rpx 20rpx;
}

.tabBtn {
    margin: 20rpx;
}

.questionDone {
    background-color: #4CD964;
}
</style>
