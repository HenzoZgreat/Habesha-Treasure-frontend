"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import UserSettingsService from "../../service/UserSettingsService"
import UserUserService from "../../service/UserUserService"
import PaymentService from "../../service/ChapaPaymentService"
import { ShoppingCart, CreditCard, Truck, AlertCircle, Loader2 } from "lucide-react"
import translations from "../../componets/TelebirrAndBankPayment/translations"

export default function CheckoutTelebirr() {
  const language = useSelector((state) => state.habesha.language)
  const cartProducts = useSelector((state) => state.habesha.cartProducts)
  const t = translations[language]
  const navigate = useNavigate()

  const [settings, setSettings] = useState(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("telebirr")
  const [transactionId, setTransactionId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showTransactionInput, setShowTransactionInput] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError(t.tokenMissing)
        navigate("/SignIn")
        return
      }

      if (!cartProducts.length) {
        navigate("/")
        return
      }

      try {
        const [settingsRes, userProfileRes] = await Promise.all([
          UserSettingsService.getSettings(),
          UserUserService.getUserProfile(),
        ])
        setSettings(settingsRes.data)
        setFormData({
          email: userProfileRes.data.email || "",
          firstName: userProfileRes.data.firstName || "",
          lastName: userProfileRes.data.lastName || "",
          phoneNumber: userProfileRes.data.phoneNumber || "",
        })
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError(`${t.apiError} ${err.response?.data?.message || err.message}`)
      }
    }
    fetchData()
  }, [navigate, t, cartProducts])

  const exchangeRate = settings?.storeInfo?.exchangeRate || 200
  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity * exchangeRate, 0)
  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold || 500
  const shippingCost = subtotal >= freeShippingThreshold * exchangeRate ? 0 : 50 * exchangeRate
  const grandTotal = subtotal + shippingCost
  const displaySubtotal = subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const displayShippingCost = shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const displayGrandTotal = grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const validateForm = () => {
    const errors = {}
    if (!formData.email) errors.email = t.requiredFields
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = t.invalidEmail
    if (!formData.firstName) errors.firstName = t.requiredFields
    if (!formData.lastName) errors.lastName = t.requiredFields
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleProceedToPayment = () => {
    if (!validateForm()) return
    setShowTransactionInput(true)
  }

  const handleVerifyPayment = async () => {
    if (!transactionId) {
      setError(t.invalidTransactionId)
      return
    }
    setLoading(true)
    setError("")
    navigate("/payment/verify-telebirr")
    try {
      const response = await PaymentService.verifyTelebirrPayment(transactionId, grandTotal)
      if (response.data.transaction.status === "Completed") {
        navigate("/payment/success-telebirr", { state: { transactionData: response.data.transaction, settings } })
      } else {
        throw new Error(response.data.error || t.paymentVerificationFailed)
      }
    } catch (err) {
      console.error("Payment verification error:", err)
      navigate("/payment/error-telebirr", {
        state: { error: err.response?.data?.error || err.message || t.paymentVerificationFailed, transactionData: err.response?.data?.transaction, settings },
      })
    } finally {
      setLoading(false)
    }
  }

  if (!cartProducts.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="text-center p-8">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t.emptyCart}</h2>
            <button
              onClick={() => navigate("/")}
              className="bg-[#1E88E5] hover:bg-[#1976D2] text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              {t.continueShopping}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.checkout}</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> {t.paymentSummary}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {cartProducts.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg?height=80&width=80"}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">{t.quantity}: {item.quantity}</span>
                        <span className="font-semibold">
                          ETB {(item.price * item.quantity * exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>{t.subtotal}</span>
                    <span>ETB {displaySubtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" /> {t.shipping}
                    </span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">{t.freeShipping}</span>
                      ) : (
                        `ETB ${displayShippingCost}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>{t.grandTotal}</span>
                    <span className="text-[#1E88E5]">ETB {displayGrandTotal}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> {t.selectPaymentMethod}
              </h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === "telebirr" ? "border-[#1E88E5] bg-blue-50" : "border-gray-300"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="telebirr"
                    checked={selectedPaymentMethod === "telebirr"}
                    onChange={() => setSelectedPaymentMethod("telebirr")}
                    className="hidden"
                  />
                  <img src="/telebirr-logo.png" alt="Telebirr" className="h-10 mb-2" />
                  <span className="font-medium">{t.telebirr}</span>
                  {selectedPaymentMethod === "telebirr" && settings && (
                    <div className="text-sm text-gray-600 mt-2 text-center">
                      <p>{t.accountName}: {settings.payment.telebirrName}</p>
                      <p>{t.phoneNumber}: {settings.payment.telebirrNumber}</p>
                    </div>
                  )}
                </label>
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${selectedPaymentMethod === "cbe" ? "border-[#1E88E5] bg-blue-50" : "border-gray-300"}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cbe"
                    checked={selectedPaymentMethod === "cbe"}
                    onChange={() => setSelectedPaymentMethod("cbe")}
                    className="hidden"
                  />
                  <img src="/cbe-logo.png" alt="CBE" className="h-10 mb-2" />
                  <span className="font-medium">{t.cbeBank}</span>
                  {selectedPaymentMethod === "cbe" && settings && (
                    <div className="text-sm text-gray-600 mt-2 text-center">
                      <p>{t.bankName}: {settings.payment.bankName}</p>
                      <p>{t.accountName}: {settings.payment.accountName}</p>
                      <p>{t.accountNumber}: {settings.payment.accountNumber}</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> {t.customerInformation}
              </h2>
            </div>
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-800">{error}</span>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">{t.firstName} *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] ${formErrors.firstName ? "border-red-500" : "border-gray-300"}`}
                      aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                    />
                    {formErrors.firstName && <p id="firstName-error" className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">{t.lastName} *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] ${formErrors.lastName ? "border-red-500" : "border-gray-300"}`}
                      aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                    />
                    {formErrors.lastName && <p id="lastName-error" className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t.email} *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] ${formErrors.email ? "border-red-500" : "border-gray-300"}`}
                    placeholder="john@example.com"
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">{t.phoneNumber}</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5]"
                    placeholder="+251 9XX XXX XXX"
                  />
                </div>
                {settings && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                      <CreditCard className="h-5 w-5" /> {t.paymentInstructions}
                    </h3>
                    <p>{t.pleasePayTo}</p>
                    <p className="font-medium">{t.accountName}: {selectedPaymentMethod === "telebirr" ? settings.payment.telebirrName : settings.payment.accountName}</p>
                    <p className="font-medium">
                      {selectedPaymentMethod === "telebirr" ? t.phoneNumber : t.accountNumber}: {selectedPaymentMethod === "telebirr" ? settings.payment.telebirrNumber : settings.payment.accountNumber}
                    </p>
                    {selectedPaymentMethod === "cbe" && <p className="font-medium">{t.bankName}: {settings.payment.bankName}</p>}
                    <p className="font-medium">{t.amount}: ETB {displayGrandTotal}</p>
                    <p className="text-sm text-red-600 mt-2">{t.payWithin30Minutes}</p>
                  </div>
                )}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${showTransactionInput ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="mt-4">
                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">{t.enterTransactionId}</label>
                    <input
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5]"
                      placeholder={t.transactionIdPlaceholder}
                    />
                  </div>
                </div>
                <button
                  onClick={showTransactionInput ? handleVerifyPayment : handleProceedToPayment}
                  disabled={loading}
                  className="w-full bg-[#1E88E5] hover:bg-[#1976D2] disabled:bg-gray-400 text-white py-3 px-4 rounded-md text-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t.loading}
                    </>
                  ) : showTransactionInput ? (
                    <>
                      <CreditCard className="h-4 w-4" /> {t.verifyPayment}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" /> {t.proceedToPayment}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}