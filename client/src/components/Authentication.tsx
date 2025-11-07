import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "register";

const Authentication = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const resetMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        resetMessages();

        if (!email || (mode === "register" && !username) || !password) {
            setError("Kérlek tölts ki minden mezőt.");
            return;
        }

        setLoading(true);

        try {
            const url = mode === "login" ? "http://localhost:5136/api/auth/login" : "http://localhost:5136/api/auth/register";
            const payload: any =
            mode === "login"
            ? { userName: username || email, password }
            : { email, password, userName: username };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
            const msg = typeof data === "string" ? data : data?.message || JSON.stringify(data);
            setError(msg || "Hiba történt a szerver válaszában.");
            } else {
            setSuccess(mode === "login" ? "Sikeres bejelentkezés." : "Sikeres regisztráció.");
            console.log("Data: ", data)
            localStorage.setItem("userName", data.username)
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            }
            } catch (ex: any) {
            setError(ex?.message || "Hálózati hiba");
            } finally {
            setLoading(false);
            if (mode === "register") {
                setTimeout(() => setMode("login"), 2000);
            }
            else
            {
                setTimeout(() => navigate("/main"), 2000);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">{mode === "login" ? "Bejelentkezés" : "Regisztráció"}</h1>
                        <p className="text-sm text-gray-300 mt-1 mb-5">{mode === "login" ? "Add meg a fiók adataidat." : "Hozz létre egy új fiókot."}</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === "register" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Felhasználónév</label>
                                    <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    autoCapitalize="none"
                                    />
                                </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Email / Felhasználónév</label>
                                    <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="email@pelda.hu"
                                    autoCapitalize="none"
                                    />
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Jelszó</label>
                                        <div className="relative">
                                            <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 pr-12 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Legalább 6 karakter"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white cursor-pointer"
                                                >
                                                {showPassword ? "Elrejt" : "Mutat"}
                                            </button>
                                        </div>
                                </div>


                                <div className="flex items-center justify-between">
                                    <label className="flex items-center text-sm text-gray-300 gap-2">
                                        <input type="checkbox" className="h-4 w-4 rounded bg-gray-700 border-gray-600 cursor-pointer" />
                                        <span className="cursor-pointer">Maradjak bejelentkezve</span>
                                    </label>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetMessages();
                                            setMode((m) => (m === "login" ? "register" : "login"));
                                        }}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer"
                                        >
                                        {mode === "login" ? "Nincs fiókod? Regisztrálj" : "Van már fiókod? Bejelentkezés"}
                                    </button>
                                </div>


                                {error && <div className="text-sm text-red-400">{error}</div>}
                                {success && <div className="text-sm text-green-400">{success}</div>}


                                <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 disabled:opacity-60 cursor-pointer"
                                    >
                                    {loading ? "Feldolgozás..." : mode === "login" ? "Bejelentkezés" : "Regisztráció"}
                                </button>
                                </div>
                            </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Authentication