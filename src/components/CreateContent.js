import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateContent({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_public: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/content', formData);
      setSuccess('Content created successfully!');
      setFormData({ title: '', content: '', is_public: false });
      
      // Redirect to content page after a short delay
      setTimeout(() => {
        navigate('/content');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container">
      <div className="mt-4">
        <h1>Create New Content</h1>
        <p className="text-gray-600 mb-4">
          Create a new article or post. You can make it public or private.
        </p>

        <div className="card create-content-card">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter content title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                name="content"
                className="form-input"
                rows="8"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Enter your content here..."
              />
            </div>

            <div className="form-group">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  className="mr-2"
                />
                Make this content public
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Public content will be visible to all users. Private content will only be visible to you and admins.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Content'}
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/content')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="card mt-4">
          <h3 className="text-lg font-semibold mb-2">Content Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Write clear and descriptive titles</li>
            <li>• Provide valuable and informative content</li>
            <li>• Consider whether your content should be public or private</li>
            <li>• You can edit your content later from the Content page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CreateContent;
