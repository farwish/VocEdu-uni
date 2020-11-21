<template>
	<view class="container">
        <button size="mini" class="tabBtn" @click="gotoAnswerSheet()">题卡</button>
        <button size="mini" class="tabBtn" :disabled="true">笔记</button>

        <textarea @blur="bindTextAreaBlur" :value="note" />

        <button type="primary" size="mini" class="saveBtn" @click="questionNoteSave()">保存</button>
	</view>
</template>

<script>
export default {
    data() {
        return {
            note: ''
        }
    },
    onShow () {
        const self = this

        const qid = self.$route.query.qid

        self.questionNoteInfo(qid)

        self.$forceUpdate()
    },
    methods: {
        questionNoteInfo (qid) {
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
                    self.note = res.data.note
                }
            }).catch((err) => {

            })
        },
        gotoAnswerSheet () {
            const self = this

            const pid = self.$route.query.pid
            const name = self.$route.query.name

            uni.redirectTo({
                url: '/pages/question/answer-sheet?pid=' + pid + '&name=' + name
            })
        },
        questionNoteSave () {
            const self = this

            const qid = self.$route.query.qid

            setTimeout(function() {
                self.$apiRequest({
                    url: self.$apiList.questionNote,
                    method: 'POST',
                    header: {
                        Authorization: 'Bearer ' + self.$store.state.member.memberToken
                    },
                    data: {
                        qid: qid,
                        note: self.note
                    }
                }).then((res) => {
                    if (res.code == 0) {
                        uni.showToast({
                            title: '保存成功',
                            icon: 'none'
                        })
                    } else {
                        uni.showToast({
                            title: '保存失败',
                            icon: 'none'
                        })
                    }
                }).catch((err) => {
                })
            }, 500)
        },
        bindTextAreaBlur (e) {
            const self = this
            self.note = e.detail.value
        }
    }
}
</script>

<style scoped>

.tabBtn {
    margin: 20rpx;
}

textarea {
    border: 1px solid #DDDDDD;
    border-radius: 12rpx;
    margin: 0 20rpx 20rpx 20rpx;
    padding: 15rpx;
    height: 300rpx;
    background-color: #FFFFFF;
}

.saveBtn {
    margin: 0 20rpx 20rpx 20rpx;
}

</style>
