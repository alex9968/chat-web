export default {
  /* -------- 登录 -------- */
  // {userName: , passWord: }
  login: {
    method: "post",
    url: "/user/login",
  },
  //   $.ajax({
  //     type: "POST",
  //     dataType: "json",
  //     url: apiUrl + "/user/login",
  //     data: JSON.stringify(jsonData),
  //     success: function (result) {
  //         if (result.code == 0) {
  //             setLocalStorage("authToken", result.data);
  //             window.location.href = "/index.html";
  //         } else {
  //             swal("error:" + result.message);
  //         }
  //     },
  //     error: function () {
  //         swal("exception！");
  //     }
  // });

  /* --------  body{ content } -------- */
  logout: {
    method: "post",
    url: "/user/logout",
  },
  // function logout() {
  //   let jsonData = {authToken: getLocalStorage("authToken")};
  //   $.ajax({
  //       type: "POST",
  //       dataType: "json",
  //       url: apiUrl + "/user/logout",
  //       data: JSON.stringify(jsonData),
  //       success: function (result) {
  //           if (result.code == 0) {
  //               window.location.href = "/login.html";
  //           } else {
  //               swal("request error，please login！");
  //           }
  //       },
  //       error: function () {
  //           swal("sorry, exception！");
  //       }
  //   });
  // }

  /* -------- 注册 body{ content } -------- */
  register: {
    method: "post",
    url: "/user/register",
  },
  // let jsonData = {userName: userName, passWord: passWord};
  // $.ajax({
  //     type: "POST",
  //     dataType: "json",
  //     url: apiUrl + "/user/register",
  //     data: JSON.stringify(jsonData),
  //     success: function (result) {
  //         if (result.code == 0) {
  //             setLocalStorage("authToken", result.data);
  //             window.location.href = "/index.html";
  //         } else {
  //             swal("error:" + result.message);
  //         }
  //     },
  //     error: function () {
  //         swal("register exception！");
  //     }
  // });

  /* -------- 登录验证 -------- */
  checkAuth: {
    method: "post",
    url: "/user/checkAuth",
  },
  // let auth = getLocalStorage("authToken");
  //   let jsonData = {"authToken": auth};
  //   $.ajax({
  //       type: "POST",
  //       contentType: "application/json",
  //       dataType: "json",
  //       url: apiUrl + "/user/checkAuth",
  //       data: JSON.stringify(jsonData),

  /* -------- 获取联系人列表 -------- */
  getRoomInfo: {
    method: "post",
    url: "/push/getRoomInfo",
  },

  // let jsonData = {roomId: 1, authToken: getLocalStorage("authToken")};
  // $.ajax({
  //     type: "POST",
  //     dataType: "json",
  //     url: apiUrl + "/push/getRoomInfo",
  //     data: JSON.stringify(jsonData),
  //     success: function (result) {
  //         if (result.code != 0) {
  //             //swal("request error，please try again later！");
  //         }
  //     },
  //     error: function () {
  //         swal("sorry, exception!");
  //     }
  // });

  /* -------- 获取消息列表 -------- */
  getRoomUserCount: {
    method: "get",
    url: "/push/count",
  },

  //   function getRoomUserCount() {
  //     let jsonData = {roomId: 1, authToken: getLocalStorage("authToken")};
  //     $.ajax({
  //         type: "POST",
  //         dataType: "json",
  //         url: apiUrl + "/push/count",
  //         data: JSON.stringify(jsonData),
  //         success: function (result) {
  //             if (result.code != 0) {
  //                 swal("request error，please login!");
  //             }
  //         },
  //         error: function () {
  //             swal("sorry, exception!");
  //         }
  //     });
  // }

  /* -------- 设置已读-------- */
  sendMessage: {
    method: "post",
    url: "/push/pushRoom",
  },

  //   function send() {
  //     $("#tab_chat").click();
  //     $("#msg").animate({scrollTop: $("#msg").offset().top + 100000}, 1000);
  //     let msg = document.getElementById('editText').value;
  //     if (msg == "") {
  //         swal("send msg is empty!");
  //         return
  //     }
  //     document.getElementById('editText').value = '';
  //     let jsonData = {op: 3, msg: msg, roomId: 1, authToken: getLocalStorage("authToken")};
  //     $.ajax({
  //         type: "POST",
  //         dataType: "json",
  //         url: apiUrl + "/push/pushRoom",
  //         data: JSON.stringify(jsonData),
  //         success: function (result) {
  //             if (result.code == 0) {
  //                 // send ok
  //             } else {
  //                 swal("please login or register account!");
  //                 window.location.href = "/register.html";
  //             }
  //         },
  //         error: function () {
  //             swal("sorry, exception！");
  //         }
  //     });
  // }

  /* -------- 获取客服初始化用户信息-------- */
  accountInit: {
    method: "post",
    url: "/api/admin/kfaccount/get_kf_account",
  },

  /* -------- 更新用户信息-------- */
  /* data: {   [key]: value   } */
  updateUserInfo: {
    method: "put",
    url: "/api/admin/user/${uid}/update",
  },
  /* -------- 获取UID------- */
  /* data: {   [key]: value   } */
  getUserUidByIMAccount: {
    method: "post",
    url: "/stub-api/v3/user/uid_translation_im_account",
  },

  /* -------- 收藏联系人------- */
  contactStar: {
    method: "post",
    url: "/stub-api/v3/friend/star_contact",
  },
  /* -------- 取消收藏联系人------- */
  contactUnStar: {
    method: "post",
    url: "/stub-api/v3/friend/un_star_contact",
  },

  /* -------- 获取聊天记录 -------- */
  getUserMessages: {
    method: "post",
    url: "/stub-api/v3/im/get_user_messages",
  },
};
