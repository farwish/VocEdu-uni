<template>
	<view class="_u-card" @click="click">
	    <view class="_u-card-left">
            <u-icon :name='iconName' size="40" top='32'></u-icon>
        </view>
	    <view class="_u-card-right">
	        <view class="_u-card-right-title">{{title}}</view>
	        <view class="_u-card-right-sub-title">{{subTitle}}</view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
        props:{
            iconName:String,
            title:String,
            subTitle:String,
        },
		methods: {
            click(e){
                this.$emit('click',e)
            }
		}
	}
</script>

<style lang="scss">
._u-card{
        position: relative;
        flex: 1;
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        background-color: #fff;
        padding: 16rpx;
        border-radius: 10rpx;
        margin:0 10rpx 20rpx 10rpx;

        &-left{
            flex: 1;
            max-width: 60rpx;
        }
        &-right{
            &-title{
                font-size: 28rpx;
                color: #555;
            }
            &-sub-title{
               font-size: 22rpx;
               color: #777;
            }

        }
    }
</style>
