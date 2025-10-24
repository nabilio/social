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

async function testEmailSend() {
  console.log('📧 Testing email sending to: rouijel.nabil@gmail.com')
  console.log('🔧 Using Supabase URL:', supabaseUrl)
  
  try {
    console.log('📤 Calling send-email edge function...')
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: 'rouijel.nabil@gmail.com',
        template: 'welcome',
        data: {
          displayName: 'Nabil Rouijel',
          username: 'nabilrouijel',
          dashboardUrl: 'https://socialid-mini-social-rywt.bolt.host/dashboard',
          profileUrl: 'https://socialid-mini-social-rywt.bolt.host/u/nabilrouijel'
        }
      }
    })

    if (error) {
      console.error('❌ Error from edge function:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
    } else {
      console.log('✅ Email sent successfully!')
      console.log('📧 Response:', data)
      console.log('🎉 Check the inbox: rouijel.nabil@gmail.com')
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

// Test different email templates
async function testAllTemplates() {
  const templates = [
    {
      name: 'Welcome Email',
      template: 'welcome',
      data: {
        displayName: 'Nabil Rouijel',
        username: 'nabilrouijel',
        dashboardUrl: 'https://socialid-mini-social-rywt.bolt.host/dashboard',
        profileUrl: 'https://socialid-mini-social-rywt.bolt.host/u/nabilrouijel'
      }
    },
    {
      name: 'Profile Created',
      template: 'profile_created',
      data: {
        displayName: 'Nabil Rouijel',
        profileName: 'Professional',
        isPublic: true,
        profileUrl: 'https://socialid-mini-social-rywt.bolt.host/u/nabilrouijel/professional',
        manageUrl: 'https://socialid-mini-social-rywt.bolt.host/dashboard/social-links'
      }
    }
  ]

  for (const test of templates) {
    console.log(`\n📧 Testing ${test.name}...`)
    
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'rouijel.nabil@gmail.com',
          template: test.template,
          data: test.data
        }
      })

      if (error) {
        console.error(`❌ Error for ${test.name}:`, error)
      } else {
        console.log(`✅ ${test.name} sent successfully!`)
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${test.name}:`, err)
    }
    
    // Wait 1 second between emails
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

// Run the test
console.log('🧪 Starting email test...\n')

// Test simple welcome email first
testEmailSend()
  .then(() => {
    console.log('\n🔄 Testing all email templates...')
    return testAllTemplates()
  })
  .then(() => {
    console.log('\n🎉 All email tests completed!')
    console.log('📬 Check the inbox: rouijel.nabil@gmail.com')
  })
  .catch(console.error)