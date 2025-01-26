import { createServer, Response } from 'miragejs';
import data from './data.json';

// Type definition for a single post
interface Post {
  id: string;
  title: string;
  author: {
    name: string; // Name of the author
    avatar: string; // URL or path to the author's avatar
  };
  categories: {
    id: string;
    name: string; // Name of the category
  }[];
  publishDate: string; // Date the post was published
  summary: string; // Summary of the post
}

// Type definition for the structure of `data.json`
interface Data {
  posts: Post[]; // Array of posts
}

createServer({
  routes() {
    this.namespace = 'api'; // Prefix for all API routes

    // Route to fetch all posts
    this.get('/posts', () => {
      return data as Data; // Return the data cast to the `Data` type
    });

    // Route to fetch a specific post by ID
    this.get('/posts/:id', (schema, request) => {
      const id = request.params.id; // Extract the ID from the URL
      const post = (data as Data).posts.find((post) => post.id === id); // Find the post matching the ID

      if (post) {
        return post; // Return the post if found
      } else {
        // Return a 404 response if the post is not found
        return new Response(404, {}, { error: 'Post not found' });
      }
    });
  },
});
