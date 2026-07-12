import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


// ===========================================
// USER AUTHENTICATION
// ===========================================

// Register
export const registerUser = async (user: any) => {
  const response = await API.post("/users/register", user);
  return response.data;
};

// Login
export const loginUser = async (user: any) => {
  const response = await API.post("/users/login", user);
  return response.data;
};

// Change Password
export const changePassword = async (data: any) => {
  const response = await API.post(
    "/users/change-password",
    data
  );

  return response.data;
};

export const sendForgotPasswordOTP = async (
  email: string
) => {

  const response = await API.post(
    "/users/forgot-password/send-otp",
    {
      email,
    }
  );

  return response.data;

};

export const verifyForgotPasswordOTP = async (
  email: string,
  otp: string
) => {

  const response = await API.post(
    "/users/forgot-password/verify-otp",
    {
      email,
      otp,
    }
  );

  return response.data;

};

// ===========================================
// UPDATE PROFILE
// ===========================================

export const updateProfile = async (
  userId: number,
  data: any
) => {

  const response = await API.put(
    `/users/update-profile/${userId}`,
    data
  );

  return response.data;

};

// Verify Email
export const verifyEmail = async (
  email: string,
  otp: string
) => {

  const response = await API.post(
    "/users/verify-email",
    {
      email,
      otp,
    }
  );

  return response.data;

};

// Resend OTP
export const resendOTP = async (
  email: string
) => {

  const response = await API.post(
    "/users/resend-otp",
    {
      email,
    }
  );

  return response.data;

};

// Get Profile
export const getProfile = async (
  userId: number
) => {

  const response = await API.get(
    `/users/profile/${userId}`
  );

  return response.data;

};


// ===========================================
// EMAIL SCANNER
// ===========================================

export const scanEmail = async (data: any) => {

  const response = await API.post(
    "/email/scan",
    data
  );

  return response.data;

};


// ===========================================
// URL SCANNER
// ===========================================

export const scanURL = async (data: any) => {

  const response = await API.post(
    "/url/scan",
    data
  );

  return response.data;

};


// ===========================================
// SMS SCANNER
// ===========================================

export const scanSMS = async (data: any) => {

  const response = await API.post(
    "/sms/scan",
    data
  );

  return response.data;

};


// ===========================================
// PASSWORD CHECKER
// ===========================================

export const checkPassword = async (
  password: string
) => {

  const response = await API.post(
    "/password/check",
    { password }
  );

  return response.data;

};


// ===========================================
// FILE UPLOAD
// ===========================================

export const uploadFile = async (
  file: File
) => {

  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post(
    "/upload/file",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;

};


// ===========================================
// DASHBOARD
// ===========================================

export const getAnalytics = async (userId: number) => {

    const response = await API.get(
        `/analytics?user_id=${userId}`
    );

    return response.data;

};


// ===========================================
// HISTORY
// ===========================================

export const getHistory = async () => {

  const user = getCurrentUser();

  const response = await API.get(
    `/history?user_id=${user.id}`
  );

  return response.data;

};

export const clearHistory = async () => {

  const user = getCurrentUser();

  const response = await API.delete(
    `/history/clear?user_id=${user.id}`
  );

  return response.data;

};

export const deleteHistory = async (id: number) => {

  const user = getCurrentUser();

  const response = await API.delete(
    `/history/${id}?user_id=${user.id}`
  );

  return response.data;

};


// ===========================================
// PDF REPORT
// ===========================================

export const downloadReport = async (
  result: any
) => {

  const response = await API.post(
    "/report/download",
    result,
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "GuardianX_Report.pdf";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);

};

// ===========================================
// CURRENT LOGGED-IN USER
// ===========================================

export const getCurrentUser = () => {

  const user = localStorage.getItem("guardianx_user");

  return user ? JSON.parse(user) : null;

};


// ===========================================
// LOGOUT
// ===========================================

export const logoutUser = () => {
  localStorage.removeItem("guardianx_user");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("rememberMe");

  window.location.href = "/login";
};

export default API;