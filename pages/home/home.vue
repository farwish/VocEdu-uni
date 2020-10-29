<template>
	<view class="container">
        <view @click="mobLogout">
            [退出登录]
        </view>
	</view>
</template>

<script>
export default {
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
                            // uni.switchTab({
                            //     url: '/pages/index/index'
                            // })
                        }, 1500)
                    }
                })
            })
        }
    }
}
</script>

<style>
</style>
