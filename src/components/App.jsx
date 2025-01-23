import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../Services/api'; // Import the fetchPosts function

function App() {
  const [posts, setPosts] = useState([]); // State to store the posts
  const [error, setError] = useState(null); // State to handle errors

  // Fetch posts from the API when the component mounts
  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts(); // Call the API
        setPosts(data.posts); // Update state with the posts data
      } catch (err) {
        setError(err.message); // Handle any errors
      }
    };

    getPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {/* Display an error message if an error occurs */}
      {error && <p>Error: {error}</p>}

      {/* Display posts in a list */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            {/* Title */}
            <h2>{post.title}</h2>
            
            {/* Publish Date */}
            <p>
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
              <p>By: {post.author.name}</p>
            </div>

            {/* Summary */}
            <p>{post.summary}</p>

            {/* Categories */}
            <div>
              <strong>Categories: </strong>
              {post.categories.map((category) => (
                <div key={category.id} style={{ marginBottom: '5px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: '#f0f0f0',
                      padding: '5px 10px',
                      marginRight: '10px',
                      borderRadius: '15px',
                      fontSize: '0.9em',
                    }}
                  >
                    {category.name}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.8em', color: '#555' }}>
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
