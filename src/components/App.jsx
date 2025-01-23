import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../Services/api'; // Import the fetchPosts function

function App() {
  const [posts, setPosts] = useState([]); // All posts from the API
  const [filteredPosts, setFilteredPosts] = useState([]); // Posts to display
  const [categories, setCategories] = useState([]); // Available categories
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category
  const [error, setError] = useState(null); // State to handle errors

  // Fetch posts and categories from the API
  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts(); // Call the API
        setPosts(data.posts); // Store all posts
        setFilteredPosts(data.posts); // Initialize with all posts

        // Extract unique categories from posts
        const uniqueCategories = ['All', ...new Set(data.posts.flatMap(post => post.categories.map(c => c.name)))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message); // Handle any errors
      }
    };

    getPosts();
  }, []);

  // Update filtered posts when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts); // Show all posts if "All" is selected
    } else {
      setFilteredPosts(
        posts.filter(post => post.categories.some(category => category.name === selectedCategory))
      );
    }
  }, [selectedCategory, posts]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'left', marginBottom: '20px' }}>Posts</h1>
      {/* Display an error message if an error occurs */}
      {error && <p>Error: {error}</p>}

      {/* Category filter */}
      <div style={{ marginBottom: '20px' }}>
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
      </div>

      {/* Display filtered posts */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredPosts.map((post) => (
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
            {/* Title */}
            <h2 style={{ marginBottom: '10px' }}>{post.title}</h2>
            <p style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#666' }}>
              <strong>Published on: </strong>
              {new Date(post.publishDate).toLocaleDateString()}
            </p>

            {/* Author */}
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

            {/* Summary */}
            <p style={{ marginBottom: '10px', color: '#444' }}>{post.summary}</p>

            {/* Categories */}
            <div>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
