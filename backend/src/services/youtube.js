import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client
});

export const setCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube'
    ]
  });
};

export const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const getVideoDetails = async (videoId) => {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: [videoId]
    });

    if (response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
      viewCount: parseInt(video.statistics.viewCount || 0),
      likeCount: parseInt(video.statistics.likeCount || 0),
      commentCount: parseInt(video.statistics.commentCount || 0),
      duration: video.contentDetails.duration
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

export const updateVideo = async (videoId, title, description) => {
  try {
    const response = await youtube.videos.update({
      part: ['snippet'],
      requestBody: {
        id: videoId,
        snippet: {
          title,
          description,
          categoryId: '22' // People & Blogs - you can make this dynamic
        }
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const getComments = async (videoId) => {
  try {
    const response = await youtube.commentThreads.list({
      part: ['snippet', 'replies'],
      videoId: videoId,
      maxResults: 100
    });

    return response.data.items.map(item => ({
      id: item.id,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
      replies: item.replies ? item.replies.comments.map(reply => ({
        id: reply.id,
        text: reply.snippet.textDisplay,
        author: reply.snippet.authorDisplayName,
        publishedAt: reply.snippet.publishedAt,
        likeCount: reply.snippet.likeCount
      })) : []
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (videoId, text) => {
  try {
    const response = await youtube.commentThreads.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text
            }
          }
        }
      }
    });

    const comment = response.data.snippet.topLevelComment;
    return {
      id: response.data.id,
      text: comment.snippet.textDisplay,
      author: comment.snippet.authorDisplayName,
      publishedAt: comment.snippet.publishedAt,
      likeCount: comment.snippet.likeCount,
      replies: []
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const replyToComment = async (commentId, text) => {
  try {
    const response = await youtube.comments.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          parentId: commentId,
          textOriginal: text
        }
      }
    });

    return {
      id: response.data.id,
      text: response.data.snippet.textDisplay,
      author: response.data.snippet.authorDisplayName,
      publishedAt: response.data.snippet.publishedAt,
      likeCount: response.data.snippet.likeCount
    };
  } catch (error) {
    console.error('Error replying to comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    await youtube.comments.delete({
      id: commentId
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
