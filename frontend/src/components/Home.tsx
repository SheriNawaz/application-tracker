import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

type Application = { status: string }

const STATUS_COLORS: Record<string, string> = {
  Applied:   "#3b82f6",
  Interview: "#eab308",
  Offer:     "#22c55e",
  Rejected:  "#ef4444",
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p className="text-slate-400">{payload[0].value} application{payload[0].value !== 1 ? "s" : ""}</p>
      </div>
    )
  }
  return null
}

const Home = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!user) return
    api.get<Application[]>("/application").then(res => {
      const counts: Record<string, number> = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 }
      res.data.forEach(app => {
        if (app.status && counts[app.status] !== undefined) counts[app.status]++
      })
      setTotal(res.data.length)
      setChartData(
        Object.entries(counts)
          .filter(([, v]) => v > 0)
          .map(([name, value]) => ({ name, value }))
      )
    }).catch(() => {})
  }, [user])

  if (loading) return null

  if (!user) {
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
            <button onClick={() => navigate("/register")} className="cursor-pointer px-6 py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200">
              Register
            </button>
            <button onClick={() => navigate("/login")} className="cursor-pointer px-6 py-2.5 bg-transparent text-white text-sm font-semibold rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-colors duration-200">
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">

        <div className="mb-12">
          <p className="text-slate-400 text-lg font-light mb-1">Welcome back,</p>
          <h1 className="text-6xl font-black tracking-tight">{user.username}</h1>
        </div>

        {total === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <p className="text-slate-400 text-lg mb-6">You haven't added any applications yet.</p>
            <button
              onClick={() => navigate("/tracker")}
              className="cursor-pointer px-6 py-2.5 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200"
            >
              Add your first application
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-1">Applications overview</h2>
              <p className="text-slate-400 text-sm mb-6">{total} total application{total !== 1 ? "s" : ""}</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map(entry => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#64748b"} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-4">
              {chartData.map(entry => (
                <div key={entry.name} className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.name] ?? "#64748b" }} />
                    <span className="text-slate-300 font-medium">{entry.name}</span>
                  </div>
                  <span className="text-3xl font-black">{entry.value}</span>
                </div>
              ))}
              <button
                onClick={() => navigate("/tracker")}
                className="cursor-pointer mt-2 w-full py-3 bg-white text-slate-950 text-sm font-semibold rounded-full hover:bg-slate-100 transition-colors duration-200"
              >
                View all applications
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Home