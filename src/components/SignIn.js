import { Button, Card, Form, Input } from "antd";
import { MailOutlined, KeyOutlined } from "@ant-design/icons";
import React from "react";

function SignIn(props) {
  const { handleAuth } = props;

  function handleSubmit(data) {
    handleAuth("in", data);
  }

  return (
    <div className="sign-in-container">
      <span className="sign-in-title">dorkChat</span>
      <Card className="sign-in-card">
        <Form
          onFinish={handleSubmit}
          className="sign-in-form"
          name="login-form"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please provide a valid email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined />}
              visibilityToggle={true}
              placeholder="password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default SignIn;
