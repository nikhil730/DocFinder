import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Row } from "antd";
import api from "../axios/axios";
import DoctorList from "../components/DoctorList";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  //login user data
  const getUserData = async () => {
    try {
      const res = await api.get("/api/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  console.log(doctors);
  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>
      <Row>
        {doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}
      </Row>
      {/* <Row>
        {doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}
      </Row> */}
    </Layout>
  );
};
export default HomePage;
