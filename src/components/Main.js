import {
  //   DesktopOutlined,
  //   FileOutlined,
  //   PieChartOutlined,
  //   TeamOutlined,
  UserOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React from "react";
import Chat from "./Chat";
import Profile from "./Profile";
const { Header, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export default function Main(props) {
  const { user, handleAuth, throwError, profile, getProfile, setModal } = props;
  const [page, setPage] = React.useState("1");
  const [collapsed, setCollapsed] = React.useState(false);
  const items = [
    getItem("Chats", "1", <MessageOutlined />),
    getItem(
      user.displayName === null ? "You" : user.displayName,
      "sub1",
      <UserOutlined />,
      [getItem("Profile", "2"), getItem("Logout", "3")]
    ),
  ];

  function handleMenu({ item, key, keyPath, domEvent }) {
    if (key === "3") {
      handleAuth("out");
    } else {
      setPage(key);
    }
  }

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">dorkChat</div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenu}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        />
        {/* Chat */}
        {page === "1" && (
          <Chat
            user={user}
            throwError={throwError}
            profile={profile}
            getProfile={getProfile}
            setModal={setModal}
          />
        )}
        {/* Profile */}
        {page === "2" && <Profile user={user} handleAuth={handleAuth} />}
        <Footer>dorkChat ©2022 Created by Rimezin</Footer>
      </Layout>
    </Layout>
  );
}
