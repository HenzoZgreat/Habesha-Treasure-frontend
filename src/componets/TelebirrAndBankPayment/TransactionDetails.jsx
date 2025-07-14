import translations from "../../componets/TelebirrAndBankPayment/translations"

export default function TransactionDetails({ transactionData, language, exchangeRate }) {
  if (!transactionData || !transactionData.amount) return null

  const t = translations[language]

  const parseCustomDate = (dateString) => {
    if (!dateString) return null
    // Expected format: DD-MM-YYYY HH:mm:ss (e.g., "13-07-2025 15:36:43")
    const [datePart, timePart] = dateString.split(" ")
    if (!datePart || !timePart) return null
    const [day, month, year] = datePart.split("-").map(Number)
    const [hours, minutes, seconds] = timePart.split(":").map(Number)
    // JavaScript months are 0-based, so subtract 1 from month
    const date = new Date(year, month - 1, day, hours, minutes, seconds)
    return isNaN(date.getTime()) ? null : date
  }

  return (
    <div className="grid gap-3 text-sm">
      <div className="flex justify-between">
        <span className="font-medium">{t.status}:</span>
        <span className={transactionData.status === "Completed" ? "text-green-600" : "text-red-600"}>{transactionData.status}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.payerName}:</span>
        <span>{transactionData.payerName || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.creditedParty}:</span>
        <span>{transactionData.creditedParty || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.amount}:</span>
        <span>{(transactionData.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</span> {/*just use the value of the amount without multipying with exchange rate*/}
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.transactionId}:</span>
        <span className="font-mono">{transactionData.transactionId || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.bankReference}:</span>
        <span className="font-mono">{transactionData.bankReference || "N/A"}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t.date}:</span>
        <span>{transactionData.date ? (parseCustomDate(transactionData.date)?.toLocaleString() || "Invalid Date") : "N/A"}</span>
      </div>
    </div>
  )
}