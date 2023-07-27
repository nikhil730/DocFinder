import React from "react";
import { useEffect } from "react";
import Layout from "../components/Layout";
import api from "../axios/axios";

const HomePage = () => {
  //login user data
  const getUserData = async () => {
    try {
      const res = await api.post(
        "/api/user/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <h1>homepage</h1>
    </Layout>
  );
};
export default HomePage;
