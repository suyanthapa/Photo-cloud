import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/Navbar";
import ThreeDotMenu from "../../components/ThreeDotMenu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchImages } from "../../service/images";

interface UploadedData {
  id: number;
  description: string;
  photo: string;
  createdAt: string;
}

const AllPhotos: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // If no page/limit, set default values
    if (!page || !limit) {
      setSearchParams({ page: "1", limit: "10" });
    }
  }, [searchParams, setSearchParams]);

  // read page & limit from URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["images", page, limit],
    queryFn: () => fetchImages(page, limit),
    placeholderData: (prev) => prev,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching photos</p>;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleInsideImage = (id: number) => {
    navigate(`photo/${id}`);
  };

  const uploads: UploadedData[] = data.data;

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Photo Gallery
          </h1>
          <p className="text-gray-600">Browse and manage all your photos</p>
        </div>

        {uploads.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Photos ({data?.totalCount || 0})
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Page {page} of {Math.ceil((data?.totalCount || 0) / limit)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={upload.photo}
                      alt={upload.description || "Uploaded photo"}
                      className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                      onClick={() => handleInsideImage(upload.id)}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ThreeDotMenu uploadedId={upload.id} />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-900 font-medium mb-1 line-clamp-2">
                      {upload.description || "No description"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(upload.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8 px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Page {data.currentPage} of {data.totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(
                    data.currentPage < data.totalPages ? page + 1 : page
                  )
                }
                disabled={page === data.totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start building your collection by uploading your first photo.
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Your First Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPhotos;
