import React from "react";
import { Layout, Breadcrumb, Avatar, message } from "antd";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import SendMessage from "./SendMessage";
import { decrypt } from "../encryption";
import { getDateTime } from "../functions";
import DeleteMessage from "./DeleteMessage";
import EditMessage from "./EditMessage";

const { Content } = Layout;

function Chat(props) {
  const { user, throwError, getProfile, setModal } = props;
  const scrollPoint = React.useRef();
  const [messages, setMessages] = React.useState([]);
  const [participants, setParticipants] = React.useState([]);
  const [names, setNames] = React.useState([]);

  React.useEffect(() => {
    const m = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limit(50)
    );
    onSnapshot(
      m,
      (snapshot) => {
        const msgArray = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          data.id = doc.id !== null ? doc.id : Math.random();
          msgArray.push(data);
        });

        setMessages(msgArray);
      },
      (error) => {
        throwError(error);
      }
    );
  }, []);

  const messagesRender = messages.map(
    ({ uid, id, text, photoURL, createdAt, isEdited }) => {
      text = decrypt(text);
      let dispName = "Loading...";

      if (participants.includes(uid)) {
        dispName = names[participants.indexOf(uid)];
        let nameElement = document.getElementById(`name_${id}`);
        if (nameElement !== null) {
          nameElement.innerText = dispName;
        } else {
          console.log(
            `%cCould not set name for message ${id}... this will probably resolve on it's own.`,
            "color: orange;"
          );
        }
      } else {
        console.log("uid NOT included in participants:", uid);
        let dispRef = getProfile(uid);
        dispRef.then((res) => {
          dispName = res.displayName;
          let nameElement = document.getElementById(`name_${id}`);
          nameElement.innerText = dispName;
          setParticipants((oldParticipants) => [...oldParticipants, uid]);
          setNames((oldNames) => [...oldNames, dispName]);
        });
      }

      return (
        <div
          key={id}
          id={`message_${id}`}
          className={`message-container${
            uid === user.uid ? " message-container-mine" : ""
          }`}
        >
          {uid === user.uid || user.role === "admin" ? (
            <div
              className={`message-button-container${
                uid === user.uid ? " message-button-container-mine" : ""
              }`}
            >
              <DeleteMessage id={id} />
              {uid === user.uid && (
                <EditMessage id={id} text={text} setModal={setModal} />
              )}
            </div>
          ) : (
            <></>
          )}

          <div className={`message${uid === user.uid ? " message-mine" : ""}`}>
            <Avatar src={photoURL} />
            <div className="message-content">
              <div id={`name_${id}`} className="message-name">
                {dispName}
              </div>
              <span className="message-text">{text.toString()}</span>
            </div>
          </div>
          <span className="message-timestamp">
            {createdAt !== null ? getDateTime(createdAt.seconds) : "Loading..."}
            {isEdited && " - Edited"}
          </span>
        </div>
      );
    }
  );

  // Always scroll to bottom //
  React.useEffect(() => {
    scrollPoint.current.scrollIntoView({ behavior: "smooth" });
  }, [messagesRender]);

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
        <Breadcrumb.Item>Chat</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background chat"
        style={{
          padding: 24,
          minHeight: 360,
        }}
      >
        {messagesRender}
        <div ref={scrollPoint}></div>
      </div>
      <SendMessage user={user} />
    </Content>
  );
}

export default Chat;
