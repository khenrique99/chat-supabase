import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SERVICE_ROLE_KEY)

const createAccount = async () => {
    await supabase.from("users").insert({ name: "kelvin", email: "kelvin", password: "kelvin" })
}

await createAccount()
