import React, { useState, useEffect } from "react";
import {
  List,
  Row,
  Col,
  Modal,
  message,
  Button,
  Avatar,
  Radio,
  Input,
} from "antd";
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
function GoodsList(props) {
  const [list, setList] = useState([]);
  const [state, setState] = useState();
  const [goodsName, setGoodsName] = useState("");

  const getList = () => {
    let params = {
      state: state,
      goodsName: goodsName,
    };
    params = removeEmpty(params);

    axios({
      method: "get",
      url: servicePath.getGoods,
      withCredentials: true,
      params: params,
    }).then((res) => {
      if(res.data.code==101){
        message.error("登录失效，请重新登录！")
        props.history.push("/");
        return;
      }
      console.log(res);
      if(res.data.code==1){
        setList(res.data.data);
      }
    });
  };

  const updaTeGoodsState = (id, state) => {
    confirm({
      content: state == 20 ? "确定下架该商品吗？" : "确定上架该商品吗？",
      okText: "是",
      cancelText: "否",
      onOk() {
        let data = {
          goodsId: id,
          state: state,
        };

        axios({
          method: "post",
          url: servicePath.updaTeGoodsState,
          data: data,
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

  const editGoods = (id) => {
    props.history.push("/index/goodsAdd/" + id);
  };
  const deleteGoods = (id) => {
    confirm({
      title: "确定删除该商品吗？",
      content: "删除后不可恢复",
      okType: "danger",
      okText: "删除",
      cancelText: "取消",
      onOk() {
        axios({
          method: "post",
          url: servicePath.deleteGoods,
          data: {
            goodsId: id,
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
  const getStateTxt = (state) => {
    let string = "";
    if (state == 10) {
      string = "已上架";
    } else if (state == 20) {
      string = "已下架";
    }
    return string;
  };

  useEffect(() => {
    axios.defaults.headers['Authorization'] = localStorage.getItem("token");
    getList();
  }, [state]);

  return (
    <div>
      <div>
        <Row>
          <Col
            span={12}
            style={{
              textAlign: "left",
            }}
          >
            <Radio.Group
              buttonStyle="solid"
              onChange={(e) => {
                setState(e.target.value);
              }}
              value={state}
              defaultValue=""
            >
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value={10}>已上架</Radio.Button>
              <Radio.Button value={20}>已下架</Radio.Button>
            </Radio.Group>
          </Col>
          <Col
            span={12}
            style={{
              textAlign: "right",
            }}
          >
            <Input
              style={{ width: 200, marginRight: 10 }}
              placeholder="请输入商品名"
              onChange={(e) => {
                setGoodsName(e.target.value);
              }}
              value={goodsName}
            ></Input>
            <Button
              type="primary"
              onClick={() => {
                getList();
              }}
            >
              搜索
            </Button>
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => {
                setGoodsName("");
              }}
            >
              清空
            </Button>
          </Col>
        </Row>
      </div>
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
            <b>商品</b>
          </Col>
          <Col span={4}>
            <b>名称</b>
          </Col>
          <Col span={4}>
            <b>价格</b>
          </Col>
          <Col span={4}>
            <b>状态</b>
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
                  <Col span={4}>
                    <Avatar shape="square" size={54} src={item.goodsCoverUrl} />
                  </Col>
                  <Col span={4}>{item.goodsName}</Col>
                  <Col span={4}>{item.price}元</Col>
                  <Col span={4}>{getStateTxt(item.state)}</Col>
                  <Col span={8}>
                    <Button
                      style={{ marginRight: 10 }}
                      disabled={item.state == 10}
                      type="primary"
                      onClick={() => updaTeGoodsState(item.Id, 10)}
                    >
                      上架
                    </Button>
                    <Button
                      style={{ marginRight: 10 }}
                      disabled={item.state == 20}
                      type="primary"
                      onClick={() => updaTeGoodsState(item.Id, 20)}
                    >
                      下架
                    </Button>
                    <Button
                      style={{ marginRight: 10 }}
                      type="primary"
                      onClick={() => editGoods(item.Id)}
                    >
                      编辑
                    </Button>
                    <Button onClick={() => deleteGoods(item.Id)}>删除</Button>
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

export default GoodsList;
