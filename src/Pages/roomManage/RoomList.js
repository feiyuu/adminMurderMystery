import React, { useState, useEffect } from "react";
import { List, Row, Col, Modal, message, Button, Image } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import servicePath from "../../config/apiUrl";
const { confirm } = Modal;

const removeEmpty = (obj) => {
  Object.keys(obj).forEach(function (key) {
    (obj[key] && typeof obj[key] === "object" && removeEmpty(obj[key])) ||
      ((obj[key] === undefined || obj[key] === null || obj[key] === "") &&
        delete obj[key]);
  });
  return obj;
};
function RoomList(props) {
  const [list, setList] = useState([]);

  const getList = () => {
    axios({
      method: "get",
      url: servicePath.getRooms,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 101) {
        message.error("登录失效，请重新登录！");
        props.history.push("/");
        return;
      }
      if (res.data.code == 1) {
        setList(res.data.data);
      }
    });
  };

  const editRoom = (id) => {
    props.history.push("/index/roomAdd/" + id);
  };
  const deleteRoom = (id) => {
    confirm({
      title: "确定删除该房间吗？",
      content: "删除后不可恢复",
      okType: "danger",
      okText: "删除",
      cancelText: "取消",
      onOk() {
        axios({
          method: "post",
          url: servicePath.deleteRoom,
          data: {
            roomId: id,
          },
          withCredentials: true,
        }).then((res) => {
          if (res.data.code == 1) {
            message.success("操作成功");
            getList();
          }
        });
      },
      onCancel() {},
    });
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
          <Col span={8}>
            <b>房间装修</b>
          </Col>
          <Col span={4}>
            <b>房间风格</b>
          </Col>
          <Col span={4}>
            <b>房间号</b>
          </Col>
          <Col span={8}>
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
                  <Col span={8}>
                    <Image
                      preview={false}
                      src={item.roomDecorate}
                      style={{ width: 160, height: 90 }}
                    />
                  </Col>
                  <Col span={4}>{item.roomName}</Col>
                  <Col span={4}>{item.roomLabel}</Col>
                  <Col span={8}>
                    <Button
                      style={{ marginRight: 10 }}
                      type="primary"
                      onClick={() => editRoom(item.Id)}
                    >
                      编辑
                    </Button>
                    <Button onClick={() => deleteRoom(item.Id)}>删除</Button>
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

export default RoomList;
