export async function fetchPosts() {
    const response = await fetch('/api/posts'); // Fetch data from the mock API
    if (!response.ok) {
      throw new Error('Failed to fetch posts'); // Handle errors if the response is not OK
    }
    return response.json(); // Convert and return the response as JSON
  }
  