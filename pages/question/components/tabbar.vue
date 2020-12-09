<template>
    <view>
        <u-popup mode="bottom" v-model="noteAreaShow" :mask-close-able="false" :closeable="true">
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
                    @confirm="abc"
                />

                <u-button type="primary" size="mini" @click="questionNoteSave">保存</u-button>
            </view>
        </u-popup>
        <!-- <u-modal v-model="noteAreaShow"
            width="90%"
            title="笔记"
            :show-cancel-button="true"
            :show-confirm-button="true"
            confirm-text="保存"
            cancel-text="关闭"
        >
            <view class="slot-content">
            </view>
        </u-modal> -->
        <u-tabbar :list="list" :before-switch="beforeSwitch" v-model="tabbarCurrent" :active-color="activeColor" />
    </view>
</template>

<script>
    export default {
        props: {
            note: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                noteAreaShow: false,

                list: [{
                    iconPath: "star",
                    selectedIconPath: "star-fill",
                    text: '收藏',
                }
                , {
                    basePath: "/pages/question/question-note",
                    iconPath: "edit-pen",
                    selectedIconPath: "edit-pen-fill",
                    text: '笔记',
                }
                , {
                    basePath: "/pages/question/answer-sheet",
                    iconPath: "grid",
                    selectedIconPath: "grid-fill",
                    text: '题卡',
                }
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

                const pid = self.$route.query.pid
                const name = self.$route.query.name
                const qid = self.$route.query.qid

                let queryParams = ''

                switch (index) {
                    case 0:
                        break;
                    case 1:
                        if (!qid || qid == 'undefined') {
                            uni.showToast({
                                title: '请选题',
                                icon: 'none'
                            })
                            return false
                        }

                        // if (self.$route.path == 'pages/question/question-detail') {
                            //
                        // }

                        self.noteAreaShow = true
                        return false

                        break;
                    case 2:
                        queryParams = '?pid=' + pid + '&name=' + name

                        // dont keep history
                        uni.redirectTo({
                            url: self.list[index].basePath + queryParams
                        })

                        break;
                    // case 3:
                    //     uni.showToast({
                    //         title: '请选题',
                    //         icon: 'none'
                    //     })
                    //     return false
                    //     break;
                    default:
                        break;
                }

                self.$store.commit('question/setTabbarCurrent', index)
                self.$emit('beforeSwitch', index)
            },

            questionNoteSave () {
                const self = this

                const qid = self.$route.query.qid

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
                        self.noteAreaShow = false
                    } else {
                        uni.showToast({
                            title: '保存失败',
                            icon: 'none'
                        })
                    }
                }).catch((err) => {
                })
            },
            bindTextAreaBlur (e) {
                const self = this
                self.note = e.detail.value
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
