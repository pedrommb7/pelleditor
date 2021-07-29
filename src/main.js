import Vue from "vue";
import App from "./App.vue";
import VuePellEditor from "vue-pell-editor";
import vuetify from "./plugins/vuetify";

Vue.use(VuePellEditor);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
