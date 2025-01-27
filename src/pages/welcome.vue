<template>
    <div
        class="min-h-screen bg-gray-100 flex flex-col"
        style="padding-top: 80px; padding-bottom: 80px"
    >
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-xl mx-auto">
            <h2 class="text-2xl font-bold text-center text-gray-800">users on the platform</h2>
            <div
                class="avatar-group -space-x-6 rtl:space-x-reverse mt-4 flex items-center justify-center"
            >
                <div class="avatar" v-for="(user, index) in teste" :key="index">
                    <div class="w-12">
                        <img
                            src="https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png"
                        />
                    </div>
                </div>
                <div class="avatar placeholder" v-show="teste.length > 10">
                    <div class="bg-neutral text-neutral-content w-12">
                        <span>+ {{ teste.length - 10 }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md mt-5 w-[85%] mx-auto">
            <div class="flex h-[500px]">
                <div
                    class="w-1/3 bg-gray-100 p-4 rounded-lg shadow-inner overflow-y-auto max-h-full"
                >
                    <div class="space-y-3 mb-3" v-for="(user, index) in teste" :key="index">
                        <button
                            class="w-full flex items-center space-x-4 bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
                            @click="chat(user.uuid)"
                        >
                            <div class="avatar">
                                <div class="w-12 rounded-lg">
                                    <img
                                        src="https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_1280.png"
                                        alt="User Avatar"
                                    />
                                </div>
                            </div>
                            <span class="text-gray-800 font-medium">{{ user.phone }}</span>
                            <span class="text-gray-800 font-medium">{{ user.name }}</span>
                        </button>
                    </div>
                </div>

                <div class="w-2/3 bg-gray-100 p-4 rounded-lg ml-4 flex flex-col">
                    <div class="flex-1 overflow-y-auto space-y-2">
                        <div
                            v-for="message in messages"
                            :key="message.id"
                            :class="{
                                'self-start': message.sender_id === senderId,
                                'self-end': message.sender_id === receiverId,
                                'bg-blue-100': message.sender_id === senderId,
                                'bg-green-100': message.sender_id === receiverId,
                            }"
                            class="max-w-[70%] p-3 rounded-lg shadow-md"
                        >
                            {{ message.content }}
                        </div>
                    </div>

                    <div class="mt-4">
                        <input
                            v-model="newMessage"
                            @keyup.enter="sendMessage(newMessage)"
                            type="text"
                            placeholder="Type your message..."
                            class="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "vue-router"

const router = useRouter()
const messages = ref([])
const senderId = localStorage.getItem("user_id")
const receiverId = ref(null)
const newMessage = ref("")

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SERVICE_ROLE_KEY,
)

const teste = ref([{}])

onMounted(() => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
        return router.push("/login")
    }

    getProfile()
    subscribeToUsers()
})

onUnmounted(() => {
    supabase.removeAllChannels()
})

async function getProfile() {
    const { data, error } = await supabase.from("users").select("uuid, name, phone")

    if (!error && data) {
        teste.value = data.map((user) => ({
            uuid: user.uuid,
            name: user.name,
            phone: user.phone,
        }))
    }
}

function subscribeToUsers() {
    supabase
        .channel("public:users")
        .on("postgres_changes", { event: "*", schema: "public", table: "users" }, async () => {
            await updateAuthUserList()
        })
        .subscribe()
}

async function updateAuthUserList() {
    const { data, error } = await supabase.from("users").select("uuid, name, phone")

    if (!error && data) {
        teste.value = data.map((user) => ({
            uuid: user.uuid,
            name: user.name,
            phone: user.phone,
        }))
    }
}

async function chat(uuid) {
    receiverId.value = uuid
    await fetchMessages()
}

async function fetchMessages() {
    const { data, error } = await supabase
        .from("chat")
        .select("*")
        .or(`sender_id.eq.${senderId},receiver_id.eq.${receiverId.value}`)
        .or(`sender_id.eq.${receiverId.value},receiver_id.eq.${senderId}`)
        .order("created_at", { ascending: true })

    if (!error) {
        messages.value = data
        subscribeToUsersTeste()
    }
}

function subscribeToUsersTeste() {
    supabase
        .channel("public:chat")
        .on("postgres_changes", { event: "*", schema: "public", table: "chat" }, async () => {
            await fetchMessages()
        })
        .subscribe()
}

async function sendMessage(content: string) {
    const { error } = await supabase.from("chat").insert({
        sender_id: senderId,
        receiver_id: receiverId.value,
        content,
    })

    if (!error) {
        newMessage.value = ""
        await subscribeToUsersTeste()
    }
}
</script>
