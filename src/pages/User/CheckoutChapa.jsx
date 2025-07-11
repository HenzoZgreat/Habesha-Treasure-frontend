"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import UserSettingsService from "../../service/UserSettingsService"
import { ShoppingCart, CreditCard, Truck, AlertCircle, Loader2 } from "lucide-react"

// Bilingual text content
const text = {
  EN: {
    title: "Checkout",
    cartSummary: "Cart Summary",
    quantity: "Qty",
    total: "Total",
    freeShipping: "Free Shipping",
    shippingCost: "Shipping",
    grandTotal: "Grand Total",
    customerInfo: "Customer Information",
    email: "Email Address",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number (Optional)",
    proceedPayment: "Proceed to Payment",
    processing: "Processing...",
    emptyCart: "Your cart is empty",
    continueShopping: "Continue Shopping",
    loginRequired: "Please login to continue",
    errorOccurred: "An error occurred. Please try again.",
    invalidEmail: "Please enter a valid email address",
    requiredField: "This field is required",
  },
  AMH: {
    title: "ክፍያ",
    cartSummary: "የጋሪ ማጠቃለያ",
    quantity: "ብዛት",
    total: "ድምር",
    freeShipping: "ነፃ መላኪያ",
    shippingCost: "የመላኪያ ዋጋ",
    grandTotal: "አጠቃላይ ድምር",
    customerInfo: "የደንበኛ መረጃ",
    email: "ኢሜይል አድራሻ",
    firstName: "ስም",
    lastName: "የአባት ስም",
    phone: "ስልክ ቁጥር (አማራጭ)",
    proceedPayment: "ወደ ክፍያ ይሂዱ",
    processing: "በሂደት ላይ...",
    emptyCart: "የእርስዎ ጋሪ ባዶ ነው",
    continueShopping: "ግዢን ይቀጥሉ",
    loginRequired: "እባክዎ ለመቀጠል ይግቡ",
    errorOccurred: "ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።",
    invalidEmail: "እባክዎ ትክክለኛ ኢሜይል አድራሻ ያስገቡ",
    requiredField: "ይህ መስክ ያስፈልጋል",
  },
}

export default function CheckoutChapa() {
  const navigate = useNavigate()
  const cartProducts = useSelector((state) => state.habesha.cartProducts)
  const [language, setLanguage] = useState("EN")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [exchangeRate, setExchangeRate] = useState(160)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(500)

  const t = text[language]
  const cartItems = Array.isArray(cartProducts) ? cartProducts : []

  useEffect(() => {
    // Fetch settings
    const fetchSettings = async () => {
      try {
        const response = await UserSettingsService.getSettings()
        setExchangeRate(response.data.storeInfo.exchangeRate || 160)
        setFreeShippingThreshold(response.data.shipping.freeShippingThreshold || 500)
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      }
    }
    fetchSettings()

    // Check authentication
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/SignIn")
      return
    }

    // Check if cart is empty
    if (!cartItems.length) {
      navigate("/")
      return
    }

    // Set language from localStorage
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && (savedLanguage === "EN" || savedLanguage === "AMH")) {
      setLanguage(savedLanguage)
    }
  }, [cartItems, navigate])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isFreeShipping = subtotal >= freeShippingThreshold
  const shippingCost = isFreeShipping ? 0 : 50
  const grandTotal = subtotal + shippingCost

  // Convert to ETB for Amharic display
  const displaySubtotal = language === "AMH" ? subtotal * exchangeRate : subtotal
  const displayShippingCost = language === "AMH" ? shippingCost * exchangeRate : shippingCost
  const displayGrandTotal = language === "AMH" ? grandTotal * exchangeRate : grandTotal
  const currency = language === "AMH" ? "ETB" : "USD"

  const validateForm = () => {
    const errors = {}

    if (!formData.email) {
      errors.email = t.requiredField
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t.invalidEmail
    }

    if (!formData.firstName) {
      errors.firstName = t.requiredField
    }

    if (!formData.lastName) {
      errors.lastName = t.requiredField
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        'http://localhost:8080/api/payments/initiate-chapa',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phone || "",
            amount: grandTotal,
          },
        }
      )

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (err) {
      console.error("Payment initiation error:", err)
      setError(err.response?.data?.error || t.errorOccurred)
    } finally {
      setLoading(false)
    }
  }

  if (!cartItems.length) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.title}</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {t.cartSummary}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
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
                        <span className="text-sm text-gray-600">
                          {t.quantity}: {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {currency}{" "}
                          {language === "AMH"
                            ? (item.price * item.quantity * exchangeRate).toFixed(2)
                            : (item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>{t.total}</span>
                    <span>
                      {currency} {displaySubtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {t.shippingCost}
                    </span>
                    <span>
                      {isFreeShipping ? (
                        <span className="text-green-600 font-medium">{t.freeShipping}</span>
                      ) : (
                        `${currency} ${displayShippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>{t.grandTotal}</span>
                    <span className="text-[#1E88E5]">
                      {currency} {displayGrandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t.customerInfo}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.email} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.firstName} *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] ${
                        formErrors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                      aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                    />
                    {formErrors.firstName && (
                      <p id="firstName-error" className="text-red-500 text-sm mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      {t.lastName} *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5] ${
                        formErrors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                      aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                    />
                    {formErrors.lastName && (
                      <p id="lastName-error" className="text-red-500 text-sm mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.phone}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-[#1E88E5]"
                    placeholder="+251 9XX XXX XXX"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1E88E5] hover:bg-[#1976D2] disabled:bg-gray-400 text-white py-3 px-4 rounded-md text-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.processing}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      {t.proceedPayment}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}