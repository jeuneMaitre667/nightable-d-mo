'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl text-[#C9973A] mb-2">NightTable</h1>
          <p className="text-gray-400 font-body">Paris Nightlife Reservations</p>
        </div>

        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-2xl p-8">
          <h2 className="font-heading text-2xl text-white mb-6">Se connecter</h2>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-body">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors"
                placeholder="vous@exemple.fr"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1 font-body">Mot de passe</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9973A] hover:bg-[#b8872f] disabled:opacity-50 text-black font-body font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6 font-body">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[#C9973A] hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
