import { createRouter, createWebHashHistory } from "vue-router"
const home = () => import("../views/home");
const CropperImage = () => import("../components/CropperImage");

const routes = [
    {
        path: "/",
        redirect: '/home',
    },
    {
        path: "/home",
        name: "home",
        component: home
    },
    {
        path: "/CropperImage",
        name: "CropperImage",
        component: CropperImage
    },
];

export const router = createRouter({
    mode: "history",
    history: createWebHashHistory(),
    routes: routes
});