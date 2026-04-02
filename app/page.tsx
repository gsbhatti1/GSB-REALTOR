'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSelectorFull from '@/components/ui/LanguageSelectorFull'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // If user has already selected a language, skip welcome → go straight to search
    const selected = localStorage.getItem('gsb_lang')
    if (selected) {
      router.replace('/search')
    }
  }, [router])

  return <LanguageSelectorFull />
}
