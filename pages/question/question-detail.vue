<template>
	<view>
        <button size="mini" class="tabBtn" @click="gotoAnswerSheet()">题卡</button>
        <button size="mini" class="tabBtn" @click="gotoQuestionNote(questionDetail.id)">笔记</button>
        <!-- <button size="mini" class="tabBtn">收藏</button> -->

        <uni-list class="listCustom" v-if="questionDetail">
            <uni-list-item :showArrow="false" :title="questionDetail.title"></uni-list-item>

            <!-- 单选，判断 -->
            <radio-group v-if="questionDetail.pattern_classify == 1 || questionDetail.pattern_classify == 4" @change="radioAnswerChange">
                <label v-for="(item, key) in questionDetail.option_answer" :key="key">
                    <view class="radioLabelPd">
                        <radio :value="key" :checked="myAnswer == key" />{{ key }}、{{ item }}
                    </view>
                </label>
            </radio-group>

            <!-- 多选 -->
            <checkbox-group v-if="questionDetail.pattern_classify == 2" @change="checkboxAnswerChange">
                <label v-for="(item, key) in questionDetail.option_answer" :key="key">
                    <view class="checkboxLabelPd">
                        <checkbox :value="key" :checked="myAnswer.indexOf(key) != -1" />{{ key }}、{{ item }}
                    </view>
                </label>
            </checkbox-group>

            <!-- 填空 -->
            <input v-if="questionDetail.pattern_classify == 5" @input="inputAnswerChange" :value="myAnswer" class="answerInput" focus placeholder="输入回答" />

            <!-- 简答(主观题) -->
            <textarea v-if="questionDetail.pattern_type == 0" @blur="textareaAnswerChange" :value="myAnswer" focus placeholder="输入回答" />
        </uni-list>

        <uni-list class="listCustom" v-if="questionDetail">
            <uni-list-item :showArrow="false" title="我的答案" :note="myAnswerShown"></uni-list-item>
            <uni-list-item :showArrow="false" title="正确答案" :note="questionDetail.right_answer"></uni-list-item>
            <uni-list-item :showArrow="false" title="难度" :note="questionDetail.difficulty"></uni-list-item>
        </uni-list>

        <uni-list class="listCustom" v-if="questionDetail">
            <uni-list-item :showArrow="false" title="解析" :note="questionDetail.analysis"></uni-list-item>
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
            myAnswer: '',
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

            const questionDetailRes = await self.$apiRequest({
                url: self.$apiList.questionDetail,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    qid: qid,
                }
            })

            if (questionDetailRes.code == 0 && questionDetailRes.data) {
                self.questionDetail = questionDetailRes.data.questionDetail
                let recordReplyAnswer = questionDetailRes.data.recordReplyAnswer
                if (recordReplyAnswer != '') {
                    self.myAnswer = questionDetailRes.data.recordReplyAnswer
                }
            }
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
        },
        async radioAnswerChange (e) {
            const self = this

            self.myAnswer = e.detail.value

            const practiseRecordRes = self.saveRecord(self.myAnswer)
        },
        async checkboxAnswerChange (e) {
            const self = this

            self.myAnswer = e.detail.value.join('')

            const practiseRecordRes = await self.saveRecord(self.myAnswer)
        },
        async inputAnswerChange (e) {
            const self = this

            self.myAnswer = e.target.value

            const practiseRecordRes = await self.saveRecord(self.myAnswer)
        },
        async textareaAnswerChange (e) {
            const self = this

            self.myAnswer = e.detail.value

            const practiseRecordRes = await self.saveRecord(self.myAnswer)
        },
        async saveRecord (value) {
            const self = this

            const cid = self.$route.query.cid
            const qid = self.$route.query.qid

            return await self.$apiRequest({
                url: self.$apiList.practiseRecord,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    cid: cid,
                    qid: qid,
                    reply_answer: value
                }
            })
        }
    },
    computed: {
        myAnswerShown () {
            const self = this

            return self.myAnswer != '' ? self.myAnswer : '-'
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

.radioLabelPd, .checkboxLabelPd {
    padding: 0 30rpx 30rpx 30rpx;
}

.answerInput {
    padding: 0 0 20rpx 32rpx;
}

textarea {
    border: 1px solid #DDDDDD;
    border-radius: 12rpx;
    margin: 0 20rpx 20rpx 20rpx;
    padding: 15rpx;
    height: 300rpx;
}
</style>
