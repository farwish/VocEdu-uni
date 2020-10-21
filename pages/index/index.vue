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
    },
    onShow() {
        const self = this

        self.getPractiseRecord()
    },
    onNavigationBarButtonTap (e) {
        const self = this

        // goto current subject
        uni.navigateTo({
            url: '/pages/index/current-subject'
        })
    },
    methods: {
        getPractiseRecord () {
            const self = this

            self.$apiRequest({
                url: self.$apiList.practiseRecord,
                method: 'GET',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            }).then((res) => {
                if (res.code == 0 && res.data.length == 0) {
                    // goto chose subject
                    uni.navigateTo({
                        url: './chose-subject'
                    })
                } else {
                    uni.setNavigationBarTitle({
                        title: res.data.categoryName
                    });
                }
            }).catch((err) => {
                console.log(err)
            })
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
