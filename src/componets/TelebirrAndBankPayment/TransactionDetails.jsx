import translations from "../../componets/TelebirrAndBankPayment/translations"

export default function TransactionDetails({ transactionData, language, exchangeRate }) {
  if (!transactionData) return null

  const t = translations[language]
  const currency = language === "AMH" ? "ETB" : "USD"

  return (
    <div className="grid gap-3 text-sm">
      <div className="flex justify-between">
        <span className="font-medium">{t.status}:</span>
        <span className={transactionData.status === "Completed" ? "text-green-600" : "text-red-600"}>{transactionData.status}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.payerName}:</span>
        <span>{transactionData.payerName}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.creditedParty}:</span>
        <span>{transactionData.creditedParty}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.amount}:</span>
        <span>{(language === "AMH" ? transactionData.amount * exchangeRate : transactionData.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.transactionId}:</span>
        <span className="font-mono">{transactionData.transactionId}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.bankReference}:</span>
        <span className="font-mono">{transactionData.bankReference}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.date}:</span>
        <span>{new Date(transactionData.date).toLocaleString()}</span>
      </div>
    </div>
  )
}