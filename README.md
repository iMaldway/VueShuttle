# vue-shuttle

一款基于 vue 的轻量级穿梭框插件。支持高度自定义。

## 属性

| 属性名                | 类型   | 说明                              |
| --------------------- | ------ | --------------------------------- |
| data                  | Array  | 渲染数据源                        |
| height                | String | 组件高度；'100px'                 |
| buttonText            | Array  | ['向右移动', '向左移动']          |
| leftDefaultChecked    | Array  | 初始状态下左侧勾选的数据          |
| leftDefaultCheckedKey | String | 初始状态下左侧勾选的数据的 key 值 |

### 事件

| 事件名       | 参数 | 说明                             |
| ------------ | ---- | -------------------------------- |
| toLeftBottom | none | 左边选择框滑动到底事件，用于分页 |

### 方法

| 方法名         | 参数            | 说明                                                                                       |
| -------------- | --------------- | ------------------------------------------------------------------------------------------ |
| obtain         | none            | 将指定属性名返回对应数组。获得选择数组对象中某个属性的数组。例如获取选中项 id 组成的数组。 |
| selectAllLeft  | Boolen:isSelect | 全选/取消 左边;根据入参 isSelect                                                           |
| selectAllRight | Boolen:isSelect | 全选/取消 左边;根据入参 isSelect                                                           |

### 插槽

| 插槽名 | 数据 | 说明           |
| ------ | ---- | -------------- |
| header | none | 头部搜索等区域 |
| source | item | 左边渲染区域   |
| target | item | 右边渲染区域   |

### 示例

```html
<VueShuttle
  class="rectangle-shuttle"
  :data="shuttleOne.data"
  :height="shuttleOne.height"
>
  <template v-slot:source="{ item }">
    <div class="rectangle">
      <span class="rectangle_name"> {{ item.name }} </span>
      <span class="rectangle_sex"> {{ item.sex }} </span>
      <span class="rectangle_age"> {{ item.age }} </span>
      <p class="rectangle_hobby">
        <span v-for=" (h,i) in item.hobby" :key="h+i"> {{ h }} </span>
      </p>
    </div>
  </template>
  <template v-slot:target="{ item }">
    <div class="rectangle">
      <span class="rectangle_name"> {{ item.name }} </span>
      <span class="rectangle_sex"> {{ item.sex }} </span>
      <span class="rectangle_age"> {{ item.age }} </span>
      <p class="rectangle_hobby">
        <span v-for=" (h,i) in item.hobby" :key="h+i"> {{ h }} </span>
      </p>
    </div>
  </template>
</VueShuttle>
```
