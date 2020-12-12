<template>
    <view>
        <u-cell-group v-if="category.chapterName" >
          <u-cell-item :label="noticeBarText" :arrow="false"></u-cell-item>
        </u-cell-group>

        <u-cell-group v-if="category.chapterName" >
          <u-cell-item v-for="item in chapterList" :key="item.id" :title="item.name" @click="loadChapter(item.id, item.name)"></u-cell-item>
        </u-cell-group>

       <!-- <uni-list v-if="chapterName">
            <uni-list-item :showArrow="false"  title="" :note="noticeBarText"></uni-list-item>
        </uni-list>

        <uni-list v-if="chapterList">
            <template v-for="item in chapterList">
            <uni-list-item :key="item.id" :title="item.name" @click="loadChapter(item.id, item.name)"></uni-list-item>
</template>
    </uni-list>-->
  </view>
</template>

<script>
    let cache = []
    let category = null
    let questionSerialNumber = 0 // set global for practise record only request once
    export default {
        components: {},
        data() {
            return {
                category:{
                    categoryId: "",
                    categoryName: "",
                    chapterName: "",
                },
                chapterList: [],
                currentIndex: 0
            };
        },
        async onShow() {
            const self = this;
            // get record for notice info
            // Then load chapter
            // self.loadChapter(0, null);
            // Force update page
            // self.$forceUpdate();
            const index = self.options.index
            const cid = uni.getStorageSync('cid')
            const name = uni.getStorageSync('categoryName')

            if (index) {
                this.currentIndex = index - 1
                if (cache[this.currentIndex]) {
                    self.chapterList = cache[this.currentIndex]
                    self.category = category
                    uni.setNavigationBarTitle({
                        title: category.categoryName,
                    });
                } else {
                    await self.getPractiseRecord();
                    await self.loadChapter(0, null);
                }
            } else  {
                uni.redirectTo({
                    url: `/pages/index/chose-chapter?index=1`
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
                category = null
            }
        },
        methods: {
            // Same in index.vue
            async getPractiseRecord() {
                const self = this;
                const res = await self.$apiRequest({
                    url: self.$apiList.practiseRecord,
                    method: "GET",
                    header: {
                        Authorization: "Bearer " + self.$store.state.member.memberToken,
                    },
                });
                if (res.code == 0) {
                    if (res.data.length == 0) {
                        // goto chose subject
                        uni.navigateTo({
                            url: "./chose-subject",
                        });
                    } else {
                        uni.setNavigationBarTitle({
                            title: res.data.categoryName,
                        });
                        // For chose-chapter page
                        // const {categoryId,categoryName,chapterName,questionSerialNumber} = res.data
                        self.category = res.data
                        category = res.data

                        questionSerialNumber = res.data.questionSerialNumber
                    }
                }
            },
            async loadChapter(pid, chapterName) {
                const self = this;
                if (self.category.categoryId == "" || self.category.categoryId == "undefined") {
                    uni.navigateTo({
                        url: "/pages/index/index",
                    });
                }

                let cid = self.category.categoryId

                const chapterRes = await self.$apiRequest({
                    url: self.$apiList.chapterIndex,
                    method: "GET",
                    header: {
                        Authorization: "Bearer " + self.$store.state.member.memberToken,
                    },
                    data: {
                        cid: cid,
                        pid: pid, // chapter parent_id
                    },
                });
                if (chapterRes.code == 0) {
                    if (chapterRes.data.length > 0) {
                        // assign chapter data
                        let index = cache.length
                        cache[index] = chapterRes.data;
                        index = cache.length
                        if (index > 1) {
                            uni.navigateTo({
                                 url: `/pages/index/chose-chapter?index=${index}`
                            })
                        }
                        self.chapterList = chapterRes.data;
                    } else {
                        // last chapter: pid(parent_id) as chapter_id to query questions
                        const chapterId = pid;

                        // local store cid + pid + chapterName
                        uni.setStorageSync('cid', cid)
                        uni.setStorageSync('pid', chapterId)
                        uni.setStorageSync('chapterName', chapterName)
                        uni.navigateTo({
                            url: "/pages/question/answer-sheet"
                        });
                    }
                }
            },
        },
        computed: {
            noticeBarText() {
                return "当前做到《" + this.category.chapterName + "》第 " + questionSerialNumber + " 题";
            },
        },
    };
</script>

<style>

</style>
