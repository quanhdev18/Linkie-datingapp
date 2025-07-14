import { Button, Checkbox, Form, Input } from 'antd'
import React from 'react'

import { FaPhone } from "react-icons/fa6";


const onFinish = values => {
    console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
};

function Login() {
    return (
        <div className="w-full h-[100vh] bg-gray-100 flex justify-center items-center ">
            <div className="w-1/3 p-5 pb-1 border bg-white border-gray-200 rounded-[10px] shadow-2xl">
                <h1 className='text-[25px] font-bold my-3 text-center mb-5'> Login</h1>

                <Form
                    name="basic"

                    style={{ width: '100%', padding: '10px 15px' }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item

                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input size="large" placeholder="Your email" prefix={<FaPhone />} />
                    </Form.Item>



                    <Form.Item name="remember" valuePropName="checked" label={null}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" className='w-full h-10' htmlType="submit">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login