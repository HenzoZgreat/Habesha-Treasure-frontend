import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { text } from "./translations"

export default function TransactionDetails({ transactionData, language }) {
  const t = text[language]

  const getStatusColor = (status) => {
    const normalizedStatus = status.toLowerCase()
    if (normalizedStatus === "success" || normalizedStatus === "completed") {
      return "text-green-600"
    } else if (normalizedStatus === "pending") {
      return "text-yellow-600"
    } else {
      return "text-red-600"
    }
  }

  const getStatusIcon = (status) => {
    const normalizedStatus = status.toLowerCase()
    if (normalizedStatus === "success" || normalizedStatus === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (normalizedStatus === "pending") {
      return <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />
    } else {
      return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          {getStatusIcon(transactionData.status)}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.transactionDetails}</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div
          className={`p-4 rounded-lg border-l-4 ${
            transactionData.status?.toLowerCase() === "success" || transactionData.status?.toLowerCase() === "completed"
              ? "bg-green-50 border-green-400"
              : transactionData.status?.toLowerCase() === "pending"
                ? "bg-yellow-50 border-yellow-400"
                : "bg-red-50 border-red-400"
          }`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(transactionData.status)}
            <div>
              <p className="font-semibold text-gray-900">
                {t.status}: <span className={getStatusColor(transactionData.status)}>{transactionData.status}</span>
              </p>
              <p className="text-sm text-gray-600">
                {transactionData.status?.toLowerCase() === "success" ||
                transactionData.status?.toLowerCase() === "completed"
                  ? t.successMessage
                  : transactionData.status?.toLowerCase() === "pending"
                    ? t.pendingMessage
                    : t.errorMessage}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">{t.transactionInfo}</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.amount}:</span>
                <span className="font-semibold text-lg text-gray-900">
                  {transactionData.currency} {Number(transactionData.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.currency}:</span>
                <span className="font-medium text-gray-900">{transactionData.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.method}:</span>
                <span className="font-medium text-gray-900">{transactionData.method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.transactionId}:</span>
                <span className="font-mono text-sm text-gray-900 bg-white px-2 py-1 rounded border">
                  {transactionData.tx_ref}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.reference}:</span>
                <span className="font-mono text-sm text-gray-900 bg-white px-2 py-1 rounded border">
                  {transactionData.reference}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">{t.paymentDetails}</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.customer}:</span>
                <span className="font-medium text-gray-900">
                  {transactionData.first_name} {transactionData.last_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.email}:</span>
                <span className="font-medium text-gray-900 text-sm">{transactionData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.phone}:</span>
                <span className="font-medium text-gray-900">{transactionData.phone_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t.date}:</span>
                <span className="font-medium text-gray-900 text-sm">
                  {new Date(transactionData.created_at).toLocaleDateString()}{" "}
                  {new Date(transactionData.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h5 className="font-medium text-blue-900">{t.secureTransaction}</h5>
              <p className="text-sm text-blue-800 mt-1">{t.secureNotice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}