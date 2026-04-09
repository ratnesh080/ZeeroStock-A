import { useState, useEffect } from 'react';

function App() {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    q: '',
    category: 'All',
    minPrice: '',
    maxPrice: ''
  });

  const categories = ["All", "Hardware", "Electrical", "Safety", "Tools"];

  const fetchInventory = async () => {
    const { q, category, minPrice, maxPrice } = filters;
    // Handle invalid price edge case before fetching
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
        alert("Min price cannot be greater than Max price");
        return;
    }

    const query = new URLSearchParams({ q, category, minPrice, maxPrice }).toString();
    const response = await fetch(`https://zeero-stock-a-gzv8.vercel.app/search?${query}`);
    const data = await response.json();
    setResults(data);
  };

  // Fetch data on initial load and when filters change
  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Zeerostock Inventory</h1>
      
      {/* Search Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          placeholder="Search products..." 
          onChange={(e) => setFilters({...filters, q: e.target.value})}
        />
        
        <select onChange={(e) => setFilters({...filters, category: e.target.value})}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <input 
          type="number" placeholder="Min Price" 
          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
        />
        <input 
          type="number" placeholder="Max Price" 
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
        />
        
        <button onClick={fetchInventory} style={{ cursor: 'pointer' }}>Search</button>
      </div>

      {/* Results Display */}
      {results.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {results.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'gray' }}>
          <h3>No results found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
}

export default App;