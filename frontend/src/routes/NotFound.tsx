import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
        
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-800">
          404 – Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Please check the URL or return to a safe location.
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/operations/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} RENU Enterprise Systems
        </p>
      </div>
    </div>
  );
}
