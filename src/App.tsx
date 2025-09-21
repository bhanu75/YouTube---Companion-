import React, { useState, useEffect } from 'react';
import { 
  Play, 
  MessageSquare, 
  Edit3, 
  Save, 
  Trash2, 
  Plus,
  Eye,
  Calendar,
  User,
  FileText,
  Activity,
  Database
} from 'lucide-react';

// Mock API functions (replace with actual YouTube API calls)
const mockAPI = {
  getVideo: async (videoId) => {
    return {
      id: videoId,
      title: "My Awesome Tutorial Video",
      description: "This is a comprehensive tutorial covering advanced concepts in web development.",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      publishedAt: "2024-03-15T10:30:00Z",
      viewCount: 1547,
      likeCount: 89,
      commentCount: 23,
      duration: "15:42"
    };
  },
  
  updateVideo: async (videoId, updates) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, ...updates };
  },
  
  getComments: async (videoId) => {
    return [
      {
        id: "comment1",
        text: "Great tutorial! Very helpful explanation of the concepts.",
        author: "TechEnthusiast",
        publishedAt: "2024-03-16T14:20:00Z",
        likeCount: 5,
        replies: [
          {
            id: "reply1",
            text: "Thanks! I'm glad you found it useful.",
            author: "YourChannel",
            publishedAt: "2024-03-16T15:30:00Z",
            likeCount: 2
          }
        ]
      },
      {
        id: "comment2",
        text: "Could you make a follow-up video on advanced techniques?",
        author: "CodeLearner",
        publishedAt: "2024-03-17T09:15:00Z",
        likeCount: 3,
        replies: []
      }
    ];
  },
  
  addComment: async (videoId, text) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: `comment_${Date.now()}`,
      text,
      author: "YourChannel",
      publishedAt: new Date().toISOString(),
      likeCount: 0,
      replies: []
    };
  },
  
  deleteComment: async (commentId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

const YouTubeDashboard = () => {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock video ID (in real app, this would come from user selection)
  const videoId = "dQw4w9WgXcQ";

  const logEvent = (action, details) => {
    const event = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      videoId
    };
    setEventLogs(prev => [event, ...prev]);
  };

  useEffect(() => {
    loadVideoData();
  }, []);

  const loadVideoData = async () => {
    try {
      setLoading(true);
      const [videoData, commentsData] = await Promise.all([
        mockAPI.getVideo(videoId),
        mockAPI.getComments(videoId)
      ]);
      
      setVideo(videoData);
      setComments(commentsData);
      setEditedTitle(videoData.title);
      setEditedDescription(videoData.description);
      
      logEvent('LOAD_VIDEO', { title: videoData.title });
    } catch (error) {
      console.error('Error loading video data:', error);
      logEvent('ERROR', { message: 'Failed to load video data' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVideo = async () => {
    try {
      await mockAPI.updateVideo(videoId, {
        title: editedTitle,
        description: editedDescription
      });
      
      setVideo(prev => ({
        ...prev,
        title: editedTitle,
        description: editedDescription
      }));
      
      setEditingVideo(false);
      logEvent('UPDATE_VIDEO', { 
        title: editedTitle, 
        description: editedDescription 
      });
    } catch (error) {
      console.error('Error updating video:', error);
      logEvent('ERROR', { message: 'Failed to update video' });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const comment = await mockAPI.addComment(videoId, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      logEvent('ADD_COMMENT', { text: newComment });
    } catch (error) {
      console.error('Error adding comment:', error);
      logEvent('ERROR', { message: 'Failed to add comment' });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await mockAPI.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      logEvent('DELETE_COMMENT', { commentId });
    } catch (error) {
      console.error('Error deleting comment:', error);
      logEvent('ERROR', { message: 'Failed to delete comment' });
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      text: newNote,
      createdAt: new Date().toISOString()
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote('');
    logEvent('ADD_NOTE', { text: newNote });
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    logEvent('DELETE_NOTE', { noteId });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your YouTube dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Play className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">YouTube Companion</h1>
              <p className="text-sm text-gray-600">Manage your videos with ease</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'comments', label: 'Comments', icon: MessageSquare },
            { id: 'notes', label: 'Notes', icon: FileText },
            { id: 'logs', label: 'Event Logs', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Video Details</h2>
                  <button
                    onClick={() => setEditingVideo(!editingVideo)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>{editingVideo ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>
                
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {editingVideo ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <button
                      onClick={handleUpdateVideo}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {video.description}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      </span>
                      <span>{video.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{video.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Likes</span>
                    <span className="font-medium">{video.likeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comments</span>
                    <span className="font-medium">{video.commentCount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes</span>
                    <span className="font-medium">{notes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events Today</span>
                    <span className="font-medium">
                      {eventLogs.filter(log => 
                        new Date(log.timestamp).toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>
              
              {/* Add Comment */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add a comment</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{comment.author}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {comment.author === 'YourChannel' && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2 ml-11">{comment.text}</p>
                    <p className="text-sm text-gray-500 ml-11">{comment.likeCount} likes</p>
                    
                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-11 mt-4 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3">
                            <User className="h-6 w-6 text-gray-400" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900 text-sm">{reply.author}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(reply.publishedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Video Improvement Notes</h2>
              
              {/* Add Note */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add a new note</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ideas for improving this video..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notes yet. Add your first improvement idea!</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="flex justify-between items-start p-4 bg-yellow-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-gray-800">{note.text}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded ml-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Event Logs Tab */}
        {activeTab === 'logs' && (
          <div className="max-w-4xl">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Event Logs</h2>
              </div>
              
              <div className="space-y-3">
                {eventLogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No events logged yet.</p>
                ) : (
                  eventLogs.map((event) => (
                    <div key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{event.action}</p>
                          <p className="text-sm text-gray-600">
                            {Object.entries(event.details).map(([key, value]) => 
                              `${key}: ${typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}`
                            ).join(', ')}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeDashboard;
