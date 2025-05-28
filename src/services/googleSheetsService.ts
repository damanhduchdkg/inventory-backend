import { google } from "googleapis";
import * as fs from "fs";
import * as path from "path";
import { JWT } from "google-auth-library";

// Đọc và cấu hình thông tin xác thực từ file credentials.json
const keyPath = path.join(__dirname, "..", "credentials.json"); // Đảm bảo đường dẫn đúng
const keys = JSON.parse(fs.readFileSync(keyPath, "utf-8"));

// Xác thực với Google Sheets API
const auth = new JWT({
  email: keys.client_email,
  key: keys.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Quyền truy cập Sheets
  subject: keys.client_email, // Dùng tài khoản dịch vụ này
});

// Cấu hình Google Sheets API
const sheets = google.sheets({ version: "v4", auth });

// Lấy dữ liệu từ bảng tính Google Sheets (thiết bị mượn)
export const fetchMuonData = async () => {
  try {
    const spreadsheetId = "17cYIPZGkfLip7Sj8Xv6OOmxEb4NRqG3Jd2P9xz-8gl4"; // Điền vào ID của Google Sheets
    const range = "ThietBiMuon!A:Z"; // Vùng dữ liệu bạn muốn lấy

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return res.data.values; // Trả về dữ liệu từ Google Sheets
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thiết bị mượn:", error);
    throw error;
  }
};

// Lấy dữ liệu thiết bị trả từ Google Sheets
export const fetchTraData = async () => {
  try {
    const spreadsheetId = "17cYIPZGkfLip7Sj8Xv6OOmxEb4NRqG3Jd2P9xz-8gl4"; // Điền vào ID của Google Sheets
    const range = "ThietBiTra!A:Z"; // Vùng dữ liệu thiết bị trả

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    // console.log(res.data.values);
    return res.data.values; // Trả về dữ liệu từ Google Sheets
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thiết bị trả:", error);
    throw error;
  }
};

// Lấy dữ liệu người dùng từ Google Sheets
export const fetchUsers = async () => {
  try {
    const spreadsheetId = "17cYIPZGkfLip7Sj8Xv6OOmxEb4NRqG3Jd2P9xz-8gl4";
    const range = "Users!A:C"; // Cột A là email, B là tên

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Bỏ dòng tiêu đề nếu có (nếu dòng đầu là "Email", "Name")
    const dataRows = rows[0][0]?.toLowerCase().includes("email")
      ? rows.slice(1)
      : rows;

    // Map thành đối tượng user
    return dataRows.map((row) => ({
      email: row[0]?.trim() || "",
      name: row[1]?.trim() || "",
      password: row[2]?.trim() || "", // thêm password
    }));
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu users:", error);
    throw error;
  }
};
