import React from "react";
import { EditOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { message, Popconfirm } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { encrypt } from "../encryption";

function EditMessage(props) {
  const { id, text } = props;
  const [newMsg, setNewMsg] = React.useState(text);

  async function handleEdit() {
    const encMsg = encrypt(newMsg);
    const docRef = doc(db, "messages", id);
    await updateDoc(docRef, {
      text: encMsg.toString(),
      isEdited: true,
    });
    console.log(`%cEdited message ${id}:`, "color: lime", newMsg);
    message.success("Updated message!");
  }

  function handleChange(e) {
    setNewMsg(e.target.value);
  }

  function handleCancel() {
    console.log("%cCancelled edit...", "color: gray;");
    setNewMsg(text);
  }

  return (
    <Popconfirm
      title={<input value={newMsg} onChange={handleChange}></input>}
      onConfirm={handleEdit}
      onCancel={handleCancel}
      okText="Confirm"
      cancelText="Cancel"
      icon={<QuestionCircleOutlined style={{ color: "#0050b3" }} />}
    >
      <div className="message-button">
        <EditOutlined />
      </div>
    </Popconfirm>
  );
}

export default EditMessage;
