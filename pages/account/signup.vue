<template>
		<view class="content">
			<view class="input-group">
				<view class="input-row">
					<text class="title">手机号：</text>
                    <input class="uni-input" v-model="mobile" />
				</view>
                <view class="input-row">
                	<text class="title">密码设置：</text>
                    <input class="uni-input" v-model="password" />
                </view>
                <view class="input-row">
                	<button class="title sendSmsCodeBtn" size="mini" @click="sendSmsCode">发送验证码</button>
                    <input class="uni-input" placeholder="填写收到的验证码" v-model="smsCode" />
                </view>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="mobRegister">注册</button>
			</view>
		</view>
</template>

<script>
export default {
    data() {
        return {
            mobile: '',
            password: '',
            smsCode: ''
        }
    },
    onShow() {
        const self = this

        uni.setNavigationBarTitle({
            title: '用户注册'
        });

        // Force update page
        self.$forceUpdate()
    },
    methods: {
        sendSmsCode () {
            uni.showToast({
                title: '建设中',
                icon: 'none'
            })
        },
        mobRegister () {
            const self = this
            let mobile = self.mobile
            let password = self.password

            uni.showToast({
                title: '建设中',
                icon: 'none'
            })

            // self.$apiRequest({
            //     url: self.$apiList.accountLogin,
            //     method: 'POST',
            //     data: {
            //         mobile: mobile,
            //         password: password
            //     }
            // }).then((res) => {
            //     if (res.code === 0) {

            //         let memberTokenKey = self.$store.state.setting.member_token_key

            //         let memberToken = res.data.access_token

            //         uni.setStorage({
            //             key: memberTokenKey,
            //             data: memberToken,
            //             success () {
            //                 self.$store.commit('member/setHasLogin', true)
            //                 self.$store.commit('member/setMemberToken', memberToken)
            //             },
            //             fail () {
            //                 return uni.showToast({
            //                     title: '客户端登录失败',
            //                     icon: 'none'
            //                 })
            //             }
            //         })

            //         if (self.$store.state.member.hasLogin) {
            //             uni.showToast({
            //                 title: '登录成功',
            //                 icon: 'none',
            //                 success () {
            //                     setTimeout(() => {
            //                         // 到 tabBar 页
            //                         uni.switchTab({
            //                             url: '/pages/index/index'
            //                         })
            //                     }, 1000)
            //                 }
            //             })
            //         }
            //     }
            // }).catch((err) => {
            // })
        }
    }
}
</script>

<style>
  .content {
    padding: 0px 20px;
  }
  .input-group {
    padding: 20px 0px;
  }
  .input-row {
    padding: 5px 0px;
  }
  .uni-input {
    border-bottom: 1rpx solid #007AFF;
  }
  .action-row {
    padding: 10px 0px;
  }

  .sendSmsCodeBtn {
      margin-top: 5rpx;
      margin-bottom: 15rpx;
  }
</style>
