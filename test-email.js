// Script de test pour vérifier l'envoi d'emails
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your_supabase_url'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testEmail() {
  console.log('🧪 Testing email sending...')
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: 'test@example.com',
        template: 'welcome',
        data: {
          displayName: 'Test User',
          username: 'testuser',
          dashboardUrl: 'https://socialid.app/dashboard',
          profileUrl: 'https://socialid.app/u/testuser'
        }
      }
    })

    if (error) {
      console.error('❌ Error:', error)
    } else {
      console.log('✅ Email sent successfully:', data)
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

testEmail()