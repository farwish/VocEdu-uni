<template>
    <view class="container">
        <view @click='navbarTap'>
        <u-navbar
            :is-back="false"
            :border-bottom="false"
            :background="backgroundColor"
            :title="navbarTitle"
            title-width="320rpx"
            title-color="white"
        >
        </u-navbar>
        </view>

        <uni-grid :column="2" :show-border="false" :highlight="false" class="gridCustom">
            <uni-grid-item>
                <text class="text">错题 {{ wrongsCount }}</text>
            </uni-grid-item>
            <uni-grid-item>
                <text class="text">笔记 {{ notesCount }}</text>
            </uni-grid-item>
            <!-- <uni-grid-item>
                <text class="text">{{ collects }}</text>
            </uni-grid-item> -->
        </uni-grid>

        <uni-notice-bar :single="true" :showIcon="true" :scrollable="true" :speed=60 :text="noticeBarText"></uni-notice-bar>

        <!-- <uni-card
            :is-full="true"
            :is-shadow="true"
            note="海量题库 快速背题"
            @click="choseChapter(categoryId, 0)"
        >
            章节练习
        </uni-card>-->
        <u-row gutter="16">
            <u-col span="6" v-for="(item,index) in cardList" :key="index">
                <card @click="choseChapter(item.id, item.subLock)" :index="index" :title="item.title" :subTitle="item.subTitle" :icon-name="item.icon" ></card>
            </u-col>
        </u-row>

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
    import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'

    import uniCard from '@/components/uni-card/uni-card.vue'

    import uniGrid from "@/components/uni-grid/uni-grid.vue"
    import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
    import card from './components/card/card.vue'
    export default {
        components: {
            uniNoticeBar,
            uniCard,
            uniGrid,
            uniGridItem,
            card
        },
        data() {
            return {
                backgroundColor: {
                    background: 'rgb(0, 122, 255)'
                },
                navbarTitle: '',

                categoryId: '',
                categoryName: '',
                chapterName: '',
                questionSerialNumber: 0,

                wrongsCount: 0,
                collectsCount: 0,
                notesCount: 0,
                cardList:[],

                subLockTipShow: false,
            }
        },
        onLoad() {
        },
        async onShow() {
            const self = this

            // Load data
            await self.getPractiseRecord()
            await self.getPractiseSummary()

            // Load menu
            self.getMenu(self.categoryId)

            // Force update page
            self.$forceUpdate()
        },

        methods: {
            // Same in chose-chapter.vue
            async getPractiseRecord() {
                const self = this

                const res = await self.$apiRequest({
                    url: self.$apiList.practiseRecord,
                    method: 'GET',
                    header: {
                        Authorization: 'Bearer ' + self.$store.state.member.memberToken
                    }
                })

                if (res.code == 0) {
                    if (res.data.length == 0) {
                        // goto chose subject
                        uni.navigateTo({
                            url: './chose-subject'
                        })
                    } else {
                        self.navbarTitle = res.data.categoryName + ' ▾'
                        // uni.setNavigationBarTitle({
                        //     title: res.data.categoryName
                        // });

                        // For chose-chapter page
                        self.categoryId = res.data.categoryId
                        self.categoryName = res.data.categoryName

                        // For notise bar
                        self.chapterName = res.data.chapterName
                        self.questionSerialNumber = res.data.questionSerialNumber
                    }
                }
            },
            async getPractiseSummary() {
                const self = this

                const res = await self.$apiRequest({
                    url: self.$apiList.practiseSummary,
                    method: 'GET',
                    header: {
                        Authorization: 'Bearer ' + self.$store.state.member.memberToken
                    }
                })

                if (res.code == 0) {
                    self.wrongsCount = res.data.wrongsCount
                    self.collectsCount = res.data.collectsCount
                    self.notesCount = res.data.notesCount
                }
            },
            async getMenu(cid){
                const self = this
                const res = await self.$apiRequest({
                    url: self.$apiList.getMenu,
                    method: 'GET',
                    header: {
                        Authorization: 'Bearer ' + self.$store.state.member.memberToken
                    },
                    data: {
                        cid: cid
                    }
                })

                if (res && res.data) {
                    this.cardList = res.data
                }
            },
            choseChapter(categoryId, subLock) {
                const self = this

                // subLock check
                if (subLock != 0) {
                    self.subLockTipShow = true
                    return
                }

                uni.setStorageSync('cid', self.categoryId)
                uni.setStorageSync('categoryName', self.categoryName)
                uni.navigateTo({
                    url: '/pages/index/chose-chapter'
                })
            },

            navbarTap () {
                uni.navigateTo({
                    url: '/pages/index/current-subject'
                })
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
                return '当前做到《' + this.chapterName + '》第 ' + this.questionSerialNumber + ' 题'
            }
        }
    }
</script>

<style lang="scss">
    .container {
        /* padding: 20px; */
        font-size: 14px;
        line-height: 24px;
    }

    .text {
        text-align: center;
        color: #FFFFFF;
        padding: 100rpx 0;
    }

    .gridCustom {
        height: 250rpx;
        background-color: #E8581B;
    }

</style>
