import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../utils/api";
import { ItemBox } from "../../components/Common/ItemBox";
import { IssuerObject } from "../../types/data";
import { renderGradientText } from "../../utils/builder.tsx";

export const DashboardHome: React.FC = () => {
  const { t } = useTranslation("Dashboard");
  const navigate = useNavigate();
  const [issuers, setIssuers] = useState<IssuerObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(localStorage.getItem("displayName"));
    fetchIssuers();
  }, []);

  const fetchIssuers = async () => {
    try {
      const apiRequest = api.fetchIssuers;
      console.log('Fetching issuers from:', apiRequest.url());
      const response = await fetch(apiRequest.url(), {
        method: "GET",
        headers: apiRequest.headers(),
        credentials: "include"
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (response.ok) {
        // Ensure responseData is an array
        if (Array.isArray(responseData)) {
          setIssuers(responseData);
        } else if (responseData && typeof responseData === 'object') {
          // If it's an object with data property that is an array
          if (Array.isArray(responseData.data)) {
            setIssuers(responseData.data);
          } else if (responseData.issuers && Array.isArray(responseData.issuers)) {
            // Some APIs return data in an 'issuers' property
            setIssuers(responseData.issuers);
          } else {
            console.error('API response is not in expected format:', responseData);
            setIssuers([]);
          }
        } else {
          console.error('API response is not in expected format:', responseData);
          setIssuers([]);
        }
      } else {
        throw new Error(responseData.errorMessage || 'Failed to fetch issuers');
      }
    } catch (error) {
      console.error("Failed to fetch issuers:", error);
      setIssuers([]);
    } finally {
      setLoading(false);
    }
  };

  // Make sure issuers is an array before filtering
  const filteredIssuers = Array.isArray(issuers)
    ? issuers.filter((issuer) => issuer.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col relative">
      {/* Background gradient accent */}
      <div className="absolute left-[49.63%] right-[23.71%] top-[46.24%] bottom-[-22.27%] bg-gradient-to-r from-[rgba(255,83,0,0.06)] to-[rgba(91,3,173,0.06)] transform -rotate-90 -z-10"></div>
      <div className="text-center pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6">
        <h1 className="text-2xl sm:text-3xl font-medium text-[#04051D]">
          Hi {displayName}!
        </h1>
        <div className="mt-2 sm:mt-4">
          <span className="text-lg sm:text-xl">Access your Verifiable Credentials </span>
          <span className="text-lg sm:text-xl font-medium">{renderGradientText("with ease!")}</span>
        </div>
        <p className="mt-2 text-sm sm:text-base text-[#717171]">
          Securely download and share your credentials instantly.
        </p>
      </div>

      {/* Search Box */}
      <div className="w-full max-w-3xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-[#8E8E8E]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border-0 rounded-lg focus:ring-0 focus:outline-none text-[#838383]"
            placeholder="Search issuer (e.g. Name 1, Name 2, Name 3)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Issuers List */}
      <div className="mt-4 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2 sm:mb-4 text-[#04051D]">List of Issuers</h2>
        <p className="text-center text-gray-500 text-sm sm:text-base mb-4 sm:mb-8 px-4">Search for your documents and choose the document you want to download in next step!</p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-iw-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 px-4 sm:px-6 lg:px-8">
            {filteredIssuers && filteredIssuers.length > 0 ? (
              filteredIssuers.map((issuer, index) => (
                <div key={index}>
                  <ItemBox
                    index={index}
                    url={issuer.display[0]?.logo?.url || ""}
                    title={issuer.display[0]?.name || issuer.name}
                    onClick={() => navigate(`/issuers/${issuer.issuer_id}`)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-10 col-span-full">
                <p className="text-lg text-gray-500">No issuers found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
