"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      // Decode the JWT to get user details directly from Google
      const decoded = jwtDecode(credentialResponse.credential);
      
      const userData = {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        avatar: decoded.picture,
      };

      // Send to our backend to login/register and get the role
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        userData,
        { withCredentials: true } // ensure cookies are set
      );

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Dispatch custom event so Navbar can update immediately
        window.dispatchEvent(new Event("authChange"));

        // Redirect based on role
        if (res.data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || "Failed to authenticate with server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-primary/30">
              T
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in securely to continue
            </p>
          </div>
          
          <div className="mt-8 flex flex-col items-center justify-center space-y-4">
            {error && (
              <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                {error}
              </div>
            )}
            
            {isLoading ? (
              <div className="animate-pulse flex items-center gap-2 text-slate-600 font-medium">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </div>
            ) : (
              <div className="w-full flex justify-center py-4">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Login was unsuccessful. Please try again.")}
                  useOneTap
                  theme="filled_blue"
                  shape="rectangular"
                  size="large"
                  text="continue_with"
                />
              </div>
            )}
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
