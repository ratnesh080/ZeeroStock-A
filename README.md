# Zeerostock Inventory Search

This is a full-stack search feature that allows buyers to find surplus inventory using multiple filters. It consists of a Node.js/Express backend and a React frontend.

---

## 🔍 Search Logic Explanation

The backend utilizes a **Progressive Filtering** strategy. Instead of complex conditional branching, the logic follows these steps:

1.  **Extraction:** The API extracts `q`, `category`, `minPrice`, and `maxPrice` from the request query string (`req.query`).
2.  **Sequential Refinement:** The full dataset is passed through a chain of filters:
    * **Partial Text Match:** Names are converted to lowercase and checked using `.includes()` for case-insensitive partial matching.
    * **Categorical Filter:** If a category is selected (and isn't "All"), the list is filtered for an exact match.
    * **Price Range:** The logic checks if the item price satisfies $min \le price \le max$.
3.  **Edge Case Handling:** * **Empty Query:** If no filters are provided, the `.filter()` steps are skipped, returning the full dataset.
    * **Invalid Range:** If `minPrice > maxPrice`, the logic naturally results in an empty array `[]`.
    * **UI State:** The frontend checks for `results.length === 0` to display a "No results found" message.

---

## 🚀 Performance Improvement for Large Datasets

In the current version, the server performs a **Linear Scan** $O(n)$ of an in-memory array. With millions of records, this would block the Node.js event loop and lead to high latency.

### The Solution: Database Indexing
I would migrate the data to a relational database like **PostgreSQL** and implement:

* **B-Tree Indexes:** On the `price` and `category` columns. This allows the database to perform range and equality searches in logarithmic time $O(\log n)$ rather than scanning every row.
* **Trigram (GIN) Index:** On the `name` column. This supports fast partial string matching (e.g., `LIKE '%steel%'`) by breaking the text into three-character chunks, allowing the database to jump directly to matches without reading the entire table.

---

## 🛠️ Setup Instructions

1.  **Backend:**
    * Navigate to `/backend`.
    * Run `npm install`.
    * Start with `node server.js` (Server runs on port **5001**).
2.  **Frontend:**
    * Navigate to `/frontend`.
    * Run `npm install`.
    * Start with `npm start` or `npm run dev`.
  




## Zeerostock Inventory Database System

This backend system manages a relational supply chain dataset, allowing for the registration of suppliers and the tracking of their surplus inventory.

---

## 🛠️ Tech Stack
* **Server:** Node.js / Express
* **Database:** MongoDB Atlas (NoSQL)
* **Modeling:** Mongoose

---

## 📊 Database Schema Explanation

The system uses two primary collections with a **Reference-based Relationship**:

### **1. Suppliers Collection**
Stores the source information for goods.
* `name`: String (Required)
* `city`: String (Required)

### **2. Inventory Collection**
Stores individual product data linked to a supplier.
* `supplier_id`: ObjectId (References `Supplier`) — This acts as the link between the two datasets.
* `product_name`: String
* `quantity`: Number (Validated to be $\ge 0$)
* `price`: Number (Validated to be $> 0$)

---

## 🧠 Why I chose NoSQL (MongoDB)

I chose **MongoDB** for this assignment for several strategic reasons:

1.  **Flexible Data Structure:** In surplus inventory, different types of products (e.g., steel pipes vs. electronic sensors) often have varying attributes. MongoDB allows for a flexible schema where we can add specific product details without altering the entire table.
2.  **Scalability:** Zeerostock's potential to grow involves high read volumes as buyers search inventory. MongoDB’s horizontal scaling (sharding) capabilities make it easier to handle large-scale global data than traditional SQL databases.
3.  **Developer Velocity:** Using JSON-like documents (BSON) maps directly to the JavaScript objects used in the Express backend, reducing the "Object-Relational Impedance Mismatch" and making development faster.

---

## 🚀 Optimization & Indexing Suggestion

To ensure the system remains performant as the inventory grows into the millions, I implemented/suggest:

### **Compound Indexing**
While a basic index on `supplier_id` is necessary for joins (`$lookup`), I recommend a **Compound Index** on `category` and `price`:

`inventory.index({ category: 1, price: 1 });`

**Why?**
Most buyer queries are not just looking for a supplier; they are looking for a specific *type* of product within a *price range*. 
* Without this index, MongoDB must perform a "Collection Scan," looking at every document.
* With this index, the database can use an **Index Scan**, jumping directly to the category and then "walking" the price range in order. This reduces query time from seconds to milliseconds on large datasets.

---

## 🌐 Deployment Notes
* **Frontend:** Hosted on Vercel.
* **Backend:** Hosted on Render.
* **Database:** Hosted on MongoDB Atlas.
* **Cross-Origin Resource Sharing (CORS):** Configured to allow secure communication between the Vercel frontend and Render backend.
