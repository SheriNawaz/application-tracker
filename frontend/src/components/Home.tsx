import { useNavigate } from "react-router-dom"
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-black text-white tracking-tight">
          Application Tracker
        </h1>
        <h2 className="text-lg text-slate-400 font-light max-w-sm mx-auto leading-relaxed">
          Register or login to start tracking your job applications
        </h2>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={()=>navigate('/register')} className="cursor-pointer px-6 py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200">
            Register
          </button>
          <button onClick={()=>navigate('/login')} className=" cursor-pointer px-6 py-2.5 bg-transparent text-white text-sm font-semibold rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-colors duration-200">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home