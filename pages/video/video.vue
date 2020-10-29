<template>
	<view>
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
            title: '课程'
        });

        // Force update page
        self.$forceUpdate()
    },
    methods: {

    }
}
</script>

<style>

</style>
