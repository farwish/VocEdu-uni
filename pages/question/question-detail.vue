<template>
	<view>
        <button size="mini" class="tabBtn" @click="gotoAnswerSheet()">题卡</button>
        <button size="mini" class="tabBtn" @click="gotoQuestionNote(questionDetail.id)">笔记</button>
        <!-- <button size="mini" class="tabBtn">收藏</button> -->

        <uni-list class="listCustom" v-if="questionDetail">
            <uni-list-item :showArrow="false" :title="questionDetail.title"></uni-list-item>
            <!-- <template v-for="(item, key) in questionDetail.option_answer">
                <uni-list-item :showArrow="false" :title="item" note=""></uni-list-item>
            </template> -->
            <radio-group @change="answerChange">
                <label v-for="(item, key) in questionDetail.option_answer" :key="key">
                    <view class="radioLabelPd">
                        <radio :value="key" />{{ key }}. {{ item }}
                    </view>
                </label>
            </radio-group>
        </uni-list>

        <uni-list class="listCustom" v-if="questionDetail">
            <uni-list-item :showArrow="false" title="我的答案" :note="myAnswer"></uni-list-item>
            <uni-list-item :showArrow="false" title="正确答案" :note="questionDetail.right_answer"></uni-list-item>
            <uni-list-item :showArrow="false" title="难度" :note="questionDetail.difficulty"></uni-list-item>
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
            myAnswer: ' - ',
            questionDetail: null
        }
    },
    async onShow () {
        const self = this

        const qid = self.$route.query.qid

        self.loadQuestionDetail(qid)
    },
    methods: {
        async loadQuestionDetail (qid) {
            const self = this

            const questionDetail = await self.$apiRequest({
                url: self.$apiList.questionDetail,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    qid: qid,
                }
            })

            console.log(questionDetail)

            if (questionDetail.code == 0 && questionDetail.data) {
                self.questionDetail = questionDetail.data
            }
        },
        answerChange (e) {
            const value = e.detail

        },
        gotoAnswerSheet () {
            const self = this

            const cid = self.$route.query.cid
            const name = self.$route.query.name

            uni.redirectTo({
                url: '/pages/question/answer-sheet?cid=' + cid + '&name=' + name
            })
        },
        gotoQuestionNote (qid) {
            const self = this

            const cid = self.$route.query.cid
            const name = self.$route.query.name

            uni.redirectTo({
                url: '/pages/question/question-note?qid=' + qid + '&cid=' + cid + '&name=' + name
            })
        }
    }
}
</script>

<style scoped>
.tabBtn {
    margin: 20rpx;
}

.listCustom {
    border: 1px solid #DDDDDD;
    border-radius: 12rpx;
    margin: 0 20rpx 20rpx 20rpx;
}

.radioLabelPd {
    padding: 15rpx 30rpx;
}
</style>
