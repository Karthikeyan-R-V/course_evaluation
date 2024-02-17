import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEnvelope, faPhone, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Sem from "./Sem";
import Student from "./Student";
import DropdownPart from "./DropdownPart";
import {url} from './url';


function Main({regNo, setRegNo, dob, setDob, isAuth, setIsAuth, stdName, setStdName}) {
  const [updated, setUpdated] = useState(false);
  const [responses, setResponses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [sem, setSem] = useState('III');
  const [year, setYear] = useState(2);
  const [email, setEmail] = useState("");
  const [phNo, setPhNo] = useState("");
  const [duplicate, setDuplicate] = useState(false);
  const [ret,setRet] = useState(false);

  const courses = {
    'Probability,Statistics and Queuing Theory': '22SPC308',
    'Digital Systems': '22SES306',
    'Discrete Structures': '22SES307',
    'Data Structures': '22SPC301',
    'Foundations of Data Science': '22SPC302',
    'Object Oriented Programming': '22SPC303',
    'Engineering Exploration': '22SES308',
    'Digital Systems Laboratory': '22SES309',
    'Data Structures Laboratory': '22SPC304'
  };

  const faculty = {
    'Probability,Statistics and Queuing Theory': 'Prof.N.Deepa,AP/Maths',
    'Digital Systems': 'Prof.N.Arumugam,AP(Cont)/CSE',
    'Discrete Structures': 'Prof.G.Poovila,AP(Cont)/CSE',
    'Data Structures': 'Dr.R.Muthuram,ASP/CSE',
    'Foundations of Data Science': 'Dr.S.Rathi,Prof/CSE',
    'Object Oriented Programming': 'Prof.L.Sumathi,AP/CSE',
    'Engineering Exploration': 'Prof.Gowri Shankar,AP/CSE,Prof.N.Ramya,AP(Cont)/CSE,Prof.P.Umarani,AP(HBL)/CSE',
    'Digital Systems Laboratory': 'Prof.L.Sumathi,AP/CSE,Prof.N.Arumugam,AP(Cont)/CSE,Prof.P.Umarani,AP(HBL)/CSE,Prof.G.Poovila,AP(Cont)/CSE',
    'Data Structures Laboratory': 'Dr.R.Muthuram,ASP/CSE,Dr.T.Rajasenbagam,AP/CSE,Prof.C.Gayathri,AP(Cont)/CSE,Prof.G.Poovila,AP(Cont)/CSE'
  };

  const questions = [
    {
      qid: 1, question: "Teacher comes to the class in time ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 2 , question: "Teaching is well planned ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 3 , question: "Aim/Objectives made clear ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 4 , question: "Subject matter organised in logical sequence", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 5 , question: "Teacher comes well prepared in the subject  ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 6 , question: "Teacher speaks clearly and audibly ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 7 , question: "Teacher writes and draws legibly ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 8 , question: "Teacher provides examples of concepts/principles.Explanations are clear and effective", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 9 , question: "Teacher's pace and level of instruction are suited to the attainment of students", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 10 , question: "Teacher offers assistance and counselling to the eed students", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 11 , question: "Teacher asks questions to promote interaction and reflective thinking", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 12 , question: "Teacher encourages questioning/raising doubts by students and answers them well", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 13 , question: "Teaches and shares learner activity and problem solving everything in the class ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 14 , question: "Teacher encourages, compliments and praises originally and creativity displayed by the student ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 15 , question: "Teacher is courteous and impartial in dealing with the students", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 16 , question: "Teacher engages classes regularly and maintains discipline ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 17 , question: "Teacher covers the syllabus completely and at appropriate pace ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 18 , question: "Teacher holds test regularly which are helpful to students in building up confidence in the acquisition and application of knowledge", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 19 , question: "Teacher's marking of scripts is fair and impartial ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    },
    {
      qid: 20 , question: "Teacher is prompt in valuing and returning the answer scripts providing feedback on performance ", qoption: ['Excellent', 'Very Good', 'Good', 'Fair', 'Satisfactory', 'Poor']
    }
  ]

  useEffect(() => {
    const storedStudentId = localStorage.getItem("studentId");
    console.log(storedStudentId); 

    if (storedStudentId) {
      const fetchStudentData = async () => {
        try {
          setRegNo(storedStudentId);
          const response = await fetch(`${url}/student/${storedStudentId}`);

          if (response.ok) {
            const studentData = await response.json();
            console.log(studentData);
            if (studentData !== "Student Not Found") {
              setStdName(studentData.stdName);
              setEmail(studentData.email);
              setPhNo(studentData.phNo);
              setRet(true);
              console.log(stdName);
            }
          }
        } catch (error) {
          console.error("Error fetching student data:");
        }
      };

      fetchStudentData();
    } 
  },[]);


  const handleOptionChange = (id, question, selectedOption) => {
    const updatedResponses = [...responses];
    const existingResponseIndex = updatedResponses.findIndex(response => response.qid === id);

    if (existingResponseIndex !== -1) {
      updatedResponses[existingResponseIndex].response = selectedOption;
    } else {
      updatedResponses.push({ qid: id, question, response: selectedOption });
    }

    setResponses(updatedResponses);
    // console.log(updatedResponses);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!courseName || !email || !phNo || responses.length !== questions.length) {
      alert("Please fill out all required fields and answer all questions.");
      return;
    }
    else{
    fetch(`${url}/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stdName,
        regNo,
        email,
        phNo,
        courseName,
        courseId,
        sem,
        year,
        responses,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from server:', data);
        if (data === "Duplicate Entry") {
          setDuplicate(true);
          setUpdated(false);
        }else if(data === "Internal Server Error"){
          alert("course is not selected!");
        }
        else {
          setUpdated(true);
        }
      })
      .catch(error => console.error('Error sending POST request:', error));

    console.log('User responses:', responses);}
  };

  const ReturnBtn = (e) => {
    setDuplicate(false);
    setUpdated(false);
    setCourseName("");
    setResponses([]);
  }

  const handleLogOut = () => {
    localStorage.removeItem('studentId');
    setIsAuth(false);
    localStorage.removeItem('isAuth');
    setRegNo("");
    setDob("");
  }
  return (
    <div>
      <div className="header">
      <h1 className="topic">Evaluation Form</h1>
      <button onClick={handleLogOut} className="logOut">Log Out</button>
      </div>
      {updated ? (
        <div className='submitted'>
          <FontAwesomeIcon icon={faCheckCircle} beatFade size="lg" />
          <div>Form Successfully Submitted</div>
          <button onClick={(e) => ReturnBtn(e)}>Form for another subject</button>
        </div>
      ) : (
        duplicate ? (
          <div className="duplicate">
            <FontAwesomeIcon icon={faThumbsUp} bounce className="thumbsUp" />
            <div>
              {stdName} has already submitted the response for the {courseName}
            </div>
            <button onClick={(e) => {ReturnBtn(e)}}>Back</button>
          </div>) :
          (
            <div>
              <form onSubmit={handleSubmit} className='formcard'>
                <Student stdName={stdName} setStdName={setStdName} regNo={regNo} setRegNo={setRegNo} ret = {ret} setRet={setRet} />
                <div className='form-group'>
                  <label htmlFor='email'>
                    <FontAwesomeIcon icon={faEnvelope} className='fontIcon' />
                    Email:
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    placeholder='Example@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled = {ret}
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='phno'>
                    <FontAwesomeIcon icon={faPhone} className='fontIcon' />
                    Mobile Number:
                  </label>
                  <input
                    type='tel'
                    className='form-control'
                    id='ph-no'
                    placeholder='Mobile Number'
                    value={phNo}
                    onChange={(e) => setPhNo(e.target.value)}
                    required
                    disabled = {ret}
                  />
                </div>

                <div className='semOption'>
                  <Sem sem={sem} setSem={setSem} year={year} setYear={setYear} />
                </div>
                {sem === 'III' && <DropdownPart faculty={faculty}courseName={courseName} setCourseName={setCourseName} courses={courses} setCourseId={setCourseId} />}


                <table className='table table-bordered table-striped'>
                  <thead>
                    <tr>
                      <th>Evaluation Question</th>
                      <th>Excellent</th>
                      <th>Very Good</th>
                      <th>Good</th>
                      <th>Fair</th>
                      <th>Satisfactory</th>
                      <th>Poor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.qid} className={question.qid % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td>{question.question}</td>
                        {question.qoption.map((option) => (
                          <td key={option} id="center">
                            <input
                              type='radio'
                              name={`quest ion_${question.qid}`}
                              value={option}
                              checked={responses.find((response) => response.qid === question.qid)?.response === option}
                              onChange={() => handleOptionChange(question.qid, question.question, option)}
                              required
                            />
                          </td>
                        ))}

                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex">
                <button type='submit' onClick={(e) => {handleSubmit(e)}}>Submit</button>
                </div>
              </form>
              
            </div>
          )
      )}
    </div>
  );
}

export default Main;
