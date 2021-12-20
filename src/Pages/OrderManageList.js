import React, { useState, useEffect } from "react";
import {
  List,
  Row,
  Col,
  Modal,
  message,
  Button,
  Switch,
  Radio,
  Input,
} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import servicePath from "../config/apiUrl";
const { confirm } = Modal;

const removeEmpty = (obj) => {
  Object.keys(obj).forEach(function (key) {
    (obj[key] && typeof obj[key] === "object" && removeEmpty(obj[key])) ||
      ((obj[key] === undefined || obj[key] === null || obj[key] === "") &&
        delete obj[key]);
  });
  return obj;
};
function OrderManageList(props) {
  const [list, setList] = useState([]);
  const [state, setState] = useState(30);
  const [userName, setUserName] = useState("");

  const getList = () => {
    let params = {
      state: state,
      userName: userName,
    };
    params = removeEmpty(params);

    axios({
      method: "get",
      url: servicePath.getOrderList,
      withCredentials: true,
      params: params,
    }).then((res) => {
      if (res.data.code == 101) {
        message.error("登录失效，请重新登录！");
        props.history.push("/");
        return;
      }
      console.log(res);
      if (res.data.code == 1) {
        setList(res.data.data);
      }
    });
  };

  const deliverGoods = (id, state, userId, charge) => {

    confirm({
      title:
        state == 40 ? "确定已经把商品交给顾客了吗？" : "确定进行退款操作吗？",
      content: "确定后无法更改",
      okText: "是",
      cancelText: "否",
      onOk() {
        axios({
          method: "post",
          url: servicePath.updaTeOrder,
          data: {
            orderId: id,
            state: state,
            userId: userId,
            charge: charge,
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

  const getGoods = (goods) => {
    let string = "";
    if (goods && goods.length > 0) {
      goods = JSON.parse(goods);
      for (var i = 0; i < goods.length; i++) {
        let a = goods[i];
        string += a.goodsName + "x" + a.count + "  ";
      }
    }
    return string;
  };
  const getStateTxt = (state) => {
    let string = "";
    if (state == 10) {
      string = "待付款";
    } else if (state == 30) {
      string = "已付款";
    } else if (state == 40) {
      string = "已完成";
    } else if (state == 50) {
      string = "已取消";
    } else if (state == 60) {
      string = "已退款";
    }
    return string;
  };

  useEffect(() => {
    axios.defaults.headers["Authorization"] = localStorage.getItem("token");
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
              defaultValue={30}
            >
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value={10}>待付款</Radio.Button>
              <Radio.Button value={30}>已付款</Radio.Button>
              <Radio.Button value={40}>已完成</Radio.Button>
              <Radio.Button value={50}>已取消</Radio.Button>
              <Radio.Button value={60}>已退款</Radio.Button>
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
              placeholder="请输入用户名"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              value={userName}
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
                setUserName("");
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
          <Col span={8}>
            <b>商品</b>
          </Col>
          <Col span={2}>
            <b>总价</b>
          </Col>
          <Col span={3}>
            <b>订单时间</b>
          </Col>
          <Col span={3}>
            <b>房间</b>
          </Col>
          <Col span={2}>
            <b>订单状态</b>
          </Col>
          <Col span={3}>
            <b>用户</b>
          </Col>
          <Col span={3}>
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
                  <Col span={8} style={{ paddingRight: 20 }}>
                    {getGoods(item.goods)}
                  </Col>
                  <Col span={2}>{item.total_price}元</Col>
                  <Col span={3}>{item.order_time}</Col>
                  <Col span={3}>{item.room}</Col>
                  <Col span={2}>{getStateTxt(item.state)}</Col>
                  <Col span={3}>{item.userName}</Col>
                  <Col span={3}>
                    <Button
                      disabled={item.state != 30}
                      type="primary"
                      style={{ marginRight: 10 }}
                      onClick={() =>
                        deliverGoods(item.Id, 40, item.userId, item.total_price)
                      }
                    >
                      发货
                    </Button>
                    <Button
                      disabled={item.state != 30 && item.state != 40}
                      onClick={() =>
                        deliverGoods(item.Id, 60, item.userId, item.total_price)
                      }
                    >
                      退款
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

export default OrderManageList;
