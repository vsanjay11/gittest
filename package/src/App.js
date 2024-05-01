// App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './Card';
import axios from 'axios';
import AdminPage from './AdminPage';

const API_URL = 'http://localhost:3001/reviews';

function Star({ selected, onClick }) {
  return (
    <span className={selected ? "star selected" : "star"} onClick={onClick}>
      ★
    </span>
  );
}

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [isAdminPage, setIsAdminPage] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(API_URL);
      setSubmittedReviews(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating >= 3) {
      try {
        const newReview = {
          name: name,
          email: email,
          review: review,
          rating: rating
        };
        await axios.post(API_URL, newReview);
        fetchReviews(); // Refresh reviews after adding
      } catch (error) {
        console.error(error);
      }
    }
    setName('');
    setEmail('');
    setReview('');
  };

  const toggleAdminPage = () => {
    setIsAdminPage(!isAdminPage);
  };

  return (
    <div className="container">
      <header>
        <h1>Product Reviews</h1>
      </header>
      <div className='main_section'>
        <main>
          {!isAdminPage ? (
            <section className="form-section">
              <h2>Submit Your Review</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Review:</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating:</label>
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        selected={index < rating}
                        onClick={() => handleStarClick(index)}
                      />
                    ))}
                  </div>
                </div>
                <button type="submit">Submit</button>
              </form>
            </section>
          ) : (
            <AdminPage
              submittedReviews={submittedReviews}
              fetchReviews={fetchReviews}
            />
          )}
          <section className="reviews-section">
            <h2>Submitted Reviews</h2>
            <ul>
              {submittedReviews.map((review) => (
                <li key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="name">Name: {review.name}</span>
                    <span className="email">Email: {review.email}</span>
                    <span className="rating">Rating: {review.rating}</span>
                  </div>
                  <p className="review">Review: {review.review}</p>
                </li>
              ))}
            </ul>
          </section>
        </main>
        <div>
          <Card submittedReviews={submittedReviews} />
        </div>
      </div>
      <footer>
        <p>&copy; 2024 Product Reviews. All rights reserved.</p>
        <button onClick={toggleAdminPage}>
          {isAdminPage ? 'Back to Reviews' : 'Go to Admin Page'}
        </button>
      </footer>
    </div>
  );
}

export default App;
