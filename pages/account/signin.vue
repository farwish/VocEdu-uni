<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row">
                <text class="title">手机号：</text>
                <input class="uni-input" v-model="mobile" />
            </view>
            <view class="input-row">
                <text class="title">密码：</text>
                <input class="uni-input" v-model="password" />
            </view>
        </view>
        <view>
            <button type="primary" class="primary" @tap="mobLogin">登录</button>
        </view>
        <view>
            <navigator url="./signup">注册账号</navigator>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            mobile: '13111111111',
            password: '123456',
        }
    },
    onShow () {
        const self = this

        uni.setNavigationBarTitle({
            title: '用户登录'
        });

        // Force update page
        self.$forceUpdate()
    },
    methods: {
        mobLogin () {
            const self = this
            let mobile = self.mobile
            let password = self.password

            self.$apiRequest({
                url: self.$apiList.accountLogin,
                method: 'POST',
                data: {
                    mobile: mobile,
                    password: password
                }
            }).then((res) => {
                if (res.code === 0) {

                    let memberTokenKey = self.$store.state.setting.member_token_key

                    let memberToken = res.data.access_token

                    uni.setStorage({
                        key: memberTokenKey,
                        data: memberToken,
                        success () {
                            self.$store.commit('member/setHasLogin', true)
                            self.$store.commit('member/setMemberToken', memberToken)
                        },
                        fail () {
                            return uni.showToast({
                                title: '客户端登录失败',
                                icon: 'none'
                            })
                        }
                    })

                    if (self.$store.state.member.hasLogin) {
                        uni.showToast({
                            title: '登录成功',
                            icon: 'none',
                            success () {
                                setTimeout(() => {
                                    // 到 tabBar 页
                                    uni.switchTab({
                                        url: '/pages/index/index'
                                    })
                                }, 1000)
                            }
                        })
                    }
                }
            }).catch((err) => {
                console.log(err)
            })
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
</style>
