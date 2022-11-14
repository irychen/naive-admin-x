import { createApp } from "vue";
import "./style/global.scss";
import App from "./App.vue";
import { createPinia } from 'pinia'
import router from './router';

const app = createApp(App);
const pinia = createPinia()

app.use(pinia)
app.use(router)
// app.use(naive);
app.mount("#app");
