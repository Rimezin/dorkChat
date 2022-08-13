import React from "react";
import { Form, Input, Button } from "antd";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { encrypt } from "../encryption";

function SendMessage(props) {
  const { user } = props;

  function handleSend(data) {
    if (data.message.length > 0) {
      console.log("Attempting send:", data);
      const encMsg = encrypt(data.message);
      const docRef = addDoc(collection(db, "messages"), {
        text: encMsg.toString(),
        uid: user.uid,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
      document.getElementById("send-input").value = "";
      console.log(`%cMessage '${encMsg}' sent!`, "color: lime;");
    } else {
      console.log("Data was empty, not sending message.");
    }
  }

  return (
    <Form
      onFinish={handleSend}
      className="message-send"
      name="send-message-form"
      autoComplete="off"
    >
      <Form.Item name="message">
        <Input
          id="send-input"
          placeholder="type your message..."
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Send
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SendMessage;
