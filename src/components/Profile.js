import React from "react";
import { Form, Input, Layout, Breadcrumb, Button, message } from "antd";
import { MehOutlined, MailOutlined, KeyOutlined } from "@ant-design/icons";
import AvatarUpload from "./AvatarUpload";
import { storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";

const { Content } = Layout;

function Profile(props) {
  const { user, handleAuth } = props;

  const [profileImage, setProfileImage] = React.useState(null);

  React.useEffect(() => {
    const avatar = ref(storage, `avatars/${user.uid}.jpg`);
    getDownloadURL(avatar)
      .then((url) => {
        console.log(
          "%cSuccessfully loaded profile image!",
          "color: lime;",
          url
        );
        setProfileImage(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            console.log(
              "%cDid not load profile image, it does not exist.",
              "color: orange;"
            );
            return;
          default:
            message.error(`Could not load profile image: ${error.code}`);
            console.log(
              "%cDid not load profile image:",
              "color: red;",
              error.code
            );
            return;
        }
      });
  }, []);

  function validate(v) {
    if (typeof v === "undefined") {
      return false;
    } else {
      if (v === undefined || v === null || v === "") {
        return false;
      } else {
        return true;
      }
    }
  }

  function handleSubmit(data) {
    // Validate data //
    let validData = {};
    if (data.email !== user.email) {
      validData.email = data.email;
    }
    if (validate(data.password)) {
      validData.password = data.password;
    }
    if (data.displayName !== user.displayName) {
      validData.displayName = data.displayName;
    }
    // if (data.photoURL !== user.photoURL) {
    // validData.photoURL = profileImage;
    // }
    if (JSON.stringify(validData).length > 2) {
      console.log("Saving profile:", validData);
      handleAuth("update", validData);
    } else {
      message.warning(`There weren't any changes...`);
      console.log(
        "%cProfile save attempted, but there were no changes...",
        "color: orange; font-weight: 700;"
      );
    }
  }

  function handleEmailVerify() {
    if (user.email !== null) {
      handleAuth("verify");
    }
  }

  return (
    <Content
      style={{
        margin: "0 16px",
      }}
    >
      <Breadcrumb
        style={{
          margin: "16px 0",
        }}
      >
        <Breadcrumb.Item>
          {user.displayName === null ? "You" : user.displayName}
        </Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <Form
        onFinish={handleSubmit}
        className="profile-form"
        name="profile-form"
        layout="vertical"
        initialValues={{
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }}
      >
        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: user.email === null,
              message: "Please provide a valid email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} size="large" />
        </Form.Item>
        <div
          className={`form-label ${
            user.emailVerified ? "verified" : "missing"
          }`}
          style={{ marginTop: "-1.5rem" }}
        >
          {user.emailVerified ? "Verified" : "Not verified!"}
          {!user.emailVerified && (
            <a href="#" onClick={handleEmailVerify}>
              <u>Verify Now</u>
            </a>
          )}
        </div>

        {/* Password */}
        <Form.Item
          name="password"
          label="Change Password"
          defaultValue={user.password}
        >
          <Input.Password
            prefix={<KeyOutlined />}
            visibilityToggle={true}
            size="large"
          />
        </Form.Item>

        {/* Display Name */}
        <Form.Item name="displayName" label="Display Name">
          <Input prefix={<MehOutlined />} size="large" />
        </Form.Item>

        {/* Profile Image */}
        <Form.Item label="Avatar">
          <AvatarUpload
            user={user}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <span className="form-label">{`Image requirements: JPG only, less than 2MB in size. Uploading a file will save it immediately.`}</span>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Profile
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
}

export default Profile;
