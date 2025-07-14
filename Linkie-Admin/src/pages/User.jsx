
import { useState, useEffect } from "react";
import Tables from "../components/Tables";
import ToolBar from "../components/ToolBar";
import axios from "axios";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    render: (value) => value || "Không có",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Kích hoạt",
    dataIndex: "is_activated",
    key: "is_activated",
    render: (value) => (value ? "✅" : "❌"),
  },
];

const User = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
  console.log("🟡 useEffect chạy");
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/accounts/activated", {
        params: { page: 1, size: 100, role: "USER" },
      });

      const users = res.data.items.map((user) => ({
        key: user.id,
        ...user,
      }));

      console.log("✅ FE nhận được:", users);
      setData(users);
    } catch (err) {
      console.error("❌ API error:", err);
    }
  };
  fetchUsers();
}, []);

console.log("👀 Data truyền xuống Table:", data); // 🔥 THÊM DÒNG NÀY

return (
  <>
    <ToolBar />
    <div className="w-full p-5">
      <Tables datas={{ columns, value: data }} />
    </div>
  </>
);

};

export default User;