import Vue from "vue";
import axios from "axios";
import Buefy from "buefy";
import VueClipboard from "vue-clipboard2";
import VModal from "vue-js-modal";
import Element from 'element-ui';
import "font-awesome/css/font-awesome.min.css";
import "source-sans-pro/source-sans-pro.css";
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css


import App from "./App";

import router from "./router";
import store from "./store";
import db from "./datastore-notes";
import dbBrowers from "./datastore-brower";
import i18n from './lang' // internationalization

require("brace/mode/text");
require("brace/mode/assembly_x86");
require("brace/mode/c_cpp");
require("brace/mode/clojure");
require("brace/mode/csharp");
require("brace/mode/dart");
require("brace/mode/elixir");
require("brace/mode/elm");
require("brace/mode/golang");
require("brace/mode/haskell");
require("brace/mode/html");
require("brace/mode/java");
require("brace/mode/javascript");
require("brace/mode/json");
require("brace/mode/jsx");
require("brace/mode/jade");
require("brace/mode/kotlin");
require("brace/mode/liquid");
require("brace/mode/makefile");
require("brace/mode/markdown");
require("brace/mode/ocaml");
require("brace/mode/perl");
require("brace/mode/pgsql");
require("brace/mode/php");
require("brace/mode/powershell");
require("brace/mode/python");
require("brace/mode/r");
require("brace/mode/ruby");
require("brace/mode/rust");
require("brace/mode/scss");
require("brace/mode/sh");
require("brace/mode/sql");
require("brace/mode/swift");
require("brace/mode/typescript");
require("brace/mode/vbscript");
require("brace/mode/xml");
require("brace/theme/monokai");

const electron = require("electron");

electron.ipcRenderer.on("about", (arg, event) => {
  let component = router.currentRoute.matched[0].instances.default;
  if (event === "about-modal-active") {
    component.aboutModalActive = true;
  }
});

Vue.use(Buefy, {
  defaultIconPack: "fa"
});

Vue.use(VueClipboard);

Vue.use(VModal);

Vue.filter("capitalize", value => {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});
Vue.use(Element, {
  size: localStorage.getItem('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value),
})
// if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.prototype.$db = db;
Vue.prototype.$dbBrowers = dbBrowers;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>"
}).$mount("#app");

function watchBrowerActivity(){

}

//检查关闭实例后，未修改数据的情况
setInterval(async () => {
  await watchBrowerActivity();
}, 1000 * 5);