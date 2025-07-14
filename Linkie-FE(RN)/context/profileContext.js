// useContext
import React, { createContext, useState, useContext } from "react";

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  //   const [profileData, setProfileData] = useState({
  //     full_name: "",
  //     date_of_birth: "",
  //     gender: "",
  //     bio: "",
  //     hobby: [],
  //     target_type: "",
  //   });
  //   const updateProfile = (field, value) => {
  //     setProfileData((prev) => ({
  //       ...prev,
  //       [field]: value,
  //     }));
  //   };

  const [fullName, setFullName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [target, setTarget] = useState({});
  const [hobby, setHobby] = useState([]);
  const [bio, setBio] = useState("");
  return (
    <ProfileContext.Provider
      value={{
        fullName,
        birth,
        gender,
        target,
        hobby,
        bio,
        setFullName,
        setBirth,
        setGender,
        setTarget,
        setHobby,
        setBio,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

const useProfile = () => useContext(ProfileContext);

export { useProfile, ProfileProvider };
