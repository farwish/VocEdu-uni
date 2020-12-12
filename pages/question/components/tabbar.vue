<template>
    <view>
        <u-popup mode="bottom" @open="noteAreaOpen" v-model="noteAreaShow" :mask-close-able="false" :closeable="true">
            <view class="content">
                笔记
                <u-input
                    v-model="note"
                    :clearable="false"
                    :border="true"
                    :auto-height="true"
                    :border-radius="0"
                    :async-close="true"
                    maxlength="300"
                    type="textarea"
                    height="350"
                    negative-top="200rpx"
                />

                <u-button type="primary" size="mini" @click="questionNoteSave">保存</u-button>
            </view>
        </u-popup>

        <u-tabbar :list="list" :before-switch="beforeSwitch" v-model="tabbarCurrent" :active-color="activeColor" />
    </view>
</template>

<script>
    export default {
        data() {
            return {
                note: '',

                noteAreaShow: false,

                list: [
                    {
                        basePath: "/pages/question/answer-sheet",
                        iconPath: "grid",
                        selectedIconPath: "grid-fill",
                        text: '题卡',
                    },
                    {
                        basePath: "/pages/question/question-note",
                        iconPath: "edit-pen",
                        selectedIconPath: "edit-pen-fill",
                        text: '笔记',
                    }
                    // ,{
                    //     iconPath: "star",
                    //     selectedIconPath: "star-fill",
                    //     text: '收藏',
                    // }
                // ,{
                //     iconPath: "man-delete",
                //     selectedIconPath: "person-delete-fill",
                //     text: '纠错',
                // },
                ],
                activeColor:'#0cba43'
            }
        },
        methods: {
            beforeSwitch(index) {
                const self = this

                const pid = uni.getStorageSync('pid')
                const name = uni.getStorageSync('chapterName')
                const qid = uni.getStorageSync('qid')

                let queryParams = ''

                switch (index) {
                    case 2:
                        uni.showToast({
                            title: '建设中',
                            icon: 'none'
                        })
                        return false

                        break;
                    case 1:
                        if (self.$route.path != '/pages/question/question-detail') {
                            uni.showToast({
                                title: '请选题',
                                icon: 'none'
                            })
                            return false
                        }

                        self.noteAreaShow = true
                        return false

                        break;
                    case 0:
                        // only click once
                        if (self.$route.path == '/pages/question/answer-sheet') {
                            return false
                        }

                        // dont keep history
                        uni.redirectTo({
                            url: self.list[index].basePath
                        })

                        break;
                    default:
                        break;
                }

                self.$store.commit('question/setTabbarCurrent', index)
                self.$emit('beforeSwitch', index)
            },

            questionNoteSave () {
                const self = this

                const qid = uni.getStorageSync('qid')

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
                            title: '已保存笔记',
                            icon: 'none'
                        })

                        // close popup
                        self.noteAreaShow = false

                        // dynamic between component
                        self.$store.commit('question/setCurrentQuestionNote', self.note)
                    } else {
                        uni.showToast({
                            title: '保存失败',
                            icon: 'none'
                        })
                    }
                }).catch((err) => {
                })
            },
            noteAreaOpen () {
                // Popup open, dynamic assign input value for showing
                const self = this
                self.note = self.$store.state.question.currentQuestionNote
            }
        },
        computed: {
            tabbarCurrent () {
                const self = this
                return self.$store.state.question.tabbarCurrent
            }
        },
    }
</script>

<style lang="scss" scoped>
	.content {
		padding: 24rpx;
		text-align: center;
	}
</style>
