import React from "react";

const Loading = () => {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="w-32 h-8 bg-gray-200 rounded shimmer"></div>
              <div className="hidden md:block w-80 h-10 bg-gray-200 rounded-full shimmer"></div>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-24 h-6 bg-gray-200 rounded shimmer mb-4"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded shimmer"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded shimmer"></div>
                    <div className="w-6 h-4 bg-gray-200 rounded-full shimmer ml-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 shimmer"></div>
                  <div className="p-4">
                    <div className="w-full h-4 bg-gray-200 rounded shimmer mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded shimmer mb-3"></div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-16 h-6 bg-gray-200 rounded shimmer"></div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-gray-200 rounded shimmer"></div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full h-10 bg-gray-200 rounded-lg shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;