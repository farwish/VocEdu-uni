<template>
	<view>
        <uni-list v-if="currentSubjectInfo.categoryName">
            <!-- <uni-list-item rightText="切换科目" :show-extra-icon="true" :extra-icon="{color: '#4cd964',size: '22',type: 'location'}" :title="currentSubjectInfo.categoryName" @click="gotoChoseSubject()"></uni-list-item> -->
            <uni-list-item :showArrow="false" :title="currentSubjectInfo.categoryName"></uni-list-item>
            <uni-list-item :showArrow="false" title="科目题量" :rightText="currentSubjectInfo.questionsCount" note=""></uni-list-item>
            <uni-list-item :showArrow="false" title="开通状态" :rightText="currentSubjectInfo.openStatus" note=""></uni-list-item>
            <uni-list-item :showArrow="false" title="到期时间" :rightText="currentSubjectInfo.expiredAt" note=""></uni-list-item>
        </uni-list>

        <template v-if="currentSubjectInfo.categoryName">
            <button type="primary" class="primary" size="mini" @click="gotoChoseSubject()">切换科目</button>
            <button type="warn" class="warn myOpenedSubjectBtn" size="mini" @click="gotoOpenedSubject()">我的题库</button>
        </template>
	</view>
</template>

<script>
import uList from "@/components/uni-list/uni-list.vue"
import uListItem from "@/components/uni-list-item/uni-list-item.vue"
export default {
    components:{
        uList, uListItem
    },
    data() {
        return {
            currentSubjectInfo: {}
        }
    },
    async onShow () {
        const self = this

        const res = await self.$apiRequest({
            url: self.$apiList.practiseCurrentSubject,
            header: {
                Authorization: 'Bearer ' + self.$store.state.member.memberToken
            }
        })

        self.currentSubjectInfo = res.data
    },
    methods: {
        gotoChoseSubject () {
            uni.navigateTo({
                url: '/pages/index/chose-subject?index=1'
            })
        },
        gotoOpenedSubject () {
            uni.navigateTo({
                url: '/pages/home/opened-subject'
            })
        },
    }
}
</script>

<style scoped>
button {
    margin: 30rpx;
}

.myOpenedSubjectBtn {
    float: right;
}
</style>
