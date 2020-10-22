<template>
	<view>
        <uni-list>
            <uni-list-item :show-extra-icon="true" :extra-icon="{color: '#4cd964',size: '22',type: 'location'}" :title="currentSubjectInfo.categoryName" ></uni-list-item>
            <uni-list-item title="科目题量" :rightText="currentSubjectInfo.questionsCount" note=""></uni-list-item>
            <uni-list-item title="开通状态" :rightText="currentSubjectInfo.openStatus" note=""></uni-list-item>
            <uni-list-item title="到期时间" :rightText="currentSubjectInfo.expiredAt" note=""></uni-list-item>
        </uni-list>

		<button type="primary" @click="gotoChoseSubject()">切换科目</button>
		<button type="default" @click="gotoMySubject()">我的题库</button>
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
            url: self.$apiList.practiseCurrentSubjectInfo,
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
        },
        gotoMySubject () {
            uni.showToast({
                title: '建设中',
                icon: 'none'
            })
        }
    }
}
</script>

<style>

</style>
