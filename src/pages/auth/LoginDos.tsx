//ANTES
//IMPORTACION DE ESTADOS, SUPABASE Y USENAVIGATE
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  //ESTADOS
  const [mode, setMode] = useState("password"); //ESTADO DEL TIPO DE LOGIN
  const [email, setEmail] = useState(""); //GUARDAR EL EMAIL
  const [password, setPassword] = useState(""); //GUARDAR LA PASSWORD
  const [confirmpassword, setConfirmPassword] = useState(""); //GUARDAR LA PASSWORD
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); //LOADING
  const [isRegister, setIsRegister] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); //MENSAJE

  //LOGIN CON EMAIL
  const handleEmailAuth = async () => {
    setMessage({ text: "", type: "" });
    //CONFIRMAR PASSWORD
    if (password !== confirmpassword) {
      setMessage({ text: "Las contraseñas deben ser iguales", type: "error" });
      return;
    }
    setLoading(true);
    const { error } = isRegister
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage({ text: error.message, type: "error" });
    } else if (isRegister) {
      setMessage({
        text: "Revisa tu correo para confirmar tu cuenta.",
        type: "success",
      });
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  //LOGIN CON MAGIC LINK
  const handleMagicLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setMessage({
      text: error
        ? error.message
        : "¡Listo! Revisa tu correo, te enviamos el link.",
      type: error ? "error" : "success",
    });
    setLoading(false);
  };

  //LOGIN CON GOOGLE
  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setMessage({ text: error.message, type: "error" });
  };

  return (
    <div className="min-h-screen bg-[#080c0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_60%_20%,#120B3C,transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_10%_80%,#120B3C,transparent)] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-[#0f1611]/85 border border-indigo-500/20 rounded-2xl px-9 py-10 backdrop-blur-xl shadow-[0_32px_64px_rgba(0,0,0,0.5),0_0_80px_rgba(16,185,129,0.05)] animate-fadeUp">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-3 py-1 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[11px] text-indigo-300 font-medium tracking-wide">
            {isRegister ? "Crea tu cuenta" : "Bienvenido de vuelta"}
          </span>
        </div>

        <h1 className="font-bold text-2xl text-green-50 mb-1 tracking-tight">
          {isRegister ? "Crear cuenta" : "Inicia sesión"}
        </h1>
        <p className="text-sm text-gray-500 mb-7 font-light">
          Accede a tu cuenta para continuar
        </p>

        {/* Tabs */}
        <div className="flex bg-white/4 rounded-xl p-1 mb-6 gap-1">
          {["password", "magic"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                mode === tab
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              {tab === "password" ? "Contraseña" : "Magic Link"}
            </button>
          ))}
        </div>

        {/* Campos */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] text-gray-400 font-medium tracking-wide mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/4 border border-white/9 rounded-xl px-3.5 py-2.5 text-[13.5px] text-green-50 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          {mode === "password" && (
            <div>
              {/* PASSWORD */}
              <label className="block text-[11px] text-gray-400 font-medium tracking-wide mb-1.5">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/4 border border-white/9 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-green-50 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <label className="block text-[11px] text-gray-400 font-medium tracking-wide mb-1.5 mt-2">
                Confirmar Contraseña
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmpassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/4 border border-white/9 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-green-50 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          )}

          {mode === "magic" && (
            <p className="text-xs text-gray-500 bg-indigo-500/6 border border-indigo-500/10 rounded-xl px-3.5 py-2.5 leading-relaxed">
              Te enviaremos un{" "}
              <span className="text-indigo-400 font-medium">enlace mágico</span>{" "}
              — solo haz click y entras sin contraseña.
            </p>
          )}
        </div>

        {/* Mensaje de feedback */}
        {message.text && (
          <p
            className={`mt-3 text-xs px-3 py-2 rounded-lg ${
              message.type === "error"
                ? "bg-red-500/10 text-red-400 border border-red-500/15"
                : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/15"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Botón principal */}
        <button
          onClick={mode === "magic" ? handleMagicLink : handleEmailAuth}
          disabled={loading}
          className="w-full mt-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all active:scale-[.98] tracking-wide"
        >
          {loading
            ? "Cargando..."
            : mode === "magic"
            ? "Enviar magic link ✦"
            : isRegister
            ? "Crear cuenta"
            : "Entrar"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-xs text-gray-600">o continúa con</span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white/4 hover:bg-white/[0.07] border border-white/10 hover:border-white/16 rounded-xl text-gray-300 text-[13px] transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar con Google
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          {isRegister ? "¿Ya tienes cuenta?" : "¿Sin cuenta?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-400 hover:underline"
          >
            {isRegister ? "Inicia sesión" : "Regístrate gratis"}
          </button>
        </p>
      </div>
    </div>
  );
}
