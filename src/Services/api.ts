export interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string; // Path or URL for the author's avatar
  };
  categories: {
    id: string;
    name: string; // Name of the category
  }[];
  summary?: string; // Optional field for post summary
  publishDate?: string; // Optional field for the post's publish date
}

// Represents the structure of the API response for posts
export interface PostsResponse {
  posts: Post[];
}

export async function fetchPosts(): Promise<PostsResponse> {
  const response = await fetch('/api/posts'); // Fetch posts data from the API endpoint
  if (!response.ok) {
    throw new Error('Failed to fetch posts'); // Handle errors if the API call fails
  }
  return response.json(); // Return the response data as JSON
}
