<script setup lang="ts">
import { ref } from "vue"
import { createClient } from "@supabase/supabase-js"
import messageSystem from "@/components/message-system.vue"

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SERVICE_ROLE_KEY,
)

const email = ref("")
const name = ref("")
const phone = ref("")
const password = ref("")
const confirmPassword = ref("")
const validName = ref(true)
const validPhone = ref(true)
const validEmail = ref(true)
const validPassword = ref(true)
const validConfirmPassword = ref(true)
const validPasswordAndConfirm = ref(true)
const createdAccount = ref("")
const messageError = ref("")

const verifyAccount = () => {
    validEmail.value = email.value !== ""
    validName.value = name.value !== ""
    validPhone.value = phone.value !== ""
    validPassword.value = password.value !== ""
    validConfirmPassword.value = confirmPassword.value !== ""

    const allFieldsValid =
        validName.value &&
        validEmail.value &&
        validPhone.value &&
        validPassword.value &&
        validConfirmPassword.value

    if (allFieldsValid) {
        validPasswordAndConfirm.value = password.value === confirmPassword.value
        if (validPasswordAndConfirm.value) {
            createAccount()
        }
    }
}

const createAccount = async () => {
    document.getElementById("my_modal_1").showModal()

    const { data: user, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
    })

    if (error) {
        createdAccount.value = "false"
        messageError.value = error.message
    } else {
        const { error: profileError } = await supabase.from("users").insert({
            uuid: user.user.id,
            name: name.value,
            phone: phone.value,
        })

        if (profileError) {
            createdAccount.value = "false"
            messageError.value = profileError.message
            document.getElementById("my_modal_1").close()
            return
        }

        createdAccount.value = "true"

        email.value = ""
        name.value = ""
        phone.value = ""
        password.value = ""
        confirmPassword.value = ""
        validEmail.value = true
        validName.value = true
        validPhone.value = true
        validPassword.value = true
        validConfirmPassword.value = true
        validPasswordAndConfirm.value = true
    }
    setTimeout(() => {
        createdAccount.value = ""
    }, 3000)
    document.getElementById("my_modal_1").close()
}
</script>

<template>
    <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">loading</h3>
        </div>
    </dialog>
    <messageSystem
        name="account created successfully"
        status="ok"
        v-show="createdAccount == 'true'"
    />
    <messageSystem :name="messageError" status="denied" v-show="createdAccount == 'false'" />

    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-bold text-center text-gray-800">create account</h2>
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <label for="name" class="block text-sm font-medium text-gray-500"
                    >Type your name full</label
                >
                <input
                    id="name"
                    type="text"
                    v-model="name"
                    placeholder="John Doe"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <label class="block text-sm font-medium text-red-500" v-show="!validName"
                    >Fill in name (required)
                </label>
            </div>

            <div class="mb-4">
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                <label for="phone" class="block text-sm font-medium text-gray-500"
                    >Type your phone</label
                >
                <input
                    id="phone"
                    type="text"
                    v-model="phone"
                    placeholder="00000000000"
                    maxlength="11"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <label class="block text-sm font-medium text-red-500" v-show="!validPhone"
                    >Fill in phone (required)
                </label>
            </div>

            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <label for="email" class="block text-sm font-medium text-gray-500"
                    >Type your email address</label
                >
                <input
                    id="email"
                    type="email"
                    v-model="email"
                    placeholder="example@example.com"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <label class="block text-sm font-medium text-red-500" v-show="!validEmail"
                    >Fill in email (required)
                </label>
            </div>

            <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700"
                    >Password</label
                >
                <label for="password" class="block text-sm font-medium text-gray-500"
                    >Create a secure password</label
                >
                <input
                    id="password"
                    type="password"
                    v-model="password"
                    placeholder="******"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <label class="block text-sm font-medium text-red-500" v-show="!validPassword"
                    >Fill in password (required)
                </label>
                <label
                    class="block text-sm font-medium text-red-500"
                    v-show="!validPasswordAndConfirm"
                    >Passwords do not match
                </label>
            </div>

            <div class="mb-4">
                <label for="confirm-password" class="block text-sm font-medium text-gray-700"
                    >Confirm Password</label
                >
                <label for="confirm-password" class="block text-sm font-medium text-gray-500"
                    >Retype your password</label
                >
                <input
                    id="confirm-password"
                    type="password"
                    v-model="confirmPassword"
                    placeholder="******"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <label class="block text-sm font-medium text-red-500" v-show="!validConfirmPassword"
                    >Fill in confirm password (required)
                </label>
                <label
                    class="block text-sm font-medium text-red-500"
                    v-show="!validPasswordAndConfirm"
                    >Passwords do not match
                </label>
            </div>

            <button
                class="w-full px-4 py-2 mt-0 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
                @click="verifyAccount"
            >
                Create Account
            </button>
            <p class="mt-6 text-center text-sm text-gray-600">
                Already have an account?
                <router-link to="/login" class="text-blue-500 hover:underline">Log in</router-link>
            </p>
        </div>
    </div>
</template>
