import { createServer } from 'miragejs';

import data from './data.json';

createServer({
  routes() {
    this.namespace = 'api';

    // Route to get all posts
    this.get('/posts', () => {
      return data;
    });

    // Route to get a specific post by ID
    this.get('/posts/:id', (schema, request) => {
      const id = request.params.id; // Extract the ID from the URL
      const post = data.posts.find((post) => post.id === id); // Find the post by ID

      if (post) {
        return post; // Return the post if found
      } else {
        return new Response(404, {}, { error: 'Post not found' }); // Return a 404 error if not found
      }
    });
  },
});
