export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

/**
 * Holiday Greetings Cron Job
 * Runs daily at 9am via Vercel Cron
 * Sends holiday-specific emails to leads based on their language preference
 */

// Holiday calendar — month/day format
const HOLIDAYS: Array<{
  month: number
  day: number
  name: string
  greeting: Record<string, string>
}> = [
  {
    month: 1, day: 1,
    name: "New Year's Day",
    greeting: {
      en: "Happy New Year! Wishing you a year full of new beginnings and the perfect home.",
      es: "¡Feliz Año Nuevo! Le deseo un año lleno de nuevos comienzos y el hogar perfecto.",
      pa: "ਨਵੇਂ ਸਾਲ ਦੀਆਂ ਮੁਬਾਰਕਾਂ! ਤੁਹਾਨੂੰ ਨਵੀਆਂ ਸ਼ੁਰੂਆਤਾਂ ਅਤੇ ਸੰਪੂਰਨ ਘਰ ਦੀ ਕਾਮਨਾ।",
      ar: "سنة جديدة سعيدة! أتمنى لكم سنة مليئة بالبدايات الجديدة والمنزل المثالي.",
      zh: "新年快乐！祝您新的一年充满新的开始和完美的家。",
      vi: "Chúc Mừng Năm Mới! Chúc bạn một năm mới tràn đầy khởi đầu mới và ngôi nhà hoàn hảo.",
    },
  },
  {
    month: 4, day: 13,
    name: "Vaisakhi",
    greeting: {
      en: "Happy Vaisakhi! Wishing you joy and prosperity.",
      es: "¡Feliz Vaisakhi!",
      pa: "ਵਿਸਾਖੀ ਦੀਆਂ ਲੱਖ ਲੱਖ ਮੁਬਾਰਕਾਂ! ਖੁਸ਼ੀ ਅਤੇ ਖੁਸ਼ਹਾਲੀ ਦੀ ਕਾਮਨਾ।",
      ar: "فيساخي سعيد!",
      zh: "节日快乐！",
      vi: "Chúc Mừng Vaisakhi!",
    },
  },
  {
    month: 7, day: 4,
    name: "Independence Day",
    greeting: {
      en: "Happy 4th of July! Celebrating freedom and the American Dream of homeownership.",
      es: "¡Feliz 4 de Julio! Celebrando la libertad y el sueño americano.",
      pa: "4 ਜੁਲਾਈ ਦੀਆਂ ਮੁਬਾਰਕਾਂ!",
      ar: "يوم استقلال سعيد!",
      zh: "独立日快乐！",
      vi: "Chúc Mừng Ngày Quốc Khánh!",
    },
  },
  {
    month: 11, day: 1,
    name: "Diwali (approx)",
    greeting: {
      en: "Happy Diwali! May the festival of lights brighten your path to your dream home.",
      es: "¡Feliz Diwali!",
      pa: "ਦੀਵਾਲੀ ਦੀਆਂ ਲੱਖ ਲੱਖ ਮੁਬਾਰਕਾਂ! ਰੋਸ਼ਨੀ ਦਾ ਤਿਉਹਾਰ ਤੁਹਾਡੇ ਸੁਪਨਿਆਂ ਦੇ ਘਰ ਦਾ ਰਾਹ ਰੌਸ਼ਨ ਕਰੇ।",
      ar: "ديوالي سعيد!",
      zh: "排灯节快乐！",
      vi: "Chúc Mừng Diwali!",
    },
  },
  {
    month: 11, day: 28,
    name: "Thanksgiving",
    greeting: {
      en: "Happy Thanksgiving! Grateful for the opportunity to help you find your home.",
      es: "¡Feliz Día de Acción de Gracias! Agradecido por la oportunidad de ayudarle.",
      pa: "ਧੰਨਵਾਦ ਦਿਵਸ ਦੀਆਂ ਮੁਬਾਰਕਾਂ!",
      ar: "عيد شكر سعيد!",
      zh: "感恩节快乐！",
      vi: "Chúc Mừng Lễ Tạ Ơn!",
    },
  },
  {
    month: 12, day: 25,
    name: "Christmas / Holiday Season",
    greeting: {
      en: "Merry Christmas and Happy Holidays! Here's to new homes and new memories.",
      es: "¡Feliz Navidad! Aquí hay nuevos hogares y nuevos recuerdos.",
      pa: "ਕ੍ਰਿਸਮਸ ਦੀਆਂ ਮੁਬਾਰਕਾਂ!",
      ar: "عيد ميلاد مجيد!",
      zh: "圣诞快乐！",
      vi: "Chúc Giáng Sinh Vui Vẻ!",
    },
  },
]

export async function GET() {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  // Check if today is a holiday
  const holiday = HOLIDAYS.find(h => h.month === month && h.day === day)

  if (!holiday) {
    return NextResponse.json({ sent: false, reason: 'No holiday today' })
  }

  // In production, fetch leads from Supabase and send emails via Resend
  // For now, log the holiday and return success
  console.log(`[Holiday Greetings] Today is ${holiday.name}! Sending greetings...`)

  // TODO: Integrate with Supabase to fetch leads with language preferences
  // TODO: Send personalized emails via Resend using holiday.greeting[lang]

  /*
  Example implementation:
  const supabase = createClient(...)
  const { data: leads } = await supabase.from('leads').select('email, name, language')

  for (const lead of leads) {
    const lang = lead.language || 'en'
    const greeting = holiday.greeting[lang] || holiday.greeting.en

    await resend.emails.send({
      from: 'Gurpreet Bhatti <leads@gsbrealtor.com>',
      to: lead.email,
      subject: `${holiday.name} Greetings from GSB Realtor`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #C9A84C;">${holiday.name}</h2>
          <p>${greeting}</p>
          <p>— Gurpreet Bhatti, REALTOR® | 801-635-8462</p>
        </div>
      `,
    })
  }
  */

  return NextResponse.json({
    sent: true,
    holiday: holiday.name,
    message: `Holiday greetings would be sent for ${holiday.name}`,
  })
}
