"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import PaymentVerification from "../../componets/ChapaPayment/PaymentVerification"
import PaymentSuccess from "../../componets/ChapaPayment/PaymentSuccess"
import PaymentError from "../../componets/ChapaPayment/PaymentError"
import { text } from "../../componets/ChapaPayment/translations"
import UserSettingsService from "../../service/UserSettingsService"

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const language = useSelector((state) => state.habesha.language)
  const [currentState, setCurrentState] = useState("verify")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [transactionData, setTransactionData] = useState(null)
  const [settings, setSettings] = useState(null)

  const t = text[language]

  const searchParams = new URLSearchParams(location.search)
  const txRef = searchParams.get("tx_ref")

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
      const token = localStorage.getItem("token")
      console.log("Verifying payment with tx_ref:", txRef, "token:", token)
      const response = await axios.post(
        "http://localhost:8080/api/payments/verify",
        { tx_ref: txRef },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      console.log("Verification response:", response.data)

      const result = response.data

      if (result.status === "success" && result.data) {
        setTransactionData(result.data)
        setLoading(false)
        const transactionStatus = result.data.status.toLowerCase()
        if (transactionStatus === "success" || transactionStatus === "completed") {
          console.log("Transitioning to success")
          setCurrentState("success")
        } else if (transactionStatus === "pending") {
          console.log("Staying on pending state")
          setCurrentState("pending")
        } else {
          console.log("Transitioning to error")
          setCurrentState("error")
        }
      } else {
        throw new Error(result.message || t.verificationFailed)
      }
    } catch (err) {
      console.error("Payment verification error:", err.response?.data || err.message)
      setError(err.response?.data?.message || err.message || t.verificationFailed)
      setCurrentState("error")
      setLoading(false)
    }
  }

  const handleTryAgain = () => {
    navigate("/checkout")
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