<template>
    <view>
        <u-search class="search-bar" placeholder="输入您的科目或者专业代码" :show-action="true" v-model="searchValue" @change="searchChange"
            @custom="searchLastCategory" @search="searchLastCategory" shape="square" height="80" :animation="true"
            :clearabled="true" @clear="clear"></u-search>

        <u-grid :col="3" :border="false" class="customGrid" v-if="!showUniListFormat && categoryList" @click="gridClicked">
            <u-grid-item class="customGridItem" v-for="item in categoryList" :index="item.id" :key="item.id" >
                <text class="text">{{ item.name }}</text>
            </u-grid-item>
        </u-grid>

        <u-cell-group v-if="showUniListFormat && categoryList">
            <u-cell-item v-for="item in categoryList" :title="item.name" @click="listItemClicked(item.id)" :key="item.id"></u-cell-item>
        </u-cell-group>
    </view>
</template>

<script>
    let cache = []
    export default {
        components: {},
        data() {
            return {
                showUniListFormat: false,
                categoryList: [],
                searchValue: '',
                currentIndex:''
            }
        },
        async onShow() {
            const self = this
            const { index } = self.options

            if (index) {
                index > 1 ? self.showUniListFormat = true : self.showUniListFormat = false
                this.currentIndex = index - 1
                if (cache[this.currentIndex]) {
                    self.categoryList = cache[this.currentIndex]
                } else {
                    await self.loadCategory(0)
                }
            } else if (self.route === 'pages/index/chose-subject') {
                uni.redirectTo({
                    url: '/pages/index/chose-subject?index=1'
                })
            }

        },
        onUnload() {
            const self = this
            const {
                index
            } = self.options
            if (index === '1') {
                cache = []
            }
        },
        methods: {
            clear() {
                this.categoryList = cache[this.currentIndex]
                this.searchValue = ''
                if(this.currentIndex === 0){
                    setTimeout(()=>{
                      this.showUniListFormat = false
                    })
                }
            },
            searchChange(e) {
                this.searchValue = e
                if (!this.searchValue) {
                    this.categoryList = cache[this.currentIndex]
                    if(this.currentIndex === 0){
                        setTimeout(()=>{
                          this.showUniListFormat = false
                        })
                    }
                }
            },
            async searchLastCategory(e) {
                const self = this
                const value = e
                if (!value) {
                    this.categoryList = cache[this.currentIndex]
                    if(this.currentIndex === 0){
                        setTimeout(()=>{
                          this.showUniListFormat = false
                        },20)
                    }
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
                        self.showUniListFormat = true
                    })
                }
            },
            async gridClicked(e) {
                const self = this

                const categoryId = e

                await self.loadCategory(categoryId)
            },
            async listItemClicked(pid) {
                const self = this

                await self.loadCategory(pid)
            },
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
                        await self.saveChosenCategory(pid)
                    } else {
                        let index = cache.length
                        cache[index] = res.data
                        index = cache.length
                        if (index > 1) {
                            uni.navigateTo({
                                url: '/pages/index/chose-subject?index=' + index
                            })
                        }
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
