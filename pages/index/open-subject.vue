<template>
    <view>
        <!-- <uni-list class="listCustom">
            <uni-list-item :showArrow="false" title="充值名称" :rightText="categoryName"></uni-list-item>
            <uni-list-item :showArrow="false" title="题库" note="实际使用366天" rightText="￥198"></uni-list-item>
        </uni-list> -->

        <u-card :full="false" margin="20rpx" v-for="(item,index) in list" :key="index" :title="item.name" :head-border-bottom="false">
            <view class="" slot="body">
                <u-row gutter="16" >
                    <u-col span="12">
                        <view class="content">
                            {{item.explain}}
                        </view>
                    </u-col>
                </u-row>

                <u-row gutter="16" >
                    <u-col span="3">服务内容：</u-col>
                    <u-col span="3" v-for="(_item,_index) in item.serviceContent" :key="_index" >
                      <u-tag :text="_item" type="primary" />
                    </u-col>
                </u-row>
            </view>
            <view class="" slot="foot">
                <u-row gutter="16" >
                    <u-col span="3"></u-col>
                    <u-col span="6">
                        <view class="text">
                            原价<text class="deline">￥{{item.price}}</text> <text class="weit">￥{{item.oriPrice}}</text>
                        </view>
                    </u-col>
                    <u-col span="3">
                      <u-button @tap="buy(item.id)" type="success" shape="circle" :custom-style="{height:'50rpx'}">购买</u-button>
                    </u-col>
                </u-row>
            </view>
        </u-card>

    </view>
</template>

<script>
    export default {
        components: {},
        data() {
            return {
                categoryName: '',
                list: [],
            }
        },
        onShow() {
            const self = this
            this.questionPackage()
        },
        methods: {
            async questionPackage() {
                const self = this

                const cid = uni.getStorageSync('cid')

                const res = await self.$apiRequest({
                    url: self.$apiList.getPackage,
                    method: 'GET',
                    header: {
                        Authorization: 'Bearer ' + self.$store.state.member.memberToken
                    },
                    data: {
                        cid: cid,
                    }
                })
                if (res && res.data) {
                  self.list = res.data
                }
            },
            async buy(kid) {
                const self = this

                const cid = uni.getStorageSync('cid')
                const pid = uni.getStorageSync('pid')

                const res = await self.$apiRequest({
                    url: self.$apiList.categoryOpen,
                    method: 'POST',
                    header: {
                        Authorization: 'Bearer ' + self.$store.state.member.memberToken
                    },
                    data: {
                        cid: cid,
                        kid: kid,
                    }
                })

                if (res.code == 0) {
                    uni.showToast({
                        title: '开通成功',
                        icon: 'none'
                    })

                    setTimeout(function() {
                        uni.redirectTo({
                            url: '/pages/question/answer-sheet'
                        })
                    }, 1000)
                }
            }
        }
    }
</script>

<style scoped>
    .content{
       padding-bottom: 16rpx;
    }
    .deline{
        text-decoration: line-through;
    }
    .weit{
        color: #18B566;
        font-size: 34rpx;
    }
    .text{
        text-align: right;
    }
</style>
