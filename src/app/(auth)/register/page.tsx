'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  registerClient,
  registerClub,
  registerPromoter,
  registerFemaleVip,
} from '@/actions/auth'

type Role = 'client' | 'club' | 'promoter' | 'female_vip'

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('client')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const roles: { value: Role; label: string; description: string }[] = [
    { value: 'client', label: 'Client', description: 'Réserver des tables' },
    { value: 'club', label: 'Club', description: 'Gérer votre établissement' },
    { value: 'promoter', label: 'Promoteur', description: 'Partager des liens affiliés' },
    { value: 'female_vip', label: 'VIP Féminin', description: 'Tables promotionnelles' },
  ]

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('role', role)

    let result: { error?: string } | undefined
    if (role === 'client') result = await registerClient(formData)
    else if (role === 'club') result = await registerClub(formData)
    else if (role === 'promoter') result = await registerPromoter(formData)
    else if (role === 'female_vip') result = await registerFemaleVip(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl text-[#C9973A] mb-2">NightTable</h1>
          <p className="text-gray-400 font-body">Créer votre compte</p>
        </div>

        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-2xl p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  role === r.value
                    ? 'border-[#C9973A] bg-[#C9973A]/10'
                    : 'border-[#C9973A]/20 hover:border-[#C9973A]/40'
                }`}
              >
                <div className={`font-body font-semibold text-sm ${role === r.value ? 'text-[#C9973A]' : 'text-white'}`}>
                  {r.label}
                </div>
                <div className="text-xs text-gray-500 font-body mt-0.5">{r.description}</div>
              </button>
            ))}
          </div>

          <form action={handleSubmit} className="space-y-4">
            {/* Common fields */}
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-body">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1 font-body">Mot de passe</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors"
              />
            </div>

            {/* Role-specific fields */}
            {role === 'club' ? (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1 font-body">Nom du club</label>
                  <input name="clubName" type="text" required className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1 font-body">Slug URL</label>
                  <input name="slug" type="text" required className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" placeholder="mon-club" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1 font-body">Adresse</label>
                  <input name="address" type="text" required className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1 font-body">Téléphone</label>
                  <input name="phone" type="tel" className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 font-body">Prénom</label>
                    <input name="firstName" type="text" required className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 font-body">Nom</label>
                    <input name="lastName" type="text" required className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1 font-body">Téléphone</label>
                  <input name="phone" type="tel" className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" />
                </div>
                {role === 'promoter' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1 font-body">Code promo unique</label>
                      <input name="promoCode" type="text" required className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" placeholder="MONCODE" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1 font-body">Instagram</label>
                      <input name="instagramHandle" type="text" className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" placeholder="@votre_compte" />
                    </div>
                  </>
                )}
                {role === 'female_vip' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1 font-body">Instagram</label>
                    <input name="instagramHandle" type="text" className="w-full bg-[#050508] border border-[#C9973A]/30 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:border-[#C9973A] transition-colors" placeholder="@votre_compte" />
                  </div>
                )}
              </>
            )}

            {error && <p className="text-red-400 text-sm font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9973A] hover:bg-[#b8872f] disabled:opacity-50 text-black font-body font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6 font-body">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#C9973A] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
