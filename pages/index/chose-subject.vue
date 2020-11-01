<template>
	<view>
        <uni-search-bar @confirm="searchLastCategory" placeholder="输入您的科目或者专业代码"></uni-search-bar>

        <uni-grid :show-border="false" class="customGrid" v-if="!showUniListFormat && categoryList" :column="3" @change="gridClicked">
            <uni-grid-item class="customGridItem" v-for="item in categoryList" :index="item.id">
                <text class="text">{{ item.name }}</text>
            </uni-grid-item>
        </uni-grid>

        <uni-list v-if="showUniListFormat && categoryList">
            <uni-list-item v-for="item in categoryList" :showArrow="true" :title="item.name" @click="listItemClicked(item.id)"></uni-list-item>
        </uni-list>
	</view>
</template>

<script>
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'

import uniGrid from "@/components/uni-grid/uni-grid.vue"
import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"

import uList from "@/components/uni-list/uni-list.vue"
import uListItem from "@/components/uni-list-item/uni-list-item.vue"
export default {
    components: {
        uniSearchBar,
        uniGrid, uniGridItem,
        uList, uListItem
    },
    data() {
        return {
            showUniListFormat: false,
            categoryList: []
        }
    },
    async onShow () {
        const self = this

        await self.loadCategory(0)
    },
    methods: {
        async searchLastCategory (e) {
            const self = this

            const value = e.value

            if (value == '') {
                return self.loadCategory(0)
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
                self.showUniListFormat = true
                self.categoryList = searchCategoryRes.data
            }
        },
        async gridClicked (e) {
            const self = this

            const categoryId = e.detail.index

            await self.loadCategory(categoryId)
        },
        async listItemClicked (pid) {
            const self = this

            await self.loadCategory(pid)
        },
        async loadCategory (pid) {
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
                    self.categoryList = res.data
                }
            }

            if (pid == 0) {
                self.showUniListFormat = false
            } else {
                self.showUniListFormat = true
            }
        },
        async saveChosenCategory (categoryId) {
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
</style>
