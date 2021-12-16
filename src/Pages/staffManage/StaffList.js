import React, { useState, useEffect } from "react";
import "../../static/css/staffManage/StaffList.css";
import { List, Row, Col, Modal, message, Button, Switch, Avatar } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import servicePath from "../../config/apiUrl";

function StaffList(props) {
  const [list, setList] = useState([]);

  const getList = () => {
    axios({
      method: "get",
      url: servicePath.getDMUsers,
      withCredentials: true,
    }).then((res) => {
      if(res.data.code==101){
        message.error("登录失效，请重新登录！")
        props.history.push("/");
        return;
      }
      console.log(res);
      setList(res.data.data);
    });
  };

  //修改剧本的跳转方法
  const updateStaff = (id, checked) => {
    props.history.push("/index/staffAdd/" + id);
  };

  useEffect(() => {
    axios.defaults.headers['Authorization'] = localStorage.getItem("token");
    getList();
  }, []);
  return (
    <div>
      <div
        style={{
          paddingTop: 20,
          paddingBottom: 10,
          paddingLeft: 16,
          paddingRight: 22,
        }}
      >
        <Row className="list-div">
          <Col span={4}>
            <b>头像</b>
          </Col>
          <Col span={4}>
            <b>工号</b>
          </Col>
          <Col span={4}>
            <b>昵称</b>
          </Col>
          <Col span={4}>
            <b>性别</b>
          </Col>
          <Col span={4}>
            <b>热度</b>
          </Col>
          <Col span={4}>
            <b>操作</b>
          </Col>
        </Row>
      </div>
      <div
        id="scrollableDiv"
        style={{
          paddingLeft: "16px",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        <InfiniteScroll
          dataLength={list.length}
          scrollableTarget="scrollableDiv"
        >
          <List
            style={{ height: 700, overflowY: "scroll" }}
            dataSource={list}
            renderItem={(item) => (
              <List.Item>
                <Row
                  className="list-div"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Col span={4}>
                    <Avatar shape="square" size={54} src={item.dmAvatarUrl} />
                  </Col>
                  <Col span={4}>{item.loginName}</Col>
                  <Col span={4}>{item.dmNickName}</Col>
                  <Col span={4}>{item.dmGender == 1 ? "男" : "女"}</Col>
                  <Col span={4}>{item.dmHot}</Col>
                  <Col span={4}>
                    <Button type="primary" onClick={() => updateStaff(item.Id)}>
                      修改
                    </Button>
                    &nbsp;
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default StaffList;
