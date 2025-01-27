import { createRouter, createWebHistory } from "vue-router"
import LoginView from "@/pages/login.vue"
import RegisterView from "@/pages/register.vue"
import WelcomeView from "../pages/welcome.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/register",
            name: "register",
            component: RegisterView,
        },
        {
            path: "/welcome",
            name: "welcome",
            component: WelcomeView,
        },
    ],
})

export default router
