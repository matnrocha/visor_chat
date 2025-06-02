import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <h2 className="mb-2 text-xl font-medium text-gray-800">AI Powered Enterprise Solutions</h2>
      <p className="max-w-md text-gray-600">
        Explore the power of conversational AI for smarter business automation.
      </p>
    </div>
  );
};