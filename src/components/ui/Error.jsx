import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RotateCcw" size={16} />
            <span>Try Again</span>
          </button>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <p>If the problem persists, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default Error;