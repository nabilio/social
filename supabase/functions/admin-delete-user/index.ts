import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify admin permissions
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const adminEmails = [
      'admin@socialid.com',
      'rouijel.nabil@gmail.com',
      'contact@nrinfra.fr',
      'rouijel.nabil.cp@gmail.com'
    ]

    if (!adminEmails.includes(user.email || '')) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { userId } = await req.json()
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🗑️ Admin Edge Function: Starting user deletion for:', userId)

    // Get user info for logging
    const { data: userInfo } = await supabase
      .from('profiles')
      .select('username, display_name')
      .eq('id', userId)
      .single()

    // Log admin action
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: user.id,
        admin_email: user.email,
        action: 'delete_user',
        target_user_id: userId,
        target_email: userInfo?.username || 'unknown',
        details: { username: userInfo?.username, display_name: userInfo?.display_name }
      })

    // Delete in correct order to avoid foreign key constraints
    console.log('🗑️ Step 1 - Deleting social links...')
    const { error: socialLinksError } = await supabase
      .from('social_links')
      .delete()
      .eq('user_id', userId)
    
    if (socialLinksError) {
      console.error('❌ Social links deletion error:', socialLinksError)
      throw new Error(`Failed to delete social links: ${socialLinksError.message}`)
    }

    console.log('🗑️ Step 2 - Deleting friendships...')
    const { error: friendshipsError } = await supabase
      .from('friendships')
      .delete()
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    
    if (friendshipsError) {
      console.error('❌ Friendships deletion error:', friendshipsError)
      throw new Error(`Failed to delete friendships: ${friendshipsError.message}`)
    }

    console.log('🗑️ Step 3 - Deleting user profiles...')
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId)
    
    if (userProfilesError) {
      console.error('❌ User profiles deletion error:', userProfilesError)
      throw new Error(`Failed to delete user profiles: ${userProfilesError.message}`)
    }

    console.log('🗑️ Step 4 - Deleting main profile...')
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('❌ Profile deletion error:', profileError)
      throw new Error(`Failed to delete profile: ${profileError.message}`)
    }

    console.log('🗑️ Step 5 - Deleting auth user...')
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.warn('⚠️ Auth user deletion failed:', authError.message)
      // Don't throw error here as profile data is already deleted
    }

    console.log('✅ User deletion completed successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error in admin-delete-user:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})