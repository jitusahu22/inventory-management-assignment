import { useState } from "react";
import { Alert } from "@mui/material";
import api from "../api/api";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary-fixed/10">
      {/* Centered Login Card */}
      <section className="w-full max-w-[440px] mx-4 flex flex-col bg-white rounded-2xl shadow-2xl shadow-primary/10 p-8 md:p-10">
        {/* Brand Identity */}
        <header className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
          </div>
          <div>
            <h1 className="font-headline-md text-on-surface tracking-tight m-0">Inventory Pro</h1>
            <p className="font-label-caps text-outline uppercase tracking-widest text-[10px] m-0">Enterprise Edition</p>
          </div>
        </header>

        {/* Welcome Text */}
        <div className="mb-6">
          <h2 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-xs mt-0">Welcome back</h2>
          <p className="font-body-md text-on-surface-variant m-0">Sign in to manage your operations.</p>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form className="space-y-lg" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="space-y-sm">
            <label className="block font-label-caps text-on-surface-variant ml-1" htmlFor="username">USERNAME OR EMAIL</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
              <input
                className="w-full pl-[48px] pr-md py-md bg-surface-container-low border border-outline-variant/50 rounded-lg font-body-md text-on-surface placeholder:text-outline/60 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all custom-ring"
                id="username"
                name="username"
                placeholder="name@company.com"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-sm">
            <label className="block font-label-caps text-on-surface-variant ml-1" htmlFor="password">PASSWORD</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
              <input
                className="w-full pl-[48px] pr-xl py-md bg-surface-container-low border border-outline-variant/50 rounded-lg font-body-md text-on-surface placeholder:text-outline/60 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all custom-ring"
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3 px-1">
            <input
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
              id="remember"
              name="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="font-body-sm text-on-surface-variant cursor-pointer select-none m-0" htmlFor="remember">Remember this device for 30 days</label>
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-md bg-primary-container text-on-primary font-title-sm rounded-lg shadow-lg shadow-primary-container/20 hover:bg-primary-container/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <footer className="mt-8 text-center">
          <p className="font-body-sm text-outline m-0">
            Don't have an account?
            <a className="text-primary font-semibold hover:underline ml-1" href="#">Contact Sales</a>
          </p>
          <div className="flex items-center justify-center gap-md mt-4 text-[12px] font-label-caps text-outline/60">
            <a className="hover:text-on-surface-variant transition-colors" href="#">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <a className="hover:text-on-surface-variant transition-colors" href="#">Terms of Service</a>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <a className="hover:text-on-surface-variant transition-colors" href="#">Support</a>
          </div>
        </footer>
      </section>
    </main>
  );
};

export default Login;