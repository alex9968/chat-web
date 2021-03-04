/* eslint-disable no-console */
import Axios from "./axios";
import apis from "./apis";
import { parseQueryString } from "../utils/index";

// const getQueryString = (name) => {
//   var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
//   var r = window.location.href.match(reg)
//   if (r != null) {
//     return unescape(r[2])
//   }
//   return null
// }
const getBaseURL = () => {
  // console.log('sssss',process.env.NODE_ENV)
  if (process.env.NODE_ENV === "production") {
    return "http://127.0.0.1:8888";
  }
  return "http://127.0.0.1:8888";
};

// console.log('url',getBaseURL())
let token;
function getToken() {
  // if (token) return token;

  // return (token = parseQueryString().token);
  const token  = localStorage.getItem('token')
  console.log('token', token)
  if (token  != undefined ){
    return "bearer"+ token
  }
  return ""
}

const http = new Axios({
  initConfig: {
    baseURL: getBaseURL(),
    credentials: "same-origin",
    headers: {
      Accept: "*/*",
      // "Content-Type": "application/json",
      Authorization: "bearer"+localStorage.getItem('token'),
    },
  },
  beforeRequset: (url) => {
    if (url === "/login") {
      console.log("to login page");
    }
  },
  reqIntercept: (config, url) => {
    // 在这里添加loading、 配置token
    // config.headers.Token = sessionStorage.getItem('token')
    if (url === "/login") {
      console.log("to login page");
    }
    return config;
  },
  resIntercept: (res, url) => {
    // 在这里移除loading,对响应结果预先处理
    //console.log('response success', res)
    // if (url === '/login' && res.status === 200) {
    //   sessionStorage.setItem('token', res.header.Token)
    // }
    //ProgressBar.hide();
    switch (res.status) {
      case 200:
        return res;
      case 302:
        //message.info('登录超时, 请重新登录！')
        break;
      case 401:
        //window.push('login');
        break;
      default:
        if (process.env.NODE_ENV !== "production") {
          console.error("Request error: ", res, res.code, res.message);
        }
        Promise.resolve(res);
    }

    return Promise.resolve(res);
  },
});

const mapUrl = (apiObj) => {
  const API = {};
  Object.keys(apiObj).forEach((key) => {
    const item = apiObj[key];
    API[key] = async function(params) {
      return await http[item.method](item.url, params);
    };
  });
  return API;
};

export default mapUrl(apis);
