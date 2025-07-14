"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import PaymentService from "../../service/ChapaPaymentService"
import UserSettingsService from "../../service/UserSettingsService"
import PaymentVerification from "../../componets/ChapaPayment/PaymentVerification"
import PaymentSuccess from "../../componets/ChapaPayment/PaymentSuccess"
import PaymentError from "../../componets/ChapaPayment/PaymentError"
import { text } from "../../componets/ChapaPayment/translations"

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const language = useSelector((state) => state.habesha.language)
  const [currentState, setCurrentState] = useState("verify")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [transactionData, setTransactionData] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [settings, setSettings] = useState(null)

  const t = text[language]

  const searchParams = new URLSearchParams(location.search)
  const txRef = searchParams.get("tx_ref")

  const formatAmount = (amount) => {
    const value = parseFloat(amount) || 0
    return value.toLocaleString(language === "AMH" ? "am-ET" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError(t.noToken)
      setCurrentState("error")
      setLoading(false)
      return
    }

    const fetchSettings = async () => {
      try {
        const response = await UserSettingsService.getSettings()
        console.log("Settings response:", response.data)
        setSettings(response.data)
      } catch (err) {
        console.error("Settings fetch error:", err.response?.data || err.message)
        setError(t.settingsFetchFailed || "Failed to fetch settings")
      }
    }

    fetchSettings()

    if (txRef) {
      setCurrentState("verify")
      verifyPayment()
    } else {
      setError(t.noTxRef)
      setCurrentState("error")
      setLoading(false)
    }
  }, [txRef, navigate, t, language])

  const verifyPayment = async () => {
    try {
      console.log("Verifying payment with tx_ref:", txRef)
      const response = await PaymentService.verifyPayment(txRef)
      console.log("Verification response:", response.data)

      const result = response.data

      if (result.message === "Payment verified and order placed." && result.transaction?.data) {
        setTransactionData({
          ...result.transaction.data,
          amount: formatAmount(result.transaction.data.amount),
          charged_amount: formatAmount(result.transaction.data.charged_amount),
        })
        setOrderId(result.orderId)
        setLoading(false)
        const transactionStatus = result.transaction.data.status.toLowerCase()
        if (transactionStatus === "success" || transactionStatus === "completed") {
          console.log("Transitioning to success")
          setCurrentState("success")
        } else if (transactionStatus === "pending") {
          console.log("Staying on pending state")
          setCurrentState("pending")
        } else {
          console.log("Transitioning to error")
          setCurrentState("error")
          setError(t.verificationFailed)
        }
      } else if (result.error || result.status === "error") {
        throw new Error(result.error || result.message || t.verificationFailed)
      } else {
        throw new Error(t.verificationFailed)
      }
    } catch (err) {
      console.error("Payment verification error:", err.response?.data || err.message)
      setError(err.response?.data?.error || err.response?.data?.message || err.message || t.verificationFailed)
      setCurrentState("error")
      setLoading(false)
    }
  }

  const handleTryAgain = () => {
    navigate("/cart")
  }

  const handleContinueShopping = () => {
    navigate("/")
  }

  if (currentState === "verify" || currentState === "pending") {
    return (
      <PaymentVerification
        loading={loading}
        error={error}
        language={language}
      />
    )
  }

  if (currentState === "success") {
    return (
      <PaymentSuccess
        language={language}
        transactionData={transactionData}
        orderId={orderId}
        onContinueShopping={handleContinueShopping}
      />
    )
  }

  if (currentState === "error") {
    return (
      <PaymentError
        language={language}
        transactionData={transactionData}
        error={error}
        onTryAgain={handleTryAgain}
        onContinueShopping={handleContinueShopping}
      />
    )
  }

  return null
}