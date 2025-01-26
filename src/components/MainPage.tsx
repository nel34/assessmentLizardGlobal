import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPosts } from '../Services/api';
import '../styles/MainPage.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Define types for the post and category structures
interface Category {
  id: string; // Each category has a unique ID
  name: string; // Name of the category
}

interface Author {
  name: string; // Author's name
  avatar: string; // URL for the author's avatar
}

interface Post {
  id: string; // Unique ID for each post
  title: string; // Title of the post
  author: Author; // Author details
  categories: Category[]; // List of categories for the post
}

// MainPage component
const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // Stores all posts
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // Stores posts based on selected category
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]); // Stores posts visible on the current page
  const [categories, setCategories] = useState<string[]>([]); // Stores list of unique categories
  const postsPerPage = 5; // Number of posts per page
  const [currentPage, setCurrentPage] = useState<number>(1); // Tracks the current page
  const [searchParams, setSearchParams] = useSearchParams(); // Handles query string in the URL

  // Get initial filter from query string
  const initialCategory = searchParams.get('category') || 'All'; // Default to "All" if no category is selected
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory); // Selected category

  // Fetch posts from the API
  useEffect(() => {
    const getPosts = async () => {
      const data: { posts: Post[] } = await fetchPosts(); // Fetch posts from API
      setPosts(data.posts); // Set all posts
      setFilteredPosts(data.posts); // Initialize filtered posts
      setVisiblePosts(data.posts.slice(0, postsPerPage)); // Show the first page of posts

      // Extract unique categories from the posts
      const uniqueCategories = [
        'All',
        ...new Set(
          data.posts.flatMap((post: Post) => post.categories.map((category) => category.name))
        ),
      ];
      setCategories(uniqueCategories);
    };

    getPosts();
  }, []);

  // Filter posts based on the selected category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(posts); // Show all posts if "All" is selected
    } else {
      setFilteredPosts(
        posts.filter((post) =>
          post.categories.some((category) => category.name === selectedCategory)
        )
      );
    }
    setCurrentPage(1); // Reset to the first page after filtering
  }, [selectedCategory, posts]);

  // Update visible posts when the current page changes
  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setVisiblePosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost)); // Display posts for the current page
  }, [currentPage, filteredPosts]);

  // Handle category change and update query string
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); // Update the selected category
    setSearchParams({ category }); // Update the query string in the URL
  };

  // Change the current page
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

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
          {/* Render category options */}
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
            className={`pagination-button ${
              currentPage === index + 1 ? 'pagination-button-active' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}
      </nav>
    </main>
  );
};

export default MainPage;
