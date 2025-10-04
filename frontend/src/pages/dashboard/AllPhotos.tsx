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
    <div className="layout-container flex h-full grow flex-col">
      <Navbar />

      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-9">Photo Gallery</h1>

        {uploads.length > 0 ? (
          <>
            <h2 className="text-xl font-bold mb-6">Your Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="bg-white rounded-lg shadow-md relative"
                >
                  <img
                    src={upload.photo}
                    alt={upload.description || "Uploaded photo"}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => handleInsideImage(upload.id)}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 mb-1">
                          {upload.description || "No description"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(upload.createdAt)}
                        </p>
                      </div>
                      <ThreeDotMenu uploadedId={upload.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {data.currentPage} of {data.totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(
                    data.currentPage < data.totalPages ? page + 1 : page
                  )
                }
                disabled={page === data.totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPhotos;
