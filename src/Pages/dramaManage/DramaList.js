import React, { useState, useEffect } from "react";
import "../../static/css/dramaManage/DramaList.css";
import {
  List,
  Row,
  Col,
  Modal,
  message,
  Button,
  Switch,
  Avatar,
  Card,
  Image,
  Select,
  Form,
  Input,
} from "antd";
import axios from "axios";
import servicePath from "../../config/apiUrl";
const { confirm } = Modal;

function DramaList(props) {
  const [list, setList] = useState([]);

  const getList = (params) => {
    axios({
      method: "get",
      url: servicePath.getFilterDramaList,
      params: {
        filters: params,
        page: 1,
        pageSize: 9999,
      },
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
  const updateDrama = (id, checked) => {
    props.history.push("/index/dramaAdd/" + id);
  };

  useEffect(() => {
    getList({});
  }, []);

  const SearchForm = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
      values = removeEmpty(values);
      console.log("Received values of form: ", values);
      getList(values);
    };
    const removeEmpty = (obj) => {
      Object.keys(obj).forEach(function (key) {
        (obj[key] && typeof obj[key] === "object" && removeEmpty(obj[key])) ||
          ((obj[key] === undefined || obj[key] === null || obj[key] === "") &&
            delete obj[key]);
      });
      return obj;
    };
    return (
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col span={6} key="dramaName">
            <Form.Item name="dramaName" label="剧本名称" initialValue="">
              <Input />
            </Form.Item>
          </Col>
          <Col span={3} key="numbers">
            <Form.Item label="人数" name="numbers">
              <Select defaultValue="全部">
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={2}>2人</Select.Option>
                <Select.Option value={3}>3人</Select.Option>
                <Select.Option value={4}>4人</Select.Option>
                <Select.Option value={5}>5人</Select.Option>
                <Select.Option value={6}>6人</Select.Option>
                <Select.Option value={7}>7人</Select.Option>
                <Select.Option value={8}>8人</Select.Option>
                <Select.Option value={9}>9人</Select.Option>
                <Select.Option value={10}>10人</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3} key="duration">
            <Form.Item label="时长" name="duration">
              <Select defaultValue="全部">
                <Select.Option value="">全部</Select.Option>
                <Select.Option value={3}>3小时</Select.Option>
                <Select.Option value={4}>4小时</Select.Option>
                <Select.Option value={5}>5小时</Select.Option>
                <Select.Option value={6}>6小时</Select.Option>
                <Select.Option value={7}>7小时</Select.Option>
                <Select.Option value={8}>8小时</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3} key="background">
            <Form.Item label="背景" name="background">
              <Select defaultValue="全部">
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="古风">古风</Select.Option>
                <Select.Option value="民国">民国</Select.Option>
                <Select.Option value="现代">现代</Select.Option>
                <Select.Option value="未来">未来</Select.Option>
                <Select.Option value="架空">架空</Select.Option>
                <Select.Option value="日式">日式</Select.Option>
                <Select.Option value="欧式">欧式</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3} key="theme">
            <Form.Item label="主题" name="theme">
              <Select defaultValue="全部">
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="惊悚">惊悚</Select.Option>
                <Select.Option value="情感">情感</Select.Option>
                <Select.Option value="推理">推理</Select.Option>
                <Select.Option value="欢乐">欢乐</Select.Option>
                <Select.Option value="阵营">阵营</Select.Option>
                <Select.Option value="机制">机制</Select.Option>
                <Select.Option value="谍战">谍战</Select.Option>
                <Select.Option value="武侠">武侠</Select.Option>
                <Select.Option value="玄幻">玄幻</Select.Option>
                <Select.Option value="立意">立意</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3} key="type">
            <Form.Item label="类型" name="type">
              <Select defaultValue="全部">
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="新本格">新本格</Select.Option>
                <Select.Option value="本格">本格</Select.Option>
                <Select.Option value="变革">变革</Select.Option>
                <Select.Option value="还原">还原</Select.Option>
                <Select.Option value="封闭">封闭</Select.Option>
                <Select.Option value="半封闭">半封闭</Select.Option>
                <Select.Option value="开放">开放</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3} key="difficulty">
            <Form.Item label="难度" name="difficulty">
              <Select defaultValue="全部">
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="简单">简单</Select.Option>
                <Select.Option value="进阶">进阶</Select.Option>
                <Select.Option value="硬核">硬核</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            span={24}
            style={{
              textAlign: "left",
            }}
          >
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => {
                form.resetFields();
              }}
            >
              清空
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };
  return (
    <div>
      <SearchForm />
      <List
        grid={{ gutter: 46, column: 8 }}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 16,
        }}
        style={{marginTop:20}}
        dataSource={list}
        renderItem={(item) => (
          <List.Item>
            <Card hoverable bordered style={{ borderRadius: 6, width: 180, height: 260 }}>
              <div style={{ position: "relative" }} onClick={() => updateDrama(item.Id)}>
                <Image
                  style={{ borderRadius: 6, width: 180, height: 260 }}
                  preview={false}
                  src={item.dramaCover}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    color: "black",
                    backgroundColor: "#B3937ada",
                    width: 180,
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                  }}
                >
                  <div style={{ paddingLeft: 8, paddingRight: 8,fontWeight:"bold",fontSize:14 }}>
                    禁止套娃
                  </div>
                  <div
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      paddingBottom: 4,
                      fontSize:8,
                      color:"#333"
                    }}
                  >
                    硬核/国民/推理
                  </div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}

export default DramaList;
