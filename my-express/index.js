const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const port = 3500;

app.use(bodyParser.json());
app.use(cors());

if (!process.env.MONGODB_CONNECTION_STRING) {
  console.error('MONGODB_CONNECTION_STRING is not set. Please set it in your environment.');
  process.exit(1);
}

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

const questionschema = new mongoose.Schema({
    qid: Number,
    question: String
})

const responseSchema = new mongoose.Schema({
  qid: Number,
  question: String,
  response: String,
});

const courseListSchema = new mongoose.Schema({
  coursecode: String,
  coursename: String,
  questions: [questionschema]
});

const studentSchema1 = new mongoose.Schema({
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
  sem: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  courselist:{
    type: Object,
    required: true,
  },
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
    type: String,
    required: true,
  },
  responses: {
    type: [responseSchema],
    required: true,
  },
});

const Student1 = mongoose.model('IIIyrstudent',studentSchema1);
const StudentIDModel = mongoose.model('IIIyrnameList', nameList);
const coursesModel = mongoose.model('IIIyrcourselist', courseListSchema);
const responseModel = mongoose.model('IIIyrresponse_feedback',studentSchema);
//forLogin checking
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

//for auto data entry of Students from students collection
app.get('/api/student/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(studentId);
  try {
    const studentData = await Student1.findOne({ stdId: studentId });
    console.log(studentData);
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



//form submission to coursesurvey
app.post('/api/submit-form', async (req, res) => {
  const formData = req.body;
  console.log(formData);

  try {
    console.log(formData.courseId);
    const newStudent = new responseModel({
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
    const duplicateEntry = await responseModel.countDocuments({ stdId: formData.regNo, courseName: formData.courseName });
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

//admin page course list
app.get('/api/admin/courses', async(req,res) => {
    try{
      const data = await coursesModel.find({},{coursename:1,coursecode:1});
      console.log(data);
      res.send(data);
}catch(err){
  console.log(err);
}
})

//admin data
app.post('/api/dashboard', async (req, res) => {
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
          "courseName": reqData.coursecode,
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

    const result = await responseModel.aggregate(aggregationPipeline);
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error('Error in aggregation:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//for proof
app.post('/api/admin/responsedata', async(req,res) => {
  const { studentId, courseCode } = req.body;
  console.log(studentId, courseCode);
    try{
      const data = await responseModel.findOne({stdId: studentId, courseName: courseCode});
      console.log(data);
      res.send(data);
}catch(err){console.log(err);}
})
//for counting no of submissions for each course
app.get('/api/students/:sub', async (req, res) => {
  const subject = req.params.sub;
  console.log(subject);
  try {
    const stdCount = await responseModel.countDocuments({ courseName: subject });
    console.log(stdCount);
    res.json(stdCount);
  } catch (err) {
    console.log(err);
  }
})

//for counting no of courses each student submitted
app.get('/api/student/admin/:std', async(req,res) => {
  const student = req.params.std;
  console.log(student);
  try{
    const resCount = await responseModel.countDocuments({stdId: student});
    console.log(resCount);
    res.json(resCount);
  }catch(err){
    console.log(err);
  }
})
//for getting student list
app.get('/api/studentList', async(req,res) => {
  const stdList = await StudentIDModel.find();
  console.log(stdList);
  res.json(stdList);
})

app.listen(port, () => {
  console.log(`Express Listening on ${port}`);
});
