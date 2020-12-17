<template>
    <view>
        <u-cell-group v-if="chapterList" >
            <u-cell-item :label="noticeBarText" :arrow="false"></u-cell-item>
        </u-cell-group>

        <u-cell-group v-if="chapterList" >
            <u-cell-item v-for="item in chapterList"
                :key="item.id" :title="item.name"
                @click="walkChapter(item.id, item.name, item.subLock)"
                :arrow="item.subLock == 0"
            >
                <u-icon v-if="item.subLock != 0" size="35" name="lock-fill"></u-icon>
            </u-cell-item>
        </u-cell-group>

        <u-popup v-model="subLockTipShow" mode="center" border-radius="10" :closeable="true" :mask-close-able="false">
            <view class="subLockContent">
                <u-table border-color="#fff">
                    <u-tr class="subLockTableTr">
                        <u-td>您当前的班次为 <b>试用版</b></u-td>
                    </u-tr>
                    <u-tr class="subLockTableTr">
                        <u-td>该功能需购买任一套餐方可使用</u-td>
                    </u-tr>
                    <u-tr class="subLockTableTr">
                        <u-td>如果您已经购买，请重新登录</u-td>
                    </u-tr>
                </u-table>

                <u-button class="subLockBtn" type="primary" size="medium" shape="circle" @click="subLockConfirm">去购买</u-button>
            </view>
        </u-popup>
  </view>
</template>

<style scoped>
    .subLockContent {
        padding: 50rpx;
        text-align: center;
    }
    .subLockTableTr {
        margin: 30rpx;
    }
    .subLockBtn {
        margin: 30rpx;
    }
</style>

<script>
    export default {
        components: {},
        data() {
            return {
                chapterList: [],
                chapterListForPreCheck: [],
                currentIndex: 0,
                questionSerialNumber: '',

                subLockTipShow: false
            };
        },
        async onLoad(options) {
            const self = this;

            // get record for notice info, then load chapter
            const cid = uni.getStorageSync('cid')
            const name = uni.getStorageSync('categoryName')

            if (cid == '' || cid == undefined || ! name) {
                uni.switchTab({
                    url: '/pages/index/index'
                })
                return
            }

            // set default parent chapter id when not set.
            let pid = (options.pid == '' || options.pid == undefined) ? 0 : options.pid

            await self.loadChapter(pid, name, 0);

            if (self.chapterListForPreCheck.length == 0) {
                uni.navigateTo({
                    url: "/pages/question/answer-sheet"
                });
                return
            } else {
                self.chapterList = self.chapterListForPreCheck
            }

            // Force update page
            self.$forceUpdate()
        },
        async onShow () {
            const self = this
            await self.getPractiseRecord();
        },
        onUnload(options) {
        },
        methods: {
            // Same in index.vue
            async getPractiseRecord() {
                const self = this;
                const res = await self.$apiRequest({
                    url: self.$apiList.practiseRecord,
                    method: "GET",
                    header: {
                        Authorization: "Bearer " + self.$store.state.member.memberToken,
                    },
                });
                if (res.code == 0) {
                    if (res.data.length == 0) {
                        // goto chose subject
                        uni.navigateTo({
                            url: "./chose-subject?index=1",
                        });
                    } else {
                        uni.setNavigationBarTitle({
                            title: res.data.categoryName,
                        });

                        self.questionSerialNumber = res.data.questionSerialNumber
                    }
                }
            },
            async loadChapter(pid, chapterName, subLock) {
                const self = this;

                // subLock check
                if (subLock != 0) {
                    self.subLockTipShow = true
                    return
                }

                let cid = uni.getStorageSync('cid')
                if (cid == '' || cid == 'undefined') {
                    return
                }

                const chapterRes = await self.$apiRequest({
                    url: self.$apiList.chapterIndex,
                    method: "GET",
                    header: {
                        Authorization: "Bearer " + self.$store.state.member.memberToken,
                    },
                    data: {
                        cid: cid,
                        pid: pid, // chapter parent_id
                    },
                });
                if (chapterRes.code == 0) {
                    if (chapterRes.data.length > 0) {
                        // final is self.chapterList
                        self.chapterListForPreCheck = chapterRes.data
                    } else {
                        self.chapterListForPreCheck = []

                        // local store cid + pid + chapterName
                        uni.setStorageSync('cid', cid)
                        uni.setStorageSync('pid', pid)
                        uni.setStorageSync('chapterName', chapterName)
                    }
                }
            },

            async walkChapter (pid, name, subLock) {
                const self = this

                // subLock check
                if (subLock != 0) {
                    self.subLockTipShow = true
                    return
                }

                await self.loadChapter(pid, name, subLock)

                if (self.chapterListForPreCheck.length == 0) {
                    uni.navigateTo({
                        url: "/pages/question/answer-sheet"
                    });
                    return
                } else {
                    uni.navigateTo({
                        url: `/pages/index/chose-chapter?pid=${pid}`
                    })
                }
            },

            subLockConfirm () {
                const self = this

                self.subLockTipShow = false
                uni.navigateTo({
                    url: `/pages/index/open-subject`
                })
            }
        },
        computed: {
            noticeBarText() {
                const self = this
                return "当前做到《" + uni.getStorageSync('categoryName') + "》题目 " + self.questionSerialNumber + ' .';
            },
        },
    };
</script>

<style>

</style>
