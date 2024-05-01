// AdminPage.js

import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = ({ submittedReviews, fetchReviews }) => {
  const [editedReview, setEditedReview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const deleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/reviews/${id}`);
      fetchReviews(); // Refresh reviews after deleting
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id, review) => {
    setIsEditing(true);
    setEditingId(id);
    setEditedReview(review);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:3001/reviews/${id}`, { review: editedReview });
      setIsEditing(false);
      setEditingId(null);
      fetchReviews(); // Refresh reviews after editing
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="admin-section">
      <h2>Admin Panel - Submitted Reviews</h2>
      <ul>
        {submittedReviews.map((review) => (
          <li key={review.id} className="review-item">
            <div className="review-header">
              <span className="name">Name: {review.name}</span> 
              <span className="email">Email: {review.email}</span>
              <span className="rating">Rating: {review.rating}</span>
            </div>
            {isEditing && editingId === review.id ? (
              <div>
                <textarea
                  value={editedReview}
                  onChange={(e) => setEditedReview(e.target.value)}
                />
                <button onClick={() => saveEdit(review.id)}>Save</button>
              </div>
            ) : (
              <p className="review">Review: {review.review}</p>
            )}
            <div>
              <button onClick={() => deleteReview(review.id)}>Delete</button>
              <button onClick={() => handleEdit(review.id, review.review)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminPage;
