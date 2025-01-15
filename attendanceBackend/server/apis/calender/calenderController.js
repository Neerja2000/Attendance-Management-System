const { Error } = require("mongoose");
const calender=require("./calenderModel")
const addCalender = async (req, res) => {
    try {
      let { date, eventTitle, startTime, endTime, employeeIds, status } = req.body;
  
      // Log employeeIds to check what is being sent
      console.log('employeeIds:', employeeIds);
      
  
      // Validate required fields
      if (!date || !eventTitle || !employeeIds) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }
  
      // Parse employeeIds if it's a string
      if (typeof employeeIds === 'string') {
        try {
          console.log('Attempting to parse employeeIds as JSON...');
          employeeIds = JSON.parse(employeeIds);
        } catch (error) {
          return res.status(400).json({ message: 'Invalid JSON format for employeeIds' });
        }
      }
  
      // Ensure employeeIds is an array
      if (!Array.isArray(employeeIds) || employeeIds.some(id => typeof id !== 'string')) {
        return res.status(400).json({ message: 'employeeIds must be an array of strings' });
      }
  
      // Generate a unique calenderId
      const total = await calender.countDocuments();
  
      const newCalender = new calender({
        calenderId: total + 1,
        date,
        eventTitle,
        startTime,
        endTime,
        employeeIds,
        status,
      });
  
      const savedEvent = await newCalender.save();
      return res.status(201).json({ message: 'Event added successfully', event: savedEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  };
  
 
  
  const viewCalendarByDate = async (req, res) => {
    try {
      const { date } = req.query;
  
      // Validate the date parameter
      if (!date) {
        return res.status(400).json({ message: 'Date parameter is required' });
      }
  
      // Fetch events for the specified date
      const events = await calender.find({ date });
  
      // Check if events exist for the date
      if (events.length === 0) {
        return res.status(404).json({ message: 'No events found for the specified date' });
      }
  
      return res.status(200).json({ message: 'Events fetched successfully', events });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  };
  
  const getAllCalendarEvents = (req, res) => {
    // Fetch all events from the database
    calender.find()
      .then(result => {
        res.status(200).json({
          success: true,
          message: "Show all calendar events",
          data: result
        });
      })
      .catch(err => {
        console.error(err); // Log the error for debugging purposes
        res.status(400).json({
          success: false,
          message: "Failed to retrieve calendar events", // Provide a meaningful error message
          error: err.message || "An error occurred" // Return the actual error message
        });
      });
  };
  
  module.exports = {
    addCalender,
    viewCalendarByDate, getAllCalendarEvents
  };
  