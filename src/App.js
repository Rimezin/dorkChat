import SignIn from "./components/SignIn";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import React from "react";
import { app, db } from "./firebase";
import { Modal, message } from "antd";
import Main from "./components/Main";
import { doc, setDoc, getDoc } from "firebase/firestore";

function App() {
  const auth = getAuth(app);
  const [user, setUser] = React.useState({});
  const [profile, setProfile] = React.useState({});
  const [modal, setModal] = React.useState({
    open: false,
    message: "Default Message",
    title: "Default Modal",
    isConfirm: false,
    onOk: () => {
      console.log("%cOkay function not specified!", "color: orange");
      setModal((m) => ({
        ...m,
        open: !m.open,
      }));
    },
    onCancel: () => {
      console.log("%cCancel function not specified!", "color: orange");
      setModal((m) => ({
        ...m,
        open: !m.open,
      }));
    },
  });

  function throwError(error) {
    console.log(
      `%c${error.code}: ${error.message}`,
      "font-weight: 700; color: red;"
    );
    setModal((m) => ({
      ...m,
      open: true,
      message: error.message,
      title: error.code,
      onOk: () => {
        setModal((m) => ({
          ...m,
          open: !m.open,
        }));
      },
      onCancel: () => {
        setModal((m) => ({
          ...m,
          open: !m.open,
        }));
      },
    }));
  }

  async function getProfile(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const prof = docSnap.data();
      if (
        typeof prof.displayName !== "undefined" &&
        typeof prof !== "Promise"
      ) {
        console.log(`Retrieved ${prof.displayName}'s profile.`);
        return prof;
      } else {
        return null;
      }
    } else {
      console.log("No such document!");
      return null;
    }
  }

  React.useEffect(() => {
    onAuthStateChanged(auth, (usr) => {
      if (usr) {
        console.log(
          "%cPersistent auth loaded.",
          "color: lime; font-weight: 700;"
        );
        const prof = getProfile(usr.uid).then((val) => {
          setUser({
            ...usr,
            role: val.role,
          });
          setProfile(val);
        });
      } else {
        console.log(
          "%cNo persistent auth.",
          "color: orange; font-weight: 700;"
        );
      }
    });
  }, []);

  function handleAuth(method, formData) {
    switch (method) {
      case "in":
        // Login //
        setPersistence(auth, browserLocalPersistence)
          .then(() => {
            return signInWithEmailAndPassword(
              auth,
              formData.email,
              formData.password
            )
              .then((userCredential) => {
                const userIn = userCredential.user;
                const prof = getProfile(userIn.uid).then((val) => {
                  setUser({
                    ...userIn,
                    role: val.role,
                  });
                  setProfile(val);
                  console.log(
                    `%cLogin Successful`,
                    "color: lime; font-weight: 700;"
                  );
                  message.success(
                    `Welcome back ${
                      userIn.displayName === null
                        ? userIn.email
                        : userIn.displayName
                    }!`
                  );
                });
              })
              .catch((error) => {
                throwError(error);
              });
          })
          .catch((error) => {
            throwError(error);
          });
        break;
      case "out":
        // Logout //
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            message.success("Successfully logged out!");
            console.log("%cLogged Out!", "color: lime; font-weight: 700;");
            setUser(null);
            setProfile(null);
          })
          .catch((error) => {
            // An error happened.
            throwError(error);
          });
        break;

      case "update":
        if (typeof formData.password !== "undefined") {
          // Password change
          updatePassword(auth.currentUser, formData.password)
            .then(() => {
              // Successful
              message.success("Updated password.");
              console.log(
                "%cUpdated password.",
                "color: lime; font-weight: 700;"
              );
            })
            .catch((error) => {
              // Error updating
              throwError(error);
            });
        }

        if (typeof formData.displayName !== "undefined") {
          const profileRef = doc(db, "users", user.uid);
          setDoc(profileRef, { displayName: formData.displayName });
          console.log(
            "%cUpdated Profile in Database.",
            "color: lime; font-weight: 700;"
          );
        }

        updateProfile(auth.currentUser, formData)
          .then(() => {
            // Success updating
            message.success("Updated profile");
            console.log("%cUpdated profile.", "color: lime; font-weight: 700;");
          })
          .catch((error) => {
            // Error updating
            throwError(error);
          });
        break;

      case "verify":
        sendEmailVerification(auth.currentUser).then(() => {
          message.success(`Sent email verification to ${user.email}`);
          console.log(
            `%cSent email verification to ${user.email}`,
            "color: lime;"
          );
        });
        break;

      default:
        message.error("Something weird happened...");
        return;
    }
  }

  // Debug only //
  React.useEffect(() => {
    console.log("User updated:", user);
  }, [user]);

  return (
    <>
      <Modal
        visible={modal.open}
        onCancel={modal.onCancel}
        onOk={modal.onOk}
        title={modal.title}
      >
        <p>{modal.message}</p>
      </Modal>

      {/* Ternary for main app */}
      {JSON.stringify(user).length > 4 ? (
        <Main
          user={user}
          handleAuth={handleAuth}
          throwError={throwError}
          profile={profile}
          getProfile={getProfile}
          setModal={setModal}
        />
      ) : (
        <SignIn handleAuth={handleAuth} />
      )}
    </>
  );
}

export default App;
