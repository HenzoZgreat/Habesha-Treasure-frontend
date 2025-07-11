import { Loader2, XCircle, CreditCard } from "lucide-react"
import { text } from "./translations"

export default function PaymentVerification({ loading, error, language }) {
  const t = text[language]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 text-center">
          <h1 className="text-2xl font-semibold flex items-center justify-center gap-2">
            <CreditCard className="h-6 w-6 text-[#1E88E5]" />
            {t.verifyTitle}
          </h1>
        </div>
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-12 w-12 text-[#1E88E5] animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-700">{t.verifying}</p>
              <p className="text-sm text-gray-500 mt-2">{t.processingPayment}</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg font-medium text-gray-700">{t.verificationComplete}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}