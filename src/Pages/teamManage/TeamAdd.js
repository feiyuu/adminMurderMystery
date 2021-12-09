import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, Button, Radio, DatePicker } from "antd";
import { LeftSquareOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import servicePath from "../../config/apiUrl";

const TeamAdd = (props) => {
  const [Id, setId] = useState(-1); // ID，如果是-1说明是新增加，如果不是0，说明是修改
  const [showSelectDrama, setShowSelectDrama] = useState(false);
  const [likeDramaName, setLikeDramaName] = useState("");
  const [likedata, setLikeData] = useState("");
  const [selectDrama, setSlectDrama] = useState();
  const [selectDate, setSlectDate] = useState();
  const [showCheckPsw, setShowCheckPsw] = useState(false);
  const [loginPsw, setLoginPsw] = useState("");
  const [editDmName, setEditDmName] = useState("");
  const [editDMId, setEditDMId] = useState("");
  const [valuesData, setValuesData] = useState("");

  useEffect(() => {
    let tempId = props.match.params.id;
    console.log("TeamAdd--useEffect===" + tempId);
    if (tempId) {
      setId(tempId);
      getTeamDetail(tempId);
    }
  }, []);

  const getTeamDetail = (Id) => {
    axios({
      method: "get",
      url: servicePath.getTeamDetail,
      params: { Id: Id },
      withCredentials: true,
    }).then((res) => {
      console.log("res.data.data========" + JSON.stringify(res.data.data));
      if (res.data.code == 1) {
        let data = res.data.data;
        form.setFieldsValue({
          ...data,
        });
        setSlectDate(data.startDate);
        setSlectDrama(data.drama);
        setEditDmName(data.dmNickName);
        setEditDMId(data.DMId);
      } else {
      }
    });
  };
  const getLikeDramaDetail = () => {
    axios({
      method: "get",
      url: servicePath.getLikeDramaDetail,
      params: { likeDramaName: likeDramaName },
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        setLikeData(res.data.data);
      } else {
        message.error(res.data.data);
      }
    });
  };

  const [form] = Form.useForm();

  const checkPassword = () => {
    console.log("checkPassword====");

    if (!loginPsw) {
      message.error("密码不可为空");
      return false;
    }
    let dataProps = {
      Id: editDMId,
      password: loginPsw,
    };

    axios({
      method: "post",
      url: servicePath.checkUserPsw,
      data: dataProps,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        handleOnFinish();
      } else {
        message.error("密码错误");
      }
    });
  };

  const onFinish = (values) => {
    if (!selectDrama) {
      message.error("请选择剧本");
      return;
    }
    if (!selectDate) {
      message.error("请选择日期");
      return;
    }

    values.startDate = selectDate;
    values.teamDramaId = selectDrama.Id;
    values.teamDramaName = selectDrama.dramaName;
    values.teamDramaNumbers = selectDrama.numbers;

    const user = JSON.parse(localStorage.getItem("user"));
    if (Id != -1) {
      values.Id = Id;
    } else {
      values.DMId = user.Id;
      values.dmNickName = user.dmNickName;
    }
    console.log("Success:", values);
    setValuesData(values);
    if (Id != -1 && user.Id != editDMId) {
      setShowCheckPsw(true);
    } else {
      handleOnFinish(values);
    }
  };

  const handleOnFinish = (values) => {
    //同一天同一场次组局数，不得超过房间数量
    axios({
      method: "post",
      url: Id != -1 ? servicePath.updateTeam : servicePath.insertTeam,
      data: values || valuesData,
      withCredentials: true,
    }).then((res) => {
      if (res.data.code == 1) {
        message.success(Id == -1 ? "创建成功" : "修改成功");
        props.history.push("/index/teamList");
      } else {
        message.error(res.data.data);
      }
    });
  };
  const handleBack = () => {
    props.history.goBack();
  };
  const handleSelectOk = () => {
    if (!likedata) {
      message.error("请选择剧本");
    } else {
      setSlectDrama(likedata);
      setShowSelectDrama(false);
      setLikeData("");
      setLikeDramaName("");
    }
  };
  const disabledDate = (current) => {
    return (
      current > moment().add(7, "days") || current < moment().startOf("day")
    );
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

  return (
    <div>
      {Id != -1 && Id != 0 ? (
        <div onClick={handleBack} style={{ width: "60px" }}>
          <LeftSquareOutlined /> 返回
        </div>
      ) : null}
      <Form {...layout} form={form} onFinish={onFinish}>
        <Form.Item
          label="选择剧本"
          rules={[
            {
              required: true,
              message: "请选择剧本",
            },
          ]}
        >
          {!selectDrama ? (
            <Button
              onClick={() => {
                setShowSelectDrama(true);
              }}
            >
              选择剧本
            </Button>
          ) : (
            <div
              onClick={() => {
                setShowSelectDrama(true);
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                visibility: selectDrama ? "visible" : "hidden",
              }}
            >
              <img
                src={selectDrama.dramaCover}
                style={{
                  width: 120,
                  height: 160,
                  borderRadius: 6,
                  marginRight: 10,
                }}
              />
              <div>
                <div style={{ fontWeight: "bold", fontSize: 18 }}>
                  {selectDrama.dramaName}
                </div>
                <div>
                  {selectDrama.genre}/{selectDrama.theme}/
                  {selectDrama.background}
                </div>
                <div>{selectDrama.NanNvShu}</div>
                <div>时长：{selectDrama.duration}小时</div>
                <div>难度：{selectDrama.difficulty}</div>
                <div>评分：{selectDrama.dramaGrade}分</div>
                <div>价格：{selectDrama.price}元/人</div>
              </div>
            </div>
          )}
        </Form.Item>
        <Form.Item label="选择时间">
          <DatePicker
            disabledDate={disabledDate}
            placeholder="请选择开局日期"
            format="YYYY-MM-DD"
            value={selectDate ? moment(selectDate, "YYYY-MM-DD") : ""}
            onChange={(date, dateString) => {
              setSlectDate(dateString);
            }}
          />
        </Form.Item>
        <Form.Item
          label="场次"
          name="startSession"
          rules={[
            {
              required: true,
              message: "请选择场次",
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="中场 14:00">中场 14:00</Radio.Button>
            <Radio.Button value="晚场 19:00">晚场 19:00</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {Id == -1 ? "确认创建" : "确认修改"}
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="请搜索剧本然后添加"
        visible={showSelectDrama}
        onOk={handleSelectOk}
        okText="选择"
        cancelText="取消"
        onCancel={() => {
          setShowSelectDrama(false);
          setLikeData("");
          setLikeDramaName("");
        }}
      >
        <Input
          style={{ width: 200, marginRight: 10 }}
          placeholder="请输入剧本名"
          onChange={(e) => {
            setLikeDramaName(e.target.value);
          }}
          value={likeDramaName}
        ></Input>
        <Button
          type="primary"
          onClick={() => {
            if (likeDramaName) {
              getLikeDramaDetail();
            } else {
              message.error("请输入剧本名");
            }
          }}
        >
          搜索
        </Button>
        <Button
          style={{
            margin: "0 8px",
          }}
          onClick={() => {
            setLikeDramaName("");
            setLikeData("");
          }}
        >
          清空
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            visibility: likedata ? "visible" : "hidden",
          }}
        >
          <img
            src={likedata.dramaCover}
            style={{
              width: 120,
              height: 160,
              borderRadius: 6,
              marginRight: 10,
            }}
          />
          <div>
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {likedata.dramaName}
            </div>
            <div>
              {likedata.genre}/{likedata.theme}/{likedata.background}
            </div>
            <div>{likedata.NanNvShu}</div>
            <div>时长：{likedata.duration}小时</div>
            <div>难度：{likedata.difficulty}</div>
            <div>评分：{likedata.dramaGrade}分</div>
            <div>价格：{likedata.price}元/人</div>
          </div>
        </div>
      </Modal>
      <Modal
        title="非本人创建的组局，请先验证密码"
        visible={showCheckPsw}
        onOk={checkPassword}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setShowCheckPsw(false);
          setLoginPsw("");
        }}
      >
        <Form {...layout}>
          <Form.Item label="DM">
            <Input disabled={true} value={editDmName} />
          </Form.Item>
          <Form.Item label="密码">
            <Input
              value={loginPsw}
              onChange={(e) => {
                setLoginPsw(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamAdd;
