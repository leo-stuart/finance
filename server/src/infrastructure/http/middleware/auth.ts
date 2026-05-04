import type { Context, Next } from 'hono'
import { supabaseAdmin } from '../../lib/supabase.js'

export type AuthVariables = { userId: string }

export async function authMiddleware(c: Context<{ Variables: AuthVariables }>, next: Next) {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = header.slice(7)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  c.set('userId', user.id)
  await next()
}
