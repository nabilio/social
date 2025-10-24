const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface EmailRequest {
  to: string
  subject?: string
  template: 'welcome' | 'profile_created' | 'friend_request' | 'password_reset' | 'account_deleted' | 'friend_accepted'
  data?: Record<string, any>
}

const emailTemplates = {
  welcome: {
    subject: '🎉 Bienvenue sur socialID !',
    html: (data: any) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
          <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="font-size: 24px; font-weight: bold;">S</span>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Bienvenue sur socialID ! 🎉</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Votre identité numérique centralisée</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
          <h2 style="color: #374151; font-size: 22px; margin: 0 0 15px;">Salut ${data.displayName} ! 👋</h2>
          <p style="color: #6b7280; line-height: 1.6; margin: 0; font-size: 16px;">
            Félicitations ! Votre compte socialID a été créé avec succès. Vous pouvez maintenant centraliser tous vos profils sociaux en un seul endroit.
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.dashboardUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
            🚀 Accéder à mon dashboard
          </a>
        </div>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border: 1px solid #dbeafe; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin: 0 0 10px; font-size: 16px;">🔗 Votre profil public :</h3>
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <a href="${data.profileUrl}" style="color: #1e40af; text-decoration: none; font-weight: 500;">${data.profileUrl}</a>
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="color: #374151; margin: 0 0 15px; font-size: 16px;">🚀 Prochaines étapes :</h3>
          <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Personnalisez votre profil</li>
            <li>Ajoutez vos liens sociaux</li>
            <li>Partagez votre URL socialID</li>
            <li>Découvrez d'autres utilisateurs</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            Powered by <strong style="color: #374151;">socialID</strong> • Votre identité numérique simplifiée
          </p>
        </div>
      </div>
    `
  },
  
  profile_created: {
    subject: '✨ Nouveau profil créé sur socialID',
    html: (data: any) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">S</span>
          </div>
          <h1 style="color: #1f2937; font-size: 24px; margin: 0;">Nouveau profil créé ! ✨</h1>
        </div>
        
        <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
          <h2 style="color: #0c4a6e; margin: 0 0 15px;">Bonjour ${data.displayName} !</h2>
          <p style="color: #075985; line-height: 1.6; margin: 0;">
            Votre nouveau profil "<strong>${data.profileName}</strong>" a été créé avec succès sur socialID.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin: 0 0 15px; font-size: 16px;">📋 Détails du profil :</h3>
          <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li><strong>Nom :</strong> ${data.profileName}</li>
            <li><strong>Visibilité :</strong> ${data.isPublic ? 'Public 🌐' : 'Privé 🔒'}</li>
            <li><strong>URL :</strong> <a href="${data.profileUrl}" style="color: #3b82f6;">${data.profileUrl}</a></li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.manageUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
            🔗 Ajouter des liens
          </a>
          <a href="${data.profileUrl}" style="display: inline-block; background: #6b7280; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            👁️ Voir le profil
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            Powered by <strong style="color: #374151;">socialID</strong>
          </p>
        </div>
      </div>
    `
  },
  
  password_reset: {
    subject: '🔐 Réinitialisation de votre mot de passe socialID',
    html: (data: any) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px;">🔐</span>
          </div>
          <h1 style="color: #1f2937; font-size: 24px; margin: 0;">Réinitialisation de mot de passe</h1>
        </div>
        
        <div style="background: #fef3c7; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
          <h2 style="color: #92400e; margin: 0 0 15px;">Bonjour ${data.displayName} !</h2>
          <p style="color: #b45309; line-height: 1.6; margin: 0;">
            Vous avez demandé à réinitialiser votre mot de passe socialID. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
            🔐 Réinitialiser mon mot de passe
          </a>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
            <strong>Lien direct :</strong><br>
            <a href="${data.resetUrl}" style="color: #3b82f6; word-break: break-all;">${data.resetUrl}</a>
          </p>
        </div>
        
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
          <p style="margin: 0; color: #dc2626; font-size: 13px; text-align: center;">
            ⚠️ Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            Powered by <strong style="color: #374151;">socialID</strong>
          </p>
        </div>
      </div>
    `
  },
  
  friend_request: {
    subject: '👥 Nouvelle demande d\'ami sur socialID',
    html: (data: any) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px;">👥</span>
          </div>
          <h1 style="color: #1f2937; font-size: 24px; margin: 0;">Nouvelle demande d'ami !</h1>
        </div>
        
        <div style="background: #f3e8ff; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #8b5cf6;">
          <h2 style="color: #581c87; margin: 0 0 15px;">Salut ${data.recipientName} !</h2>
          <p style="color: #7c3aed; line-height: 1.6; margin: 0;">
            <strong>${data.senderName}</strong> (@${data.senderUsername}) souhaite vous ajouter comme ami sur socialID.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.acceptUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
            ✅ Accepter la demande
          </a>
          <a href="${data.profileUrl}" style="display: inline-block; background: #6b7280; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            👁️ Voir le profil
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            Powered by <strong style="color: #374151;">socialID</strong>
          </p>
        </div>
      </div>
    `
  },
  
  friend_accepted: {
    subject: '🎉 Demande d\'ami acceptée sur socialID',
    html: (data: any) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px;">🎉</span>
          </div>
          <h1 style="color: #1f2937; font-size: 24px; margin: 0;">Demande d'ami acceptée !</h1>
        </div>
        
        <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #10b981;">
          <h2 style="color: #065f46; margin: 0 0 15px;">Excellente nouvelle ${data.senderName} ! 🎊</h2>
          <p style="color: #047857; line-height: 1.6; margin: 0;">
            <strong>${data.friendName}</strong> (@${data.friendUsername}) a accepté votre demande d'ami sur socialID.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.friendProfileUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-right: 10px;">
            👁️ Voir le profil
          </a>
          <a href="${data.friendsPageUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            👥 Mes amis
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            Powered by <strong style="color: #374151;">socialID</strong>
          </p>
        </div>
      </div>
    `
  },
  
  email_confirmation: {
    subject: '📧 Confirmez votre adresse email - socialID',
    html: (data: any) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; color: white;">
          <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="font-size: 24px;">📧</span>
          </div>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Confirmez votre email</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.9;">Une dernière étape pour activer votre compte</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #10b981;">
          <h2 style="color: #065f46; margin: 0 0 15px;">Salut ${data.displayName} ! 👋</h2>
          <p style="color: #047857; line-height: 1.6; margin: 0;">
            Merci de vous être inscrit sur socialID ! Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${data.confirmationUrl}" style="display: inline-block; background: #10b981; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
            ✅ Confirmer mon email
          </a>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
            <strong>Lien direct :</strong><br>
            <a href="${data.confirmationUrl}" style="color: #3b82f6; word-break: break-all;">${data.confirmationUrl}</a>
          </p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border: 1px solid #fde68a;">
          <p style="margin: 0; color: #92400e; font-size: 13px; text-align: center;">
            ⏰ Ce lien expire dans 24 heures. Si vous n'avez pas créé ce compte, ignorez cet email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            Powered by <strong style="color: #374151;">socialID</strong>
          </p>
        </div>
      </div>
    `
  },
  
  account_deleted: {
    subject: '👋 Compte socialID supprimé',
    html: (data: any) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: #6b7280; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px;">👋</span>
          </div>
          <h1 style="color: #1f2937; font-size: 24px; margin: 0;">Au revoir ${data.displayName}</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <p style="color: #374151; line-height: 1.6; margin: 0; text-align: center;">
            Votre compte socialID (@${data.username}) a été supprimé avec succès. Toutes vos données ont été effacées de nos serveurs.
          </p>
        </div>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <p style="color: #1e40af; margin: 0; text-align: center; font-size: 14px;">
            💡 Vous pouvez toujours revenir ! Créez un nouveau compte quand vous voulez sur <a href="${data.homeUrl}" style="color: #1e40af;">socialID</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px; margin: 0;">
            Merci d'avoir utilisé <strong style="color: #374151;">socialID</strong>
          </p>
        </div>
      </div>
    `
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('📧 Edge Function: send-email called')
  
  try {
    // Check environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'RESEND_API_KEY not configured in Supabase Edge Functions settings'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const requestBody = await req.json()
    const { to, subject, template, data = {} }: EmailRequest = requestBody
    
    console.log('📧 Email request:', { to, template })

    // Validate required fields
    if (!to || !template) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: to, template' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get email template
    const emailTemplate = emailTemplates[template]
    if (!emailTemplate) {
      return new Response(
        JSON.stringify({ success: false, error: `Invalid template: ${template}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare email content
    const emailSubject = subject || emailTemplate.subject
    const emailHtml = emailTemplate.html(data)
    
    console.log('📧 Sending email via Resend...')

    // Send email via Resend using default domain
    const emailPayload = {
      from: 'socialID <noreply@socialid.resend.dev>',
      to: [to],
      subject: emailSubject,
      html: emailHtml,
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    })

    console.log('📧 Resend response status:', emailResponse.status)

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('❌ Resend API error:', errorData)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Resend API error: ${errorData}` 
        }),
        { status: emailResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await emailResponse.json()
    console.log('✅ Email sent successfully:', result.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})