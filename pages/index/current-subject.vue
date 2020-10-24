<template>
	<view>
        <uni-list>
            <!-- <uni-list-item rightText="切换科目" :show-extra-icon="true" :extra-icon="{color: '#4cd964',size: '22',type: 'location'}" :title="currentSubjectInfo.categoryName" @click="gotoChoseSubject()"></uni-list-item> -->
            <uni-list-item rightText="切换科目" :title="currentSubjectInfo.categoryName" @click="gotoChoseSubject()"></uni-list-item>
            <uni-list-item :showArrow="false" title="科目题量" :rightText="currentSubjectInfo.questionsCount" note=""></uni-list-item>
            <uni-list-item :showArrow="false" title="开通状态" :rightText="currentSubjectInfo.openStatus" note=""></uni-list-item>
            <uni-list-item :showArrow="false" title="到期时间" :rightText="currentSubjectInfo.expiredAt" note=""></uni-list-item>
        </uni-list>

		<!-- <button type="primary" @click="gotoChoseSubject()">切换科目</button> -->
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
                url: '/pages/index/chose-subject'
            })
        }
    }
}
</script>

<style>

</style>
