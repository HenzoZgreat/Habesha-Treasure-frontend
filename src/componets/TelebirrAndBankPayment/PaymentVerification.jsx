"use client"

import { Loader2 } from "lucide-react"
import { useSelector } from "react-redux"
import translations from "../../componets/TelebirrAndBankPayment/translations"

export default function PaymentVerification() {
  const language = useSelector((state) => state.habesha.language)
  const t = translations[language]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-12 w-12 text-[#1E88E5] animate-spin" />
          <h2 className="text-2xl font-bold text-[#1E88E5] mt-4">{t.verifyingPayment}</h2>
          <p className="text-gray-600 mt-2">{t.loading}</p>
        </div>
      </div>
    </div>
  )
}