import { createRouter, createWebHashHistory } from "vue-router"
const home = () => import("../views/home");
const login = () => import("../views/login");
const CropperImage = () => import("../components/CropperImage");

const routes = [
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