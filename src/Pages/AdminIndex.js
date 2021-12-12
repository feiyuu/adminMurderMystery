import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Avatar, Modal } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  ReconciliationOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "../static/css/AdminIndex.css";
import { Route } from "react-router-dom";
import DramaAdd from "./dramaManage/DramaAdd";
import DramaList from "./dramaManage/DramaList";
import StaffAdd from "./staffManage/StaffAdd";
import StaffList from "./staffManage/StaffList";
import GoodsList from "./goodsManage/GoodsList";
import GoodsAdd from "./goodsManage/GoodsAdd";
import TeamList from "./teamManage/TeamList";
import TeamAdd from "./teamManage/TeamAdd";
import RoomList from "./roomManage/RoomList";
import RoomAdd from "./roomManage/RoomAdd";
import OrderManageList from "./OrderManageList";
import GoEasy from "goeasy";
import neworder from "../../src/static/music/neworder.ogg";

const { confirm } = Modal;
//初始化
var goeasy = GoEasy.getInstance({
  host: "hangzhou.goeasy.io", //若是新加坡区域：singapore.goeasy.io
  appkey: "BS-eb60bdd05efa4e819db911bbb04e56cb",
  modules: ["pubsub"], //根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});
var pubsub = goeasy.pubsub;

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function AdminIndex(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      console.log("user grade===" + JSON.parse(user).grade);
      if (JSON.parse(user)) {
        setUserData(JSON.parse(user));
      }
    }
    connectGoeasy();
  }, []);

  const connectGoeasy = () => {
    //建立连接
    goeasy.connect({
      data: { nickname: "Neo" }, //必须是一个对象，pubsub选填，im必填，用于上下线提醒和查询在线用户列表时，扩展更多的属性
      onSuccess: function () {
        //连接成功
        console.log("GoEasy connect successfully."); //连接成功
      },
      onFailed: function (error) {
        //连接失败
        console.log(
          "Failed to connect GoEasy, code:" +
            error.code +
            ",error:" +
            error.content
        );
      },
      onProgress: function (attempts) {
        //连接或自动重连中
        console.log("GoEasy is connecting", attempts);
      },
    });

    pubsub.subscribe({
      channel: "17jbs-order", //替换为您自己的channel
      onMessage: function (message) {
        console.log(
          "Channel:" + message.channel + " content:" + message.content
        );
        //播放订单提示音
        var music = document.getElementById("audio");
        if (music.paused) {
          music.play();
        }
        confirm({
          title: "有新的订单了",
          content: message.content,
          okText: "去处理",
          cancelText: "取消",
          onOk() {
            props.history.push("/index/orderManageList");
          },
          onCancel() {},
        });
      },
      onSuccess: function () {
        console.log("Channel订阅成功。");
      },
      onFailed: function (error) {
        console.log(
          "Channel订阅失败, 错误编码：" +
            error.code +
            " 错误信息：" +
            error.content
        );
      },
    });
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleClickSubStaff = (e) => {
    console.log(e.item.props);
    if (e.key == "addStaff") {
      props.history.push("/index/staffAdd");
    } else {
      props.history.push("/index/staffList");
    }
  };
  const handleClickDramaMan = (e) => {
    console.log(e.item.props);
    if (e.key == "DramaAdd") {
      props.history.push("/index/dramaAdd");
    } else {
      props.history.push("/index/dramaList");
    }
  };
  const handleClickTeamMan = (e) => {
    console.log(e.item.props);
    if (e.key == "TeamAdd") {
      props.history.push("/index/teamAdd");
    } else {
      props.history.push("/index/teamList");
    }
  };
  const handleClickRoomMan = (e) => {
    console.log(e.item.props);
    if (e.key == "RoomAdd") {
      props.history.push("/index/roomAdd");
    } else {
      props.history.push("/index/roomList");
    }
  };
  const handleClickGoodsMan = (e) => {
    console.log(e.item.props);

    if (e.key == "GoodsAdd") {
      props.history.push("/index/goodsAdd");
    } else {
      props.history.push("/index/goodsList");
    }
  };
  const handleClickPersonInfo = (e) => {
    console.log(e.item.props);
    props.history.push("/index/staffAdd/" + localStorage.getItem("Id"));
  };
  const handleClickOrderMan = (e) => {
    props.history.push("/index/orderManageList");
  };

  const rootSubmenuKeys = ["sub1", "sub2", "sub3", "sub4", "sub5"];
  const [openKeys, setOpenKeys] = React.useState([]);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Layout
      style={{
        minHeight: document.documentElement.clientHeight,
        minWidth: document.documentElement.clientWidth,
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo">
          <audio id="audio" src={neworder} preload="true">
            <track kind="captions" />
            对不起，您的浏览器不支持HTML5音频播放。
          </audio>
          <Avatar shape="square" size={54} src={userData.dmAvatarUrl} />
          <div style={{ marginTop: "8px" }}>{userData.dmNickName}</div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          <Menu.Item
            key="1"
            onClick={handleClickPersonInfo}
            icon={<UserOutlined />}
          >
            <span>个人信息</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            disabled={userData.grade != 1}
            onClick={handleClickSubStaff}
            icon={<TeamOutlined />}
            title="人员管理"
          >
            <Menu.Item key="addStaff">添加DM</Menu.Item>
            <Menu.Item key="staffList">DM列表</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            onClick={handleClickRoomMan}
            icon={<DesktopOutlined />}
            title="房间管理"
          >
            <Menu.Item key="RoomAdd">新增房间</Menu.Item>
            <Menu.Item key="RoomList">房间列表</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            onClick={handleClickDramaMan}
            icon={<DatabaseOutlined />}
            title="剧本管理"
          >
            <Menu.Item key="DramaAdd">添加剧本</Menu.Item>
            <Menu.Item key="DramaList">剧本列表</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub4"
            onClick={handleClickTeamMan}
            icon={<ScheduleOutlined />}
            title="组局管理"
          >
            <Menu.Item key="TeamAdd">添加组局</Menu.Item>
            <Menu.Item key="TeamList">组局列表</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub5"
            onClick={handleClickGoodsMan}
            icon={<ShoppingCartOutlined />}
            title="商品管理"
          >
            <Menu.Item key="GoodsAdd">添加商品</Menu.Item>
            <Menu.Item key="GoodsList">商品列表</Menu.Item>
          </SubMenu>
          <Menu.Item
            key="9"
            icon={<FileSearchOutlined />}
            onClick={handleClickOrderMan}
          >
            <span>订单管理</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>后台管理系统</Breadcrumb.Item>
            {/* <Breadcrumb.Item>工作台</Breadcrumb.Item> */}
          </Breadcrumb>
          <div style={{ padding: 24, background: "#fff" }}>
            <div>
              <Route path="/index/" />
              <Route path="/index/dramaAdd/" exact component={DramaAdd} />
              <Route path="/index/dramaAdd/:id" exact component={DramaAdd} />
              <Route path="/index/dramaList/" component={DramaList} />
              <Route path="/index/staffAdd/" exact component={StaffAdd} />
              <Route path="/index/staffAdd/:id" exact component={StaffAdd} />
              <Route path="/index/staffList/" component={StaffList} />
              <Route path="/index/goodsAdd/" exact component={GoodsAdd} />
              <Route path="/index/goodsAdd/:id" exact component={GoodsAdd} />
              <Route path="/index/goodsList/" component={GoodsList} />
              <Route path="/index/teamAdd/" exact component={TeamAdd} />
              <Route path="/index/teamAdd/:id" exact component={TeamAdd} />
              <Route path="/index/teamList/" component={TeamList} />
              <Route path="/index/roomAdd/" exact component={RoomAdd} />
              <Route path="/index/roomAdd/:id" exact component={RoomAdd} />
              <Route path="/index/roomList/" component={RoomList} />
              <Route
                path="/index/orderManageList/"
                component={OrderManageList}
              />
            </div>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>17jbs.com</Footer> */}
      </Layout>
    </Layout>
  );
}

export default AdminIndex;
