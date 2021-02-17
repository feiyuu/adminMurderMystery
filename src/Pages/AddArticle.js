import React, { useState, useEffect } from "react";
import marked from "marked";
import "../static/css/AddArticle.css";
import { Row, Col, Input, Select, Button, DatePicker, message } from "antd";
import axios from "axios";
import servicePath from "../config/apiUrl";
import Moment from 'moment'

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

const AddAtricle = (props) => {
  const [articleId, setArticleId] = useState(0); // 剧本的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState(""); //剧本标题
  const [articleContent, setArticleContent] = useState(""); //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState("预览内容"); //html内容
  const [introducemd, setIntroducemd] = useState(); //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState("等待编辑"); //简介的html内容
  const [showDate, setShowDate] = useState(); //发布日期
  const [updateDate, setUpdateDate] = useState(); //修改日志的日期
  const [typeInfo, setTypeInfo] = useState([]); // 剧本类别信息
  const [selectedType, setSelectType] = useState("请选择类型"); //选择的剧本类别

  useEffect(() => {
    getTypeInfo();
    //获取剧本ID
    let tempId = props.match.params.id;
    if (tempId) {
      setArticleId(tempId);
      getArticleById(tempId);
    }
  }, []);

  marked.setOptions({
    renderer: marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
  });

  const changeContent = (e) => {
    setArticleContent(e.target.value);
    let html = marked(e.target.value);
    setMarkdownContent(html);
  };

  const changeIntroduce = (e) => {
    setIntroducemd(e.target.value);
    let html = marked(e.target.value);
    setIntroducehtml(html);
  };

  const getTypeInfo = () => {
    axios({
      method: "get",
      url: servicePath.getTypeInfo,
      withCredentials: true,
    }).then((res) => {
      if (res.data.data == "没有登录") {
        localStorage.removeItem("openId");
        props.history.push("/");
      } else {
        console.log(res.data.data);
        setTypeInfo(res.data.data);
      }
    });
  };

  const selectTypeHandler = (value) => {
    console.log(value);
    setSelectType(value);
  };

  const saveArticle = () => {
    if (!selectedType) {
      message.error("必须选择剧本类型");
      return false;
    } else if (!articleTitle) {
      message.error("剧本名称不能为空");
      return false;
    } else if (!articleContent) {
      message.error("剧本内容不能为空");
      return false;
    } else if (!introducemd) {
      message.error("剧本简介不能为空");
      return false;
    } else if (!showDate) {
      message.error("发布日期不能为空");
      return false;
    } else {
    }

    let dataProps = {};
    dataProps.type_id = selectedType;
    dataProps.title = articleTitle;
    dataProps.article_Content = articleContent;
    dataProps.introduce = introducemd;
    let dateText = showDate.replace("-", "/");
    dataProps.addTime = new Date(dateText).getTime() / 1000;

    if (articleId == 0) {
      dataProps.view_count = 0;
      axios({
        method: "post",
        url: servicePath.addArticle,
        data: dataProps,
        withCredentials: true,
      }).then((res) => {
        setArticleId(res.data.insertId);
        if (res.data.isSuccess) {
          message.success("剧本保存成功");
        } else {
          message.error("剧本保存失败");
        }
      });
    } else {
      dataProps.Id = articleId;
      axios({
        method: "post",
        url: servicePath.updateArticle,
        data: dataProps,
        withCredentials: true,
      }).then((res) => {
        if (res.data.isSuccess) {
          message.success("剧本修改成功");
        } else {
          message.error("剧本修改失败");
        }
      });
    }
  };

  const getArticleById = (id) => {
    axios(servicePath.getArticleById + id, { withCredentials: true }).then(
      (res) => {
        if (res.data.data) {
          let articleInfo = res.data.data[0];
          setArticleTitle(articleInfo.title);
          setArticleContent(articleInfo.article_content);
          let html = marked(articleInfo.article_content);
          setMarkdownContent(html);
          setIntroducemd(articleInfo.introduce);
          let htmlIn = marked(articleInfo.introduce);
          setIntroducehtml(htmlIn);
          setShowDate(articleInfo.addTime);
          setSelectType(articleInfo.typeId);
        }
      }
    );
  };

  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10}>
            <Col span={20}>
              <Input
                value={articleTitle}
                placeholder="剧本名"
                size="large"
                onChange={(e) => {
                  setArticleTitle(e.target.value);
                }}
              ></Input>
            </Col>
            <Col span={4}>
              &nbsp;
              <Select
                defaultValue={selectedType}
                size="large"
                onChange={selectTypeHandler}
              >
                {typeInfo.map((item, index) => {
                  return (
                    <Option value={index} key={index} value={item.Id}>
                      {item.typeName}
                    </Option>
                  );
                })}
              </Select>
            </Col>
          </Row>
          <br></br>
          <Row gutter={10}>
            <Col span={12}>
              <TextArea
                className="markdown-content"
                rows={35}
                value={articleContent}
                placeholder="剧本内容"
                onChange={changeContent}
              ></TextArea>
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML={{ __html: markdownContent }}
              ></div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <Col span="24">
              <Button size="large">暂存剧本</Button>&nbsp;
              <Button type="primary" size="large" onClick={saveArticle}>
                发布剧本
              </Button>
            </Col>
            <br></br>
            <Col span="24">
              <TextArea
                raws={4}
                placeholder="剧本简介"
                value={introducemd}
                onChange={changeIntroduce}
              ></TextArea>
              <br></br>
              <div
                className="introduce-html"
                dangerouslySetInnerHTML={{ __html: introducehtml }}
              ></div>
              <Col span={12}>
                <div className="date-select">
                  <DatePicker
                    placeholder="发布日期"
                    size="large"
                    onChange={(date, dateString) => {
                      setShowDate(dateString);
                    }}
                  ></DatePicker>
                </div>
              </Col>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default AddAtricle;
