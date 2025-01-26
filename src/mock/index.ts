import { createServer, Response } from 'miragejs';
import data from './data.json';

// Définir un type pour un post (facultatif mais recommandé)
interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  categories: {
    id: string;
    name: string;
  }[];
  publishDate: string;
  summary: string;
}

// Définir un type pour le fichier `data.json` (facultatif mais structuré)
interface Data {
  posts: Post[];
}

createServer({
  routes() {
    this.namespace = 'api';

    // Route to get all posts
    this.get('/posts', () => {
      return data as Data;
    });

    // Route to get a specific post by ID
    this.get('/posts/:id', (schema, request) => {
      const id = request.params.id; // Extract the ID from the URL
      const post = (data as Data).posts.find((post) => post.id === id); // Find the post by ID

      if (post) {
        return post; // Return the post if found
      } else {
        return new Response(404, {}, { error: 'Post not found' }); // Return a 404 error if not found
      }
    });
  },
});
