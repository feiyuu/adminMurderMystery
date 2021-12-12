import React, { useState, useEffect } from "react";
import {
  List,
  Row,
  Col,
  Modal,
  message,
  Button,
  Radio,
  Input,
  Select,
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
function TeamList(props) {
  const [list, setList] = useState([]);
  const [state, setState] = useState(10);
  const [teamDramaName, setTeamDramaName] = useState(""); // 组局剧本名称
  const [dmUser, setDmUser] = useState([]); // 筛选可选项，主持人名字
  const [selectDmUser, setSelectDmUser] = useState(); // 选中的主持人名字

  const getList = () => {
    let params = {
      status: state,
      teamDramaName: teamDramaName,
      dmNickName: selectDmUser,
    };
    params = removeEmpty(params);

    axios({
      method: "get",
      url: servicePath.getTeamList,
      withCredentials: true,
      params: params,
    }).then((res) => {
      console.log(res);
      setList(res.data.data);
    });
  };

  const updateTeamState = (id, state) => {
    confirm({
      content:
        state == 30 ? "确定组局成功，可以完成了吗？" : "确定解散这次组局吗？",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        let data = {
          TeamId: id,
          state: state,
        };
        axios({
          method: "post",
          url: servicePath.updateTeamState,
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

  const editTeam = (id) => {
    props.history.push("/index/TeamAdd/" + id);
  };

  const getDmUser = () => {
    axios({
      method: "get",
      url: servicePath.getDMUsers,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        let list = res.data.data;
        setDmUser(list);
      }
    });
  };

  const getStateTxt = (state) => {
    let string = "";
    if (state == 10) {
      string = "组局中";
    } else if (state == 30) {
      string = "已完成";
    } else if (state == 50) {
      string = "已解散";
    }
    return string;
  };

  useEffect(() => {
    getList();
  }, [state]);
  useEffect(() => {
    getList();
  }, [selectDmUser]);
  useEffect(() => {
    getDmUser();
  }, []);

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
              defaultValue={10}
            >
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value={10}>组局中</Radio.Button>
              <Radio.Button value={30}>已完成</Radio.Button>
              <Radio.Button value={50}>已解散</Radio.Button>
            </Radio.Group>
            <Select
              style={{ marginLeft: 10, width: 200 }}
              defaultValue="全部"
              value={selectDmUser}
              onChange={(value) => {
                setSelectDmUser(value);
              }}
            >
              <Select.Option key="">全部</Select.Option>
              {dmUser.map((item, index) => {
                if (item.dmNickName) {
                  return (
                    <Select.Option key={item.Id} value={item.dmNickName}>
                      {item.dmNickName}
                    </Select.Option>
                  );
                }
              })}
            </Select>
          </Col>
          <Col
            span={12}
            style={{
              textAlign: "right",
            }}
          >
            <Input
              style={{ width: 200, marginRight: 10 }}
              placeholder="请输入剧本名"
              onChange={(e) => {
                setTeamDramaName(e.target.value);
              }}
              value={teamDramaName}
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
                setTeamDramaName("");
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
            <b>剧本</b>
          </Col>
          <Col span={4}>
            <b>开局时间</b>
          </Col>
          <Col span={4}>
            <b>DM</b>
          </Col>
          <Col span={4}>
            <b>人员</b>
          </Col>
          <Col span={4}>
            <b>状态</b>
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
                  <Col span={4}>{item.teamDramaName}</Col>
                  <Col span={4}>
                    {item.startDate + " " + item.startSession}
                  </Col>
                  <Col span={4}> {item.dmNickName}</Col>
                  <Col span={4}>
                    {item.joinedCount < item.teamDramaNumbers
                      ? item.joinedCount + "/" + item.teamDramaNumbers
                      : "已满"}
                  </Col>
                  <Col span={4}>{getStateTxt(item.status)}</Col>
                  <Col span={4}>
                    <Button
                      disabled={
                        item.status != 10 ||
                        item.joinedCount < item.teamDramaNumbers
                      }
                      style={{ marginRight: 10 }}
                      type="primary"
                      onClick={() => updateTeamState(item.Id, 30)}
                    >
                      完成
                    </Button>
                    <Button
                      disabled={item.status == 50}
                      style={{ marginRight: 10 }}
                      type="primary"
                      onClick={() => editTeam(item.Id)}
                    >
                      编辑
                    </Button>
                    <Button
                      disabled={item.status == 50}
                      onClick={() => updateTeamState(item.Id, 50)}
                    >
                      解散
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

export default TeamList;
