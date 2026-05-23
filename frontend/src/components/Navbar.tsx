import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate('/')
  }

  const close = () => setMenuOpen(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-white font-black text-lg tracking-tight">Application Tracker</p>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className="cursor-pointer px-4 py-2 text-slate-400 text-sm font-medium hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-800">
            Home
          </Link>
          {user && (
            <Link to="/tracker" className="cursor-pointer px-4 py-2 text-slate-400 text-sm font-medium hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-800">
              Tracker
            </Link>
          )}
          {user ? (
            <>
              <span className="px-4 py-2 text-slate-400 text-sm">
                Hi, <span className="text-white font-semibold">{user.username}</span>
              </span>
              <button onClick={handleLogout} className="cursor-pointer px-5 py-2 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200 ml-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="cursor-pointer px-4 py-2 text-slate-400 text-sm font-medium hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-800">
                Login
              </Link>
              <Link to="/register" className="cursor-pointer px-5 py-2 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200 ml-2">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="cursor-pointer md:hidden text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-3 mx-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
          <Link to="/" onClick={close} className="cursor-pointer px-4 py-2.5 text-slate-400 text-sm font-medium hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            Home
          </Link>
          {user && (
            <Link to="/tracker" onClick={close} className="cursor-pointer px-4 py-2.5 text-slate-400 text-sm font-medium hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
              Tracker
            </Link>
          )}
          {user ? (
            <>
              <p className="px-4 py-2 text-slate-400 text-sm border-t border-slate-800 mt-1 pt-3">
                Hi, <span className="text-white font-semibold">{user.username}</span>
              </p>
              <button onClick={handleLogout} className="cursor-pointer mt-1 w-full py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close} className="cursor-pointer px-4 py-2.5 text-slate-400 text-sm font-medium hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={close} className="cursor-pointer mt-1 block text-center py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
