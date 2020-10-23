<template>
	<view class="container">
        <uni-grid :column="3" :show-border="false"  :highlight="false" class="gridCustom">
            <uni-grid-item>
                <text class="text">{{ wrongs }}</text>
            </uni-grid-item>
            <uni-grid-item>
                <text class="text">{{ collects }}</text>
            </uni-grid-item>
            <uni-grid-item>
                <text class="text">{{ notes }}</text>
            </uni-grid-item>
        </uni-grid>

        <uni-notice-bar :single="true" :showIcon="true" :scrollable="true" :speed=70 :text="noticeBarText"></uni-notice-bar>

        <uni-card
            :is-full="true"
            :is-shadow="true"
            note="海量题库 快速背题"
            @click="choseChapter()"
        >
            章节练习
        </uni-card>

        <uni-card
            :is-full="true"
            :is-shadow="true"
            note="随机组卷 真实模拟"
            @click="simulateExam()"
        >
            模拟考试
        </uni-card>

        <uni-card
            :is-full="true"
            :is-shadow="true"
            note="精华热题 易错试题"
            @click="hotQuestion()"
        >
            精华热题
        </uni-card>

        <uni-card
            :is-full="true"
            :is-shadow="true"
            note="考试大纲 应试技巧"
            @click="examGuide()"
        >
            考试指南
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
        uniNoticeBar, uniCard,
        uniGrid, uniGridItem
    },
    data() {
        return {
            chapterName: '',
            questionSerialNumber: 0,

            wrongsCount: '',
            collectsCount: '',
            notesCount: ''
        }
    },
    onLoad() {
    },
    async onShow() {
        const self = this

        self.getPractiseRecord()
        self.getPractiseSummary()
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
        async getPractiseCollectsCount () {
        },
        async getPractiseNotsCount () {
        },
        choseChapter () {
            uni.showToast({
                title: '章节练习',
                icon: 'none'
            })
        },
        simulateExam () {
            uni.showToast({
                title: '模拟考试',
                icon: 'none'
            })
        },
        hotQuestion () {
            uni.showToast({
                title: '精华热题',
                icon: 'none'
            })
        },
        examGuide () {
            uni.showToast({
                title: '考试指南',
                icon: 'none'
            })
        },
    },
    computed: {
        wrongs () {
            return '错题 ' + this.wrongsCount
        },
        collects () {
            return '收藏 ' + this.collectsCount
        },
        notes () {
            return '笔记 ' + this.notesCount
        },
        noticeBarText () {
            return '上次做到《' + this.chapterName + '》第 ' + this.questionSerialNumber + ' 题。'
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
    background-color: #E8581B;
}
</style>
