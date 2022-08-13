import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";

export default function AvatarUpload(props) {
  const { user, profileImage, setProfileImage } = props;
  const [loading, setLoading] = React.useState(false);
  //   const [imageUrl, setImageUrl] = React.useState(user.pho);

  function beforeUpload(file) {
    const isJpg = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpg) {
      message.error("You can only upload a .jpg file!");
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpg && isLt2M;
  }

  function uploadToFirebase(upload) {
    setLoading(true);
    const avatar = ref(storage, `avatars/${user.uid}.jpg`);
    uploadBytes(avatar, upload.file)
      .then((snapshot) => {
        console.log("%cUploaded:", "color: lime;", snapshot.metadata.fullPath);
        message.success("Uploaded avatar image!");
        setLoading(false);
        getDownloadURL(avatar).then((url) => {
          setProfileImage(url);
        });
      })
      .catch((error) => {
        console.log("%cError:", "color: red", error);
        message.error(`Error uploading: ${error.code}`);
      });
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={uploadToFirebase}
      beforeUpload={beforeUpload}
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt="avatar"
          style={{
            width: "100%",
          }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
