import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../api/axios"
import PasswordInput from "./PasswordInput"

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await api.post("/auth/reset-password", { token, password })
      setDone(true)
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || "Something went wrong. Your link may have expired.")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-red-400">Invalid reset link.</p>
          <button onClick={() => navigate("/forgot-password")} className="cursor-pointer px-6 py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200">
            Request a new link
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Set new password</h1>
          <p className="text-slate-400 text-sm font-light">
            {done ? "You're all set" : "Choose a strong password"}
          </p>
        </div>

        {done ? (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-4 text-center">
              <p className="text-green-400 text-sm">Password reset successfully.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer w-full py-3 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200"
            >
              Log in
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
                New Password
              </label>
              <PasswordInput value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Confirm Password
              </label>
              <PasswordInput value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
