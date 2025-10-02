import { useEffect, useState } from 'react';

const ALLOWED_IPS = [
  "10.65.11.13",      
  "106.79.198.59"          
];

export default function IPGuard({ children }) {
  const [userIP, setUserIP] = useState('');
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's IP address
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        setUserIP(data.ip);
        setIsAllowed(ALLOWED_IPS.includes(data.ip));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this admin panel.</p>
          <p className="text-sm text-gray-400">IP: {userIP}</p>
        </div>
      </div>
    );
  }

  return children;
}
