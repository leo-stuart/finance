import { Hono } from 'hono'
import { supabaseAdmin } from '../lib/supabase.js'
import { SupabaseCategoryRepository } from '../db/SupabaseCategoryRepository.js'
import { SupabaseTransactionRepository } from '../db/SupabaseTransactionRepository.js'
import { SupabaseSavingsRepository } from '../db/SupabaseSavingsRepository.js'
import { categoriesRouter } from './routes/categories.js'
import { transactionsRouter } from './routes/transactions.js'
import { savingsRouter } from './routes/savings.js'

const categoryRepo = new SupabaseCategoryRepository(supabaseAdmin)
const transactionRepo = new SupabaseTransactionRepository(supabaseAdmin)
const savingsRepo = new SupabaseSavingsRepository(supabaseAdmin)

export const app = new Hono()

app.get('/api/health', (c) => c.json({ ok: true }))

app.route('/api/categories', categoriesRouter(categoryRepo))
app.route('/api/transactions', transactionsRouter(transactionRepo))
app.route('/api/savings', savingsRouter(savingsRepo))
