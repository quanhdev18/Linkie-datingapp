import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const Report = () => {
  const [data, setData] = useState([]);

  const handleUpdateStatus = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:8000/reports/accounts");
      const reports = res.data;

      const formatted = reports.map((item) => ({
        key: item.id,
        accused: item.reported_id,
        plaintiff: item.reporter_id,
        reason: item.description,
        detail: item.detail_description || "Không có",
        time: dayjs(item.created_at).format("HH:mm | DD/MM/YYYY"),
        status: "Chờ xác nhận",
      }));

      setData(formatted);
    } catch (error) {
      console.error("Lỗi lấy danh sách báo cáo:", error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "id",
      sorter: (a, b) => a.key - b.key,
      defaultSortOrder: "ascend",
    },
    {
      title: "Tài khoản bị báo cáo",
      dataIndex: "accused",
      key: "accused",
      render: (text) => (
        <span className="text-blue-600 underline cursor-pointer">{text}</span>
      ),
    },
    {
      title: "Tài khoản báo cáo",
      dataIndex: "plaintiff",
      key: "plaintiff",
      render: (text) => (
        <span className="text-blue-600 underline cursor-pointer">{text}</span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Mô tả chi tiết",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            className="text-green-600 hover:underline"
            onClick={() => handleUpdateStatus(record.key, "Đã xác nhận")}
          >
            Xác nhận
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={() => handleUpdateStatus(record.key, "Đã đơn giác")}
          >
            Đơn giác
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 className="mx-5 text-[16px] font-bold mt-5">Danh sách báo cáo</h1>
      <div className="w-[98%] mt-2 mx-auto bg-white p-2 rounded-[10px] border border-gray-200 shadow-xl">
        <Table columns={columns} dataSource={data} scroll={{ x: true }} />
      </div>
    </>
  );
};

export default Report;
