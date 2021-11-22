import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn.js'
createApp(App).use(ElementPlus, { locale }).mount('#app')
