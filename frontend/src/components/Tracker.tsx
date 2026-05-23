import { useState, useEffect } from "react";
import api from "../api/axios";

type JobApplication = {
  id: number;
  company_name: string;
  job_role: string;
  applied_date: string | null;
  status: string;
  company_website: string | null;
  location: string | null;
};

type StatusValue = "Applied" | "Interview" | "Rejected" | "Offer";

const STATUS_OPTIONS: StatusValue[] = ["Applied", "Interview", "Rejected", "Offer"];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Applied":   return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "Interview": return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    case "Rejected":  return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "Offer":     return "bg-green-500/10 text-green-400 border border-green-500/20";
    default:          return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  }
};

const formatDate = (date: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const Tracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusValue | 'All'>('All');
  const [formData, setFormData] = useState({
    company_name: "",
    job_role: "",
    applied_date: "",
    status: "Applied",
    company_website: "",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<JobApplication[]>('/application')
      .then(res => setApplications(res.data))
      .catch(() => setLoadError('Failed to load applications.'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post<JobApplication>('/application', {
        ...formData,
        applied_date: formData.applied_date || null,
      });
      setApplications([res.data, ...applications]);
      setFormData({ company_name: "", job_role: "", applied_date: "", status: "Applied", company_website: "", location: "" });
    } catch {
      // silently ignore; could add toast here
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await api.put<JobApplication>(`/application/${id}`, { status });
      setApplications(apps => apps.map(a => a.id === id ? res.data : a));
    } catch {
      // silently ignore
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q
      || app.company_name.toLowerCase().includes(q)
      || app.job_role.toLowerCase().includes(q)
      || (app.location ?? '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const deleteApplication = async (id: number) => {
    try {
      await api.delete(`/application/${id}`);
      setApplications(apps => apps.filter(a => a.id !== id));
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 pt-22 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight">Job Tracker</h1>
          <p className="text-slate-400 mt-2 text-lg">Track your applications in one place</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by company, role or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 outline-none focus:border-slate-600 transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            {(['All', ...STATUS_OPTIONS] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`cursor-pointer px-4 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  statusFilter === s
                    ? 'bg-white text-slate-950'
                    : 'border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6">Add New Application</h2>
          <form onSubmit={addApplication} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text" name="company_name" placeholder="Company Name"
              value={formData.company_name} onChange={handleChange} required
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />
            <input
              type="text" name="job_role" placeholder="Job Role"
              value={formData.job_role} onChange={handleChange} required
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />
            <input
              type="date" name="applied_date"
              value={formData.applied_date} onChange={handleChange}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />
            <input
              type="text" name="location" placeholder="Location"
              value={formData.location} onChange={handleChange}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />
            <input
              type="url" name="company_website" placeholder="Company Website"
              value={formData.company_website} onChange={handleChange}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />
            <select
              name="status" value={formData.status} onChange={handleChange}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              type="submit" disabled={submitting}
              className="cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 bg-white text-slate-950 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Application'}
            </button>
          </form>
        </div>

        {loadError && (
          <p className="text-red-400 text-sm text-center mb-6">{loadError}</p>
        )}

        {applications.length === 0 && !loadError ? (
          <p className="text-slate-500 text-center py-16">No applications yet. Add one above!</p>
        ) : filteredApplications.length === 0 ? (
          <p className="text-slate-500 text-center py-16">No applications match your filters.</p>
        ) : (
          <div className="grid gap-5">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-bold">{application.company_name}</h2>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(application.status ?? '')}`}>
                        {application.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-lg">{application.job_role}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      {application.applied_date && <p>Applied: {formatDate(application.applied_date)}</p>}
                      {application.location && <p>{application.location}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={application.status ?? ''}
                      onChange={e => updateStatus(application.id, e.target.value)}
                      className="cursor-pointer bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 outline-none focus:border-slate-500 transition-colors"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    {application.company_website && (
                      <a
                        href={application.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-colors duration-200 text-sm font-semibold"
                      >
                        Visit Company
                      </a>
                    )}

                    <button
                      onClick={() => deleteApplication(application.id)}
                      className="cursor-pointer px-4 py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors duration-200 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;