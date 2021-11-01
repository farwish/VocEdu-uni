<template>
    <view>
        <u-search class="search-bar" placeholder="输入您的科目或者专业代码" :show-action="true" v-model="searchValue"
            @custom="searchLastCategory" @search="searchLastCategory" shape="square" height="80" :animation="true"
            :clearabled="true"></u-search>

        <u-grid :col="3" :border="false" class="customGrid" v-if="showGridFormat && categoryList" @click="gridClicked">
            <u-grid-item class="customGridItem" v-for="item in categoryList" :index="item.id" :key="item.id" >
                <text class="text">{{ item.name }}</text>
            </u-grid-item>
        </u-grid>

        <u-cell-group v-if="!showGridFormat && categoryList">
            <u-cell-item v-for="item in categoryList" :title="item.name" @click="listItemClicked(item.id)" :key="item.id"></u-cell-item>
        </u-cell-group>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            searchValue: '',
            showGridFormat: true,
            categoryList: [],
        }
    },
    async onLoad(options) {
        const self = this
        const { i } = options

        const pid = parseInt(i)
        if (!isNaN(pid)) {
            pid > 0 ? (self.showGridFormat = false) : (self.showGridFormat = true)

            // Load data by pid directly.
            await self.loadCategory(pid)
        } else {
            uni.redirectTo({
                url: '/pages/index/chose-subject?i=0'
            })
        }
    },
    onUnload() {
    },
    methods: {
        async searchLastCategory(e) {
            const self = this
            const value = e
            if (!value) {
                // Do Nothing.
                return
            }
            const searchCategoryRes = await self.$apiRequest({
                url: self.$apiList.categorySearchLast,
                data: {
                    n: value
                },
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            })

            if (searchCategoryRes.code == 0) {
                self.categoryList = searchCategoryRes.data
                setTimeout(()=>{
                    self.showGridFormat = false
                })
            }
        },
        async gridClicked(e) {
            const self = this

            const categoryId = e

            uni.navigateTo({
                url: '/pages/index/chose-subject?i=' + categoryId
            })
        },
        async listItemClicked(pid) {
            const self = this

            uni.navigateTo({
                url: '/pages/index/chose-subject?i=' + pid
            })
        },
        // Only load and save data, do NOT navigate.
        async loadCategory(pid) {
            const self = this

            const res = await self.$apiRequest({
                url: self.$apiList.categoryIndex,
                method: 'GET',
                data: {
                    pid: pid
                },
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            })
            if (res.code == 0) {
                if (res.data.length == 0) {
                    uni.setStorageSync('cid', pid)
                    await self.saveChosenCategory(pid)
                } else {
                    self.categoryList = res.data
                }
            }

        },
        async saveChosenCategory(categoryId) {
            const self = this

            const res = await self.$apiRequest({
                url: self.$apiList.practiseRecord,
                method: 'POST',
                data: {
                    cid: categoryId
                },
                header: {
                    Authorization: 'Bearer ' + self.$store.state.member.memberToken
                }
            })

            if (res.code == 0) {
                uni.switchTab({
                    url: '/pages/index/index'
                })
            }
        }
    }
}
</script>

<style scoped>
.customGrid {
    background-color: #FFFFFF;
}

.text {
    text-align: center;
    padding: 30px 0;
}

.search-bar {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    position: relative;
    padding: 8px;
    background-color: #ffffff;
}
</style>
