import React, { useState } from 'react'
import 'antd/dist/antd.css'
import { Card, Input, Button, Spin, message } from "antd";
import { SmileOutlined } from '@ant-design/icons';
import '../static/css/Login.css'
import axios from "axios";
import servicePath from '../config/apiUrl'

function Login(props) {

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const checkLogin = () => {
        setIsLoading(true)
        if (!userName) {
            message.error('用户名不可为空')
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
            return false
        } else if (!password) {
            message.error('密码不可为空')
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
            return false
        }

        let dataProps = {
            'userName': userName,
            'password': password
        }

        axios({
            method: 'post',
            url: servicePath.checkLogin,
            data: dataProps,
            withCredentials: true
        }).then(
            res => {
                setIsLoading(false)
                console.log(res.data);
                if (res.data.data == '登录成功') {
                    localStorage.setItem('openId', res.data.openId)
                    props.history.push('/index')
                } else {
                    message.error('用户名或密码错误')
                }
            }
        )
    }

    return (
        <div className="login-div">
            <Spin tip="Lading..." spinning={isLoading}>
                <Card title="JSPang bolg System" bordered={true} style={{ width: 400 }}>
                    <Input
                        id="useName"
                        size="large"
                        placeholder="Enter your Name"
                        prefix={<SmileOutlined type="user" style={{ color: 'rgba(0,0,0,0.25)' }}></SmileOutlined>}
                        onChange={(e) => { setUserName(e.target.value) }}
                    ></Input>
                    <br ></br>
                    <Input
                        style={{ marginTop: 20 }}
                        id="password"
                        size="large"
                        placeholder="Enter your password"
                        prefix={<SmileOutlined type="password" style={{ color: 'rgba(0,0,0,0.25)' }}></SmileOutlined>}
                        onChange={(e) => { setPassword(e.target.value) }}
                    ></Input>
                    <br></br>
                    <Button style={{ marginTop: 20 }} type="primary" size="large" block onClick={checkLogin}>login in</Button>
                </Card>
            </Spin>
        </div>
    )
}

export default Login