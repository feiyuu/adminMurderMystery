import React, { useState, useEffect } from "react";
import "../../static/css/dramaManage/DramaAdd.css";
import {
  Form,
  Upload,
  Input,
  message,
  Button,
  Radio,
  InputNumber,
  Checkbox,
  Space,
  List,
  Card,
  Image,
  Modal,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  LeftSquareOutlined,
} from "@ant-design/icons";
import axios from "axios";
import servicePath from "../../config/apiUrl";
import qiniu from "../../config/common";
const { TextArea } = Input;
const { confirm } = Modal;

const DramaAdd = (props) => {
  const [Id, setId] = useState(-1);
  // Dm的ID，如果是-1说明是新增加，如果不是0，说明是修改
  const [imageUrl, setImageUrl] = useState(""); //
  const [loading, setLoading] = useState(false); //
  const [nan, setNan] = useState(0);
  const [nv, setNv] = useState(0);
  const [fanChuan, setFanChuan] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [uploadToken, setUploadToken] = useState(""); //
  const [fileKey, setFileKey] = useState(""); //

  useEffect(() => {
    let tempId = props.match.params.id;
    console.log("DramaAdd--useEffect===" + tempId);
    getAuth();
    if (tempId) {
      setId(tempId);
      getDramaDetail(tempId);
    } else {
    }
  }, []);

  const getDramaDetail = (Id) => {
    axios({
      method: "get",
      url: servicePath.getDramaDetail,
      params: { Id: Id },
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        let data = res.data.data;
        console.log("res.data.data========" + JSON.stringify(res.data.data));
        form.setFieldsValue({
          ...data,
        });
        let NanNvShuTemp = data.NanNvShu;
        let nanStr = NanNvShuTemp.substring(
          NanNvShuTemp.indexOf("男") - 1,
          NanNvShuTemp.indexOf("男")
        );
        let nvStr = NanNvShuTemp.substring(
          NanNvShuTemp.indexOf("女") - 1,
          NanNvShuTemp.indexOf("女")
        );
        setNan(Number(nanStr));
        setNv(Number(nvStr));
        if (NanNvShuTemp.indexOf("可反串") != -1) {
          setFanChuan("(可反串)");
        }

        setRoleList(data.roles);
        setImageUrl(data.dramaCover);
      } else {
      }
    });
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const imageKey = info.file.response.key;
      const uploadUrl = qiniu.picDomain + imageKey;
      setImageUrl(uploadUrl);
      setLoading(false);
    } else {
      setLoading(false);
      getAuth();
    }
  };
  const handleChangeRoleList = (info, index) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      const imageKey = info.file.response.key;
      const uploadUrl = qiniu.picDomain + imageKey;
      let roleListTemp = JSON.parse(JSON.stringify(roleList));
      roleListTemp[index].roleAvatar = uploadUrl;
      setRoleList(roleListTemp);
      setLoading(false);
    } else {
      setLoading(false);
      getAuth();
    }
  };
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const beforeUpload = (file) => {
    const isJPG = file.type === "image/jpeg";
    const isPNG = file.type === "image/png";
    const isGIF = file.type === "image/gif";
    const isBMP = file.type === "image/bmp";
    if (!(isJPG || isPNG || isGIF || isBMP)) {
      message.error("您只能上传PNG、JPG、JPEG、Gif、BMP格式的图片");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("您上传的图片不能超过2MB!");
    }

    return new Promise((resolve, reject) => {
      if ((isJPG || isPNG || isGIF || isBMP) && isLt2M) {
        setFileKey(file.name);
        return resolve(true);
      } else {
        return reject(false);
      }
    });
  };
  const beforeUploadRoleList = (file, index) => {
    const isJPG = file.type === "image/jpeg";
    const isPNG = file.type === "image/png";
    const isGIF = file.type === "image/gif";
    const isBMP = file.type === "image/bmp";
    if (!(isJPG || isPNG || isGIF || isBMP)) {
      message.error("您只能上传PNG、JPG、JPEG、Gif、BMP格式的图片");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("您上传的图片不能超过2MB!");
    }

    return new Promise((resolve, reject) => {
      if ((isJPG || isPNG || isGIF || isBMP) && isLt2M) {
        let roleListTemp = JSON.parse(JSON.stringify(roleList));
        roleListTemp[index].fileKey = file.name;
        setRoleList(roleListTemp);
        return resolve(true);
      } else {
        return reject(false);
      }
    });
  };

  const getAuth = () => {
    axios({
      method: "get",
      url: servicePath.getAuth,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1 && res.data.data) {
        console.log("getAuth===data == " + res.data.data);
        setUploadToken(res.data.data);
      } else {
      }
    });
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    if (Id != -1) {
      values.Id = Id;
    }
    if (!imageUrl) {
      message.error("请上传剧本封面！");
      return;
    }
    values.NanNvShu = nan + "男" + nv + "女" + fanChuan;
    values.numbers = nan + nv;
    values.dramaCover = imageUrl;
    values.roles = roleList;
    console.log("Success:", values);
    axios({
      method: "post",
      url: Id == -1 ? servicePath.inertDrama : servicePath.updateDrama,
      data: values,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        message.success(Id == -1 ? "创建成功" : "修改成功");
        props.history.push("/index/dramaList");
      } else {
      }
    });
  };
  const deleteDrama = () => {
    confirm({
      title: "确定要删除剧本吗？",
      content: "删除后无法恢复",
      okType: "danger",
      okText: "删除",
      cancelText: "取消",
      onOk() {
        axios({
          method: "post",
          url: servicePath.deleteDrama,
          data: { dramaId: Id },
          withCredentials: true,
        }).then((res) => {
          if (res.data.code == 1) {
            message.success("剧本已删除");
            props.history.push("/index/dramaList");
          } else {
            message.error(res.data.data);
          }
        });
      },
      onCancel() {},
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleBack = () => {
    props.history.goBack();
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 8,
    },
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <div className="page-drama-add">
      {Id != -1 && Id != 0 ? (
        <div onClick={handleBack} style={{ width: "60px" }}>
          <LeftSquareOutlined /> 返回
        </div>
      ) : null}

      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item name="dramaCover" label="剧本封面" initialValue="">
          <Upload
            listType="picture-card"
            showUploadList={false}
            action={qiniu.picUpLoadUrl}
            data={{ token: uploadToken, key: fileKey }}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                style={{ width: 120, height: 160, borderRadius: 6 }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="dramaName"
          label="剧本名称"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Input style={{ width: 600 }} />
        </Form.Item>
        <Form.Item
          name="profile"
          label="剧本简介"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <TextArea maxLength={76} style={{ height: 60, width: 600 }} />
        </Form.Item>
        <Form.Item
          label="时长"
          name="duration"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value={3}>3小时</Radio.Button>
            <Radio.Button value={4}>4小时</Radio.Button>
            <Radio.Button value={5}>5小时</Radio.Button>
            <Radio.Button value={6}>6小时</Radio.Button>
            <Radio.Button value={7}>7小时</Radio.Button>
            <Radio.Button value={8}>8小时</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="背景"
          name="background"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="古风">古风</Radio.Button>
            <Radio.Button value="民国">民国</Radio.Button>
            <Radio.Button value="现代">现代</Radio.Button>
            <Radio.Button value="未来">未来</Radio.Button>
            <Radio.Button value="架空">架空</Radio.Button>
            <Radio.Button value="日式">日式</Radio.Button>
            <Radio.Button value="欧式">欧式</Radio.Button>
            <Radio.Button value="其他">其他</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="主题"
          name="theme"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="惊悚">惊悚</Radio.Button>
            <Radio.Button value="情感">情感</Radio.Button>
            <Radio.Button value="推理">推理</Radio.Button>
            <Radio.Button value="欢乐">欢乐</Radio.Button>
            <Radio.Button value="阵营">阵营</Radio.Button>
            <Radio.Button value="机制">机制</Radio.Button>
            <Radio.Button value="谍战">谍战</Radio.Button>
            <Radio.Button value="武侠">武侠</Radio.Button>
            <Radio.Button value="玄幻">玄幻</Radio.Button>
            <Radio.Button value="立意">立意</Radio.Button>
            <Radio.Button value="其他">其他</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="类型"
          name="genre"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="新本格">新本格</Radio.Button>
            <Radio.Button value="本格">本格</Radio.Button>
            <Radio.Button value="变格">变格</Radio.Button>
            <Radio.Button value="还原">还原</Radio.Button>
            <Radio.Button value="封闭">封闭</Radio.Button>
            <Radio.Button value="半封闭">半封闭</Radio.Button>
            <Radio.Button value="开放">开放</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="难度"
          name="difficulty"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="简单">简单</Radio.Button>
            <Radio.Button value="进阶">进阶</Radio.Button>
            <Radio.Button value="硬核">硬核</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="男女数">
          <Space>
            <InputNumber
              min={0}
              max={10 - nv}
              style={{ width: 100 }}
              addonAfter={"男"}
              value={nan}
              onChange={(value) => {
                setNan(value);
                setRoleList(new Array(value + nv).fill({}));
              }}
            />
            <InputNumber
              min={0}
              max={10 - nan}
              style={{ width: 100 }}
              addonAfter={"女"}
              value={nv}
              onChange={(value) => {
                setNv(value);
                setRoleList(new Array(nan + value).fill({}));
              }}
            />
            <Checkbox
              checked={fanChuan}
              onChange={(e) => {
                if (e.target.checked) {
                  setFanChuan("(可反串)");
                } else {
                  setFanChuan("");
                }
              }}
            >
              可反串
            </Checkbox>
          </Space>
        </Form.Item>
        <Form.Item label="媒体评分" name="dramaGrade" initialValue={1}>
          <InputNumber min={1} max={10} style={{ width: 100 }} />
        </Form.Item>
        <Form.Item label="是否预发" name="beforehand" initialValue={0}>
          <Radio.Group>
            <Radio.Button value={1}>是</Radio.Button>
            <Radio.Button value={0}>否</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="价格"
          name="price"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <InputNumber style={{ width: 100 }} />
        </Form.Item>
        <Form.Item label="角色">
          <Space>
            <List
              grid={{ gutter: 16, column: roleList.length }}
              dataSource={roleList}
              renderItem={(item, index) => (
                <List.Item>
                  <Card
                    hoverable
                    bordered
                    style={{ borderRadius: 6, width: 120 }}
                  >
                    <div>
                      <Upload
                        listType="picture-card"
                        showUploadList={false}
                        action={qiniu.picUpLoadUrl}
                        data={{ token: uploadToken, key: item.fileKey }}
                        beforeUpload={(file) =>
                          beforeUploadRoleList(file, index)
                        }
                        onChange={(info) => handleChangeRoleList(info, index)}
                      >
                        {item.roleAvatar ? (
                          <Image
                            style={{
                              borderRadius: 6,
                              width: 120,
                              height: 160,
                            }}
                            preview={false}
                            src={item.roleAvatar}
                          />
                        ) : (
                          uploadButton
                        )}
                      </Upload>

                      <div
                        className="rolefooter"
                        style={{
                          color: "black",
                          width: 120,
                          borderBottomLeftRadius: 4,
                          borderBottomRightRadius: 4,
                        }}
                      >
                        <Input
                          style={{
                            paddingLeft: 8,
                            paddingRight: 8,
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                          bordered={false}
                          placeholder="请输入角色名字"
                          value={item.roleName}
                          onChange={(e) => {
                            let roleListTemp = JSON.parse(
                              JSON.stringify(roleList)
                            );
                            roleListTemp[index].roleName = e.target.value;
                            setRoleList(roleListTemp);
                          }}
                        ></Input>
                        <Radio.Group
                          bordered={false}
                          onChange={(e) => {
                            let roleListTemp = JSON.parse(
                              JSON.stringify(roleList)
                            );
                            roleListTemp[index].roleSex = e.target.value;
                            setRoleList(roleListTemp);
                          }}
                          value={item.roleSex}
                        >
                          <Radio.Button value="男">男</Radio.Button>
                          <Radio.Button value="女">女</Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Space>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {Id == -1 ? "确认创建" : "确认修改"}
          </Button>
          <Button
            style={{
              visibility: Id == -1 ? "hidden" : "visible",
              margin: "0 8px",
            }}
            onClick={deleteDrama}
          >
            删除剧本
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DramaAdd;
