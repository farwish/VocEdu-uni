<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
        const self = this

        const memberToken = uni.getStorageSync(self.$store.state.setting.member_token_key)

        if (memberToken == '') {
            // Close other pages and redirect
            uni.redirectTo({
                url: './pages/account/signin'
            })
        } else {
            // Request to check
            self.$apiRequest({
                url: self.$apiList.accountInfo,
                method: 'post',
                header: {
                    Authorization: `Bearer ${memberToken}`
                }
            }).then((res) => {
                // No login
                if (res.code != 0 || res.data.length == 0) {
                    // clear invalid token
                    uni.removeStorageSync(self.$store.state.setting.member_token_key)

                    // redirect
                    uni.redirectTo({
                        url: './pages/account/signin'
                    })
                } else {
                    // Recover store info
                    self.$store.commit('member/setHasLogin', true)
                    self.$store.commit('member/setMemberToken', memberToken)
                }
            }).catch((err) => {
                uni.redirectTo({
                    url: './pages/account/signin'
                })
            })
        }
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import url("./uni.scss");

/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */


button.primary {
    background-color: #0faeff;
}
</style>
