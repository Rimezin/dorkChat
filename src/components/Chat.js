import React from "react";
import { Layout, Breadcrumb, Avatar, message } from "antd";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import SendMessage from "./SendMessage";
import { decrypt } from "../encryption";
import { getDateTime } from "../functions";
import DeleteMessage from "./DeleteMessage";
import EditMessage from "./EditMessage";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const { Content } = Layout;

function Chat(props) {
  const { user, throwError, getProfile, setModal } = props;
  const scrollPoint = React.useRef();
  const [messages, setMessages] = React.useState([]);
  const [participants, setParticipants] = React.useState([]);
  const [names, setNames] = React.useState([]);
  const [avatars, setAvatars] = React.useState([]);

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

  function getUserAvatar(uid) {
    if (participants.includes(uid)) {
      return avatars[participants.indexOf(uid)];
    } else {
      const avatar = ref(storage, `avatars/${uid}.jpg`);
      getDownloadURL(avatar)
        .then((url) => {
          console.log(
            "%cSuccessfully loaded profile image for ${uid}!",
            "color: lime;",
            url
          );
          setAvatars((oldAvatars) => [...oldAvatars, url]);
          return url;
        })
        .catch((error) => {
          switch (error.code) {
            case "storage/object-not-found":
              console.log(
                "%cDid not load profile image, it does not exist.",
                "color: orange;"
              );
              return null;
            default:
              message.error(`Could not load profile image: ${error.code}`);
              console.log(
                "%cDid not load profile image:",
                "color: red;",
                error.code
              );
              return null;
          }
        });
    }
  }

  const messagesRender = messages.map(
    ({ uid, id, text, createdAt, isEdited }) => {
      text = decrypt(text);
      let dispName = "Loading...";
      let pic = getUserAvatar(uid);

      if (participants.includes(uid)) {
        // get name //
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

        // get avatar //
        // pic = avatars[participants.indexOf(uid)];
      } else {
        console.log("uid NOT included in participants:", uid);

        // Get the name and add to list //
        let dispRef = getProfile(uid);
        dispRef.then((res) => {
          dispName = res.displayName;
          let nameElement = document.getElementById(`name_${id}`);
          nameElement.innerText = dispName;
          setParticipants((oldParticipants) => [...oldParticipants, uid]);
          setNames((oldNames) => [...oldNames, dispName]);
        });

        // Get the pic and add to list //
        // let picRef = getUserAvatar(uid);
        // picRef.then((res) => {
        //   pic = res;
        //   setAvatars((oldAvatars) => [...oldAvatars, pic]);
        // });
        // pic = getUserAvatar(uid);
        // setAvatars((oldAvatars) => [...oldAvatars, pic]);
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
            <Avatar src={pic} />
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
        textAlign: "-webkit-center",
      }}
    >
      <Breadcrumb
        style={{
          margin: "16px 0",
        }}
      >
        <Breadcrumb.Item>Chat</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-background chat">
        {messagesRender}
        <div ref={scrollPoint}></div>
      </div>
      <SendMessage user={user} />
    </Content>
  );
}

export default Chat;
