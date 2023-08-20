import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import axios from "axios";
import api from "../axios/axios";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Form, Row, Col, Input, DatePicker, message, Table } from "antd";
import moment from "moment";

const Medicines = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  let med = [];
  if (user) {
    med = user.medicines;
  }
  console.log(user);
  const handleStatus = async (record) => {
    try {
      console.log(record);
      dispatch(showLoading());
      const res = await api.post(
        "/api/user/removeMedicine",
        { Id: record.Id, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        window.location.reload();
        console.log(user);
        // setMed(user.medicines);

        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };
  // const medi = [
  //   { name: "calpole", expiry: "2023-01-13T19:50:30.177Z" },

  //   { name: "paracitamol", expiry: "2023-04-13T19:51:59.796Z" },

  //   { name: "paracitamol", expiry: "2023-05-13T20:07:41.260Z" },

  //   { name: "cabc", expiry: "2023-02-15T20:06:37.607Z" },
  // ];
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await api.post(
        "/api/user/addMedicine",
        { ...values, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      dispatch(hideLoading());
      if (res.data.success) {
        window.location.reload();
        console.log(user);
        // setMed(user.medicines);

        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Somthing Went Wrrong ");
    }
  };
  // const f = () => {
  // };
  // const getMed = async () => {
  //   try {
  //     dispatch(showLoading());
  //     const res = await axios.post(
  //       "/api/user/getMedicine",
  //       { userId: user._id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     console.log(res);
  //     dispatch(hideLoading());
  //     if (res.data.success) {
  //       console.log(res.data.data);
  //       message.success(res.data.message);
  //       setMed(res.data.data);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //     console.log(error);
  //     message.error("Somthing Went Wrrong ");
  //   }
  //};
  // setInterval(getMed, 10000);
  // useEffect(() => {
  //   console.log("hello");
  // }, [user]);
  console.log(med);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorInfo.firstName} {record.doctorInfo.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    // },
    {
      title: "Expiry Date",
      dataIndex: "expiry",
      render: (text, record) => (
        <span>{moment(record.expiry).format("MM:YYYY")}</span>
      ),
    },
    {
      title: "Expires in",
      dataIndex: "expiry",
      render: (text, record) => <span>{moment(record.expiry).fromNow()}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <div className="d-flex">
            <button
              className="btn btn-danger ms-2"
              onClick={() => handleStatus(record)}
            >
              Remove
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1>Medicines</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Medicine Name"
              name="medicineName"
              required
              rules={[{ required: true }]}
            >
              <Input type="text" placeholder="medicine name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Timings" name="timings" required>
              <DatePicker.MonthPicker format="MM:YYYY" />
            </Form.Item>
          </Col>
        </Row>
        <Col xs={24} md={24} lg={8}>
          <button className="btn btn-primary form-btn" type="submit">
            Submit
          </button>
        </Col>
      </Form>

      <Table columns={columns} dataSource={med} />
    </Layout>
  );
};
export default Medicines;
