<template>
	<view class="container">
        <uni-grid :column="2" :show-border="false"  :highlight="false" class="gridCustom">
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

        <uni-notice-bar :single="true" :showIcon="true" :scrollable="true" :speed=70 :text="noticeBarText"></uni-notice-bar>

        <uni-card
            :is-full="true"
            :is-shadow="true"
            note="海量题库 快速背题"
            @click="choseChapter(categoryId)"
        >
            章节练习
        </uni-card>

	</view>
</template>

<script>
import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'

import uniCard from '@/components/uni-card/uni-card.vue'

import uniGrid from "@/components/uni-grid/uni-grid.vue"
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"

export default {
    components: {
        uniNoticeBar,
        uniCard,
        uniGrid, uniGridItem
    },
    data() {
        return {
            categoryId: '',
            categoryName: '',
            chapterName: '',
            questionSerialNumber: 0,

            wrongsCount: 0,
            collectsCount: 0,
            notesCount: 0
        }
    },
    onLoad() {
    },
    async onShow() {
        const self = this

        // Load data
        await self.getPractiseSummary()
        await self.getPractiseRecord()

        // Force update page
        self.$forceUpdate()
    },
    onNavigationBarButtonTap (e) {
        uni.navigateTo({
            url: '/pages/index/current-subject'
        })
    },
    methods: {
        async getPractiseRecord () {
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
                    uni.setNavigationBarTitle({
                        title: res.data.categoryName
                    });

                    // For chose-chapter page
                    self.categoryId = res.data.categoryId
                    self.categoryName = res.data.categoryName

                    // For notise bar
                    self.chapterName = res.data.chapterName
                    self.questionSerialNumber = res.data.questionSerialNumber
                }
            }
        },
        async getPractiseSummary () {
            const self = this

            const res = await self.$apiRequest({
                url: self.$apiList.practiseSummary,
                method: 'POST',
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
        choseChapter (categoryId) {
            const self = this
            uni.navigateTo({
                url: '/pages/index/chose-chapter?cid=' + self.categoryId + '&name=' + self.categoryName + '&notice=' + self.noticeBarText
            })
        }
    },
    computed: {
        noticeBarText () {
            return '当前做到《' + this.chapterName + '》第 ' + this.questionSerialNumber + ' 题'
        }
    }
}
</script>

<style>
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
