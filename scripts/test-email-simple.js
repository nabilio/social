import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.log('VITE_SUPABASE_URL:', !!supabaseUrl)
  console.log('VITE_SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testEmailSystem() {
  console.log('🧪 TEST SYSTÈME EMAIL SOCIALID')
  console.log('=' .repeat(50))
  
  // Test avec votre vraie adresse email
  const testEmail = 'rouijel.nabil@gmail.com'
  
  console.log(`📧 Test d'envoi vers: ${testEmail}`)
  console.log('🔧 URL Supabase:', supabaseUrl)
  
  try {
    console.log('\n📤 Test 1: Email de bienvenue...')
    
    const welcomePayload = {
      to: testEmail,
      template: 'welcome',
      data: {
        displayName: 'Nabil Rouijel',
        username: 'nabilrouijel',
        dashboardUrl: 'https://socialid.one/dashboard',
        profileUrl: 'https://socialid.one/u/nabilrouijel'
      }
    }

    const { data: welcomeData, error: welcomeError } = await supabase.functions.invoke('send-email', {
      body: welcomePayload
    })

    if (welcomeError) {
      console.error('❌ Erreur welcome:', welcomeError)
    } else if (welcomeData?.success) {
      console.log('✅ Email de bienvenue envoyé!')
      console.log('📧 Message ID:', welcomeData.messageId)
    } else {
      console.log('⚠️ Réponse inattendue:', welcomeData)
    }

    // Attendre 2 secondes entre les emails
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('\n📤 Test 2: Email de création de profil...')
    
    const profilePayload = {
      to: testEmail,
      template: 'profile_created',
      data: {
        displayName: 'Nabil Rouijel',
        profileName: 'Professionnel',
        isPublic: true,
        profileUrl: 'https://socialid.one/u/nabilrouijel/professionnel',
        manageUrl: 'https://socialid.one/dashboard/social-links'
      }
    }

    const { data: profileData, error: profileError } = await supabase.functions.invoke('send-email', {
      body: profilePayload
    })

    if (profileError) {
      console.error('❌ Erreur profile:', profileError)
    } else if (profileData?.success) {
      console.log('✅ Email de profil envoyé!')
      console.log('📧 Message ID:', profileData.messageId)
    } else {
      console.log('⚠️ Réponse inattendue:', profileData)
    }

    // Attendre 2 secondes
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('\n📤 Test 3: Email de réinitialisation...')
    
    const resetPayload = {
      to: testEmail,
      template: 'password_reset',
      data: {
        displayName: 'Nabil Rouijel',
        resetUrl: 'https://socialid.one/reset-password?token=test123'
      }
    }

    const { data: resetData, error: resetError } = await supabase.functions.invoke('send-email', {
      body: resetPayload
    })

    if (resetError) {
      console.error('❌ Erreur reset:', resetError)
    } else if (resetData?.success) {
      console.log('✅ Email de reset envoyé!')
      console.log('📧 Message ID:', resetData.messageId)
    } else {
      console.log('⚠️ Réponse inattendue:', resetData)
    }

  } catch (err) {
    console.error('❌ Erreur générale:', err)
  }

  console.log('\n' + '=' .repeat(50))
  console.log('🎯 VÉRIFICATIONS À FAIRE:')
  console.log('1. Supabase Dashboard → Settings → Edge Functions')
  console.log('2. Vérifier que RESEND_API_KEY est configurée')
  console.log('3. Vérifier que le domaine socialid.one est vérifié dans Resend')
  console.log('4. Vérifier votre boîte email (et spam): ' + testEmail)
  console.log('\n🏁 Test terminé!')
}

testEmailSystem().catch(console.error)