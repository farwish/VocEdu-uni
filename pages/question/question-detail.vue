<template>
    <view>
        <!--<button size="mini" class="tabBtn" @click="gotoAnswerSheet()">题卡</button>
                            <button size="mini" class="tabBtn" @click="gotoQuestionNote(questionDetail.id)">笔记</button>-->
        <!-- <button size="mini" class="tabBtn">收藏</button> -->
        <movable :list="questionList" :currentIndex="currentIndex" @next="next">
            <template v-slot="{soruce}">
                            <view >
                                <uni-list
                                    class="listCustom"
                                    v-if="soruce"
                                >
                                    <uni-list-item
                                        :showArrow="false"
                                        :title="soruce.title"
                                    ></uni-list-item>
                                    <!-- 单选，判断 -->
                                    <radio-group
                                        v-if="soruce.patternClassify == 1 || soruce.patternClassify == 4"
                                        @change="radioAnswerChange"
                                    >
                                        <label
                                            v-for="(item, key) in soruce.optionAnswer"
                                            :key="key"
                                        >
                                            <view class="radioLabelPd">
                                                <radio
                                                    :value="key"
                                                    :checked="soruce.myAnswer == key"
                                                />{{ key }}、{{ item }}
                                            </view>
                                        </label>
                                    </radio-group>
                                    <!-- 多选 -->
                                    <checkbox-group
                                        v-if="soruce.patternClassify == 2"
                                        @change="checkboxAnswerChange"
                                    >
                                        <label
                                            v-for="(item, key) in soruce.optionAnswer"
                                            :key="key"
                                        >
                                            <view class="checkboxLabelPd">
                                                <checkbox
                                                    :value="key"
                                                    :checked="soruce.myAnswer.indexOf(key) != -1"
                                                />{{ key }}、{{ item }}
                                            </view>
                                        </label>
                                    </checkbox-group>
                                    <!-- 填空 -->
                                    <input
                                        v-if="soruce.patternClassify == 5"
                                        @input="inputAnswerChange"
                                        :value="soruce.myAnswer"
                                        class="answerInput"
                                        focus
                                        placeholder="输入回答"
                                    />
                                    <!-- 简答(主观题) -->
                                    <textarea
                                        v-if="soruce.patternType == 0"
                                        @blur="textareaAnswerChange"
                                        :value="soruce.myAnswer"
                                        focus
                                        placeholder="输入回答"
                                    />
                                    </uni-list>
                    <uni-list class="listCustom" v-if="soruce">
                        <uni-list-item :showArrow="false" title="我的答案" :note="myAnswerShown"></uni-list-item>
                        <uni-list-item :showArrow="false" title="正确答案" :note="soruce.rightAnswer"></uni-list-item>
                        <uni-list-item :showArrow="false" title="难度" :note="soruce.difficulty"></uni-list-item>
                    </uni-list>
                    <uni-list class="listCustom" v-if="soruce">
                        <uni-list-item :showArrow="false" title="解析" :note="soruce.analysis"></uni-list-item>
                    </uni-list>
                            </view>
</template>
        </movable>


        <tabbar />
    </view>
</template>

<script>
    import uList from "@/components/uni-list/uni-list.vue";
    import uListItem from "@/components/uni-list-item/uni-list-item.vue";
    import tabbar from "pages/question/components/tabbar";
    import movable from "pages/question/components/movable.vue";
    let caches = []
    export default {
        components: {
            uList,
            uListItem,
            tabbar,
            movable,
        },
        data() {
            return {
                // myAnswer: '',
                // questionDetail: null,
                height: "100rpx",
                width: "100rpx",
                questionList: [],
                setList: {},
                list: [],
                serial: null,
                currentIndex:0
            };
        },
        async onShow() {
            const self = this;
            const qid = self.$route.query.qid;
            let listStr = uni.getStorageSync('questionList')
            if (listStr) {
                this.list = JSON.parse(listStr)
                caches = this.list.map(i => i.id)
            }
            this.getList(qid)
        },
        methods: {
            // direction = true 下一页，false 上一页
            // nextIndex 翻页的当前页
            // stop 执行后会阻止上下翻页
            // row 触发的数据
            next(direction, nextIndex, stop,row) {
                let cIndex = 0
                this.list.forEach((i,dx)=>{
                    if(this.questionList[nextIndex] && this.questionList[nextIndex].id === i.id){
                       cIndex = dx
                    }
                })
                if (cIndex === 0) {
                    stop()
                }else{
                    // if(direction) ++nextIndex
                    let id = this.questionList[nextIndex].id
                    this.getList(id,nextIndex)
                }
            },
            getList(id,nextIndex) {
                let index = 0
                this.list.forEach((i, _dx) => {
                    if (i.id + '' === id + '') {
                        index = _dx
                        return
                    }
                })
                let ids = []
                if (index === 0) {
                    ids = this.list.slice(0, 2).map(i => i.id)
                } else if (index === this.list.length - 1) {
                    ids = this.list.slice(-2).map(i => i.id)
                } else {
                    ids = this.list.slice(index - 1, index + 2).map(i => i.id)
                }
                this.serial = +id
                this.loadQuestionDetail(ids,nextIndex)
            },
            movableChange(e) {
                console.log(e, 11111);
            },
            async loadQuestionDetail(idx,nextIndex) {
                const self = this;
                const questionDetailRes = await self.$apiRequest({
                    url: self.$apiList.questionDetailList,
                    method: "GET",
                    header: {
                        Authorization: "Bearer " + self.$store.state.member.memberToken,
                    },
                    data: {
                        qids: String(idx),
                    },
                });
                if (questionDetailRes.code == 0 && questionDetailRes.data) {
                    // console.log(questionDetailRes.data)
                    if (Array.isArray(questionDetailRes.data)) {
                        this.questionList.forEach(i=>{
                            self.setList[i.id] = i
                        })
                        questionDetailRes.data.forEach((i,index) => {
                            i.questionDetail.myAnswer = i.recordReplyAnswer
                            self.setList[i.questionDetail.id] = {
                                ...i.questionDetail
                            };
                            // self.setList[index] = i.questionDetail.id
                        })
                    }
                    // // self.questionDetail = questionDetailRes.data.questionDetail
                    // self.setList[qid] = questionDetailRes.data.questionDetail;
                    // let recordReplyAnswer = questionDetailRes.data.recordReplyAnswer;
                    // if (recordReplyAnswer !== "") {
                    // self.setList[qid].myAnswer = recordReplyAnswer || '';

                    if(self.serial===null) self.serial = Number(self.$route.query.qid)

                    let list = caches.map((i,index) => {
                        return self.setList[i]
                        // list.push()
                    }).filter(i => typeof i ==='object')
                    list.forEach((i,index)=>{
                        if(i.id === self.serial){
                            this.currentIndex = index
                        }
                    })
                    console.log(list.map(i=>i.title),'i.title',this.currentIndex)
                    this.questionList = list
                    this.$forceUpdate()
                }
            },
            gotoAnswerSheet() {
                const self = this;
                const pid = self.$route.query.pid;
                const name = self.$route.query.name;
                uni.redirectTo({
                    url: "/pages/question/answer-sheet?pid=" + pid + "&name=" + name,
                });
            },
            gotoQuestionNote(qid) {
                const self = this;
                const pid = self.$route.query.pid;
                const name = self.$route.query.name;
                uni.redirectTo({
                    url: "/pages/question/question-note?qid=" +
                        qid +
                        "&pid=" +
                        pid +
                        "&name=" +
                        name,
                });
            },
            async radioAnswerChange(e) {
                const self = this;
                self.myAnswer = e.detail.value;
                const practiseRecordRes = self.saveRecord(self.myAnswer);
            },
            async checkboxAnswerChange(e) {
                const self = this;
                self.myAnswer = e.detail.value.join("");
                const practiseRecordRes = await self.saveRecord(self.myAnswer);
            },
            async inputAnswerChange(e) {
                const self = this;
                self.myAnswer = e.target.value;
                const practiseRecordRes = await self.saveRecord(self.myAnswer);
            },
            async textareaAnswerChange(e) {
                const self = this;
                self.myAnswer = e.detail.value;
                const practiseRecordRes = await self.saveRecord(self.myAnswer);
            },
            async saveRecord(value) {
                const self = this;
                const pid = self.$route.query.pid;
                const qid = self.$route.query.qid;
                return await self.$apiRequest({
                    url: self.$apiList.practiseRecord,
                    method: "POST",
                    header: {
                        Authorization: "Bearer " + self.$store.state.member.memberToken,
                    },
                    data: {
                        pid: pid,
                        qid: qid,
                        reply_answer: value,
                    },
                });
            },
        },
        computed: {
            myAnswerShown() {
                const self = this;
                return self.myAnswer != "" ? self.myAnswer : "-";
            },
        },
    };
</script>

<style scoped>
    .movable-action {
        width: auto;
        height: initial;
        position: relative;
        overflow: hidden;
    }
    .movable-action-view {
        /* #ifndef APP-NVUE */
        display: flex;
        flex-direction: column;
        /* #endif */
        height: initial;
        position: relative;
        /* 这一句很关键，覆盖默认的绝对定位 */
    }
    .tabBtn {
        margin: 20rpx;
    }
    .listCustom {
        border: 1px solid #dddddd;
        border-radius: 12rpx;
        margin: 0 20rpx 20rpx 20rpx;
    }
    .radioLabelPd,
    .checkboxLabelPd {
        padding: 0 30rpx 30rpx 30rpx;
    }
    .answerInput {
        padding: 0 0 20rpx 32rpx;
    }
    textarea {
        border: 1px solid #dddddd;
        border-radius: 12rpx;
        margin: 0 20rpx 20rpx 20rpx;
        padding: 15rpx;
        height: 300rpx;
    }
</style>
