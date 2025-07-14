"use client"

import { CheckCircle, ShoppingBag, Sparkles } from "lucide-react"
import { text } from "./translations"
import TransactionDetails from "./TransactionDetails"

export default function PaymentSuccess({ transactionData, language, orderId, onContinueShopping }) {
  const t = text[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Sparkles
              className="h-4 w-4 text-habesha_yellow opacity-70"
              style={{
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-0">
        <div className="text-center p-8 space-y-6">
          {/* Success Icon */}
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 relative">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-habesha_blue">{t.successTitle}</h1>
            <p className="text-lg text-habesha_blue font-medium">{t.successSubtitle}</p>
            {orderId && (
              <p className="text-sm text-gray-600">
                {t.orderId}: <span className="font-semibold">{orderId}</span>
              </p>
            )}
          </div>

          {/* Transaction Details */}
          {transactionData && (
            <div className="space-y-4">
              <TransactionDetails transactionData={transactionData} language={language} />
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={onContinueShopping}
              className="w-full bg-habesha_blue hover:bg-blue-700 text-white py-3 px-4 rounded-md text-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {t.continueShopping}
            </button>
          </div>

          {/* Thank You Message */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">{t.thankYou}</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-habesha_yellow rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-habesha_blue rounded-full opacity-10 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-5 w-12 h-12 bg-green-400 rounded-full opacity-10 animate-bounce delay-500"></div>
    </div>
  )
}