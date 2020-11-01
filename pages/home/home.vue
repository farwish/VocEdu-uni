<template>
	<view class="container">
        <uni-list class="listCustom">
            <uni-list-item :showArrow="true" title="我的题库" @click="gotoOpenedSubject()"></uni-list-item>
        </uni-list>
        <uni-list class="listCustom">
            <uni-list-item :showArrow="true" title="切换科目" @click="gotoChoseSubject()"></uni-list-item>
        </uni-list>

        <button type="primary" class="primary customLogoutBtn" @tap="mobLogout">退出登录</button>
	</view>
</template>

<script>
import uList from "@/components/uni-list/uni-list.vue"
import uListItem from "@/components/uni-list-item/uni-list-item.vue"
export default {
    components: {
        uList, uListItem
    },
    data() {
        return {

        }
    },
    onShow() {
        const self = this

        uni.setNavigationBarTitle({
            title: '我的'
        });

        // Force update page
        self.$forceUpdate()
    },
    methods: {
        gotoOpenedSubject () {
            uni.navigateTo({
                url: '/pages/home/opened-subject'
            })
        },
        gotoChoseSubject () {
            uni.navigateTo({
                url: '/pages/index/chose-subject'
            })
        },
        mobLogout () {
            const self = this

            self.$apiRequest({
                url: self.$apiList.accountLogout,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            }).then((res) => {
                uni.showToast({
                    title: '退出成功',
                    icon: 'none',
                    success () {
                        setTimeout(() => {
                            uni.redirectTo({
                                url: '/pages/account/signin'
                            })
                        }, 1500)
                    }
                })
            })
        }
    }
}
</script>

<style scoped>
.customLogoutBtn {
    margin: 25rpx;
}
</style>
