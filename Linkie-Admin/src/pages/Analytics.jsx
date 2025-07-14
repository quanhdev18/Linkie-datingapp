import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Statistics from "../components/Statistics";
import { ArrowUpOutlined } from "@ant-design/icons";
import StatsCard from "../components/StatsCard";
import ChartPie from "../components/ChartPie";
import { Table, Space } from "antd";

const columns = [
  {
    title: "ID",
    dataIndex: "key",
    sorter: (a, b) => a.key - b.key,
    defaultSortOrder: "ascend",
  },

  {
    title: "Tài khoản bị báo cáo",
    dataIndex: "accused",
    key: "accused",
    render: (text) => <span>{text}</span>, // ⚠️ Sửa lại từ <a>
  },
  {
    title: "Tài khoản báo cáo",
    dataIndex: "plaintiff",
    key: "plaintiff",
    render: (text) => <span>{text}</span>, // ⚠️ Sửa lại từ <a>
  },
  {
    title: "Lý do",
    dataIndex: "reason",
    key: "reason",
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
          className="text-blue-600 hover:underline"
          onClick={() => alert(`Xác nhận đơn: ${record.key}`)}
        >
          Xác nhận
        </button>
        <button
          className="text-red-600 hover:underline"
          onClick={() => alert(`Đơn giác đơn: ${record.key}`)}
        >
          Đơn giác
        </button>
      </Space>
    ),
  },
];

const dataSta = [
  {
    name: "Doanh thu hôm nay",
    number: 550000,
    icon: "",
    color: "#000000",
    unit: "đ",
  },
  {
    name: "Doanh thu tháng này",
    number: 10000,
    icon: "",
    color: "#000080",
    unit: "đ",
  },
  {
    name: "Tăng trưởng theo tháng",
    number: 30.49,
    icon: <ArrowUpOutlined />,
    color: "#3f8600",
    unit: "%",
  },
  {
    name: "Số người dùng đăng ký gói",
    number: 120000,
    icon: "",
    color: "#3333FF",
    unit: "",
  },
];

const Analytics = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:8000/reports/accounts");
        const reports = res.data;

        const formatted = reports.map((item) => ({
          key: item.id,
          accused: item.reported_id,
          plaintiff: item.reporter_id,
          reason: item.description,
          time: dayjs(item.created_at).format("HH:mm | DD/MM/YYYY"),
          status: "Chờ xác nhận",
        }));

        setReportData(formatted);
      } catch (error) {
        console.error("Lỗi lấy danh sách báo cáo:", error.message);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="w-full p-2">
      <Statistics data={dataSta} />
      <div className="w-full mt-5 flex">
        <div className="w-1/2 h-full px-3">
          <div className="w-full shadow-xl border border-gray-200 bg-white rounded-[10px]">
            <h1 className="text-center text-xl my-3 font-bold">
              Tỷ lệ chuyển đổi
            </h1>
            <ChartPie />
          </div>
        </div>
        <div className="w-1/2 bg-white rounded-[10px] p-2 shadow-xl">
          <h1 className="text-center text-xl my-3 font-bold">Loại giao dịch</h1>
          <div className="flex justify-between mb-5">
            <div className="grid gap-4 grid-cols-2">
              <div>
                <h5 className="text-gray-500 font-normal mb-2">Revenue</h5>
                <p className="text-gray-900 text-2xl font-bold">42,3k</p>
              </div>
              <div>
                <h5 className="text-gray-500 font-normal mb-2">
                  Interest Rate
                </h5>
                <p className="text-gray-900 text-2xl font-bold">$5.40</p>
              </div>
            </div>
          </div>
          <StatsCard />
        </div>
      </div>

      <div className="w-[98%] mt-5 rounded-xl p-3 shadow-xl mx-auto bg-white">
        <Table
          columns={columns}
          dataSource={reportData}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default Analytics;
