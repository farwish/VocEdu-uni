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
            @click="choseChapter(categoryId)"
        >
            章节练习
        </uni-card>-->
        <u-row gutter="16">
            <u-col span="6" v-for="(item,index) in cardList" :key="index">
                <card @click="choseChapter(item.id)" :index="index" :title="item.title" :subTitle="item.subTitle" :icon-name="item.icon" ></card>
            </u-col>
        </u-row>

    </view>
</template>

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
                cardList:[]
            }
        },
        onLoad() {
            this.getMenu()
        },
        async onShow() {
            const self = this

            // Load data
            await self.getPractiseRecord()
            await self.getPractiseSummary()

            // Force update page
            self.$forceUpdate()
        },

        // Uni only, sometimes not infect
        // onNavigationBarButtonTap(e) {
        //     uni.navigateTo({
        //         url: '/pages/index/current-subject'
        //     })
        // },
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
            async getMenu(){
                const self = this
                const res = await self.$apiRequest({
                    url: self.$apiList.getMenu,
                    method: 'GET',
                    header: {
                        Authorization: 'Bearer ' + self.$store.state.member.memberToken
                    }
                })

                if (res && res.data) {
                    this.cardList = res.data
                }
            },
            choseChapter(categoryId) {
                const self = this

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
