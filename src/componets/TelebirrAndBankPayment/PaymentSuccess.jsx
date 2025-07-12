"use client"

import { CheckCircle, Sparkles } from "lucide-react"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import TransactionDetails from "../../componets/TelebirrAndBankPayment/TransactionDetails"
import translations from "../../componets/TelebirrAndBankPayment/translations"

export default function PaymentSuccess() {
  const language = useSelector((state) => state.habesha.language)
  const t = translations[language]
  const navigate = useNavigate()
  const { state } = useLocation()
  const { transactionData, settings } = state || {}

  const handleContinueShopping = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center p-8">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="text-2xl font-bold text-green-600 mt-4 flex items-center justify-center gap-2">
            {t.paymentSuccess} <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </h2>
        </div>
        <div className="p-6">
          {transactionData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">{t.transactionDetails}</h3>
              <TransactionDetails transactionData={transactionData} language={language} exchangeRate={settings?.storeInfo?.exchangeRate || 160} />
            </div>
          )}
          <button
            onClick={handleContinueShopping}
            className="w-full bg-[#1E88E5] hover:bg-[#1976D2] text-white py-3 px-4 rounded-md text-lg font-medium transition-colors mt-4"
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    </div>
  )
}