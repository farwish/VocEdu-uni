<template>
	<view>
        <uni-list class="listCustom">
            <uni-list-item :showArrow="false" title="充值名称" :rightText="categoryName"></uni-list-item>
            <uni-list-item :showArrow="false" title="题库" note="实际使用366天" rightText="￥198"></uni-list-item>
        </uni-list>

        <button type="primary" class="primary customBuyBtn" @tap="buy">购买</button>
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
            categoryName: 'xxxxx'
        }
    },
    onShow () {
        const self = this
    },
    methods: {
        async buy () {
            const self = this
            const cid = self.$route.query.cid

            const res = await self.$apiRequest({
                url: self.$apiList.categoryOpen,
                method: 'POST',
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                },
                data: {
                    cid: cid,
                }
            })

            if (res.code == 0) {
                uni.showToast({
                    title: '开通成功',
                    icon: 'none'
                })
                setTimeout(function () {
                    uni.redirectTo({
                        url: '/pages/question/answer-sheet?cid=' + cid + '&name=' + self.$route.query.name
                    })
                }, 1000)
            }
        }
    }
}
</script>

<style scoped>
.tabBtn {
    margin: 25rpx;
}
.customBuyBtn {
    margin: 25rpx;
}
</style>
