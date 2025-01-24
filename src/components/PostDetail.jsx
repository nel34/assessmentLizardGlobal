import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PostDetail.css'; // PostDetail-specific styles

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post details');
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
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
        <h2 className="post-title">{post.title}</h2>
        <p className="post-summary">{post.summary}</p>
        <p className="post-date">
          <strong>Published on: </strong>
          {new Date(post.publishDate).toLocaleDateString()}
        </p>
        <p className="author-name">
          <strong>By: </strong>
          {post.author.name}
        </p>
      </article>
    </div>
  );
}

export default PostDetail;
