const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Course = require('./models/Course');
const Contact = require('./models/Contact');
const Enquiry = require('./models/Enquiry');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));




// --- NEW: Set up the Email Transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // The 16-character App Password
  }
});

// NEW: Helper function to send the email
const sendNotificationEmail = async (subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Rasoi Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sends the email to yourself
      subject: subject,
      text: text
    });
    console.log('📧 Email notification sent successfully!');
  } catch (error) {
    console.error('❌ Email notification failed:', error);
  }
};
  // --- API ROUTES ---

// POST Route: Receive an enquiry and save it to the database
// POST Route: Receive an enquiry and save it to the database
app.post('/api/enquiries', async (req, res) => {
  try {
    // 1. Pull out exactly the fields we expect from the frontend form
    const { name, phone, courseTitle, tier, message } = req.body;
    // 2. Create the new Enquiry using only those specific fields
    const newEnquiry = new Enquiry({ name, phone, courseTitle, tier, message });
    
    await newEnquiry.save();
    console.log(`📩 NEW COURSE ENQUIRY from ${name} for ${courseTitle} (${tier} tier)`);

    sendNotificationEmail(
      `🚨 New Course Enquiry: ${courseTitle}`,
      `You have a new enquiry for Rasoi Cooking Classes!\n\nName: ${name}\nPhone: ${phone}\nCourse: ${courseTitle}\nTier: ${tier}\nMessage: ${message || 'No message provided.'}`
    );

    res.status(201).json({ message: 'Enquiry saved successfully!', data: newEnquiry });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ message: 'Failed to save enquiry.' });
  }
});

// GET Route: Fetch all enquiries so you can view them!
app.get('/api/enquiries', async (req, res) => {
  try {
    // This fetches them all and sorts them by newest first
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enquiries' });
  }
});

// POST Route: Add a new course from the admin dashboard
app.post('/api/courses', async (req, res) => {
  try {
    const courseData = req.body;
    
    // Auto-generate a URL slug from the title (e.g., "New Cake Class" -> "new-cake-class")
    courseData.id = courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCourse = new Course(courseData);
    await newCourse.save();
    
    res.status(201).json({ message: 'Course added successfully!', data: newCourse });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Failed to add course.' });
  }
});

// PUT Route: Update an existing course
app.put('/api/courses/:id', async (req, res) => {
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true } // Return the updated document
    );
    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course updated successfully!', data: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Failed to update course.' });
  }
});

// DELETE Route: Remove a course
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findOneAndDelete({ id: req.params.id });
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully!' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course.' });
  }
});

// GET Route: Fetch all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// GET Route: Get a single course by its ID (slug)
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course details' });
  }
});

// POST Route: Save a contact message
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    console.log(`📩 NEW CONTACT MESSAGE from ${name} (${email})`);

    sendNotificationEmail(
      `✉️ New Contact Message from ${name}`,
      `Someone filled out the contact form on the website.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    );

    res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});