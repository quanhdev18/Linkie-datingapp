const API_URL = "https://your-api-endpoint.com"; 

export const sendOTP = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Network error" };
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Network error" };
  }
};

export const loginWithPassword = async (phoneNumber, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Network error" };
  }
};
