import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const emailsToDelete = [
  'meryem.saadi1997@gmail.com',
  'rouijel.nabil.cp@gmail.com',
  'yazidroroy@gmail.com'
]

async function deleteAccounts() {
  console.log('🗑️ Starting account deletion process...')
  
  for (const email of emailsToDelete) {
    try {
      console.log(`\n🔍 Looking for user with email: ${email}`)
      
      // First, get the user by email from auth.users (requires service role key)
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        console.error(`❌ Error listing users:`, listError)
        continue
      }
      
      const user = users.users.find(u => u.email === email)
      
      if (!user) {
        console.log(`⚠️ User not found: ${email}`)
        continue
      }
      
      console.log(`✅ Found user: ${user.id} (${email})`)
      
      // Delete from profiles table (this will cascade to user_profiles and social_links)
      console.log(`🗑️ Deleting profile data for: ${email}`)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)
      
      if (profileError) {
        console.error(`❌ Error deleting profile:`, profileError)
      } else {
        console.log(`✅ Profile data deleted for: ${email}`)
      }
      
      // Delete from auth.users
      console.log(`🗑️ Deleting auth user: ${email}`)
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
      
      if (authError) {
        console.error(`❌ Error deleting auth user:`, authError)
      } else {
        console.log(`✅ Auth user deleted: ${email}`)
      }
      
    } catch (error) {
      console.error(`❌ Unexpected error for ${email}:`, error)
    }
  }
  
  console.log('\n🎉 Account deletion process completed!')
}

// Run the deletion
deleteAccounts().catch(console.error)