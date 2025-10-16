import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Forgot Password Data:", form);

        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Reset request failed");

            console.log("✅ Reset link sent:", data);

        } catch (err) {
            console.error("❌ Forgot password error:", err.message);

        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-3xl px-10 py-8 w-full max-w-md flex flex-col gap-6 border border-gray-100"
            >
                <div className="flex flex-col items-center gap-2 mb-2">
                    <FiMail size={36} className="text-purple-600 mb-1" />
                    <h2 className="text-2xl font-bold text-center tracking-tight text-gray-800">Forgot Password</h2>
                    <p className="text-sm text-gray-500 text-center max-w-xs">
                        Enter your email and we’ll send you a password reset link.
                    </p>
                </div>

                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiMail />
                    </span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-700 bg-gray-50 transition"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition text-base tracking-wide flex items-center justify-center gap-2"
                >
                    <FiMail className="inline-block" /> Send Reset Link
                </button>

                <div className="text-sm text-center mt-2">
                    <Link to="/login" className="text-blue-600 hover:underline font-medium flex items-center justify-center gap-1">
                        <FiArrowLeft /> Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
