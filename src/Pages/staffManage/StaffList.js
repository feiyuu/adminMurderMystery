import React, { useState, useEffect } from "react";
import "../../static/css/staffManage/StaffList.css";
import { List, Row, Col, Modal, message, Button, Switch, Avatar } from "antd";
import axios from "axios";
import servicePath from "../../config/apiUrl";
const { confirm } = Modal;

function StaffList(props) {
  const [list, setList] = useState([]);

  const getList = () => {
    axios({
      method: "get",
      url: servicePath.getDMUsers,
      withCredentials: true,
    }).then((res) => {
      console.log(res);
      setList(res.data.data);
    });
  };

  const deleteArticle = (id) => {
    confirm({
      title: "确定要删除这篇剧本吗？",
      content: "删除后无法恢复",
      onOk() {
        axios(servicePath.deleteArticle + id, { withCredentials: true }).then(
          (res) => {
            message.success("剧本删除成功");
            getList();
          }
        );
      },
      onCancel() {
        message.success("取消删除剧本");
      },
    });
  };

  //修改剧本的跳转方法
  const updateStaff = (id, checked) => {
    props.history.push("/index/staffAdd/" + id);
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div>
      <List
        header={
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
        }
        bordered
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <Row className="list-div">
              <Col span={4}>
                <Avatar shape="square" size={54} src={item.dmAvatarUrl} />
              </Col>
              <Col span={4}>{item.loginName}</Col>
              <Col span={4}>{item.dmNickName}</Col>
              <Col span={4}>{item.dmGender==1?'男':'女'}</Col>
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
    </div>
  );
}

export default StaffList;
