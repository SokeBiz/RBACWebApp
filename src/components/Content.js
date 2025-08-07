import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Content({ user }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', is_public: false });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content');
      setContent(response.data.content);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      content: item.content,
      is_public: item.is_public
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/content/${editingId}`, editForm);
      await fetchContent();
      setEditingId(null);
      setEditForm({ title: '', content: '', is_public: false });
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ title: '', content: '', is_public: false });
  };

  const canEdit = (item) => {
    return user.permissions.includes('edit_content') && 
           (user.permissions.includes('view_all_data') || item.author === user.email);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mt-4">
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mt-4">
        <h1>Content</h1>
        <p className="text-gray-600 mb-4">
          {user.permissions.includes('view_all_data') 
            ? 'You can see all content as an admin.' 
            : 'You can see public content and content you have created.'}
        </p>

        {content.length === 0 ? (
          <div className="card">
            <p className="text-center text-gray-600">No content available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {content.map((item) => (
              <div key={item.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      By {item.author} • {item.is_public ? 'Public' : 'Private'}
                    </p>
                  </div>
                  {canEdit(item) && editingId !== item.id && (
                    <button 
                      onClick={() => handleEdit(item)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editingId === item.id ? (
                  <div className="mt-4">
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Content</label>
                      <textarea
                        className="form-input"
                        rows="4"
                        value={editForm.content}
                        onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.is_public}
                          onChange={(e) => setEditForm({...editForm, is_public: e.target.checked})}
                          className="mr-2"
                        />
                        Make public
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="btn btn-primary">
                        Save
                      </button>
                      <button onClick={handleCancel} className="btn btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-gray-700">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Content;
