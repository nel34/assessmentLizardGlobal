import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../Services/api'; // Import the fetchPosts function
import '../styles/App.css'; // Import the external CSS file

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
    <div className="container">
      {/* Header section */}
      <header className="header">
        <h1>Posts</h1>
      </header>

      {/* Main content */}
      <main>
        {/* Display an error message if an error occurs */}
        {error && <p className="error">Error: {error}</p>}

        {/* Category filter */}
        <section className="filter-section">
          <label htmlFor="category-filter" className="filter-label">
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
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
          <ul className="post-list">
            {visiblePosts.map((post) => (
              <li key={post.id} className="post-item">
                <article>
                  <header>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-date">
                      <strong>Published on: </strong>
                      {new Date(post.publishDate).toLocaleDateString()}
                    </p>
                  </header>

                  <div className="author-section">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="author-image"
                    />
                    <p className="author-name">
                      <strong>By: </strong>
                      {post.author.name}
                    </p>
                  </div>
                  <p className="post-summary">{post.summary}</p>

                  <footer>
                    <strong>Categories: </strong>
                    {post.categories.map((category) => (
                      <div key={category.id} className="category">
                        <span className="category-badge">{category.name}</span>
                        <p className="category-id">
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
        <nav className="pagination" aria-label="Pagination navigation">
          {[...Array(Math.ceil(filteredPosts.length / postsPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-button ${
                currentPage === index + 1 ? 'pagination-button-active' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 LizardGlobal Assessment</p>
      </footer>
    </div>
  );
}

export default App;
