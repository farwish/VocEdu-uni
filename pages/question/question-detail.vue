<template>
	<view>
        <swiper :style="{'height':swiperHeight+'rpx'}" :autoplay="false" :current="swiperCurrent" @change="swiperChange">
            <swiper-item :style="{'min-height':'100%'}" v-for="(item, idx) in questionList" :key="idx">
                <view class="swiper-item">
                    <!-- <text :style="{'margin': '25rpx'}">{{ idx+1 }} / {{ questionList.length }}</text> -->
                    <uni-notice-bar
                        :style="{'margin': '20rpx', 'border-radius': '10rpx'}"
                        single="true"
                        background-color="#FFF"
                        color="#3b4144"
                        :text="'第'+(idx + 1)+'题 / 共'+questionList.length+'题'"
                    ></uni-notice-bar>

                    <uni-list class="listCustom" v-if="questionDetail && (questionDetail.id == item.id)">
                        <uni-list-item :showArrow="false" :title="'[ ' + questionDetail.patternClassifyName + ' ] ' + questionDetail.title"></uni-list-item>

                        <!-- 单选，判断 -->
                        <radio-group v-if="questionDetail.patternClassify == 1 || questionDetail.patternClassify == 4"
                        @change="radioAnswerChange">
                            <label v-for="(item, key) in questionDetail.optionAnswer" :key="key">
                                <view class="radioLabelPd">
                                    <radio :value="key" :checked="myAnswer == key" />{{ key }}、{{ item }}
                                </view>
                            </label>
                        </radio-group>

                        <!-- 多选 -->
                        <checkbox-group v-if="questionDetail.patternClassify == 2" @change="checkboxAnswerChange">
                            <label v-for="(item, key) in questionDetail.optionAnswer" :key="key">
                                <view class="checkboxLabelPd">
                                    <checkbox :value="key" :checked="myAnswer.indexOf(key) != -1" />{{ key }}、{{ item }}
                                </view>
                            </label>
                        </checkbox-group>

                        <!-- 填空 -->
                        <input v-if="questionDetail.patternClassify == 5" @input="inputAnswerChange" :value="myAnswer" class="answerInput" focus placeholder="输入回答" />

                        <!-- 简答(主观题) -->
                        <textarea v-if="questionDetail.patternType == 0" @blur="textareaAnswerChange" :value="myAnswer" focus placeholder="输入回答" />
                    </uni-list>

                    <!-- 答案 -->
                    <uni-list class="listCustom" v-if="questionDetail && (questionDetail.id == item.id)">
                        <uni-list-item :showArrow="false" title="我的答案" :note="myAnswerShown"></uni-list-item>
                        <uni-list-item :showArrow="false" title="正确答案" :note="questionDetail.rightAnswer"></uni-list-item>
                        <uni-list-item :showArrow="false" title="难度" :note="questionDetail.difficulty"></uni-list-item>
                    </uni-list>

                    <!-- 解析 -->
                    <uni-list class="listCustom" v-if="questionDetail && (questionDetail.id == item.id)">
                        <uni-list-item :showArrow="false" title="解析" :note="questionDetail.analysis"></uni-list-item>
                    </uni-list>
                </view>
            </swiper-item>
            <!-- <swiper-item>
                <view class="swiper-item uni-bg-green">BBBBBBBBBBBBBBBBBB</view>
            </swiper-item> -->
        </swiper>

        <tabbar></tabbar>
	</view>
</template>

<script>
import uList from "@/components/uni-list/uni-list.vue"
import uListItem from "@/components/uni-list-item/uni-list-item.vue"
import tabbar from "pages/question/components/tabbar";
export default {
    components:{
        uList, uListItem, tabbar
    },
    data() {
        return {
            questionDetail: [],
            myAnswer: '',

            swiperHeight: 1500,
            swiperCurrent: 0
        }
    },
    async onShow () {
        const self = this

        const qid = uni.getStorageSync('qid')

        // Initial swiper current idx
        self.swiperCurrent = self.questionListIds.indexOf(qid)

        // Question detail async
        self.loadQuestionDetail(qid)

        // Question note async
        self.questionNoteInfo(qid)
    },
    methods: {
        async loadQuestionDetail (qid) {
            const self = this

            const questionDetailRes = await self.$apiRequest({
                url: self.$apiList.questionDetail,
                method: 'GET',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    qid: qid,
                }
            })

            if (questionDetailRes.code == 0 && questionDetailRes.data) {
                self.questionDetail = questionDetailRes.data.questionDetail
                self.myAnswer = questionDetailRes.data.recordReplyAnswer

                uni.setStorageSync('qid', qid)
            }
        },

        async questionNoteInfo (qid) {
            const self = this

            self.$apiRequest({
                url: self.$apiList.questionNote,
                method: 'GET',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    qid: qid
                }
            }).then((res) => {
                if (res.code == 0) {
                    // dynamic share note between `tabbar` component
                    self.$store.commit('question/setCurrentQuestionNote', res.data.note)
                } else {
                    // when failure
                    self.$store.commit('question/setCurrentQuestionNote', '')
                }
            }).catch((err) => {
            })
        },

        // When swiper change, loading new
        async swiperChange (e) {
            const self = this

            let idx = e.detail.current
            let qid = self.questionList[idx].id

            uni.setStorageSync('qid', qid)

            self.loadQuestionDetail(qid)
            self.questionNoteInfo(qid)
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

            const pid = uni.getStorageSync('pid')
            const qid = uni.getStorageSync('qid')

            return await self.$apiRequest({
                url: self.$apiList.practiseRecord,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    pid: pid,
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
        },
        questionList () {
            return JSON.parse(uni.getStorageSync('questionList'))
        },
        questionListIds () {
            const self = this

            let list = self.questionList
            let ids = []
            for (let i = 0; i < list.length; i++) {
                ids.push(list[i].id)
            }

            return ids
        }
    }
}
</script>

<style scoped>
.listCustom {
    border-radius: 10rpx;
    margin: 20rpx 20rpx 20rpx 20rpx;
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
