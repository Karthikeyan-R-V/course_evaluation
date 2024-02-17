import React, { useState, useEffect } from 'react';
import { url } from './url';
import { Table, Input, Select, Button, notification } from 'antd';
import './Admin.css';

const { Option } = Select;

const Admin2 = () => {
    const [studentId, setStudentId] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [response, setResponse] = useState([]);
    const [courses, setCourses] = useState([]);
    const [stdName,setStdName] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${url}/admin/courses`);
                if (!res.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await res.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = { studentId, courseCode };
            const res = await fetch(`${url}/admin/responsedata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                throw new Error('Failed to fetch response');
            }
            const data = await res.json();
            setStdName(data.stdName);
            setResponse(data.responses);
        } catch (error) {
            console.error('Error fetching response:', error);
            setResponse([]);
            notification.info({
                message: 'No response Found',
                description: `No response found with student ID ${studentId}`,
            });
            setStudentId("");
            setStdName("");
        }
    };

    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Response',
            dataIndex: 'response',
            key: 'response',
        },
    ];

    return (
        <div>
            <h1>Student Response</h1>
            <form onSubmit={handleSubmit} id='admin-form'>
                <label htmlFor="studentId">Student ID:</label>
                <Input
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <label htmlFor="courseCode">Select Course:</label>
                <Select
                    className="courseCode"
                    value={courseCode}
                    onChange={(value) => setCourseCode(value)}
                >
                    <Option value="">Select Course</Option>
                    {courses.map(course => (
                        <Option key={course.coursecode} value={course.coursecode} id="courseOption">{course.coursename}</Option>
                    ))}
                </Select>
                <Button type="primary" htmlType="submit">Submit</Button>
            </form>
            {response.length > 0 && (
                <div id='responses'>
                    <div id='stdData'>
                      <p><span id='stdData__span'>Student Name :</span> {stdName}</p>
                      <p><span id='stdData__span'>Register Number :</span> {studentId}</p>
                    </div>
                    <Table dataSource={response} columns={columns}  pagination={false} />
                </div>
            )}
        </div>
    );
};

export default Admin2;
