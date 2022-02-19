import { useState, useEffect } from "react";
import {
  Row,
  Col,
  List,
  Button,
  Input,
  Select,
  Tooltip,
  Typography,
  message,
  Popconfirm,
} from "antd";
import {
  ArrowRightOutlined,
  EyeTwoTone,
  HighlightTwoTone,
  RollbackOutlined,
} from "@ant-design/icons";
const { Option } = Select;
const modeOption = [
  { value: "排序1" },
  { value: "前缀" },
  { value: "排序2" },
  { value: "原名" },
  { value: "排序3" },
  { value: "后缀" },
  { value: "排序4" },
];
const path = window.require("path");
const fsPromises = window.require("fs").promises;
const App = function () {
  const [fileList, setFileList] = useState([]);
  const [modeList, setModeList] = useState(["原名"]);
  const [px1, setPx1] = useState("");
  const [beforeStr, setBeforeStr] = useState("");
  const [px2, setPx2] = useState("");
  const [useold, setUseold] = useState(true);
  const [px3, setPx3] = useState("");
  const [afterStr, setAfterStr] = useState("");
  const [px4, setPx4] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const hasRepeat = () => {
    const newList = new Set();
    for (let i = 0; i < fileList.length; i++) {
      if (newList.has(fileList[i].newName)) {
        return true;
      } else {
        newList.add(fileList[i].newName);
      }
    }
    return false;
  };
  const addFiles = (e) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = "true";
    // fileInput.webkitdirectory = "true";
    fileInput.onchange = (e) => {
      setFileList([
        ...Array.from(e.target.files).map((item) => {
          // { root: '/',
          //   dir: '/home/user/dir',
          //   base: 'file.txt',
          //   ext: '.txt',
          //   name: 'file' }
          return { ...path.parse(item.path), newName: "" };
        }),
      ]);
    };
    fileInput.click();
  };
  const sortModeToNum = (mode, index) => {
    let tempNum = index + 1;
    switch (mode) {
      case "X":
        return tempNum;
      case "XX":
        return tempNum > 9 ? tempNum : "0" + tempNum;
      case "XXX":
        return tempNum > 99
          ? tempNum
          : tempNum > 9
          ? "0" + tempNum
          : "00" + tempNum;
      default:
        return "";
    }
  };
  const proviewName = () => {
    const newFileList = fileList.map((item, index) => {
      return {
        ...item,
        newName:
          sortModeToNum(px1, index) +
          beforeStr +
          sortModeToNum(px2, index) +
          (useold ? item.name : "") +
          sortModeToNum(px3, index) +
          afterStr +
          sortModeToNum(px4, index),
      };
    });

    setFileList(newFileList);
    setIsPreview(true);
  };
  const modeChangeHandle = (mode) => {
    setUseold(mode.includes("原名"));
    if (mode.includes("排序1") === false) {
      setPx1("");
    }
    if (mode.includes("排序2") === false) {
      setPx2("");
    }
    if (mode.includes("排序3") === false) {
      setPx3("");
    }
    if (mode.includes("排序4") === false) {
      setPx4("");
    }
    if (mode.includes("前缀") === false) {
      setBeforeStr("");
    }
    if (mode.includes("后缀") === false) {
      setAfterStr("");
    }
    setModeList(mode);
    setIsPreview(false);
  };
  const confirmChangeName = () => {
    changeName();
  };
  const cancelChangeName = () => {
    message.info("取消成功", 2);
  };
  const confirmWithdraw = () => {
    message.info("暂不支持");
  }; 
  const changeName = () => {
    if (hasRepeat()) {
      return message.warning("请保证命名不重复！");
    }
    if (isPreview === false) {
      message.warn("请预览，确认效果！", 2);
    } else {
      console.log(fileList);
      const taskList = [];
      fileList.map((file) => {
        taskList.push(
          new Promise((resolve, reject) => {
            fsPromises
              .rename(
                path.join(file.dir, file.base),
                path.join(file.dir, file.newName + file.ext)
              )
              .then(() => {
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          })
        );
      });
      Promise.allSettled(taskList).then((res) => {
        setIsPreview(false);
        const rejectFiles = [];
        res.map((item) => {
          if (item.status === "rejected") {
            2;
            rejectFiles.push(path.parse(item.reason.path).base);
          }
        });
        if (rejectFiles.length === 0) {
          message.success("修改成功", 2);
        } else {
          message.error(`改名失败的有:${rejectFiles}`, 4);
        }
      });
    }
  };
  return (
    <div>
      <div style={{ padding: "12px 24px" }}>
        <Row align="middle">
          <Col span={4}>
            <Button type="primary" onClick={addFiles}>
              选择文件
            </Button>
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            OldName <ArrowRightOutlined />
          </Col>
          <Col span={12}>
            <Select
              mode="multiple"
              showArrow
              defaultValue={["原名"]}
              style={{ width: "100%" }}
              options={modeOption}
              placeholder="添加规则"
              maxTagCount="responsive"
              onChange={modeChangeHandle}
            />
          </Col>
          <Col span={4} style={{ textAlign: "center" }}>
            <ArrowRightOutlined /> NewName
          </Col>
        </Row>
        <Row
          align="middle"
          justify="center"
          style={{ marginTop: "10px" }}
          gutter={[8, 16]}
          wrap={false}
        >
          <Col>
            <ArrowRightOutlined />
          </Col>
          {modeList.includes("排序1") && (
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => {
                  setPx1(value);
                  setIsPreview(false);
                }}
              >
                <Option value="X">1~X</Option>
                <Option value="XX">01~X</Option>
                <Option value="XXX">001~X</Option>
              </Select>
            </Col>
          )}
          {modeList.includes("前缀") && (
            <Col span={3}>
              <Input
                placeholder="前缀"
                onChange={(e) => {
                  setBeforeStr(e.target.value);
                  setIsPreview(false);
                }}
              ></Input>
            </Col>
          )}
          {modeList.includes("排序2") && (
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => {
                  setPx2(value);
                  setIsPreview(false);
                }}
              >
                <Option value="X">1~X</Option>
                <Option value="XX">01~X</Option>
                <Option value="XXX">001~X</Option>
              </Select>
            </Col>
          )}
          {modeList.includes("原名") && (
            <Col span={2} style={{ textAlign: "center" }}>
              <Typography.Text mark>原名</Typography.Text>
            </Col>
          )}
          {modeList.includes("排序3") && (
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => {
                  setPx3(value);
                  setIsPreview(false);
                }}
              >
                <Option value="X">1~X</Option>
                <Option value="XX">01~X</Option>
                <Option value="XXX">001~X</Option>
              </Select>
            </Col>
          )}
          {modeList.includes("后缀") && (
            <Col span={3}>
              <Input
                placeholder="后缀"
                onChange={(e) => {
                  setAfterStr(e.target.value);
                  setIsPreview(false);
                }}
              ></Input>
            </Col>
          )}
          {modeList.includes("排序4") && (
            <Col span={3}>
              <Select
                style={{ width: "100%" }}
                onChange={(value) => {
                  setPx4(value);
                  setIsPreview(false);
                }}
              >
                <Option value="X">1~X</Option>
                <Option value="XX">01~X</Option>
                <Option value="XXX">001~X</Option>
              </Select>
            </Col>
          )}
        </Row>
      </div>
      <div
        style={{
          height: "calc(100vh - 88px - 56px + 15px)",
          overflow: "scroll",
          marginRight: "-15px",
        }}
      >
        <List
          size="small"
          className="fileList"
          bordered
          dataSource={fileList}
          renderItem={(item) => (
            <List.Item style={{ textAlign: "center" }}>
              <Col span={12}>
                <Tooltip title={path.join(item.dir, item.base)}>
                  {item.base}
                </Tooltip>
              </Col>
              <Col span={12}>
                {item.newName ? (
                  <Typography.Text type="success">
                    {item.newName + item.ext}
                  </Typography.Text>
                ) : (
                  <Typography.Text type="secondary">NewName</Typography.Text>
                )}
              </Col>
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          width: "100vw",
          position: "fixed",
          bottom: "0",
          padding: "12px 24px",
          background: "#fff",
        }}
      >
        <Row>
          <Col span={4}>
            <Button icon={<EyeTwoTone />} type="dashed" onClick={proviewName}>
              预览
            </Button>
          </Col>
          <Col span={4}>
            <Popconfirm
              title="是否确认修改？"
              onConfirm={confirmChangeName}
              onCancel={cancelChangeName}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<HighlightTwoTone />} type="default">
                修改
              </Button>
            </Popconfirm>
          </Col>
          <Col span={4}>
            <Popconfirm
              title="是否确认撤回上一次操作？"
              onConfirm={confirmWithdraw}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<RollbackOutlined />} danger>
                撤回
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default App;
