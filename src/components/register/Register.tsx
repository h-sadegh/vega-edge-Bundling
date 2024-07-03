import React, { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import style from "./Register.module.css";
import { Button, Col, Form, Input } from "antd";
import Dragger from "../common/dragger";
import TextArea from "antd/es/input/TextArea";
import { useListUpdate } from "../../api/Register";

const Register = ({ onSuccess }: { onSuccess: () => void }) => {
  const [logo, setLogo] = useState<any>();

  const formRef = useRef(null);

  const { mutate: register, isSuccess } = useListUpdate();

  useEffect(() => {
    isSuccess && onSuccess();
  }, [isSuccess]);

  const submitHandler = useCallback(() => {
    // @ts-ignore
    const data = { ...formRef.current?.getFieldValue() };
    register({ ...data, logo });
  }, [logo, register]);

  const draggerHandlerOnDone = useCallback((info?: any, img?: any) => {
    setLogo(img?.id);
  }, []);

  type FieldType = {
    name?: string;
    description?: string;
    logo?: string;
  };

  const formItemLayout = {
    labelCol: {
      style: { padding: 0 },
    },
    wrapperCol: {
      xs: { span: 24, offset: 1, pull: 0 },
      style: { marginInlineStart: 1 },
    },
  };

  return (
    <div className={style.rgs01}>
      <div className={style.rgs02}>
        <Form
          ref={formRef}
          {...formItemLayout}
          // initialValues={{ title, description }}
          name="registerStore"
          onFinish={submitHandler}
          autoComplete="off"
        >
          <Col xs={24} style={{ width: 250 }}>
            name
            <Form.Item<FieldType>
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "please add a name",
                },
                {
                  max: 72,
                  message: "max length is 72 character",
                },
              ]}
            >
              <Input
                id="name"
                placeholder={"name"}
                autoFocus={true}
                maxLength={72}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            image
            <Form.Item
              name={[`logo`]}
              rules={[
                () => ({
                  validator(_, value) {
                    if (logo?.length > 3) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("please add image"));
                  },
                }),
              ]}
            >
              <Dragger
                maxFileSize={4000}
                formats=".jpg, .jpeg, .png"
                onDone={draggerHandlerOnDone}
                onRemove={draggerHandlerOnDone}
                imageStyle={{ height: 120, backgroundSize: "contain" }}
                text={"image select"}
                hint={"please add image in png or jpg format"}
                url={`http://ef666f36-0e89-4d95-9dbc-006d1b95b64a.hsvc.ir:30051/api/v1/images/`}
                style={{
                  maxWidth: 250,
                  minWidth: 250,
                  padding: 0,
                  height: 150,
                  margin: 0,
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} style={{ marginTop: 50 }}>
            description
            <Form.Item<FieldType>
              name={"description"}
              rules={[
                {
                  required: true,
                  message: "please add some description",
                },
              ]}
            >
              <TextArea
                id="description"
                autoFocus={true}
                style={{ height: 200, maxWidth: 250 }}
              />
            </Form.Item>
          </Col>
          <Form.Item<FieldType>>
            <Col xs={24}>
              <div>
                <Button
                  htmlType="submit"
                  style={{
                    width: 250,
                    height: 40,
                    minHeight: 40,
                    color: "#ffffff",
                    backgroundColor: "#181818",
                  }}
                >
                  Add
                </Button>
              </div>
            </Col>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
