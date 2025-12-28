import React from 'react';

interface TestProps {
  title?: string;
}

const Test: React.FC<TestProps> = ({ title = 'Test Component' }) => {
  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h2 className="text-lg font-semibold text-blue-900 mb-2">{title}</h2>
      <p className="text-blue-700">Questo è un componente di test.</p>
    </div>
  );
};

export default Test;