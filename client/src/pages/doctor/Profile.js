import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import api from "../../axios/axios";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();

  //update doc form submit function
  const handleFinish = async (values) => {
    console.log(moment(values.timings[0]).format("HH:mm"));
    console.log(moment(values.timings[1]).format("HH:mm"));
    try {
      dispatch(showLoading());
      const res = await api.post(
        "/api/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      dispatch(hideLoading());
      if (res.data.success) {
        console.log(res);
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };

  //get doc details
  const getDocInfo = async () => {
    try {
      if (user._id === params.id) {
        console.log("same");
      } else {
        console.log("dif");
      }
      const res = await api.post(
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
        setDoctor(res.data.data);
        console.log(res);
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
        {doctor && (
          <Form
            layout="vertical"
            onFinish={handleFinish}
            className="m-3"
            initialValues={{
              ...doctor,
              timings: [
                moment(doctor.timings[0], "HH:mm"),
                moment(doctor.timings[1], "HH:mm"),
              ],
            }}
          >
            <h4 className="">Personal Details : </h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="your first name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="your last name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Phone No"
                  name="phone"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="your contact no" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="email" placeholder="your email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Website" name="website">
                  <Input type="text" placeholder="your website" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Address"
                  name="address"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="your clinic address" />
                </Form.Item>
              </Col>
            </Row>
            <h4>Professional Details :</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="your specialization" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="your experience" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Fees Per consultation"
                  name="feesPerconsultation"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="your contact no" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Timings" name="timings" required>
                  <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}></Col>
              <Col xs={24} md={24} lg={8}>
                <button className="btn btn-primary form-btn" type="submit">
                  Submit
                </button>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </Layout>
  );
};
export default Profile;
