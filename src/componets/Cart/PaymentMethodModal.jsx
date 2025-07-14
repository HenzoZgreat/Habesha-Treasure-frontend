"use client"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"

export default function PaymentMethodModal({ isOpen, onClose }) {
  const language = useSelector((state) => state.habesha.language)
  const navigate = useNavigate()

  const text = {
    EN: {
      selectPaymentMethod: "Select Payment Method",
      proceedToPay: "Proceed to Pay",
      cbeBank: "Bank Transfer",
      telebirr: "Telebirr",
    },
    AMH: {
      selectPaymentMethod: "የክፍያ ዘዴ ይምረጡ",
      proceedToPay: "መክፈል ቀጥል",
      cbeBank: "ባንክ ማስተላለፍ",
      telebirr: "ቴሌብር",
    },
  }

  const t = text[language]

  if (!isOpen) return null

  const paymentMethods = [
    {
      id: "manual",
      name: t.cbeBank,
      description: language === "EN" 
        ? "Pay by bank transfer and upload a screenshot of the payment confirmation. Our team will verify it manually."
        : "በባንክ ማስተላለፍ ይክፈሉ እና የክፍያ ማረጋገጫ ስክሪንሾት ይስቀሉ። ቡድናችን በእጅ ያረጋግጣል።",
      route: "/checkout/manual",
    },
    {
      id: "telebirr",
      name: t.telebirr,
      description: language === "EN" 
        ? "Pay via Telebirr and enter the transaction ID. The system will automatically verify your payment."
        : "በቴሌብር ይክፈሉ እና የግብይት መለያ ያስገቡ። ስርዓቱ ክፍያዎን በራስ-ሰር ያረጋግጣል።",
      route: "/checkout/telebirr",
    },
    {
      id: "chapa",
      name: "Chapa",
      description: language === "EN" 
        ? "Pay securely using Chapa's payment gateway for a seamless transaction."
        : "በቻፓ የክፍያ መግቢያ በአስተማማኝ ሁኔታ ይክፈሉ ለተቀላጠፈ ግብይት።",
      route: "/checkout/chapa",
    },
  ]

  const handleSelectPayment = (route) => {
    navigate(route)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-habesha_blue mb-6 text-center">
          {t.selectPaymentMethod}
        </h2>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-habesha_blue transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800">{method.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
              <button
                onClick={() => handleSelectPayment(method.route)}
                className="mt-3 w-full bg-habesha_blue hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {t.proceedToPay}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}