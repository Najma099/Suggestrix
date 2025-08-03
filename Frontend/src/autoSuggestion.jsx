import { useState, useEffect } from "react";

export default function Autocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [type, setType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const searchQuery = query.trim().toLowerCase(); 
      
      if (!searchQuery) {
        setSuggestions([]);
        setIsLoading(false);
        setHasSearched(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`https://suggestrix.onrender.com/suggestion?word=${searchQuery}`);
        const data = await res.json();
        setType(data.type);
        setSuggestions(data.suggestions);
        setHasSearched(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="ml-3 text-3xl font-bold text-gray-800">Smart Suggest</h1>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Start typing to get suggestions..."
                className="w-full p-4 pl-12 border-0 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm text-gray-700 placeholder-gray-400"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {isLoading && (
                <div className="absolute right-4 top-4">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="mt-6 p-4 text-center">
                <p className="text-gray-500">Searching for suggestions...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="mt-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full uppercase">
                    {type}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{suggestions.length} suggestions</span>
                </div>
                <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {suggestions.map((entry, index) => (
                    <li
                      key={index}
                      className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-150 flex items-center group"
                      onClick={() => setQuery(entry.word)}
                    >
                      <span className="flex-1 font-medium text-gray-800 group-hover:text-blue-600">{entry.word}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </li>
                  ))}
                </ul>
              </div>
            ) : hasSearched && query.trim() ? (
              <div className="mt-6 p-6 text-center bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-700">No suggestions found</h3>
                <p className="mt-1 text-gray-500">We couldn't find any matches for "{query}"</p>
                <p className="mt-2 text-sm text-gray-400">Try a different search term</p>
              </div>
            ) : null}
          </div>
          
          {(suggestions.length > 0 || (hasSearched && query.trim())) && (
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                {suggestions.length > 0 
                  ? "Click on any suggestion to select it" 
                  : "Try searching for something else"}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Powered by Smart Suggest API</p>
        </div>
      </div>
    </div>
  );
}