import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import Antd from 'ant-design-vue'
import "ant-design-vue/dist/antd.css"
// import'cropperjs/dist/cropper.min.css'
import VueCropper from 'vue-cropper'
import ElementPlus from 'element-plus'
import { Layout, Menu, Breadcrumb, Upload, Card, Modal } from 'ant-design-vue'
import {UserOutlined, VideoCameraOutlined, UploadOutlined, FileImageOutlined} from "@ant-design/icons-vue"

const app = createApp(App);
app.use(router);
app.config.productionTip = false;

app.use(ElementPlus);

app.use(Antd);
app.use(Layout).use(Menu).use(Breadcrumb).use(Upload).use(Card).use(Modal);
app.component(VueCropper.name, VueCropper);
app.component(UserOutlined.name, UserOutlined);
app.component(VideoCameraOutlined.name, VideoCameraOutlined);
app.component(UploadOutlined.name, UploadOutlined);
app.component(FileImageOutlined.name, FileImageOutlined);

app.mount('#app');
