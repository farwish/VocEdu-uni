<template>
    <view class="movable">
        <view
            v-for="(item,index) in list"
            :key="index"
            class="movable-item"
            @touchstart="onTouchStart(index,$event)"
            @touchmove="onTouchMove(index,$event)"
            @touchend="onTouchEnd(index,$event)"
            @touchcancel="onTouchEnd(index,$event)"
            :style="style[index]"
        >
            <slot v-if="item" :soruce="item"></slot>
        </view>
    </view>

</template>

<script>
export default {
  props: {
      list:{
          type:Array,
          default:[]
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
      sliderRect: {
        left: 0,
        width: 0,
      },
      rTouch:{},
      style:{}
    };
  },
  computed: {},
  mounted() {
      console.log(this.list,'mounted')
    // this.getActionRect();
  },
  methods: {
    itemMove(x,index){
        this.style[index] = {
            transform: `translateX(${x}rpx)`
        }
        this.$forceUpdate()
    },
    onTouchStart(index,event) {
      this.startX = 0;
      // 触摸点集
      let touches = event.touches[0];
      // 触摸点到屏幕左边的距离
      this.startX =  uni. touches.clientX;
      // 标示当前的状态为开始触摸滑动
      this.status = "start";
    },
    onTouchMove(index,event) {
      // 连续触摸的过程会一直触发本方法，但只有手指触发且移动了才被认为是拖动了，才发出事件
      // 触摸后第一次移动已经将status设置为moving状态，故触摸第二次移动不会触发本事件
    //   if (this.status == "start") this.$emit("start");
      let touches = event.touches[0];
      // 滑块的左边不一定跟屏幕左边接壤，所以需要减去最外层父元素的左边值
      this.distanceX = touches.clientX - this.startX;
      console.log(event,index,'event,index')
      this.itemMove(this.distanceX,index)
      this.status = "moving";
      // 发出moving事件
      this.$emit("moving");
    },
    onTouchEnd(index,event) {
      if (this.status === "moving") {
        this.$emit("end");
      }
      this.status = "end";
    },
  },
};
</script>

<style scoped lang="scss">
.movable{
    width: 100%;
    height: auto;
    background-color: #fff;
    &-item{
        width: 100%;
        height: auto;
        background-color: #fff;
    }
}

</style>
