<template>
    <view class="movable">
        <view v-for="(item,index) in list" :key="index" class="movable-item" @touchstart="onTouchStart(index,$event)" @touchmove="onTouchMove(index,$event)" @touchend="onTouchEnd($event)" @touchcancel="onTouchEnd($event)" :style="style[index]">
            <slot v-if="item" :soruce="item"></slot>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                //   list:[],
                startX: 0,
                status: "end",
                newValue: 0,
                distanceX: 0,
                startValue: 0,
                barStyle: {},
                rect: {
                    left: 0,
                    width: 0,
                },
                rTouch: {},
                style: {},
                currentIndex: 0
            };
        },
        computed: {},
        mounted() {
            // this.getActionRect();
            this.$uGetRect('.movable').then(rect => {
                this.rect = rect;
                console.log(rect, 'rect')
            });
        },
        methods: {
            itemMove(x, index, isTransition) {
                let style = {
                    transform: `translateX(${x}px)`
                }
                if (isTransition) style.transition = 'transform 0.45s'
                this.style[index] = style
                this.$forceUpdate()
            },
            onTouchStart(index, event) {
                this.startX = 0;
                // 触摸点集
                let touches = event.touches[0];
                // 触摸点到屏幕左边的距离
                this.startX = touches.clientX;
                // 标示当前的状态为开始触摸滑动
                this.status = "start";
            },
            onTouchMove(index, event) {
                let touches = event.touches[0];
                this.distanceX = touches.clientX - this.startX;
                if (this.status === 'start') {
                    if (this.distanceX > 5) {
                        if (index > 0) {
                            this.currentIndex = --index
                        }
                    }
                    this.status = "moving";
                }
                this.itemMove(this.distanceX, this.currentIndex)
                // 发出moving事件
                //   this.$emit("moving");
            },
            onTouchEnd(event) {
                let index = this.currentIndex
                if (this.status === "moving") {
                    // this.$emit("end");
                    let diffX = this.rect.width / 4
                    console.log(this.distanceX, diffX)
                    this.direction = this.distanceX > 0
                    // 触发第几个上一页还是下一页
                    if (Math.abs(this.distanceX) >= diffX) {
                        this.next()
                        this.$emit('next', this.direction, index, this.next)
                    } else {
                        this.itemMove(0, index, !0)
                    }
                }
                this.status = "end";
            },
            next() {
                let x = !this.direction ? -this.rect.width : 0
                this.itemMove(x, this.currentIndex, !0)
            }
        },
    };
</script>

<style scoped lang="scss">
    .movable {
        width: 100%;
        height: auto;
        background-color: #fff;
        &-item {
            width: 100%;
            height: auto;
            background-color: #fff;
        }
    }
</style>
