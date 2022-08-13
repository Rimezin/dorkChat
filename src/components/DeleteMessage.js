import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { message, Popconfirm } from "antd";

function DeleteMessage(props) {
  const { id } = props;
  async function handleDelete() {
    console.log(`%cDeleting message '${id}'!`, "color: orange");
    await deleteDoc(doc(db, "messages", id));
    message.success("Message deleted...");
  }

  function handleCancel() {
    message.info("Did not delete.");
  }

  return (
    <Popconfirm
      title="Are you sure you want to delete this message?"
      onConfirm={handleDelete}
      onCancel={handleCancel}
      okText="Yes"
      cancelText="No"
    >
      <div className="message-button">
        <DeleteOutlined />
      </div>
    </Popconfirm>
  );
}

export default DeleteMessage;
