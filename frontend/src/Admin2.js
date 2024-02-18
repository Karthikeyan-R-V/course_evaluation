import React, { useEffect, useState } from "react";
import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { url } from './url';
import { Table, Spin } from 'antd';

const Admin2 = () => {
    const [std, setStd] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stdListResponse = await fetch(`${url}/studentList`);
                const stdList = await stdListResponse.json();
                console.log(stdList);

                const studentsWithCourses = await Promise.all(
                    stdList.map(async (student) => {
                        const res = await fetch(`${url}/student/admin/${student.RegNo}`);
                        const courses = await res.json();
                        console.log(courses);

                        return {
                            RegNo: student.RegNo,
                            Name: student.StdName,
                            CoursesSubmitted: courses
                        };
                    })
                );

                setStd(studentsWithCourses);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: 'Register No',
            dataIndex: 'RegNo',
            key: 'RegNo',
        },
        {
            title: 'Student Name',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Number of Courses Submitted',
            dataIndex: 'CoursesSubmitted',
            key: 'CoursesSubmitted',
        },
    ];

    return (
        <>
            <h3>Feedback submission</h3>
            {
                loading ? (<div id="spin"><Spin size="large"></Spin></div>) : (
                    <Table dataSource={std} columns={columns} />
                )
            }
        </>
    );
};

export default Admin2;
