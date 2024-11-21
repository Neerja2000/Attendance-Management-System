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
  
  
  module.exports = {
    addCalender
  };