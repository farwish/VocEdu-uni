<template>
	<view class="content">
        <view class="btn-row">
            <button type="primary" class="primary" @tap="mobLogout">退出登录</button>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
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
                                // 到 tabBar 页
                                uni.switchTab({
                                    url: '/pages/index/index'
                                })
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
