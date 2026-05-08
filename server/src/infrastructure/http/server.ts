import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { supabaseAdmin } from '../lib/supabase.js'
import { SupabaseCategoryRepository } from '../db/SupabaseCategoryRepository.js'
import { SupabaseTransactionRepository } from '../db/SupabaseTransactionRepository.js'
import { SupabaseSavingsRepository } from '../db/SupabaseSavingsRepository.js'
import { SupabaseCreditCardRepository } from '../db/SupabaseCreditCardRepository.js'
import { SupabaseCreditCardChargeRepository } from '../db/SupabaseCreditCardChargeRepository.js'
import { categoriesRouter } from './routes/categories.js'
import { transactionsRouter } from './routes/transactions.js'
import { savingsRouter } from './routes/savings.js'
import { creditCardsRouter, creditCardChargesRouter } from './routes/creditCards.js'

const categoryRepo = new SupabaseCategoryRepository(supabaseAdmin)
const transactionRepo = new SupabaseTransactionRepository(supabaseAdmin)
const savingsRepo = new SupabaseSavingsRepository(supabaseAdmin)
const creditCardRepo = new SupabaseCreditCardRepository(supabaseAdmin)
const creditCardChargeRepo = new SupabaseCreditCardChargeRepository(supabaseAdmin)

export const app = new Hono()

app.use('*', cors({
  origin: process.env.ALLOWED_ORIGIN ?? '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.get('/api/health', (c) => c.json({ ok: true }))

app.route('/api/categories', categoriesRouter(categoryRepo))
app.route('/api/transactions', transactionsRouter(transactionRepo))
app.route('/api/savings', savingsRouter(savingsRepo))
app.route('/api/credit-cards', creditCardsRouter(creditCardRepo, creditCardChargeRepo))
app.route('/api/credit-card-charges', creditCardChargesRouter(creditCardChargeRepo))

app.onError((err, c) => {
  console.error(`[ERROR] ${c.req.method} ${c.req.url}`, err)
  return c.json({ error: err.message }, 500)
})
