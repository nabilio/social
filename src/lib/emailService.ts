import { supabase } from './supabase'

export interface EmailData {
  to: string
  subject?: string
  template: 'welcome' | 'profile_created' | 'friend_request' | 'password_reset' | 'account_deleted' | 'friend_accepted' | 'email_confirmation'
  data?: Record<string, any>
}

export class EmailService {
  private static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 EmailService: Sending email to:', emailData.to, 'Template:', emailData.template)
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData
      })

      if (error) {
        console.error('❌ EmailService: Error:', error)
        return false
      }

      if (!data?.success) {
        console.error('❌ EmailService: Failed:', data)
        return false
      }

      console.log('✅ EmailService: Email sent successfully, ID:', data.messageId)
      return true
    } catch (error) {
      console.error('❌ EmailService: Error sending email:', error)
      return false
    }
  }

  // 🎉 Email de bienvenue (inscription + Google OAuth)
  static async sendWelcomeEmail(userEmail: string, userData: {
    displayName: string
    username: string
  }): Promise<boolean> {
    const baseUrl = window.location.origin
    
    return this.sendEmail({
      to: userEmail,
      template: 'welcome',
      data: {
        displayName: userData.displayName,
        username: userData.username,
        dashboardUrl: `${baseUrl}/dashboard`,
        profileUrl: `${baseUrl}/u/${userData.username}`,
      }
    })
  }

  // ✨ Email de confirmation d'inscription
  static async sendEmailConfirmationEmail(userEmail: string, userData: {
    displayName: string
    confirmationUrl: string
  }): Promise<boolean> {
    return this.sendEmail({
      to: userEmail,
      template: 'email_confirmation',
      data: {
        displayName: userData.displayName,
        confirmationUrl: userData.confirmationUrl,
      }
    })
  }

  // 📋 Email de création de profil
  static async sendProfileCreatedEmail(userEmail: string, profileData: {
    displayName: string
    username: string
    profileName: string
    profileSlug: string
    isPublic: boolean
  }): Promise<boolean> {
    const baseUrl = window.location.origin
    const profileUrl = profileData.profileSlug === 'default' 
      ? `${baseUrl}/u/${profileData.username}`
      : `${baseUrl}/u/${profileData.username}/${profileData.profileSlug}`
    
    return this.sendEmail({
      to: userEmail,
      template: 'profile_created',
      data: {
        displayName: profileData.displayName,
        profileName: profileData.profileName,
        isPublic: profileData.isPublic,
        profileUrl,
        manageUrl: `${baseUrl}/dashboard/social-links`,
      }
    })
  }

  // 👥 Email de demande d'ami
  static async sendFriendRequestEmail(recipientEmail: string, requestData: {
    recipientName: string
    senderName: string
    senderUsername: string
    requestId: string
  }): Promise<boolean> {
    const baseUrl = window.location.origin
    
    return this.sendEmail({
      to: recipientEmail,
      template: 'friend_request',
      data: {
        recipientName: requestData.recipientName,
        senderName: requestData.senderName,
        senderUsername: requestData.senderUsername,
        profileUrl: `${baseUrl}/u/${requestData.senderUsername}`,
        acceptUrl: `${baseUrl}/friends?request=${requestData.requestId}`,
      }
    })
  }

  // 🎊 Email d'acceptation d'ami
  static async sendFriendAcceptedEmail(senderEmail: string, friendData: {
    senderName: string
    friendName: string
    friendUsername: string
  }): Promise<boolean> {
    const baseUrl = window.location.origin
    
    return this.sendEmail({
      to: senderEmail,
      template: 'friend_accepted',
      data: {
        senderName: friendData.senderName,
        friendName: friendData.friendName,
        friendUsername: friendData.friendUsername,
        friendProfileUrl: `${baseUrl}/u/${friendData.friendUsername}`,
        friendsPageUrl: `${baseUrl}/friends`,
      }
    })
  }

  // 🔐 Email de réinitialisation de mot de passe
  static async sendPasswordResetEmail(userEmail: string, resetData: {
    displayName: string
    resetToken: string
  }): Promise<boolean> {
    const baseUrl = window.location.origin
    
    return this.sendEmail({
      to: userEmail,
      template: 'password_reset',
      data: {
        displayName: resetData.displayName,
        resetUrl: `${baseUrl}/reset-password?token=${resetData.resetToken}`,
      }
    })
  }

  // 👋 Email de suppression de compte
  static async sendAccountDeletedEmail(userEmail: string, userData: {
    displayName: string
    username: string
  }): Promise<boolean> {
    const baseUrl = window.location.origin
    
    return this.sendEmail({
      to: userEmail,
      template: 'account_deleted',
      data: {
        displayName: userData.displayName,
        username: userData.username,
        homeUrl: baseUrl,
      }
    })
  }

  // 🛠️ Méthode générique pour emails personnalisés
  static async sendCustomEmail(emailData: EmailData): Promise<boolean> {
    return this.sendEmail(emailData)
  }

  // 🧪 Test du système d'email
  static async testEmailSystem(testEmail: string): Promise<boolean> {
    console.log('🧪 Testing email system with:', testEmail)
    
    return this.sendWelcomeEmail(testEmail, {
      displayName: 'Test User',
      username: 'testuser'
    })
  }
}