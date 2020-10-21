<template>
	<view>

        当前科目信息

		<button type="primary" @click="gotoChoseSubject()">切换科目</button>
		<button type="default" @click="gotoMySubject()">我的题库</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
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
