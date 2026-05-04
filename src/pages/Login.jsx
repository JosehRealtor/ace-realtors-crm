import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Home, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async () => {
    if (!email || !password) return setError('Please enter your email and password')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Invalid email or password. Please try again.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
            <Home size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Ace Realtors</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your CRM</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Email address</label>
            <input className="input" type="email" placeholder="you@acerealtors.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input className="input pr-10" type={showPass ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}
          <button onClick={login} disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">© 2026 Ace Realtors Ltd · Nairobi, Kenya</p>
      </div>
    </div>
  )
}
