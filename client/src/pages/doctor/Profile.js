import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  //get doc details
  const getDocInfo = async () => {
    try {
      if (user._id === params.id) {
        console.log("same");
      } else {
        console.log("dif");
      }
      const res = await axios.post(
        "/api/doctor/getDoctorInfo",
        {
          userId: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(doctor);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDocInfo();
  }, []);

  return (
    <Layout>
      <div>
        <h1>Manage Profile</h1>
      </div>
    </Layout>
  );
};
export default Profile;
