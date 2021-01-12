import API from "@/services/index";
const message = {
  state: {
    currentUserProfile: {},
    isLogin: false,

  },
  mutations: {
   
    toggleIsSDKReady(state, isSDKReady) {
    },
   
  },
  actions: {
    initWebSocket(context) {
      localStorage.clear()
      
    },
  },
};

export default message;
