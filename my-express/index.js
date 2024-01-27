const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'StudentDB'
});

const nameList = new mongoose.Schema({
  SNo: Number,
  RegNo: String,
  StdName: String,
  DOB: String
});

const responseSchema = new mongoose.Schema({
  qid: Number,
  question: String,
  response: String,
});

const studentSchema = new mongoose.Schema({
  stdName: {
    type: String,
    required: true,
  },
  stdId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phNo: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  sem: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  responses: {
    type: [responseSchema],
    required: true,
  },
});


const Student = mongoose.model('Student', studentSchema);
const StudentIDModel = mongoose.model('nameList', nameList);
app.post('/api/studentID', async (req, res) => {
  const studentAuth = req.body;
  console.log(studentAuth);
  const studentID = studentAuth.regNo;
  const studentDOB = studentAuth.dob;
  try {
    const isFound = await StudentIDModel.find({ RegNo: studentID, DOB: studentDOB });
    console.log(isFound);
    if (isFound.length>0) {
      res.json(isFound);
    } else {
      res.json("Wrong password");
    }
  } catch (err) {
    console.error('Error retrieving student data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(studentId);
  try {
    const studentData = await Student.findOne({ stdId: studentId });
    //console.log(studentData);
    if (studentData) {
      res.json(studentData);
    }
    else {
      res.json("Student Not Found");
    }
  } catch (error) {
    console.error('Error retrieving student data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/submit-form', async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    console.log(formData.courseId);
    const newStudent = new Student({
      stdName: formData.stdName,
      stdId: formData.regNo,
      email: formData.email,
      phNo: formData.phNo,
      courseName: formData.courseName,
      courseId: formData.courseId,
      sem: formData.sem,
      year: formData.year,
      responses: formData.responses,
    });
    const duplicateEntry = await Student.countDocuments({ stdId: formData.regNo, courseName: formData.courseName });
    if (duplicateEntry !== 0) {
      res.json("Duplicate Entry");
      console.log(duplicateEntry);
    }
    else {
      console.log(duplicateEntry);
      await newStudent.save();

      console.log('Document successfully inserted');
      res.json({ message: 'Form Successfully Submitted!' });
    }
  } catch (e) {
    console.log('Error Occurred:', e.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/dashboard', async (req, res) => {
  const reqData = req.body;

  try {
    let categoryScale;

    if (reqData.category === "Planning and organization") {
      categoryScale = 1;
    } else if (reqData.category === "Presentation and Communication") {
      categoryScale = 2;
    } else if (reqData.category === "Student participation") {
      categoryScale = 3;
    } else if (reqData.category === "Class Management") {
      categoryScale = 4;
    } else {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const lowerBound = (categoryScale - 1) * 5 + 1;
    const upperBound = categoryScale * 5;

    const aggregationPipeline = [
      { $unwind: "$responses" },
      {
        $match: {
          "courseName": reqData.sub,
          "responses.qid": { $gte: lowerBound, $lte: upperBound }
        }
      },
      {
        $group: {
          _id: null,
          totalScore: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ["$responses.response", "Excellent"] }, then: 5 },
                  { case: { $eq: ["$responses.response", "Very Good"] }, then: 4 },
                  { case: { $eq: ["$responses.response", "Good"] }, then: 3 },
                  { case: { $eq: ["$responses.response", "Fair"] }, then: 2 },
                  { case: { $eq: ["$responses.response", "Satisfactory"] }, then: 1 },
                ],
                default: 0
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalScore: 1
        }
      }
    ];

    const result = await Student.aggregate(aggregationPipeline);
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error('Error in aggregation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/student/:sub', async (req, res) => {
  const subject = req.params.sub;
  console.log(subject);
  try {
    const stdCount = await Student.countDocuments({ courseName: subject });
    console.log(stdCount);
    res.json(stdCount);
  } catch (err) {
    console.log(err);
  }
})

app.get('/student/admin/:std', async(req,res) => {
  const student = req.params.std;
  console.log(student);
  try{
    const resCount = await Student.countDocuments({stdName: student});
    console.log(resCount);
    res.json(resCount);
  }catch(err){
    console.log(err);
  }
})

app.get('/studentList', async(req,res) => {
  const stdList = await StudentIDModel.find();
  console.log(stdList);
  res.json(stdList);
})

app.listen(port, () => {
  console.log(`Express Listening on ${port}`);
});
