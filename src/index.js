import VueShuttle from "./components/VueShuttle/index.vue";

const components = [VueShuttle];

// 目的就是注册为全局组件
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

// 原生script tag引入方式
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  VueShuttle,
};
