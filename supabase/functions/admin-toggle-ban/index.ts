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

    const { userId, ban } = await req.json()
    
    if (!userId || ban === undefined) {
      return new Response(
        JSON.stringify({ error: 'User ID and ban status required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`🔄 Admin Edge Function: ${ban ? 'Banning' : 'Unbanning'} user:`, userId)

    // Log admin action
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: user.id,
        admin_email: user.email,
        action: ban ? 'ban_user' : 'unban_user',
        target_user_id: userId,
        details: { ban_status: ban }
      })

    const updates: any = {}
    
    if (ban) {
      // Ban for 100 years (effectively permanent)
      const banUntil = new Date()
      banUntil.setFullYear(banUntil.getFullYear() + 100)
      updates.banned_until = banUntil.toISOString()
    } else {
      updates.banned_until = null
    }

    const { error } = await supabase.auth.admin.updateUserById(userId, updates)
    if (error) throw error

    console.log(`✅ User ${ban ? 'banned' : 'unbanned'} successfully`)

    return new Response(
      JSON.stringify({ success: true, message: `User ${ban ? 'banned' : 'unbanned'} successfully` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error in admin-toggle-ban:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})