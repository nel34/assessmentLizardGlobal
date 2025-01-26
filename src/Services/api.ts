export interface Post {
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
  summary?: string;
  publishDate?: string;
}

// Définition d'un type pour la réponse
export interface PostsResponse {
  posts: Post[];
}

export async function fetchPosts(): Promise<PostsResponse> {
  const response = await fetch('/api/posts'); // Fetch data from the mock API
  if (!response.ok) {
    throw new Error('Failed to fetch posts'); // Handle errors if the response is not OK
  }
  return response.json(); // Convert and return the response as JSON
}

  