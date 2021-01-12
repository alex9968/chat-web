import API from "@/services/index";
const user = {
  state: {
    profile: {},
    isLogin: false,
    isWsReady: false,
    userID: 0,
    name: "",
    age: null,
    avatar: "",
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.profile = userInfo.Profile;
      state.userID = userInfo.ID;
      state.name = userInfo.Name;
      state.age = userInfo.Age;
      state.avatar = userInfo.Avatar;
    },
    toggleIsLogin(state, isLogin) {
      state.isLogin = typeof isLogin === "undefined" ? !state.isLogin : isLogin;
    },
    toggleIsWsReady(state, isWsReady) {
      state.isWsReady = isWsReady
    },
    reset(state) {
      Object.assign(state, {
        profile: {},
        isLogin: false,
        isWsReady: false,
        userID: null,
        name: "",
        avatar: "",
      });
    },
  },
  actions: {
    logout(context) {
      localStorage.clear();
      context.commit("toggleIsLogin", false);
      context.commit("reset");
    },
  },
};

export default user;
