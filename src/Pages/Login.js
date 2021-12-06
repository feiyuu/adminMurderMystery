import React, { useState } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Spin, message } from "antd";
import { SmileOutlined, UserOutlined } from "@ant-design/icons";
import "../static/css/Login.css";
import axios from "axios";
import servicePath from "../config/apiUrl";

function Login(props) {
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const checkLogin = () => {
    setIsLoading(true);
    if (!userName) {
      message.error("用户名不可为空");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return false;
    } else if (!password) {
      message.error("密码不可为空");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return false;
    }

    let dataProps = {
      userName: userName,
      password: password,
    };

    axios({
      method: "post",
      url: servicePath.checkLogin,
      data: dataProps,
      withCredentials: true,
    }).then((res) => {
      setIsLoading(false);
      console.log("res.data.data========" + JSON.stringify(res.data.data));
      if (res.data.code == 1) {
        localStorage.setItem("Id", res.data.data.Id);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        props.history.push("/index");
      } else {
        message.error("用户名或密码错误");
      }
    });
  };

  return (
    <div className="login-div">
      <Spin tip="Lading..." spinning={isLoading}>
        <Card bordered={true} style={{ width: 400, padding: 20 }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            剧有趣后台管理系统
          </div>
          <Input
            id="useName"
            size="large"
            placeholder="输入管理员账号"
            prefix={
              <UserOutlined
                type="user"
                style={{ color: "rgba(0,0,0,0.25)" }}
              ></UserOutlined>
            }
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          ></Input>
          <br></br>
          <Input
            style={{ marginTop: 20 }}
            id="password"
            size="large"
            placeholder="输入管理员密码"
            prefix={
              <SmileOutlined
                type="password"
                style={{ color: "rgba(0,0,0,0.25)" }}
              ></SmileOutlined>
            }
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Input>
          <br></br>
          <Button
            style={{ marginTop: 20 }}
            type="primary"
            size="large"
            block
            onClick={checkLogin}
          >
            登录
          </Button>
        </Card>
      </Spin>
    </div>
  );
}

export default Login;
