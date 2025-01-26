import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams to extract URL parameters and useNavigate for navigation
import '../styles/PostDetail.scss';

// Define types for post structure
interface Author {
  name: string; // Author's name
}

interface Post {
  id: string; // Unique ID of the post
  title: string; // Title of the post
  summary: string; // Summary of the post
  publishDate: string; // Publish date of the post
  author: Author; // Author details
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the post ID from the URL and type it as a string
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [post, setPost] = useState<Post | null>(null); // State to store the post details or null if not loaded
  const [loading, setLoading] = useState<boolean>(true); // State to indicate loading status
  const [error, setError] = useState<string | null>(null); // State to store any errors

  useEffect(() => {
    // Fetch post details when the component mounts or the ID changes
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`); // Fetch post data using the post ID
        if (!response.ok) throw new Error('Failed to fetch post details'); // Throw an error if the response is not OK
        const data = await response.json(); // Parse the response as JSON
        setPost(data); // Store the post details in state
        setLoading(false); // Set loading to false
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // If the error is an instance of Error, use its message
        } else {
          setError('An unknown error occurred'); // Handle unknown errors
        }
        setLoading(false); // Set loading to false
      }
    };

    fetchPost(); // Call the fetch function
  }, [id]); // Dependency array to trigger the effect when the ID changes

  if (loading) return <p>Loading post...</p>; // Show loading message while fetching
  if (error) return <p className="error">{error}</p>; // Show error message if an error occurs

  return (
    <div className="post-detail-container">
      <article>
        <h2 className="post-title">{post?.title}</h2> {/* Display the post title */}
        <p className="post-summary">{post?.summary}</p> {/* Display the post summary */}
        <p className="post-date">
          <strong>Published on: </strong>
          {post?.publishDate && new Date(post.publishDate).toLocaleDateString()} {/* Format and display the publish date */}
        </p>
        <p className="author-name">
          <strong>By: </strong>
          {post?.author.name} {/* Display the author's name */}
        </p>
      </article>
      
      {/* Button to navigate back to the main page */}
      <button className="back-to-main-button" onClick={() => navigate('/')}>
        Back to Main Page
      </button>
    </div>
  );
};

export default PostDetail;
