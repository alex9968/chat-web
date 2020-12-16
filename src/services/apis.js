export default {
  /* -------- 获取用户详细资料信息, params: /uid -------- */
  getUserInfo: {
    method: "get",
    url: "/api/admin/pair/history/",
  },
  /* -------- 获取用户配对信息 body{ content } -------- */
  getUserPartner: {
    method: "post",
    url: "/api/admin/partner/search/",
  },
  /* -------- 获取好友列表 -------- */
  getFriendList: {
    method: "get",
    url: "/stub-api/v3/friend/get_friend_list",
  },
  /* -------- 获取联系人列表 -------- */
  getContactList: {
    method: "get",
    url: "/api/admin/kfaccount/get_contact_list",
  },
  /* -------- 获取消息列表 -------- */
  getMessageList: {
    method: "get",
    url: "/api/admin/kfaccount/get_message_list",
  },
  /* -------- 设置已读-------- */
  setMessageRead: {
    method: "post",
    url: "/api/admin/kfaccount/set_message_read",
  },
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
  // fromAccount		String	true
  // toAccount		String	true
  // msgRandom		int	true
  // msgTimeStamp		int	true
  // msgSeq		int	true
  // limit	页距	int
  // isForward	是否向前查找更早的消息	Enums.BoolToInt	true
  getUserMessages: {
    method: "post",
    url: "/stub-api/v3/im/get_user_messages",
  },
};
