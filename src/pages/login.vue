<script setup lang="ts">
import { ref, onMounted } from "vue"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "vue-router"

const router = useRouter()
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SERVICE_ROLE_KEY,
)

const email = ref("")
const password = ref("")
const messageError = ref("")

onMounted(() => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_id")
})

const loginAccount = async () => {
    document.getElementById("my_modal_2").showModal()
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    if (error) {
        messageError.value = error.message
    } else {
        localStorage.setItem("access_token", data.session.access_token)
        localStorage.setItem("refresh_token", data.session.refresh_token)
        localStorage.setItem("user_id", data.session.user.id)

        router.push("/welcome")
    }
    document.getElementById("my_modal_2").close()
}
</script>

<template>
    <dialog id="my_modal_2" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">loading</h3>
        </div>
    </dialog>

    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold text-center text-gray-800">login app</h2>
            <div class="mb-4 mt-6">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <label for="email" class="block text-sm font-medium text-gray-500">
                    Enter your email below
                </label>
                <input
                    id="email"
                    type="email"
                    v-model="email"
                    placeholder="example@example.com"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>

            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700"
                    >Password</label
                >
                <label for="password" class="block text-sm font-medium text-gray-500">
                    Enter your password below
                </label>
                <input
                    id="password"
                    type="password"
                    v-model="password"
                    placeholder="******"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <label class="block text-sm font-medium text-red-500" v-show="messageError != ''"
                    >{{ messageError }}
                </label>
            </div>

            <button
                @click="loginAccount"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Log In
            </button>

            <p class="mt-6 text-center text-sm text-gray-600">
                Don't have an account?
                <router-link to="/register" class="text-blue-500 hover:underline">
                    Sign Up
                </router-link>
            </p>
        </div>
    </div>
</template>
