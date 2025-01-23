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
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <h2>{post.title}</h2>
            <p>{post.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

