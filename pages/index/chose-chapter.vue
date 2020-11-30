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
    export default {
        components: {},
        data() {
            return {
                category:{
                    categoryId: "",
                    categoryName: "",
                    chapterName: "",
                },
                questionSerialNumber: 0,
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
            const { index,cid,name } = self.options
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
                    url: `/pages/index/chose-chapter?cid=${cid}&name=${name}&index=1`
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
                const chapterRes = await self.$apiRequest({
                    url: self.$apiList.chapterIndex,
                    method: "GET",
                    header: {
                        Authorization: "Bearer " + self.$store.state.member.memberToken,
                    },
                    data: {
                        cid: self.category.categoryId,
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
                            const { cid,name } = self.options
                            uni.navigateTo({
                                 url: `/pages/index/chose-chapter?cid=${cid}&name=${name}&index=${index}`
                            })
                        }
                        self.chapterList = chapterRes.data;
                    } else {
                        // last chapter: pid(parent_id) as chapter_id to query questions
                        const chapterId = pid;
                        uni.navigateTo({
                            url: "/pages/question/answer-sheet?pid=" + chapterId + "&name=" + chapterName,
                        });
                    }
                }
            },
        },
        computed: {
            noticeBarText() {
                return "当前做到《" + this.category.chapterName + "》第 " + this.questionSerialNumber + " 题";
            },
        },
    };
</script>

<style>

</style>
