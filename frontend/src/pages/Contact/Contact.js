import React from "react";
import Navbar from "../../components/navbar/Navbar";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      {/* Navbar stays here - NOT inside the centered container */}
      <Navbar />
      
      {/* This container will be centered */}
      <div className="contact-centered-content">
        <div className="contact-container">
          <div className="contact-header">
            <h1 className="contact-title">Get In Touch</h1>
            <p className="contact-subtitle">
              Have questions? We're here to help! Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email</h3>
                <p>wildcatsfindersupport@gmail.com</p>
                <a href="mailto:wildcatsfindersupport@gmail.com" className="contact-link">
                  Send Email
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Phone</h3>
                <p>+(63) 928-742-5453</p>
                <a href="tel:+63 9287425453" className="contact-link">
                  Call Now
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3>Address</h3>
                <p>CIT-UNIVERSITY</p>
                <p>N. Bacalso Avenue, Cebu City</p>
                <p>Philippines 6000</p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-link"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Your name" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Your email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" placeholder="How can we help?" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    placeholder="Your message here..." 
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3>How do I report a lost item?</h3>
                <p>Login to your account and use the "Report Lost Item" feature with details and photos of the item.</p>
              </div>
              <div className="faq-item">
                <h3>What should I do if I find something?</h3>
                <p>Use the "Report Found Item" feature to post details about what you found.</p>
              </div>
              <div className="faq-item">
                <h3>Is this service free for students?</h3>
                <p>Yes! Wildcats Finder is completely free for all registered university students.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="contact-footer">
          © 2025 Wildcats Finder. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export default Contact;