const WorkStatus = require('./workModel');

// Add Work Status
exports.addWorkStatus = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const {  workStatus, startTime, endTime, workTitle,workDescription,difficultyLevel } = req.body;

        if (!employeeId || !workStatus || !startTime || !endTime || !workTitle || !workDescription || !difficultyLevel) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newWork = new WorkStatus({
            employeeId,
            workStatus,
            startTime,
            endTime,
            workTitle,
            workDescription,
            difficultyLevel
        });

        await newWork.save();
        res.status(201).json({ message: 'Work status added successfully', data: newWork });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get Work Status by Employee ID
exports.getWorkStatusByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const workEntries = await WorkStatus.find({ employeeId }).sort({ createdAt: -1 });

        if (!workEntries.length) {
            return res.status(404).json({ message: 'No work entries found for this employee' });
        }

        res.status(200).json({ data: workEntries });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get All Work Status Entries
exports.getAllWorkStatus = async (req, res) => {
    try {
        const workEntries = await WorkStatus.find().populate('employeeId', 'name email');

        res.status(200).json({ data: workEntries });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
