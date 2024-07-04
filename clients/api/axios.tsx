import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.56.1:8800/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
