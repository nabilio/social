import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixGoogleProfile() {
  try {
    const email = 'rouijel.nabil@gmail.com'

    console.log(`\n🔍 Looking for profile with email: ${email}`)

    // Find the user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) throw listError

    const user = users.users.find(u => u.email === email)
    if (!user) {
      console.log('❌ User not found')
      return
    }

    console.log('✅ User found:', user.id)
    console.log('📧 Email:', user.email)
    console.log('📝 Metadata:', JSON.stringify(user.user_metadata, null, 2))

    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      console.log('\n📋 Current profile:')
      console.log('  Username:', profile.username)
      console.log('  Display Name:', profile.display_name)
      console.log('  Avatar URL:', profile.avatar_url)

      // Delete the profile so it can be recreated
      console.log('\n🗑️ Deleting profile to allow recreation...')
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (deleteError) throw deleteError
      console.log('✅ Profile deleted successfully')
      console.log('\n✨ Now you can sign in with Google again and the profile will be created correctly!')
      console.log('📌 Expected username: rouijel.nabil')
      console.log('📌 Expected display name: nabil rouijel')
      console.log('📌 Expected avatar: https://lh3.googleusercontent.com/...')
    } else {
      console.log('\n⚠️ No profile found - user can sign in to create it')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixGoogleProfile()
