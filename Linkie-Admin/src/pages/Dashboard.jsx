// // import React from 'react';
// import Statistics from '../components/Statistics';
// import { FaUser } from 'react-icons/fa';
// import { HiUserGroup } from "react-icons/hi2";
// import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
// import ChartPie from '../components/ChartPie';
// import RevenueCard from '../components/RevenueCard';
// // import StatsCard from '../components/StatsCard';


// const dataSta = [
//     {
//         name: 'User',
//         number: 550000,
//         icon: <FaUser />,
//         color: '#000000',
//         unit: ''
//     },
//     {
//         name: 'Member',
//         number: 10000,
//         icon: <HiUserGroup />,
//         color: '#000080',
//         unit: ''
//     },
//     {
//         name: 'Revenue',
//         number: 30.49,
//         icon: <ArrowUpOutlined />,
//         color: '#3f8600',
//         unit: '%'
//     },
//     {
//         name: 'Interest Rate',
//         number: 12.5,
//         icon: < ArrowDownOutlined />,
//         color: '#cf1322',
//         unit: '%'
//     },
// ]

// const Dashboard = () => {
//     return (
//         <div className="w-full p-2  ">
//             <Statistics data={dataSta} />
//             <div className="w-full my-2 flex">
//                 <div className="w-1/3 pr-1">
//                     <ChartPie />
//                 </div>
//                 <div className="w-2/3 pl-1">
//                     <RevenueCard />
//                 </div>

//             </div>

//         </div>
//     );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import Statistics from "../components/Statistics";
import { FaUser } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import ChartPie from "../components/ChartPie";
import RevenueCard from "../components/RevenueCard";
import axios from "axios";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);     // USER + ADMIN
  const [memberCount, setMemberCount] = useState(0); // chỉ USER

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/accounts/activated", {
          params: { page: 1, size: 100 },
        });

        const allAccounts = res.data.items || [];

        // Lấy role (chuyển về in hoa để an toàn)
        const normalizedAccounts = allAccounts.map(acc => ({
          ...acc,
          role: acc.role?.toUpperCase() || "",
        }));

        // USER = USER + ADMIN
        const userTotal = normalizedAccounts.filter(acc =>
          acc.role === "USER" || acc.role === "ADMIN"
        ).length;

        // MEMBER = chỉ USER
        const memberTotal = normalizedAccounts.filter(acc =>
          acc.role === "USER"
        ).length;

        setUserCount(userTotal);
        setMemberCount(memberTotal);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu account:", err.message);
      }
    };

    fetchAccounts();
  }, []);

  const dataSta = [
    {
      name: "User (User + Admin)",
      number: userCount,
      icon: <FaUser />,
      color: "#000000",
      unit: "",
    },
    {
      name: "Member (chỉ User)",
      number: memberCount,
      icon: <HiUserGroup />,
      color: "#000080",
      unit: "",
    },
    {
      name: "Revenue",
      number: 30.49,
      icon: <ArrowUpOutlined />,
      color: "#3f8600",
      unit: "%",
    },
    {
      name: "Interest Rate",
      number: 12.5,
      icon: <ArrowDownOutlined />,
      color: "#cf1322",
      unit: "%",
    },
  ];

  return (
    <div className="w-full p-2">
      <Statistics data={dataSta} />
      <div className="w-full my-2 flex">
        <div className="w-1/3 pr-1">
          <ChartPie />
        </div>
        <div className="w-2/3 pl-1">
          <RevenueCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
