interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-wise-bg flex items-center justify-center p-4"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(159,232,112,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(159,232,112,0.05) 0%, transparent 40%)',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1
            className="font-black text-wise-black"
            style={{ fontSize: '48px', lineHeight: '0.85', fontFeatureSettings: '"calt"' }}
          >
            Finanças
          </h1>
          <div className="w-12 h-1.5 bg-wise-green rounded-full mx-auto mt-3" />
        </div>
        <div className="card p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
