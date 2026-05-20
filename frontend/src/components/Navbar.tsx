import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <p className="text-white font-black text-lg tracking-tight">
          Application Tracker
        </p>
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 text-slate-400 text-sm font-medium hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/tracker"
            className="px-4 py-2 text-slate-400 text-sm font-medium hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-800"
          >
            Tracker
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-slate-400 text-sm font-medium hover:text-white transition-colors duration-200 rounded-full hover:bg-slate-800"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200 ml-2"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar