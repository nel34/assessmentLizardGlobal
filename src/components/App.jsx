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
    <div>
      <h1>Posts</h1>
      {/* Display an error message if an error occurs */}
      {error && <p>Error: {error}</p>}

      {/* Category filter */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-filter">Filter by Category: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          <li key={post.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <h2>{post.title}</h2>
            <p><strong>Published on: </strong>{new Date(post.publishDate).toLocaleDateString()}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={post.author.avatar}
                alt={post.author.name}
                style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '10px' }}
              />
              <p>By: {post.author.name}</p>
            </div>
            <p>{post.summary}</p>
            <div>
              <strong>Categories: </strong>
              {post.categories.map(category => (
                <span key={category.id} style={{ marginRight: '5px', background: '#f0f0f0', padding: '5px', borderRadius: '5px' }}>
                  {category.name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
