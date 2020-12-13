<template>
    <view>
        <u-cell-group v-if="category.chapterName" >
            <u-cell-item :label="noticeBarText" :arrow="false"></u-cell-item>
        </u-cell-group>

        <u-cell-group v-if="category.chapterName" >
            <u-cell-item v-for="item in chapterList"
                :key="item.id" :title="item.name"
                @click="loadChapter(item.id, item.name, item.subLock)"
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
    let cache = []
    let category = null
    let questionSerialNumber = 0 // set global for practise record only request once
    export default {
        components: {},
        data() {
            return {
                category:{
                    categoryId: "",
                    categoryName: "",
                    chapterName: "",
                },
                chapterList: [],
                currentIndex: 0,

                subLockTipShow: false
            };
        },
        async onShow() {
            const self = this;

            // get record for notice info, then load chapter
            const index = self.options.index
            const cid = uni.getStorageSync('cid')
            const name = uni.getStorageSync('categoryName')

            if (cid == '' || cid == undefined || ! name) {
                uni.switchTab({
                    url: '/pages/index/index'
                })
                return
            }

            if (index) {
                this.currentIndex = index - 1
                if (cache[this.currentIndex]) {
                    self.chapterList = cache[this.currentIndex]
                    self.category = category
                    uni.setNavigationBarTitle({
                        title: category.categoryName,
                    });
                } else {
                    await self.loadChapter(0, null, 0);
                }
                await self.getPractiseRecord();
            } else  {
                uni.redirectTo({
                    url: `/pages/index/chose-chapter?index=1`
                })
            }

            // Force update page
            self.$forceUpdate()
        },
        onUnload() {
            const self = this
            const {
                index
            } = self.options
            if (index === '1') {
                cache = []
                category = null
            }
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
                            url: "./chose-subject",
                        });
                    } else {
                        uni.setNavigationBarTitle({
                            title: res.data.categoryName,
                        });
                        // For chose-chapter page
                        // const {categoryId,categoryName,chapterName,questionSerialNumber} = res.data
                        self.category = res.data
                        category = res.data

                        questionSerialNumber = res.data.questionSerialNumber
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

                let cid = self.category.categoryId || uni.getStorageSync('cid')
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
                        // assign chapter data
                        let index = cache.length
                        cache[index] = chapterRes.data;
                        index = cache.length
                        if (index > 1) {
                            uni.navigateTo({
                                 url: `/pages/index/chose-chapter?index=${index}`
                            })
                        }
                        self.chapterList = chapterRes.data;
                    } else {
                        // last chapter: pid(parent_id) as chapter_id to query questions
                        const chapterId = pid;

                        // local store cid + pid + chapterName
                        uni.setStorageSync('cid', cid)
                        uni.setStorageSync('pid', chapterId)
                        uni.setStorageSync('chapterName', chapterName)
                        uni.navigateTo({
                            url: "/pages/question/answer-sheet"
                        });
                    }
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
                return "当前做到《" + this.category.chapterName + "》第 " + questionSerialNumber + " 题";
            },
        },
    };
</script>

<style>

</style>
