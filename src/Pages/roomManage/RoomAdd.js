import React, { useState, useEffect } from "react";
import "../../static/css/roomManage/RoomAdd.css";
import {
  Form,
  Upload,
  Input,
  message,
  Button,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  LeftSquareOutlined,
} from "@ant-design/icons";
import axios from "axios";
import servicePath from "../../config/apiUrl";

const RoomAdd = (props) => {
  const [Id, setId] = useState(-1); // Dm的ID，如果是-1说明是新增加，如果不是0，说明是修改
  const [imageUrl, setImageUrl] = useState(""); //房间照片
  const [loading, setLoading] = useState(false); //上传中

  useEffect(() => {
    let tempId = props.match.params.id;
    if (tempId) {
      setId(tempId);
      getRoomDetail(tempId);
    }
  }, []);

  const getRoomDetail = (Id) => {
    axios({
      method: "get",
      url: servicePath.getRoomDetail,
      params: { Id: Id },
      withCredentials: true,
    }).then((res) => {
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
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
        form.setFieldsValue({
          roomDecorate: imageUrl,
        });
      });
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
    return (isJPG || isPNG || isGIF || isBMP) && isLt2M;
  };

  const [form] = Form.useForm();

  const onFinish = (values) => {
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
        props.history.push("/index/roomList");
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
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
