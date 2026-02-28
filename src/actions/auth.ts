'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ROLE_REDIRECTS: Record<string, string> = {
  client: '/dashboard/client',
  club: '/dashboard/club',
  promoter: '/dashboard/promoter',
  female_vip: '/dashboard/vip',
  admin: '/dashboard/admin',
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Authentication failed' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const redirectPath = profile ? ROLE_REDIRECTS[profile.role] || '/dashboard/client' : '/dashboard/client'

  revalidatePath('/', 'layout')
  redirect(redirectPath)
}

export async function registerClient(formData: FormData) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: 'client' },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await adminClient.from('client_profiles').insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      phone,
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/client')
}

export async function registerClub(formData: FormData) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const clubName = formData.get('clubName') as string
  const slug = formData.get('slug') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: 'club' },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await adminClient.from('club_profiles').insert({
      id: data.user.id,
      club_name: clubName,
      slug,
      address,
      city: 'Paris',
      phone,
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/club')
}

export async function registerPromoter(formData: FormData) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const promoCode = formData.get('promoCode') as string
  const instagramHandle = formData.get('instagramHandle') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: 'promoter' },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await adminClient.from('promoter_profiles').insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      phone,
      promo_code: promoCode,
      instagram_handle: instagramHandle,
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/promoter')
}

export async function registerFemaleVip(formData: FormData) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const instagramHandle = formData.get('instagramHandle') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: 'female_vip' },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await adminClient.from('female_vip_profiles').insert({
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      phone,
      instagram_handle: instagramHandle,
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/vip')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
