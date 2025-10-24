import { EmailService } from './emailService'
import toast from 'react-hot-toast'

export class NotificationService {
  // Notification pour les événements utilisateur avec email automatique
  static async notifyUserEvent(
    eventType: 'welcome' | 'profile_created' | 'friend_request' | 'friend_accepted' | 'password_reset' | 'account_deleted' | 'email_confirmation',
    userEmail: string,
    eventData: any,
    showToast: boolean = true
  ) {
    try {
      let emailSent = false
      let toastMessage = ''

      switch (eventType) {
        case 'welcome':
          emailSent = await EmailService.sendWelcomeEmail(userEmail, eventData)
          toastMessage = '📧 Email de bienvenue envoyé !'
          break
          
        case 'email_confirmation':
          emailSent = await EmailService.sendEmailConfirmationEmail(userEmail, eventData)
          toastMessage = '📧 Email de confirmation envoyé !'
          break
          
        case 'profile_created':
          emailSent = await EmailService.sendProfileCreatedEmail(userEmail, eventData)
          toastMessage = '✨ Email de confirmation de profil envoyé !'
          break
          
        case 'friend_request':
          emailSent = await EmailService.sendFriendRequestEmail(userEmail, eventData)
          toastMessage = '👥 Notification de demande d\'ami envoyée !'
          break

        case 'friend_accepted':
          emailSent = await EmailService.sendFriendAcceptedEmail(userEmail, eventData)
          toastMessage = '🎉 Notification d\'acceptation d\'ami envoyée !'
          break
          
        case 'password_reset':
          emailSent = await EmailService.sendPasswordResetEmail(userEmail, eventData)
          toastMessage = '🔐 Email de réinitialisation envoyé !'
          break

        case 'account_deleted':
          emailSent = await EmailService.sendAccountDeletedEmail(userEmail, eventData)
          toastMessage = '👋 Email de confirmation de suppression envoyé !'
          break
      }

      if (showToast) {
        if (emailSent) {
          // toast.success(toastMessage) // Désactivé pour éviter trop de notifications
          console.log('✅', toastMessage)
        } else {
          console.warn('⚠️ Email non envoyé pour:', eventType)
        }
      }

      return emailSent
    } catch (error) {
      console.error('Error in notification service:', error)
      if (showToast) {
        console.warn('⚠️ Erreur notification:', error.message)
      }
      return false
    }
  }

  // 📊 Notifications système pour les administrateurs
  static async notifyAdmin(eventType: string, data: any) {
    try {
      console.log('📊 Admin notification:', eventType, data)
      
      // Notifier les admins des événements importants
      if (eventType === 'new_user_registered') {
        console.log('👤 Nouvel utilisateur:', data.email)
      }
      
      if (eventType === 'user_deleted') {
        console.log('🗑️ Utilisateur supprimé:', data.email)
      }
      
      if (eventType === 'suspicious_activity') {
        console.log('⚠️ Activité suspecte:', data)
      }
    } catch (error) {
      console.error('Error sending admin notification:', error)
    }
  }

  // 🔔 Notifications en temps réel
  static async sendRealTimeNotification(userId: string, notification: {
    type: string
    title: string
    message: string
    data?: any
  }) {
    try {
      console.log('🔔 Real-time notification for user:', userId, notification)
      
      // Stocker la notification pour l'afficher quand l'utilisateur se connecte
      // TODO: Implémenter avec WebSockets ou polling
      console.log('📱 Notification stockée pour:', userId)
    } catch (error) {
      console.error('Error sending real-time notification:', error)
    }
  }

  // 🧪 Test du système d'email
  static async testEmailSystem(testEmail: string): Promise<boolean> {
    console.log('🧪 Testing email system with:', testEmail)
    
    return this.notifyUserEvent('welcome', testEmail, {
      displayName: 'Test User',
      username: 'testuser'
    }, false)
  }

  // 📈 Statistiques d'emails
  static getEmailStats() {
    return {
      sent: parseInt(localStorage.getItem('email_stats_sent') || '0'),
      failed: parseInt(localStorage.getItem('email_stats_failed') || '0'),
      lastSent: localStorage.getItem('email_stats_last_sent')
    }
  }

  // 📊 Incrémenter les stats
  static updateEmailStats(success: boolean) {
    const currentSent = parseInt(localStorage.getItem('email_stats_sent') || '0')
    const currentFailed = parseInt(localStorage.getItem('email_stats_failed') || '0')
    
    if (success) {
      localStorage.setItem('email_stats_sent', (currentSent + 1).toString())
    } else {
      localStorage.setItem('email_stats_failed', (currentFailed + 1).toString())
    }
    
    localStorage.setItem('email_stats_last_sent', new Date().toISOString())
  }
}