import {  useState } from 'react'
import { Avatar, Dropdown, Input, Layout } from 'antd';
import { FaBell, FaUser } from 'react-icons/fa';
import { SettingOutlined } from '@ant-design/icons'
const { Header } = Layout;



const NavBar = ({ userName = "Vũ Tiến Đạt" }) => {
    const [color] = useState('#f56a00');
    const menuItems = [
        {
            key: '1',
            label: 'vivudaudo@gmail.com',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
            icon: <FaUser />
        },

        {
            key: '3',
            label: 'Settings',
            icon: <SettingOutlined />,

        },
    ];



    return (

        <Header className='border-b border-gray-200 ' style={{ padding: 0, display: 'flex', alignItems: 'center', backgroundColor: "white", borderRadius: '5px' }}>
            <div className="w-1/6  text-2xl font-bold h-full flex items-center  rounded-[5px]  justify-center">Linkes Admin </div>
            <div className="w-2/3 h-full  flex items-center justify-center">


                <Input.Search className='w-2/3 ' size="large" placeholder="Search" enterButton />

            </div>
            <div className="w-1/6 h-full   flex items-center justify-center">
                <nav className='w-1/2 mx-auto h-full   '>
                    <ul className=' list-none  grid grid-cols-2   flex items-center justify-center'>
                        <li className='h-full aspect-square   flex items-center justify-center '>
                            <div className='w-10  aspect-square  bg-gray-300  flex items-center  rounded-full justify-center  relative '>
                                <FaBell style={{ fontSize: '18px' }} />
                                <div className="absolute top-[-2px]   right-[-5px] w-5 h-5 flex items-center justify-center text-white text-[10px] font-bold rounded-full bg-red-500"> 1</div>
                            </div>
                        </li>
                        <li className=' h-full aspect-square  flex items-center justify-center'>
                            <Dropdown
                                menu={{ items: menuItems }}
                                trigger={['click']}
                                overlayClassName="min-w-[150spx]"
                            >
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <Avatar
                                        className="border-2 border-transparent hover:border-blue-500 transition-all"
                                        style={{
                                            backgroundColor: color,
                                            verticalAlign: 'middle',
                                        }}
                                        size="large"
                                    >
                                        {userName[0].toUpperCase()}
                                    </Avatar>

                                </div>
                            </Dropdown>

                        </li>
                    </ul>
                </nav>
            </div>
        </Header>


    )
}

export default NavBar