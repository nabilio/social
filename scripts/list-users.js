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

async function listAllUsers() {
  try {
    console.log('📋 Listing all registered users...\n')
    
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError)
      return
    }
    
    // Get all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError)
      return
    }
    
    console.log(`📊 Total users found: ${authUsers.users.length}`)
    console.log(`📊 Total profiles found: ${profiles?.length || 0}\n`)
    
    if (authUsers.users.length === 0) {
      console.log('🔍 No users found in the database.')
      return
    }
    
    console.log('👥 REGISTERED USERS:')
    console.log('=' .repeat(80))
    
    authUsers.users.forEach((user, index) => {
      const profile = profiles?.find(p => p.id === user.id)
      
      console.log(`\n${index + 1}. 📧 EMAIL: ${user.email}`)
      console.log(`   🆔 ID: ${user.id}`)
      console.log(`   📅 Created: ${new Date(user.created_at).toLocaleString()}`)
      console.log(`   ✅ Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
      console.log(`   🔐 Last sign in: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`)
      
      if (profile) {
        console.log(`   👤 Username: @${profile.username}`)
        console.log(`   🏷️  Display name: ${profile.display_name}`)
        console.log(`   🌐 Public profile: ${profile.is_public ? 'Yes' : 'No'}`)
        if (profile.bio) {
          console.log(`   📝 Bio: ${profile.bio}`)
        }
      } else {
        console.log(`   ⚠️  No profile found`)
      }
    })
    
    console.log('\n' + '=' .repeat(80))
    
    // Summary by email domain
    const emailDomains = {}
    authUsers.users.forEach(user => {
      if (user.email) {
        const domain = user.email.split('@')[1]
        emailDomains[domain] = (emailDomains[domain] || 0) + 1
      }
    })
    
    console.log('\n📊 SUMMARY BY EMAIL DOMAIN:')
    Object.entries(emailDomains)
      .sort(([,a], [,b]) => b - a)
      .forEach(([domain, count]) => {
        console.log(`   ${domain}: ${count} user${count > 1 ? 's' : ''}`)
      })
    
    // Email confirmation status
    const confirmedCount = authUsers.users.filter(u => u.email_confirmed_at).length
    const unconfirmedCount = authUsers.users.length - confirmedCount
    
    console.log('\n📧 EMAIL CONFIRMATION STATUS:')
    console.log(`   ✅ Confirmed: ${confirmedCount}`)
    console.log(`   ⏳ Pending: ${unconfirmedCount}`)
    
    // Recent activity
    const recentUsers = authUsers.users
      .filter(u => u.last_sign_in_at)
      .sort((a, b) => new Date(b.last_sign_in_at) - new Date(a.last_sign_in_at))
      .slice(0, 5)
    
    if (recentUsers.length > 0) {
      console.log('\n🕒 RECENT ACTIVITY (Last 5 sign-ins):')
      recentUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} - ${new Date(user.last_sign_in_at).toLocaleString()}`)
      })
    }
    
    console.log('\n✅ User listing completed!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the listing
listAllUsers().catch(console.error)