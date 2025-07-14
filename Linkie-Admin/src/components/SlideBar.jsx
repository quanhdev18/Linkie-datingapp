import { useState } from 'react';
import { AiFillPieChart } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from "react-router-dom";
import { FaFlag, FaUserAlt } from 'react-icons/fa';

const { Sider } = Layout;

// Hàm tạo item cho Menu
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

// Danh sách menu
const items = [
    getItem('Dashboard', '1', <AiFillPieChart />),
    getItem('Users', '2', <FaUserAlt />),
    getItem('Reports', '3', <FaFlag />),
    getItem('Analytics', '4', <SiGoogleanalytics />),
    getItem('Setting', '5', <IoSettings />),
];

// Component SlideBar
const SlideBar = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleClick = (e) => {
        const routes = ["/", "/users", "/report", "/analytics", "/settings"];
        const index = parseInt(e.key, 10) - 1;
        if (routes[index]) navigate(routes[index]);
    };

    return (
        <Layout style={{ minHeight: '90vh' }}>
            <Sider
                className="bg-white py-3"
                width={"16.666666%"}
                collapsible
                collapsed={collapsed}
                onCollapse={value => setCollapsed(value)}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    onClick={handleClick}
                    className="bg-white"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout className="h-[90.8vh] overflow-y-auto">
                <Outlet />
            </Layout>
        </Layout>
    );
};

export default SlideBar;
