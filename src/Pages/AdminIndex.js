import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Avatar } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "../static/css/AdminIndex.css";
import { Route } from "react-router-dom";
import DramaAdd from "./dramaManage/DramaAdd";
import DramaList from "./dramaManage/DramaList";
import StaffAdd from "./staffManage/StaffAdd";
import StaffList from "./staffManage/StaffList";
import GoodsList from "./goodsManage/GoodsList";
import GoodsAdd from "./goodsManage/GoodsAdd";
import OrderManageList from "./OrderManageList";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function AdminIndex(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let user = localStorage.getItem("user");
    console.log("user grade===" + JSON.parse(user).grade);
    if (JSON.parse(user)) {
      setUserData(JSON.parse(user));
    }
  }, []);

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

  return (
    <Layout style={{ minHeight: document.documentElement.clientHeight,minWidth:document.documentElement.clientWidth }} >
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo">
          <Avatar shape="square" size={54} src={userData.dmAvatarUrl} />
          <div style={{ marginTop: "8px" }}>{userData.dmNickName}</div>
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
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
            onClick={handleClickDramaMan}
            icon={<DesktopOutlined />}
            title="剧本管理"
          >
            <Menu.Item key="DramaAdd">添加剧本</Menu.Item>
            <Menu.Item key="DramaList">剧本列表</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            onClick={handleClickGoodsMan}
            icon={<DesktopOutlined />}
            title="商品管理"
          >
            <Menu.Item key="GoodsAdd">添加商品</Menu.Item>
            <Menu.Item key="GoodsList">商品列表</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}onClick={handleClickOrderMan}>
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
          <div style={{ padding: 24, background: "#fff"}}>
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
              <Route path="/index/orderManageList/" component={OrderManageList} />
            </div>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>17jbs.com</Footer> */}
      </Layout>
    </Layout>
  );
}

export default AdminIndex;
