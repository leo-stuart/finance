import type { Category, Transaction, SavingsGoal } from '../types/finance'
import type { User } from '@supabase/supabase-js'

export const DEMO_USER = {
  id: 'demo',
  email: 'demo@financas.app',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '',
} as unknown as User

export const DEMO_CATEGORIES: Category[] = [
  { id: 'c1', user_id: 'demo', name: 'Salário',      type: 'income',  color: '#9fe870', created_at: '' },
  { id: 'c2', user_id: 'demo', name: 'Freelance',    type: 'income',  color: '#054d28', created_at: '' },
  { id: 'c3', user_id: 'demo', name: 'Alimentação',  type: 'expense', color: '#ea580c', created_at: '' },
  { id: 'c4', user_id: 'demo', name: 'Transporte',   type: 'expense', color: '#7c3aed', created_at: '' },
  { id: 'c5', user_id: 'demo', name: 'Aluguel',      type: 'expense', color: '#d03238', created_at: '' },
  { id: 'c6', user_id: 'demo', name: 'Lazer',        type: 'expense', color: '#0369a1', created_at: '' },
  { id: 'c7', user_id: 'demo', name: 'Saúde',        type: 'expense', color: '#db2777', created_at: '' },
  { id: 'c8', user_id: 'demo', name: 'Poupança',     type: 'savings', color: '#0369a1', created_at: '' },
]

const tx = (id: string, date: string, amount: number, type: Transaction['type'], category_id: string | null, description = ''): Transaction => ({
  id, user_id: 'demo', date, amount, type, category_id, description, created_at: '',
})

export const DEMO_TRANSACTIONS: Transaction[] = [
  // Janeiro
  tx('t01', '2026-01-05', 4500,  'income',  'c1', 'Salário Janeiro'),
  tx('t02', '2026-01-10', 1500,  'expense', 'c5', 'Aluguel'),
  tx('t03', '2026-01-12', 350,   'expense', 'c3', 'Mercado'),
  tx('t04', '2026-01-15', 120,   'expense', 'c4', 'Combustível'),
  tx('t05', '2026-01-18', 85,    'expense', 'c6', 'Cinema'),
  tx('t06', '2026-01-20', 200,   'expense', 'c7', 'Farmácia'),
  tx('t07', '2026-01-25', 280,   'expense', 'c3', 'Restaurante'),
  tx('t08', '2026-01-28', 500,   'savings', 'c8', 'Poupança mensal'),
  tx('t09', '2026-01-30', 95,    'expense', 'c4', 'Uber'),

  // Fevereiro
  tx('t10', '2026-02-05', 4500,  'income',  'c1', 'Salário Fevereiro'),
  tx('t11', '2026-02-08', 1200,  'income',  'c2', 'Projeto web'),
  tx('t12', '2026-02-10', 1500,  'expense', 'c5', 'Aluguel'),
  tx('t13', '2026-02-14', 420,   'expense', 'c3', 'Mercado'),
  tx('t14', '2026-02-16', 135,   'expense', 'c4', 'Combustível'),
  tx('t15', '2026-02-22', 180,   'expense', 'c6', 'Show'),
  tx('t16', '2026-02-25', 320,   'expense', 'c3', 'Supermercado'),
  tx('t17', '2026-02-28', 700,   'savings', 'c8', 'Poupança mensal'),

  // Março
  tx('t18', '2026-03-05', 4500,  'income',  'c1', 'Salário Março'),
  tx('t19', '2026-03-10', 1500,  'expense', 'c5', 'Aluguel'),
  tx('t20', '2026-03-12', 380,   'expense', 'c3', 'Mercado'),
  tx('t21', '2026-03-14', 110,   'expense', 'c4', 'Combustível'),
  tx('t22', '2026-03-18', 250,   'expense', 'c7', 'Consulta médica'),
  tx('t23', '2026-03-22', 90,    'expense', 'c6', 'Bar'),
  tx('t24', '2026-03-28', 600,   'savings', 'c8', 'Poupança mensal'),
  tx('t25', '2026-03-29', 180,   'expense', 'c3', 'Delivery'),

  // Abril
  tx('t26', '2026-04-05', 4500,  'income',  'c1', 'Salário Abril'),
  tx('t27', '2026-04-08', 800,   'income',  'c2', 'Logo design'),
  tx('t28', '2026-04-10', 1500,  'expense', 'c5', 'Aluguel'),
  tx('t29', '2026-04-15', 410,   'expense', 'c3', 'Mercado'),
  tx('t30', '2026-04-18', 145,   'expense', 'c4', 'Combustível'),
  tx('t31', '2026-04-22', 320,   'expense', 'c6', 'Viagem fim de semana'),
  tx('t32', '2026-04-28', 700,   'savings', 'c8', 'Poupança mensal'),
  tx('t33', '2026-04-30', 200,   'expense', 'c7', 'Dentista'),

  // Maio (parcial — até dia 3)
  tx('t34', '2026-05-01', 4500,  'income',  'c1', 'Salário Maio'),
  tx('t35', '2026-05-02', 1500,  'expense', 'c5', 'Aluguel'),
  tx('t36', '2026-05-03', 65,    'expense', 'c4', 'Uber'),
]

export const DEMO_GOALS: SavingsGoal[] = [
  { id: 'g1', user_id: 'demo', name: 'Viagem Europa',       target_amount: 15000, current_amount: 2300, deadline: '2027-06-01', created_at: '' },
  { id: 'g2', user_id: 'demo', name: 'Fundo de Emergência', target_amount: 27000, current_amount: 8500, deadline: null,         created_at: '' },
  { id: 'g3', user_id: 'demo', name: 'Notebook novo',       target_amount: 5000,  current_amount: 1800, deadline: '2026-09-01', created_at: '' },
]
