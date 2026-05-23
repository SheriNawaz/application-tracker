import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.post("/auth/forgot-password", { email })
      setSent(true)
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Forgot password?</h1>
          <p className="text-slate-400 text-sm font-light">
            {sent ? "Check your inbox" : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-4 text-center">
              <p className="text-green-400 text-sm">
                If an account with that email exists, a reset link has been sent. Check your inbox.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer w-full py-3 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-center text-slate-500 text-sm">
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-white font-semibold hover:text-slate-300 transition-colors duration-200"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
