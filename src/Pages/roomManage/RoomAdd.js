import React, { useState, useEffect } from "react";
import "../../static/css/roomManage/RoomAdd.css";
import { Form, Upload, Input, message, Button } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  LeftSquareOutlined,
} from "@ant-design/icons";
import axios from "axios";
import servicePath from "../../config/apiUrl";
import qiniu from "../../config/common";

const RoomAdd = (props) => {
  const [Id, setId] = useState(-1); // Dm的ID，如果是-1说明是新增加，如果不是0，说明是修改
  const [imageUrl, setImageUrl] = useState(""); //房间照片
  const [loading, setLoading] = useState(false); //上传中
  const [uploadToken, setUploadToken] = useState(""); //
  const [fileKey, setFileKey] = useState(""); //

  useEffect(() => {
    axios.defaults.headers["Authorization"] = localStorage.getItem("token");
    let tempId = props.match.params.id;
    if (tempId) {
      setId(tempId);
      getRoomDetail(tempId);
    }
    getAuth();
  }, []);

  const getRoomDetail = (Id) => {
    axios({
      method: "get",
      url: servicePath.getRoomDetail,
      params: { Id: Id },
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 101) {
        message.error("登录失效，请重新登录！");
        props.history.push("/");
        return;
      }
      if (res.data.code == 1) {
        let data = res.data.data[0];
        form.setFieldsValue({
          ...data,
        });
        setImageUrl(data.roomDecorate);
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
      // Get this url from response in real world.
      const imageKey = info.file.response.key;
      const uploadUrl = qiniu.picDomain + imageKey;
      setImageUrl(uploadUrl);
      setLoading(false);
      form.setFieldsValue({
        roomDecorate: uploadUrl,
      });
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

  const getAuth = () => {
    axios({
      method: "get",
      url: servicePath.getAuth,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 101) {
        message.error("登录失效，请重新登录！");
        props.history.push("/");
        return;
      }
      if (res.data.code == 1 && res.data.data) {
        console.log("getAuth===data == " + res.data.data);
        setUploadToken(res.data.data);
      } else {
      }
    });
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
    if (!imageUrl) {
      message.error("请上传房间装修照片！");
      return;
    }
    values.Id = Id;
    console.log("Success:", values);
    axios({
      method: "post",
      url: servicePath.updaTeRoom,
      data: values,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        message.success(Id == -1 ? "创建成功" : "修改成功");
        if (Id != -1) {
          props.history.push("/index/roomList");
        } else {
          form.resetFields();
          setImageUrl("");
          setLoading(false);
          setFileKey("");
        }
      } else {
      }
    });
  };

  const handleBack = () => {
    props.history.goBack();
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 8,
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
    <div className="page-room-add">
      {Id != -1 && Id != 0 ? (
        <div onClick={handleBack} style={{ width: "60px" }}>
          <LeftSquareOutlined /> 返回
        </div>
      ) : null}

      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item name="roomDecorate" label="房间装修" initialValue="">
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
                alt="avatar"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="roomName"
          label="房间风格"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="roomLabel"
          label="房间号"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {Id == -1 ? "确认创建" : "确认修改"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RoomAdd;
