import { useState } from "react";

type JobApplication = {
  id: number;
  company: string;
  role: string;
  appliedDate: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  companyLink: string;
  location: string;
};

const dummyApplications: JobApplication[] = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer",
    appliedDate: "2026-05-10",
    status: "Interview",
    companyLink: "https://google.com",
    location: "London, UK",
  },
  {
    id: 2,
    company: "Spotify",
    role: "React Developer",
    appliedDate: "2026-05-08",
    status: "Applied",
    companyLink: "https://spotify.com",
    location: "Remote",
  },
  {
    id: 3,
    company: "Netflix",
    role: "Software Engineer",
    appliedDate: "2026-05-02",
    status: "Rejected",
    companyLink: "https://netflix.com",
    location: "Amsterdam, NL",
  },
];

const Tracker = () => {
  const [applications, setApplications] =
    useState<JobApplication[]>(dummyApplications);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    appliedDate: "",
    status: "Applied",
    companyLink: "",
    location: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addApplication = (e: React.FormEvent) => {
    e.preventDefault();

    const newApplication: JobApplication = {
      id: Date.now(),
      company: formData.company,
      role: formData.role,
      appliedDate: formData.appliedDate,
      status: formData.status as JobApplication["status"],
      companyLink: formData.companyLink,
      location: formData.location,
    };

    setApplications([newApplication, ...applications]);

    setFormData({
      company: "",
      role: "",
      appliedDate: "",
      status: "Applied",
      companyLink: "",
      location: "",
    });
  };

  const getStatusStyle = (status: JobApplication["status"]) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Interview":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "Offer":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 pt-22 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight">
            Job Tracker
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Track your applications in one place
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6">
            Add New Application
          </h2>

          <form
            onSubmit={addApplication}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />

            <input
              type="text"
              name="role"
              placeholder="Job Role"
              value={formData.role}
              onChange={handleChange}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />

            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              required
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />

            <input
              type="url"
              name="companyLink"
              placeholder="Company Website"
              value={formData.companyLink}
              onChange={handleChange}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-slate-600 transition-colors"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>

            <button
              type="submit"
              className="cursor-pointer col-span-1 md:col-span-2 lg:col-span-3 bg-white text-slate-950 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors duration-200"
            >
              Add Application
            </button>
          </form>
        </div>

        <div className="grid gap-5">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold">
                      {application.company}
                    </h2>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-lg">
                    {application.role}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <p>Applied: {application.appliedDate}</p>
                    <p>{application.location}</p>
                  </div>
                </div>

                <div>
                  <a
                    href={application.companyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-colors duration-200 text-sm font-semibold"
                  >
                    Visit Company
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracker;