import { useNavigate } from "react-router-dom"

const SignUp = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">Create account</h1>
          <p className="text-slate-400 text-sm font-light">Start tracking your applications</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Name
            </label>
            <input
              type="text"
              placeholder="Jane Smith"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors duration-200"
            />
          </div>

          <button className="w-full py-3 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200 mt-2">
            Create account
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-white font-semibold hover:text-slate-300 transition-colors duration-200"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignUp