// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  videos: (videoId: string) => `${API_BASE_URL}/videos/${videoId}`,
  updateVideo: (videoId: string) => `${API_BASE_URL}/videos/${videoId}`,
  comments: (videoId: string) => `${API_BASE_URL}/comments/${videoId}`,
  addComment: (videoId: string) => `${API_BASE_URL}/comments/${videoId}`,
  replyComment: (commentId: string) => `${API_BASE_URL}/comments/${commentId}/reply`,
  deleteComment: (commentId: string) => `${API_BASE_URL}/comments/${commentId}`,
  notes: (videoId: string) => `${API_BASE_URL}/notes/${videoId}`,
  createNote: (videoId: string) => `${API_BASE_URL}/notes/${videoId}`,
  updateNote: (noteId: number) => `${API_BASE_URL}/notes/${noteId}`,
  deleteNote: (noteId: number) => `${API_BASE_URL}/notes/${noteId}`,
  searchNotes: (videoId: string) => `${API_BASE_URL}/notes/${videoId}/search`,
  suggestTitles: `${API_BASE_URL}/ai/suggest-titles`,
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const tokens = localStorage.getItem('youtube_tokens');
  return {
    'Content-Type': 'application/json',
    ...(tokens && { 'Authorization': `Bearer ${tokens}` })
  };
};
