/* eslint-disable no-console */
import Axios from './axios'
import apis from './apis'
import { parseQueryString } from '../utils/index'

// const getQueryString = (name) => {
//   var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
//   var r = window.location.href.match(reg)
//   if (r != null) {
//     return unescape(r[2])
//   }
//   return null
// }
const getBaseURL = () => {
  console.log('sssss',process.env.NODE_ENV)
  if(process.env.NODE_ENV === 'production' ) {
      return 'https://api.fenpeiduixiang.com'
  } else  if (process.env.NODE_ENV === 'release') { 
      return 'http://release.fenpeiduixiang.com'
  }
  return 'http://dev.fenpeiduixiang.com'
}

// console.log('url',getBaseURL())
let token;
function getToken () {
  if(token) return token;

  return token = parseQueryString().token;
}

const http = new Axios({
  initConfig: {
    baseURL: getBaseURL(),
    credentials: 'same-origin',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      authorization: getToken(),
      //'authorization': 'bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXV0aC5wb2NrZXR1bml2ZXJzaXR5LmNuL2FwaS9hdXRoL2FkbWluL3ZlcmlmeWNvZGUiLCJpYXQiOjE2MDIyMDgwOTEsImV4cCI6MTYwMjI1MTI5MSwibmJmIjoxNjAyMjA4MDkxLCJqdGkiOiJJRnRBc1pJakZPUWRlbVRRIiwic3ViIjoiMTc2MDE0MjgwNzUiLCJwcnYiOiJlM2JjMDdmOTM1OTZlODU2MzhhYjQ1ZjIxMDZmYjg1Yzc4ZDI3ZTcyIiwibmlja25hbWUiOiJ0aHJlYWRzIiwiaGVhZGltZ3VybCI6Imh0dHBzOi8vb3NzLnBvY2tldHVuaXZlcnNpdHkuY24vYXZhdGFyL0ZSTkk0cmlzcUhCa0ZVRGRBOU44bDZVcTZlemN1SU5FRkxBd1hETzEuanBlZyIsInNleCI6MiwidWlkIjo5ODA0N30.8LG96gEauzPhQbNvAiCNZIYs3QKulAQL8wHiNiRq1PU'
      //'authorization': 'bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZGV2LmF1dGguZmVucGVpZHVpeGlhbmcuY29tL2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNjAyMzgwNTU3LCJleHAiOjE2MDQ5NzI1NTcsIm5iZiI6MTYwMjM4MDU1NywianRpIjoidkloMk04YUVqdUhCYmxDQyIsInN1YiI6IjZBREIwOURCNEJDMzBGQzgxMjEyQjI2NjM0Q0YyQzdCIiwicHJ2IjoiZTNiYzA3ZjkzNTk2ZTg1NjM4YWI0NWYyMTA2ZmI4NWM3OGQyN2U3MiIsIm5pY2tuYW1lIjoiXHU2ODQyXHU1NzA2IiwiaGVhZGltZ3VybCI6Imh0dHBzOi8vb3NzLnBvY2tldHVuaXZlcnNpdHkuY24vYXZhdGFyLzIwMjAtMDUtMTgvMTI4ZmZmNjgtNDRkNC00NmRjLTlmOTgtMjQ4ZWUxNjM2YzU1LnBuZyIsInNleCI6MiwidWlkIjoxMDAwMX0.yt2BKt86T4dyBAkXu691TeivE56di8jQYvJt95jiTEg'
      // 'authorization': 'bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZGV2LmF1dGguZmVucGVpZHVpeGlhbmcuY29tL2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNjAyMzg5ODcwLCJleHAiOjE2MDQ5ODE4NzAsIm5iZiI6MTYwMjM4OTg3MCwianRpIjoiR0czR3h0aHNxOUVYTjFKNiIsInN1YiI6IkZERjAzMTUyM0UwRERGREJBMDNBRkQzQjc4MzMzOUJDIiwicHJ2IjoiZTNiYzA3ZjkzNTk2ZTg1NjM4YWI0NWYyMTA2ZmI4NWM3OGQyN2U3MiIsIm5pY2tuYW1lIjoiXHU1YzExXHU1ZTc0XHUwMGI3U3VyZSIsImhlYWRpbWd1cmwiOiJodHRwczovL29zcy5wb2NrZXR1bml2ZXJzaXR5LmNuL21lZGlhLzIwMjAtMDItMDYvNWUzYmQ5YTE5MjI2ZC5qcGciLCJzZXgiOjEsInVpZCI6MTAwMDd9.XnTWPohhzl5b3Cn_Lc_ipQ0pdDxtNGqa0Z3dAKPsnD0'
      //线上 'authorization': 'bearereyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXV0aC5wb2NrZXR1bml2ZXJzaXR5LmNuL2FwaS9hdXRoL2FkbWluL3ZlcmlmeWNvZGUiLCJpYXQiOjE2MDMwNzk0NzcsImV4cCI6MTYwMzEyMjY3NywibmJmIjoxNjAzMDc5NDc3LCJqdGkiOiJBQ3hVTWtRZ0RWM2Qybm8xIiwic3ViIjoiMTc2MDE0MDUzNjAiLCJwcnYiOiJlM2JjMDdmOTM1OTZlODU2MzhhYjQ1ZjIxMDZmYjg1Yzc4ZDI3ZTcyIiwibmlja25hbWUiOiJcdTVjMTFcdTVlNzRcdTAwYjdTdXJlIiwiaGVhZGltZ3VybCI6Imh0dHBzOi8vb3NzLnBvY2tldHVuaXZlcnNpdHkuY24vbWVkaWEvMjAyMC0wMi0wNi81ZTNiZDlhMTkyMjZkLmpwZyIsInNleCI6MSwidWlkIjoxMDAwN30.FFLIcLA_IH78S3cQEelVGxmUXAXATu-S2ca5QVPRnj4'
    },
  },
  beforeRequset: (url) => {
    if (url === '/login') {
      console.log('to login page')
    }
  },
  reqIntercept: (config, url) => {
    // 在这里添加loading、 配置token
    // config.headers.Token = sessionStorage.getItem('token')
    if (url === '/login') {
      console.log('to login page')
    }
    return config
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
        return res
      case 302:
        //message.info('登录超时, 请重新登录！')
        break
      case 401:
        //window.push('login');
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          console.error('Request error: ', res, res.code, res.message)
        }
        Promise.resolve(res)
    }

    return Promise.resolve(res)
  },
})

const mapUrl = (apiObj) => {
  const API = {}
  Object.keys(apiObj).forEach((key) => {
    const item = apiObj[key]
    API[key] = async function(params) {
      return await http[item.method](item.url, params)
    }
  })
  return API
}

export default mapUrl(apis)
