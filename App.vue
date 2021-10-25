<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
        const self = this

        // Deal with page loaded at first time.
        // Check login!

        let memberToken = uni.getStorageSync(self.$store.state.setting.member_token_key)
        if (! memberToken) {
            // Close other pages and redirect
            uni.redirectTo({
                url: '/pages/account/signin'
            })
        } else {
            // Request to check
            self.$apiRequest({
                url: self.$apiList.accountInfo,
                method: 'GET',
                header: {
                    Authorization: `Bearer ${memberToken}`
                }
            }).then((res) => {
                // console.log(res.data);
                if (res.code == 0 && res.data) {
                    // res.data format is {mobile: "13185826384", email: null, name: null}
                    // Recover store info
                    self.$store.commit('member/setHasLogin', true)
                    self.$store.commit('member/setMemberToken', memberToken)
                } else {
                    // clear invalid token
                    uni.removeStorageSync(self.$store.state.setting.member_token_key)

                    // redirect
                    uni.redirectTo({
                        url: '/pages/account/signin'
                    })
                }
            }).catch((err) => {
                uni.redirectTo({
                    url: '/pages/account/signin'
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

/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */

body {
    background-color: #F1F5F8;
}

button.primary {
    background-color: #0faeff;
}

button.warn {
    background-color: #FFA200;
}

</style>
