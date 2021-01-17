export default {
  /* -------- 登录 -------- */
  // {name: , pwd: }
  login: {
    method: 'post',
    url: '/api/v1/users/login',
  },

  /* --------  body{ content } -------- */
  logout: {
    method: 'post',
    url: '/api/v1/users/logout',
  },

  /* -------- 注册 body{ content } -------- */
  register: {
    method: 'post',
    url: '/api/v1/users/register',
  },

  /* -------- 登录验证 -------- */
  checkAuth: {
    method: 'post',
    url: '/api/v1/users/checkAuth',
  },

   /* -------- -------- */
   userProfile: {
    method: 'get',
    url: '/api/v1/users/detail',
  },

  /* -------- 获取联系人列表 -------- */
  getChatList: {
    method: 'get',
    url: '/api/v1/chats',
  },

  sendMessage: {
    method: 'post',
    url: '/api/v1/message',
  },

  /* -------- 获取联系人列表 -------- */
  getFriendList: {
    method: 'get',
    url: '/api/v1/friends',
  },

  /* -------- 获取群列表 -------- */
  getGroupList: {
    method: 'get',
    url: '/api/v1/groups',
  },

  /* -------- 获取消息列表 -------- */
  getMessageList: {
    method: 'get',
    url: '/api/v1/messages',
  },

  /* -------- 获取客服初始化用户信息-------- */
  addConversation: {
    method: 'post',
    url: '/api/v1/chats',
  },

  /* -------- 更新用户信息-------- */
  /* data: {   [key]: value   } */
  updateUserInfo: {
    method: 'put',
    url: '/api/admin/user/${uid}/update',
  },

  /* -------- 获取UID------- */
  /* data: {   [key]: value   } */
  getUserUidByIMAccount: {
    method: 'post',
    url: '/stub-api/v3/user/uid_translation_im_account',
  },

  /* -------- 收藏联系人------- */
  contactStar: {
    method: 'post',
    url: '/stub-api/v3/friend/star_contact',
  },
  /* -------- 取消收藏联系人------- */
  contactUnStar: {
    method: 'post',
    url: '/stub-api/v3/friend/un_star_contact',
  },

  /* -------- 获取聊天记录 -------- */
  getUserMessages: {
    method: 'post',
    url: '/stub-api/v3/im/get_user_messages',
  },
};
