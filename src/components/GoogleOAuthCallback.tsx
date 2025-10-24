// components/GoogleOAuthCallback.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/authcontext";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleOAuthCallback: React.FC = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const error = searchParams.get("error");

        if (error) {
          setError("Google authentication failed");
          return;
        }

        if (token && userParam) {
          // Store the token
          localStorage.setItem("token", token);

          // Redirect to editor
          navigate("/editor", { replace: true });
        } else {
          // No token in URL, check if we're authenticated
          await checkAuth();
          navigate("/editor", { replace: true });
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError("Failed to complete authentication");
      }
    };

    handleCallback();
  }, [searchParams, checkAuth, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
