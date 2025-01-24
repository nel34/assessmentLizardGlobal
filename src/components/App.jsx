import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../Services/api'; // Import the fetchPosts function

function App() {
  const [posts, setPosts] = useState([]); // All posts from the API
  const [filteredPosts, setFilteredPosts] = useState([]); // Posts to display after filtering
  const [visiblePosts, setVisiblePosts] = useState([]); // Posts currently visible
  const [categories, setCategories] = useState([]); // Available categories
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category
  const [error, setError] = useState(null); // State to handle errors
  const postsPerPage = 5; // Number of posts per page
  const [currentPage, setCurrentPage] = useState(1); // Current page

  // Fetch posts and categories from the API
  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts(); // Call the API
        setPosts(data.posts); // Store all posts
        setFilteredPosts(data.posts); // Initialize with all posts
        setVisiblePosts(data.posts.slice(0, postsPerPage)); // Show initial posts

        // Extract unique categories from posts
        const uniqueCategories = ['All', ...new Set(data.posts.flatMap(post => post.categories.map(c => c.name)))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message); // Handle any errors
      }
    };

    getPosts();
  }, []);

  // Update filtered posts when the selectedCategory changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts); // Show all posts if "All" is selected
    } else {
      setFilteredPosts(
        posts.filter(post => post.categories.some(category => category.name === selectedCategory))
      );
    }
    setCurrentPage(1); // Reset to the first page when category changes
  }, [selectedCategory, posts]);

  // Update visible posts when the current page or filtered posts change
  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setVisiblePosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentPage, filteredPosts]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header section */}
      <header style={{ textAlign: 'left', marginBottom: '20px' }}>
        <h1>Posts</h1>
      </header>

      {/* Main content */}
      <main>
        {/* Display an error message if an error occurs */}
        {error && <p>Error: {error}</p>}

        {/* Category filter */}
        <section style={{ marginBottom: '20px' }}>
          <label htmlFor="category-filter" style={{ fontWeight: 'bold', marginRight: '10px' }}>
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '1rem',
            }}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </section>

        {/* Posts list */}
        <section aria-label="Posts list">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {visiblePosts.map((post) => (
              <li
                key={post.id}
                style={{
                  marginBottom: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '15px',
                  background: '#f9f9f9',
                }}
              >
                <article>
                  <header>
                    <h2 style={{ marginBottom: '10px' }}>{post.title}</h2>
                    <p style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Published on: </strong>
                      {new Date(post.publishDate).toLocaleDateString()}
                    </p>
                  </header>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '10px' }}
                    />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
                      <strong>By: </strong>
                      {post.author.name}
                    </p>
                  </div>
                  <p style={{ marginBottom: '10px', color: '#444' }}>{post.summary}</p>

                  <footer>
                    <strong>Categories: </strong>
                    {post.categories.map((category) => (
                      <div key={category.id} style={{ marginBottom: '5px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#e0e0e0',
                            padding: '5px 10px',
                            marginRight: '10px',
                            borderRadius: '15px',
                            fontSize: '0.9em',
                            color: '#333',
                          }}
                        >
                          {category.name}
                        </span>
                        <p style={{ margin: 0, fontSize: '0.8em', color: '#777' }}>
                          <strong>ID: </strong>{category.id}
                        </p>
                      </div>
                    ))}
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* Pagination controls */}
        <nav style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} aria-label="Pagination navigation">
          {[...Array(Math.ceil(filteredPosts.length / postsPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              style={{
                padding: '10px 15px',
                margin: '0 5px',
                border: '1px solid #ccc',
                background: currentPage === index + 1 ? '#007bff' : '#f9f9f9',
                color: currentPage === index + 1 ? '#fff' : '#333',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        <p>&copy; 2025 LizardGlobal Assessment</p>
      </footer>
    </div>
  );
}

export default App;
