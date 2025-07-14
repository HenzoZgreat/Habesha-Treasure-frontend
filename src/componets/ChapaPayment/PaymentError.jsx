"use client"

import { XCircle, RefreshCw, ShoppingBag, AlertTriangle } from "lucide-react"
import { text } from "./translations"
import TransactionDetails from "./TransactionDetails"

export default function PaymentError({ language, transactionData, error, onTryAgain, onContinueShopping }) {
  const t = text[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border-0">
        <div className="text-center p-8 space-y-6">
          {/* Error Icon */}
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4 relative">
              <XCircle className="h-12 w-12 text-red-600" />
              <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse opacity-30"></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-habesha_blue">{t.errorTitle}</h1>
            <p className="text-lg text-red-600 font-medium">{error || t.errorSubtitle}</p>
          </div>

          {/* Transaction Details */}
          {transactionData && (
            <div className="space-y-4">
              <TransactionDetails transactionData={transactionData} language={language} />
            </div>
          )}

          {/* Details */}
          <div className="space-y-4 text-gray-600">
            <p className="text-sm leading-relaxed">{t.errorMessage}</p>

            {/* Common Reasons */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="text-sm font-medium text-orange-800">{t.commonReasons}</p>
              </div>
              <ul className="text-xs text-orange-700 space-y-1 ml-6">
                {t.reasons.map((reason, index) => (
                  <li key={index} className="list-disc">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={onTryAgain}
              className="w-full bg-habesha_blue hover:bg-blue-700 text-white py-3 px-4 rounded-md text-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              {t.tryAgain}
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full bg-habesha_yellow hover:bg-yellow-500 text-habesha_blue py-3 px-4 rounded-md text-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {t.continueShopping}
            </button>
          </div>

          {/* Support Message */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <p className="text-xs text-gray-500">{t.needHelp}</p>
            <p className="text-sm text-gray-500 font-medium">{t.sorryMessage}</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-5 w-12 h-12 bg-red-300 rounded-full opacity-20 animate-bounce delay-500"></div>
    </div>
  )
}