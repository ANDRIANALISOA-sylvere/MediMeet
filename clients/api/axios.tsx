import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.43.149:8800/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
