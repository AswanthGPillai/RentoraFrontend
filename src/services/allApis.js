import { serverURL } from "./serverURL";
import commonApi from "./commonApi";

/* ===========================
   AUTH APIs
=========================== */

// LOGIN
export const loginAPI = async (reqBody) => {
  return await commonApi("post", `${serverURL}/login`, reqBody);
};

// REGISTER
export const registerAPI = async (reqBody) => {
  return await commonApi("post", `${serverURL}/register`, reqBody);
};

// GOOGLE LOGIN
export const googleLoginAPI = async (reqBody) => {
  return await commonApi("post", `${serverURL}/google-login`, reqBody);
};

/* ===========================
   USER APIs (JWT REQUIRED)
=========================== */

// UPDATE USER PROFILE
export const updateUserProfileAPI = async (reqBody) => {
  return await commonApi("put", `${serverURL}/user-profile-update`, reqBody);
};

/* ===========================
   ADMIN APIs
=========================== */

// GET ALL USERS
export const getAllUsersAPI = async () => {
  return await commonApi("get", `${serverURL}/all-users`);
};

// UPDATE ADMIN PROFILE
export const updateAdminProfileAPI = async (reqBody) => {
  return await commonApi("put", `${serverURL}/admin-profile-update`, reqBody);
};

// DELETE USER
export const deleteUserAPI = async (id) => {
  return await commonApi("delete", `${serverURL}/users/${id}`);
};

/* ===========================
   ROOM APIs
=========================== */

// CREATE ROOM (ADMIN)
export const createRoomAPI = async (reqBody) => {
  return await commonApi("post", `${serverURL}/rooms`, reqBody);
};

// GET ALL ROOMS (PUBLIC)
export const getAllRoomsAPI = async () => {
  return await commonApi("get", `${serverURL}/rooms`);
};

// GET SINGLE ROOM
export const getRoomByIdAPI = async (id) => {
  return await commonApi("get", `${serverURL}/rooms/${id}`);
};

// UPDATE ROOM (ADMIN)
export const updateRoomAPI = async (id, reqBody) => {
  return await commonApi("put", `${serverURL}/rooms/${id}`, reqBody);
};

// DELETE ROOM (ADMIN)
export const deleteRoomAPI = async (id) => {
  return await commonApi("delete", `${serverURL}/rooms/${id}`);
};

/* ===========================
   BOOKING APIs
=========================== */

// CREATE BOOKING (USER)
export const createBookingAPI = async (reqBody) => {
  return await commonApi("post", `${serverURL}/bookings`, reqBody);
};

// GET ALL BOOKINGS (ADMIN)
export const getAllBookingsAPI = async () => {
  return await commonApi("get", `${serverURL}/bookings`);
};

// GET MY BOOKINGS (USER)
export const getMyBookingsAPI = async () => {
  return await commonApi("get", `${serverURL}/bookings/user`);
};

// GET BOOKINGS BY ROOM (ADMIN)
export const getBookingsByRoomAPI = async (roomId) => {
  return await commonApi("get", `${serverURL}/bookings/room/${roomId}`);
};

// UPDATE BOOKING STATUS (ADMIN - e.g., Confirmed, Pending)
export const updateBookingStatusAPI = async (id, reqBody) => {
  return await commonApi(
    "put",
    `${serverURL}/bookings/${id}/status`,
    reqBody
  );
};

// CANCEL/TERMINATE LEASE (USER - Soft Delete)
export const cancelBookingAPI = async (id) => {
  return await commonApi("delete", `${serverURL}/bookings/${id}`);
};

/* ===========================
   COMPLAINT APIs
=========================== */

// CREATE COMPLAINT (USER)
export const createComplaintAPI = async (reqBody) => {
  return await commonApi("post", `${serverURL}/complaints`, reqBody);
};

// GET ALL COMPLAINTS (ADMIN)
export const getAllComplaintsAPI = async () => {
  return await commonApi("get", `${serverURL}/complaints`);
};

// DELETE / RESOLVE COMPLAINT (ADMIN)
export const deleteComplaintAPI = async (id) => {
  return await commonApi("delete", `${serverURL}/complaints/${id}`);
};

/* ===========================
   SUGGESTION APIs
=========================== */

// CREATE SUGGESTION (USER)
export const createSuggestionAPI = async (reqBody) => {
  return await commonApi("post", `${serverURL}/suggestions`, reqBody);
};

// GET ALL SUGGESTIONS (ADMIN)
export const getAllSuggestionsAPI = async () => {
  return await commonApi("get", `${serverURL}/suggestions`);
};

// DELETE SUGGESTION (ADMIN)
export const deleteSuggestionAPI = async (id) => {
  return await commonApi("delete", `${serverURL}/suggestions/${id}`);
};
