<template>
    <view class="movable">
        <view v-for="(item,index) in list" :key="index" class="movable-item" @touchstart="onTouchStart(index,$event)" @touchmove="onTouchMove(index,$event,item)" @touchend="onTouchEnd($event,item)" @touchcancel="onTouchEnd($event,item)" :style="style[index]">
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
            },
            currentIndex:{
                type: Number,
                default: 0
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
                Zindex:200,
                rect: {
                    left: 0,
                    width: 0,
                },
                rTouch: {},
                style: {},
                // currentIndex: 0
            };
        },
        watch:{
            list(n){
                n.map((i,index)=>{
                    let style = {
                        zIndex:--this.Zindex
                    }
                    style.left = `0px`
                    if(index < this.currentIndex){
                        style.left = `-${this.rect.width}px`
                    }
                    this.style[index] = style
                })
            },
            currentIndex(n){
                // this._index = n
                this.list.map((i,index)=>{
                    let style = {
                        zIndex:--this.Zindex
                    }
                    style.left = `0px`
                    if(index < n){
                        style.left = `-${this.rect.width}px`
                    }
                    this.style[index] = style
                })
            }
        },
        computed: {},
        mounted() {
            // this.getActionRect();
            this.$uGetRect('.movable').then(rect => {
                this.rect = rect;
            });
        },
        methods: {
            itemMove(x, index, isTransition) {
                // console.log(`结果${index}`,x,this.style,isTransition)
                if(x > 5 && !isTransition){
                    x = -this.rect.width + x
                }
                let style = {
                    ...this.style[index],
                    left: `${x}px`
                }
                if (isTransition){
                    style.transition = 'left 0.45s'
                } else{
                    delete style.transition
                }
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
            onTouchMove(index, event,item) {
                let touches = event.touches[0];
                this.distanceX = touches.clientX - this.startX;
                if (this.status === 'start') {
                    if (Math.abs(this.distanceX) > 5) {
                        this._index = this.getNextIndex(item)
                        this.status = "moving";
                    }
                }

                if(this.status === 'moving'){
                    if(this._index === -1 && this.distanceX > 0) return

                    this.itemMove(this.distanceX, this._index)
                }
            },
            onTouchEnd(event,item) {
                if (this.status === "moving") {
                    // let index = this._index
                    // this.$emit("end");
                    let diffX = this.rect.width / 4
                    // console.log(this.distanceX, diffX)
                    this.direction = this.distanceX < 0
                    // 触发第几个上一页还是下一页
                    let index = this.getNextIndex(item,!0)
                    if (Math.abs(this.distanceX) >= diffX) {
                        // index = this.getNextIndex(item)
                        this.$emit('next', this.direction, index, this.stop,item)
                        this.next()
                    } else {
                        this.itemMove(0, index, !0)
                    }
                }
                this.status = "end";
            },
            next() {
                if(this.isStop){
                    this.itemMove(0, this._index, !0)
                    this.isStop = false
                }else{
                    let x = this.direction ? -this.rect.width : 0
                    this.itemMove(x,this._index, !0)
                }
            },
            stop(){
                this.isStop = true
            },
            getNextIndex(item,isNext){
                    let direction = this.distanceX < 0
                    let n = isNext? 1 : 0
                    let _d = direction? n : -1
                    let _i = 0
                    this.list.forEach((i,dx) => {
                        if(item.id === i.id) _i = dx
                    })
                    return _i + _d
            }
        },
    };
</script>

<style scoped lang="scss">
    .movable {
        width: 100%;
        height: auto;
        background-color: #fff;
        position: relative;
        &-item {
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            height: auto;
            background-color: #fff;
        }
    }
</style>
