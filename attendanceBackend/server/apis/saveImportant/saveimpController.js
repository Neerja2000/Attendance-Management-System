const AdminContent = require('./saveimpModel');

// Add content with multiple files (photo, video, document, etc.)
const addContent = async (req, res) => {
  try {
    const { title ,description,link} = req.body;

    // Collect all uploaded file paths
    const filesArray = req.files.map(file => file.path);

    // Create a new content object
    const newContent = new AdminContent({
      title,
      description,
      link,
      files: filesArray
    });

    // Save to the database
    const savedContent = await newContent.save();
    res.status(201).json({ message: 'Content added successfully', savedContent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding content', error });
  }
};

const getContent = async (req, res) => {
    try {
      // Retrieve all content from the database
      const allContent = await AdminContent.find();
  
      // Normalize file paths and construct URLs
      const contentWithFileUrls = allContent.map(content => {
        return {
          ...content._doc,
          files: content.files.map(file => {
            const filename = file.split('\\').pop().split('/').pop();
            return `http://localhost:3000/projectDocument/${filename}`;
          }),
        };
      });
      
  
      // Respond with the retrieved content
      res.status(200).json({ message: 'Content retrieved successfully', data: contentWithFileUrls });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving content', error });
    }
  };
  
module.exports={addContent,getContent}
