const Announcement = require('./announcementModel'); // Import Announcement model
const Employee = require("../employee/employeeModel"); // Import Employee model
const Admin = require("../admin/adminModel"); // Import Admin model

// Function to add a new announcement
const addAnnouncement = async (req, res) => {
    try {
        // Check if a file is uploaded
        const mediaFile = req.file ? req.file.filename : null;

        // Create a new announcement
        let total = await Announcement.countDocuments();
        const newAnnouncement = new Announcement({
            announcementId: total + 1,
            title: req.body.title,
            description: req.body.description,
            media: mediaFile // Use the uploaded file's filename
        });

        // Save the announcement to the database
        await newAnnouncement.save();

        // Send success response
        res.status(201).json({
            message: 'Announcement created successfully!',
            announcement: newAnnouncement
        });
    } catch (error) {
        // Handle error
        res.status(500).json({
            message: 'Failed to create announcement.',
            error: error.message
        });
    }
};

// Function to get all announcements
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().populate('comments.user');

        const projectsWithFileUrls = announcements.map(announcement => {
            return {
                ...announcement._doc,
                media: announcement.media ? `http://localhost:3000/projectDocument/${announcement.media}` : null // Construct the URL for the media file directly in media
            };
        });

        res.status(200).json({
            message: 'Announcements retrieved successfully!',
            announcements: projectsWithFileUrls
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve announcements.',
            error: error.message
        });
    }
};


const addLike = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const { userId } = req.body; // UserId comes from request body

        // Find the announcement
        const announcement = await Announcement.findById(announcementId);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Clean the likedBy array (removing any null values, if any)
        announcement.likedBy = announcement.likedBy.filter(id => id !== null);

        // Check if the user has already liked the announcement
        const hasLiked = announcement.likedBy.includes(userId);

        console.log(`Announcement ID: ${announcementId}`);
        console.log(`User ID: ${userId}`);
        console.log(`Current likes count: ${announcement.likes}`);
        console.log(`Current likedBy array: ${announcement.likedBy}`);
        console.log(`User has liked the announcement: ${hasLiked}`);

        if (hasLiked) {
            // User is unliking the announcement
            announcement.likes = Math.max(0, announcement.likes - 1); // Ensure likes don't go below zero
            announcement.likedBy = announcement.likedBy.filter(id => id.toString() !== userId); // Remove user from likedBy
            console.log(`User unliked the announcement.`);
        } else {
            // User is liking the announcement
            announcement.likes += 1; // Increment likes
            announcement.likedBy.push(userId); // Add user to likedBy
            console.log(`User liked the announcement.`);
        }

        console.log(`Updated likedBy array after ${hasLiked ? 'unlike' : 'like'}: ${announcement.likedBy}`);
        console.log(`Final likes count: ${announcement.likes}`);
        console.log(`Final likedBy array: ${announcement.likedBy}`);

        // Save the updated announcement
        await announcement.save();

        res.status(200).json({
            message: hasLiked ? 'Like removed successfully!' : 'Like added successfully!',
            announcement
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({
            message: 'Failed to toggle like.',
            error: error.message
        });
    }
};




const addComment = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const { user, text } = req.body;

        // Fetch the user's data (including the name)
        let userData, userModel;
        if (await Employee.exists({ _id: user })) {
            userData = await Employee.findById(user);
            userModel = 'Employee';
        } else if (await Admin.exists({ _id: user })) {
            userData = await Admin.findById(user);
            userModel = 'Admin';
        }

        if (!userData) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userName = userData.name; // Ensure this is the correct field for the user's name

        const newComment = {
            user,               // User ID
            userModel,          // User model type, either 'Employee' or 'Admin'
            name: userName,     // User's name
            text,
            createdAt: new Date()
        };

        // Update the announcement to add the new comment
        const announcement = await Announcement.findByIdAndUpdate(
            announcementId,
            { $push: { comments: newComment } },
            { new: true }
        );

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({
            message: 'Comment added successfully!',
            announcement
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add comment.',
            error: error.message
        });
    }
};




module.exports = { addAnnouncement, getAnnouncements, addLike, addComment }; // Export all controllers
