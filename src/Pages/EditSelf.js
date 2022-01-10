import React, { useState, useEffect } from "react";
import "../static/css/staffManage/StaffAdd.css";
import { Form, Upload, Input, message, Button, Radio } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  LeftSquareOutlined,
} from "@ant-design/icons";
import axios from "axios";
import servicePath from "../config/apiUrl";
import qiniu from "../config/common";

const EditSelf = (props) => {
  const [Id, setId] = useState(-1); // ID，如果是-1说明是新增加，如果不是0，说明是修改
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false); //
  const [uploadToken, setUploadToken] = useState(""); //
  const [fileKey, setFileKey] = useState(""); //

  useEffect(() => {
    axios.defaults.headers['Authorization'] = localStorage.getItem("token");
    let tempId = props.match.params.id;
    console.log("EditSelf--useEffect===" + tempId);
    getAuth();
    if (tempId) {
      setId(tempId);
      getUser(tempId);
    } else {
      autoId();
    }
  }, []);

  const autoId = (Id) => {
    axios({
      method: "get",
      url: servicePath.autoId,
      withCredentials: true,
    }).then((res) => {
      console.log("res.data.data========" + JSON.stringify(res.data.data));
      if (res.data.code == 1) {
        form.setFieldsValue({
          loginName: res.data.data,
        });
      } else {
      }
    });
  };
  const getUser = (Id) => {
    axios({
      method: "get",
      url: servicePath.getUser,
      params: { Id: Id },
      withCredentials: true,
    }).then((res) => {
      console.log("res.data.data========" + JSON.stringify(res.data.data));
      if (res.data.code == 1) {
        let data = res.data.data;
        form.setFieldsValue({
          ...data,
        });
        setImageUrl(data.dmAvatarUrl);
      } else {
      }
    });
  };

  const handleChange = (info) => {
    console.log("handleChange====info===" + JSON.stringify(info.file));
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
        dmAvatarUrl: uploadUrl,
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
      if(res.data.code==101){
        message.error("登录失效，请重新登录！")
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
    console.log("Success:", values);
    if (!imageUrl) {
      message.error("请上传头像！");
      return;
    }
    axios({
      method: "post",
      url: Id == -1 ? servicePath.inertUser : servicePath.updateUser,
      data: values,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        message.success(Id == -1 ? "创建成功" : "修改成功");
        if (Id != -1) {
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
  const handleLogout = () => {
    props.history.push("/");
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
    <div className="page-staff-add">
      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item
          name="loginName"
          label="工号"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="loginPsw"
          label="密码"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="dmNickName" label="昵称" initialValue="">
          <Input />
        </Form.Item>
        <Form.Item name="dmAvatarUrl" label="头像" initialValue="">
          <Upload
            listType="picture-card"
            multiple={false}
            showUploadList={false}
            action={qiniu.picUpLoadUrl}
            data={{ token: uploadToken, key: fileKey }}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="性别" name="dmGender" initialValue={0}>
          <Radio.Group>
            <Radio.Button value={1}>男</Radio.Button>
            <Radio.Button value={0}>女</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {Id == -1 ? "确认创建" : "确认修改"}
          </Button>
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={handleLogout}
          >
            退出账号
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditSelf;
