import React, { useState, useEffect } from "react";
import "../static/css/ArticleList.css";
import { List, Row, Col, Modal, message, Button, Switch } from "antd";
import axios from "axios";
import servicePath from "../config/apiUrl";
const { confirm } = Modal;
function ArticleList(props) {
  const [list, setList] = useState([]);

  const getList = () => {
    axios({
      method: "get",
      url: servicePath.getArticleList,
      withCredentials: true,
    }).then((res) => {
        console.log(res);
      setList(res.data.list);
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
  const updateArticle = (id, checked) => {
    props.history.push("/index/add/" + id);
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div>
      <List
        header={
          <Row className="list-div">
            <Col span={8}>
              <b>标题</b>
            </Col>
            <Col span={4}>
              <b>类别</b>
            </Col>
            <Col span={4}>
              <b>发布时间</b>
            </Col>
            <Col span={4}>
              <b>浏览量</b>
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
              <Col span={8}>{item.title}</Col>
              <Col span={4}>{item.typeName}</Col>
              <Col span={4}>{item.addTime}</Col>
              <Col span={4}>{item.view_count}</Col>
              <Col span={4}>
                <Button type="primary" onClick={() => updateArticle(item.id)}>
                  修改
                </Button>
                &nbsp;
                <Button onClick={() => deleteArticle(item.id)}>删除 </Button>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
}

export default ArticleList;
