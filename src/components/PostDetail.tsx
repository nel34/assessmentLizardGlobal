import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/PostDetail.scss';

// Define types for post structure
interface Author {
  name: string;
}

interface Post {
  id: string;
  title: string;
  summary: string;
  publishDate: string;
  author: Author;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Type the parameter as a string
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [post, setPost] = useState<Post | null>(null); // Use a Post type or null
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post details');
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Use err.message for the error message
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="post-detail-container">
      <article>
        <h2 className="post-title">{post?.title}</h2>
        <p className="post-summary">{post?.summary}</p>
        <p className="post-date">
          <strong>Published on: </strong>
          {post?.publishDate && new Date(post.publishDate).toLocaleDateString()}
        </p>
        <p className="author-name">
          <strong>By: </strong>
          {post?.author.name}
        </p>
      </article>
      
      {/* Back to Main Page Button */}
      <button className="back-to-main-button" onClick={() => navigate('/')}>
        Back to Main Page
      </button>
    </div>
  );
};

export default PostDetail;
