import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPosts } from '../Services/api';
import '../styles/MainPage.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group'; // Import animation components

function MainPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const postsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial filter from query string
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      setPosts(data.posts);
      setFilteredPosts(data.posts);
      setVisiblePosts(data.posts.slice(0, postsPerPage));

      const uniqueCategories = ['All', ...new Set(data.posts.flatMap((post) => post.categories.map((c) => c.name)))];
      setCategories(uniqueCategories);
    };

    getPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.categories.some((category) => category.name === selectedCategory)));
    }
    setCurrentPage(1);
  }, [selectedCategory, posts]);

  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setVisiblePosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentPage, filteredPosts]);

  // Handle category change and update query string
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category }); // Update the query string
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main>
      {/* Filter Section */}
      <section className="filter-section">
        <label htmlFor="category-filter" className="filter-label">
          Filter by Category:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="filter-select"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </section>

      {/* Posts List with Animation */}
      <TransitionGroup component="ul" className="post-list">
        {visiblePosts.map((post) => (
          <CSSTransition key={post.id} timeout={300} classNames="post">
            <li className="post-item">
              <article>
                {/* Post Logo */}
                <img src={post.author.avatar} alt={post.author.name} className="post-logo" />

                <header>
                  <h2 className="post-title">{post.title}</h2>
                </header>

                {/* Categories */}
                <footer className="post-categories">
                  <strong>Categories: </strong>
                  <div className="category-list">
                    {post.categories.map((category) => (
                      <div key={category.id} className="category-item">
                        <span className="category-badge">{category.name}</span>
                        <p className="category-id">
                          <strong>ID: </strong>
                          {category.id}
                        </p>
                      </div>
                    ))}
                  </div>
                </footer>

                {/* Detail Button */}
                <div className="post-actions">
                  <Link to={`/post/${post.id}`} className="detail-button">
                    Detail
                  </Link>
                </div>
              </article>
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>

      {/* Pagination */}
      <nav className="pagination">
        {[...Array(Math.ceil(filteredPosts.length / postsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'pagination-button-active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </nav>
    </main>
  );
}

export default MainPage;
