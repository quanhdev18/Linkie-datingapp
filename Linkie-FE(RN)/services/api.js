import * as FileSystem from "expo-file-system";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://10.0.2.2:8000";

const api = axios.create({
  baseURL: baseURL,
});



export const getLikedUsers = async (userId) => {
  try {
    const response = await api.get("/interactions/interactions", {
      params: {
        user_id: userId,
      },
    });

    return response.data; // VD: [12, 15, 18]
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đã like:", error);
    throw new Error(error.response?.data?.detail || "Lỗi khi lấy danh sách đã like");
  }
};



export const updateLocation = async (accountId, lat, lng) => {
  await api.post(`/location/update_location/${accountId}`, null, {
    params: { latitude: lat, longitude: lng },
  });
};

export const getNearbyUsers = async (accountId, radius) => {
  const response = await api.get("/location/nearby_users_by_account", {
    params: {
      account_id: accountId,
      radius,
    },
  });
  return response.data; // Trả thẳng danh sách (không .nearby_users nữa nếu API trả List[])
};

export const getLocationName = async (lat, lng) => {
  try {
    const response = await api.get("/location/get_location_name", {
      params: { latitude: lat, longitude: lng },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tên địa điểm:", error);
    return "Không rõ địa điểm";
  }
};

export const getLocationByAccountId = async (accountId) => {
  try {
    const response = await api.get(`/location/by_account_id/${accountId}`);
    return response.data; // { latitude: ..., longitude: ..., last_updated: ... }
  } catch (error) {
    console.error("Lỗi khi lấy vị trí từ account ID:", error);
    return null;
  }
};

export const fetchMatches = async (accountId) => {
  const response = await api.get(`/interactions/matches/${accountId}`);
  return response.data;
};

{
  /* Profile */
}
export const createProfile = async (data, token) => {
  try {
    const response = await api.post("/profiles/create", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network error");
  }
};

export const getProfiles = async (token) => {
  try {
    const response = await api.get("/profiles/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const dataWithFullImageUrl = response.data.map((profile) => ({
      ...profile,
      images:
        profile.images?.map((img) => ({
          ...img,
          url: `${baseURL}/${img.url}`,
        })) || [],
    }));

    return dataWithFullImageUrl;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách profile:", error);
    throw new Error(error.response?.data?.detail || "Lỗi kết nối");
  }
};

{
  /* Location */
}

{
  /* Like */
}
export const likeUser = async (likedId, likerId) => {
  try {
    const response = await api.post(`/interactions/like/${likedId}/${likerId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi like:", error);
    throw new Error(error.response?.data?.detail || "Lỗi khi like người dùng");
  }
};

{
  /* Dang ky/dang nhap */
}
export const login = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network error");
  }
};

export const verifyOtp = async (data) => {
  try {
    const response = await api.post("/auth/verify-otp", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network error");
  }
};

export const sendOtp = async (data) => {
  try {
    const response = await api.post("/auth/send-otp", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network error");
  }
};

export const register = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network error");
  }
};

export const refreshToken = async (data) => {
  try {
    const response = await api.post("/auth/refresh", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Network error");
  }
};

export const verifyEmail = async (data) => {
  try {
    const response = await api.post("/auth/verify-email", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Network error");
  }
};

{
  /* Upload anh */
}

export const uploadProfileImage = async (profileId, imageUris) => {
  const formData = new FormData();

  for (let index = 0; index < imageUris.length; index++) {
    const uri = imageUris[index];
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename ?? "");
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const response = await fetch(uri);
    const blob = await response.blob();

    formData.append("files", {
      uri,
      name: filename || `profile${index}.jpg`,
      type,
    });
  }

  try {
    const response = await api.post(`/images/profile/${profileId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload profile ảnh thành công");
    return response.data;
  } catch (error) {
    console.error(
      "Upload profile image failed",
      error.response?.data || error.message
    );
    throw new Error("Upload profile image failed");
  }
};

export const getProfileImage = async (title) => {
  try {
    return `http://10.0.2.2:8000/static/images/profile/${title}`;
  } catch (error) {
    throw new Error("Cannot generate profile image URL");
  }
};

export const deleteProfileImage = async (imageId) => {
  try {
    const response = await api.delete(`/images/profile/${imageId}`);
    console.log("Xóa ảnh thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Xóa ảnh thất bại", error.response?.data || error.message);
    throw new Error("Delete profile image failed");
  }
};






export const uploadAvatar = async (email, imageUri) => {
  const formData = new FormData();

  const filename = imageUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename ?? "");
  const type = match ? `image/${match[1]}` : `image/jpeg`;

  formData.append("file", {
    uri: imageUri,
    name: filename || "avatar.jpg",
    type,
  });

  try {
    const response = await api.post(`/images/account/${email}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload avatar thành công");
    return response.data;
  } catch (error) {
    console.error(
      "Upload avatar failed",
      error.response?.data || error.message
    );
    throw new Error("Upload avatar failed");
  }
};

// export const getAvatarImage = (title) => {
//   return `http://10.0.2.2:8000/static/images/avatar/${title}`;
// };
export const getAvatarImage = (titleOrPath) => {
  // Nếu là đường dẫn có "static/", cắt tên file ra
  const filename = titleOrPath?.split("\\").pop(); // hoặc .split("/").pop() nếu dùng dấu /

  return `http://10.0.2.2:8000/static/images/avatar/${filename}`;
};

// export const uploadAvatar = async (accountId, imageUri) => {
//   const formData = new FormData();
//   formData.append("file", {
//     uri: imageUri,
//     name: "avatar.jpg",
//     type: "image/jpeg",
//   });

//   try {
//     const response = await api.post(`/images/account/${accountId}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Upload avatar failed",
//       error.response?.data || error.message
//     );
//     throw new Error("Upload avatar failed");
//   }
// };

// export const getAvatarImage = async (imageId) => {
//   try {
//     const response = await api.get(`/images/account/${imageId}`);
//     return response;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Cannot fetch avatar image");
//   }
// };

{
  /* Profile */
}

export const getProfileById = async (profileId) => {
  try {
    // Lấy access_token từ AsyncStorage
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      throw new Error("Không có access_token");
    }

    // Gọi API với header Authorization
    const response = await api.get(`/profiles/${profileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy profile:",
      error.response?.data || error.message
    );
    throw new Error("Không thể tải hồ sơ người dùng");
  }
};

export const updateProfile = async (profile_id, data) => {
  try {
    // Lấy access_token từ AsyncStorage
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      throw new Error("Không có access_token");
    }

    // Gọi API với header Authorization
    const response = await api.put(`/profiles/update/${profile_id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail || error.message || "Network error";
    throw new Error(
      typeof detail === "string" ? detail : JSON.stringify(detail)
    );
  }
};
