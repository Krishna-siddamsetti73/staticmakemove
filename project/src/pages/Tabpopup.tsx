import React from 'react';
import { X } from 'lucide-react';

interface TabPopupProps {
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
  children: React.ReactNode;
}

export const TabPopup: React.FC<TabPopupProps> = ({ activeTab, setActiveTab, children }) => {
  if (!activeTab) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
  <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 w-full max-w-4xl relative max-h-[calc(100vh-2.5rem)] overflow-auto my-5">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={() => setActiveTab(null)}
        >
          <X size={24} />
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default TabPopup;
