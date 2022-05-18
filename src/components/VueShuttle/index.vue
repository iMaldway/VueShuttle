<template>
  <div class="shuttle" :style="{ 'height': height }">
    <div class="shuttle_header" ref="header">
      <!-- 这个插槽是给筛选条件集成的，数据怎么来的由使用者处理 -->
      <slot name="header"></slot>
    </div>
    <div class="shuttle_body" :style="{ 'height': bodyHeight }">
      <div class="shuttle_body_left" ref="leftBody" @scroll="leftBodyScroll">
        <div class="shuttle_body_left_item" v-for="(item, index) in handleData" :key="index">
          <!-- 数据源列表，将渲染格式插入这个插槽 -->
          <slot name="source" v-bind:item="item"></slot>
          <input type="checkbox" name="vehicle" class="checkbox" v-model="item.$$shuttleSelect"
            @change="checkbox(item, '$$shuttleSelect')" />
        </div>
      </div>
      <div class="shuttle_body_center">
        <button type="button" class="_btn _btn_bule" @click="toRight()">{{ buttonText[0] }}</button>
        <button type="button" class="_btn _btn_bule" @click="toLeft()">{{ buttonText[1] }}</button>
      </div>
      <div class="shuttle_body_right" ref="rightBody">
        <div class="shuttle_body_right_item" v-for="(item, index) in choiceData" :key="index">
          <!-- 目标渲染插槽 -->
          <slot name="target" v-bind:item="item"></slot>
          <input type="checkbox" name="vehicle" class="checkbox" v-model="item.$$choiceSelect"
            @change="checkbox(item, '$$choiceSelect')" />
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
/***
 * 自定义穿梭框
 * author Maldway
 *
 *暂未实现全选
 */
export default {
  name: 'VueShuttle',
  data() {
    return {
      bodyHeight: 0,
      handleData: [],
      choiceData: [],
      leftSelectAll: false,
      rightSelectAll: false
    }
  },
  components: {
    //组件
  },
  props: {
    //参数
    /**
     * 渲染数据源
     */
    data: {
      type: Array,
      required: true
    },
    /**
     * 组件高度
     */
    height: {
      type: String,
      required: true
    },
    /***
     * 按钮文字
     */
    buttonText: {
      type: Array,
      default: function () {
        return ['向右移动', '向左移动']
      }
    },
    /***
     * 初始状态下左侧勾选的数据
     */
    leftDefaultChecked: {
      type: Array,
      default: function () {
        return []
      }
    },
    /***
     * 初始状态下左侧勾选的数据的key值
     */
    leftDefaultCheckedKey: {
      type: String
    }
  },
  computed: {
    //计算属性
  },
  watch: {
    //监听
    data: {
      handler() {
        this.handleData = this.transformation()
      },
      immediate: true,
      deep: true
    }
  },
  created: function () {
    //可访问实例，dom还未渲染
  },
  mounted: function () {
    //dom已经挂载
    this.$nextTick(() => {
      /**
       * 动态设置高度
       */
      let offsetHeight = this.$refs.header.offsetHeight
      let height = this.height
      this.bodyHeight = `calc(${height} - ${offsetHeight}px)`
      /**
       * 初始化左侧勾选数据，并将勾选的数据移动到右边
       */
      if (
        this.leftDefaultChecked &&
        this.leftDefaultChecked.length > 0 &&
        this.leftDefaultCheckedKey &&
        this.leftDefaultCheckedKey != ''
      ) {
        for (let i in this.handleData) {
          let item = this.handleData[i]
          let is = this.leftDefaultChecked.includes(
            item[this.leftDefaultCheckedKey]
          )
          if (typeof item['$$shuttleSelect'] != 'undefined') {
            if (is) {
              item['$$shuttleSelect'] = true
            } else {
              item['$$shuttleSelect'] = false
            }
          }
        }
        // 移动到右边
        this.toRight()
      } else {
        console.warn('No default value')
      }
    })
  },
  methods: {
    /**
     * 左边滚动事件
     */
    leftBodyScroll() {
      //获取距离顶部的距离
      let leftBodyScrollTop = this.$refs.leftBody.scrollTop
      leftBodyScrollTop = parseFloat(leftBodyScrollTop.toFixed())
      // 获取可视区的高度
      let leftBodyClientHeight = this.$refs.leftBody.clientHeight
      // 获取滚动条的总高度
      let leftBodyScrollHeight = this.$refs.leftBody.scrollHeight
      if (leftBodyScrollTop + leftBodyClientHeight >= leftBodyScrollHeight) {
        // 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
        this.$emit('toLeftBottom')
      }
    },
    reset(newArray) {
      this.choiceData = []
      if (
        newArray &&
        newArray.length > 0 &&
        this.leftDefaultCheckedKey &&
        this.leftDefaultCheckedKey != ''
      ) {
        for (let i in this.handleData) {
          let item = this.handleData[i]
          let is = newArray.includes(item[this.leftDefaultCheckedKey])
          if (typeof item['$$shuttleSelect'] != 'undefined') {
            if (is) {
              item['$$shuttleSelect'] = true
            } else {
              item['$$shuttleSelect'] = false
            }
          }
        }
        // 移动到右边
        this.toRight()
      } else {
        for (let i in this.handleData) {
          let item = this.handleData[i]
          if (typeof item['$$shuttleSelect'] != 'undefined') {
            item['$$shuttleSelect'] = false
          }
        }
      }
    },
    obtain(attribute) {
      /***
       * 将指定属性名返回对应数组。
       * 获得选择数组对象中某个属性的数组。
       */
      let keyList = []
      for (let key in this.choiceData) {
        let item = this.choiceData[key]
        if (item['$$shuttleSelect']) {
          keyList.push(item[attribute + ''])
        }
      }
      return keyList
    },
    transformation() {
      //转变数据，添加自定义属性
      let $data = [...this.data]
      for (let key in $data) {
        let item = $data[key]
        if (typeof item !== 'object') {
          throw new Error('not Object')
        }
        //是否存在侵入的属性
        if (!item['$$shuttleSelect'] && !item['$$choiceSelect']) {
          this.$set(item, '$$shuttleSelect', false)
          this.$set(item, '$$choiceSelect', false)
        }
      }
      return $data
    },
    checkbox(item, key) {
      //选中
      item[key] = !item[key]
      if (item[key]) {
        item[key] = false
      } else {
        item[key] = true
      }
      /**
       * 取消全选
       */
      if (this.leftSelectAll && !item[key]) {
        this.leftSelectAll = false
      }
      if (this.rightSelectAll && !item[key]) {
        this.rightSelectAll = false
      }
      /**
       * 全选
       */
      if (!this.leftSelectAll && item[key]) {
        let is = this.handleData.every(function (item) {
          return item['$$shuttleSelect'] == true
        })
        this.leftSelectAll = is
      }
      if (!this.rightSelectAll && item[key]) {
        // 如果其中每一项都是true 的话就选中
        let is = this.choiceData.every(function (item) {
          return item['$$choiceSelect'] == true
        })
        this.rightSelectAll = is
      }
    },
    toRight() {
      //移动到右边
      this.choiceData = []
      for (let key in this.handleData) {
        let item = this.handleData[key]
        if (item['$$shuttleSelect']) {
          this.choiceData.push(item)
          item['$$choiceSelect'] = false
        }
      }
    },
    toLeft() {
      //移动到左边
      for (let i = 0; i < this.choiceData.length;) {
        let item = this.choiceData[i]
        if (item['$$choiceSelect']) {
          item['$$shuttleSelect'] = false
          item['$$choiceSelect'] = false
          this.$delete(this.choiceData, i)
        } else {
          i++
        }
      }
    },
    isAllLeft() {
      if (this.leftSelectAll) {
        this.selectAllLeft(true)
      } else {
        this.selectAllLeft(false)
      }
    },
    isAllRight() {
      if (this.rightSelectAll) {
        this.selectAllRight(true)
      } else {
        this.selectAllRight(false)
      }
    },
    selectAllLeft(isSelect) {
      /**
       * 全选/取消 左边
       */
      for (let i in this.handleData) {
        let item = this.handleData[i]
        item['$$shuttleSelect'] = isSelect
      }
    },
    selectAllRight(isSelect) {
      /**
       * 全选/取消 右边
       */
      for (let i in this.choiceData) {
        let item = this.choiceData[i]
        item['$$choiceSelect'] = isSelect
      }
    }
  }
}
</script>
 
<style lang="scss" scoped>
.shuttle {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  position: relative;

  width: 100%;
  height: auto;
  padding: 10px;

  &_header {
    width: 100%;
    flex-basis: 100%;
    height: auto;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  &_body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    flex-basis: 100%;
    width: 100%;
    box-sizing: border-box;

    &_left,
    &_center,
    &_right {
      border-radius: 5px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fff;
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
    }

    &_left {
      width: calc(50% - 120px);
      border: 1px solid #ebeef5;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;

      &_item {
        position: relative;
        border: 1px solid #ebeef5;
        margin: 10px;
        border-radius: 5px;

        .checkbox {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 15px;
          height: 15px;
        }
      }
    }

    &_center {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      width: 220px;

      ._btn {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-color: #dcdfe6;
        color: #606266;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: 0.1s;
        font-weight: 400;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;

        &_bule {
          width: 100px;
          background: #46a6ff;
          border-color: #46a6ff;
          color: #ffffff;
          margin: 10px;
        }
      }
    }

    &_right {
      width: calc(50% - 120px);
      border: 1px solid #ebeef5;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;

      &_item {
        position: relative;
        border: 1px solid #ebeef5;
        margin: 10px;
        border-radius: 5px;

        .checkbox {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}
</style>