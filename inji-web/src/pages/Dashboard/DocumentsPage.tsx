import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { EmptyDocument } from "../../components/Dashboard/EmptyDocument";
import { api } from "../../utils/api";
import { toast } from "react-toastify";
import backgroundImage from "../../assets/Background.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";

export const DocumentsPage: React.FC = () => {
  const { t } = useTranslation("Dashboard");
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const language = useSelector((state: RootState) => state.common.language);

  const fetchWalletCredentials = async () => {
    try {
      const apiRequest = api.fetchWalletVCs;
      const response = await fetch(apiRequest.url(language), {
        method: "GET",
        headers: apiRequest.headers(),
        credentials: "include"
      });

      const responseData = await response.json();
      if (response.ok) {
        setCredentials(responseData);
      } else {
        throw responseData.errorMessage;
      }
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      setError("Failed to load documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredential = async (credentialId: string) => {
    try {
      setDeletingId(credentialId);
      const apiRequest = api.deleteCredential;
      const response = await fetch(apiRequest.url(credentialId), {
        method: "DELETE",
        headers: apiRequest.headers(),
      });

      if (response.ok) {
        // Remove the credential from the state
        setCredentials(credentials.filter(cred => cred.id !== credentialId));
        toast.success("Credential deleted successfully");
      } else if (response.status === 404) {
        toast.error("Credential not found");
      } else {
        throw new Error("Failed to delete credential");
      }
    } catch (err) {
      console.error("Error deleting credential:", err);
      toast.error("Failed to delete credential. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchWalletCredentials();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iw-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!credentials || credentials.length === 0) {
    return <EmptyDocument />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] relative">
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
          <div className="flex items-center">
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 cursor-pointer" onClick={() => navigate("/dashboard/home")}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#000000"/>
              </svg>
              <h1 className="text-xl sm:text-2xl font-semibold">Stored Credentials</h1>
            </div>
            <span className="text-xs sm:text-sm text-[#5B03AD] ml-2 cursor-pointer hover:underline" onClick={() => navigate("/")}>Home</span>
          </div>
          <button
            onClick={() => navigate("/dashboard/home")}
            className="bg-gradient-to-r from-[#FF5300] via-[#C5363C] to-[#5B03AD] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
          >
            Add Credential
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {credentials.map((credential, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow relative"
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleDeleteCredential(credential.id)}
                disabled={deletingId === credential.id}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                {deletingId === credential.id ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            <h3 className="font-medium text-lg mb-2">{credential.name || "Document"}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(credential.issuanceDate).toLocaleDateString()}
            </p>
          </div>
        ))}
        </div>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src={backgroundImage} alt="Background" className="absolute top-0 left-0 w-full h-full object-cover" />
      </div>
      </div>
    </div>
  );
};
