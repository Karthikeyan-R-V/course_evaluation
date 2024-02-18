import React, { useEffect, useState } from "react";
import { Table, Spin } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import { url } from './url';

const Admin = () => {
    const categories = ["Planning and organization", "Presentation and Communication", "Student participation", "Class Management"];

    const [loading, setLoading] = useState(true);
    const [marks, setMarks] = useState({});
    const [no, setNo] = useState({});
    const [courses, setCourses] = useState([]);

    const fetchCourseMark = async (coursecode, category) => {
        try {
            const response = await fetch(`${url}/dashboard`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ coursecode, category }),
            });
            const data = await response.json();

            if (data && data.length > 0) {
                return data[0].totalScore;
            } else {
                return 0;
            }
        } catch (err) {
            console.error(err);
            return 0;
        }
    };

    const fetchStdCount = async (coursecode) => {
        try {
            const response = await fetch(`${url}/students/${coursecode}`);
            const data = await response.json();
            return data; 
        } catch (err) {
            console.error(err);
            return 0;
        }
    };

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const res = await fetch(`${url}/admin/courses`);
                if (!res.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await res.json();
                console.log(data);
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourseData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const marksData = {};
            const stdCountData = {};
            for (const course of courses) {
                stdCountData[course.coursecode] = await fetchStdCount(course.coursecode);
                for (const category of categories) {
                    const key = `${course.coursecode}-${category}`;
                    marksData[key] = await fetchCourseMark(course.coursecode, category);
                }
            }
            console.log(marksData);
            console.log(stdCountData);
            setMarks(marksData);
            setNo(stdCountData);
            setLoading(false);
        };

        fetchData();
    }, [courses]);

    const totRes = (coursecode) => {
        let tot = 0;
        for (const category of categories) {
            const key = `${coursecode}-${category}`;
            tot += marks[key] || 0; // Ensure to handle undefined marks
        }
        return tot;
    };

    const average = (coursecode) => {
        if (!no[coursecode] || isNaN(no[coursecode])) return 0; // Handle cases where no data is available or data is not a number
        return Math.round(totRes(coursecode) / no[coursecode]);
    };

    const columns = [
        {
            title: 'Course Code',
            dataIndex: 'coursecode',
            key: 'coursecode',
        },
        ...categories.map(category => ({
            title: category,
            dataIndex: category,
            key: category,
        })),
        {
            title: 'Total Students',
            dataIndex: 'totalStudents',
            key: 'totalStudents',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Average',
            dataIndex: 'overallAvg',
            key: 'overallAvg',
        },
    ];

    const data = courses.map(course => ({
        key: course.coursecode,
        coursecode: course.coursename, // Assuming the property is courseName, change it accordingly if it's different
        totalStudents: no[course.coursecode],
        total: totRes(course.coursecode),
        overallAvg: average(course.coursecode),
        ...Object.fromEntries(categories.map(category => [category, marks[`${course.coursecode}-${category}`]]))
    }));

    return (
        <>
            <h3>Course Feedback Summary</h3>
            { loading ? (<div id="spin"><Spin size="large" /></div>) :
            (<div>
                <Table dataSource={data} columns={columns} pagination={false}/>
                <div id="footer">
                    <div id="designation">Faculty Advisor</div>
                    <div id="designation">Course Coordinator</div>
                    <div id="designation">Head Of the Department</div>
                </div>
            </div>)}
        </>
    );
};

export default Admin;
