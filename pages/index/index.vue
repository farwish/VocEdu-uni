<template>
	<view class="container">
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
			const self = this
			self.loadChosenCategory()
		},
		methods: {
			async loadChosenCategory () {
				const self = this
				
				const dropDownChar = ' ▾'
				uni.setNavigationBarTitle({
					title: "执业药师（中药）" + dropDownChar
				});
				
				let res = await self.$apiRequest({
					url: self.$apiList.defaultChosenSubject
				})
				console.log(res)
			}
		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
</style>
