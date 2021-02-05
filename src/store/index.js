import Vue from "vue";
import Vuex from "vuex";
import conversation from "./modules/conversation";
import group from "./modules/group";
import user from "./modules/user";
import message from "./modules/message";
import video from "./modules/video";
import friend from "./modules/friend";
import blacklist from "./modules/blacklist";
import { Message } from "element-ui";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activeTab: 'conversation-list',
    current: Date.now(), // 当前时间
    intervalID: 0,
    message: undefined,
    unreadCount: 10,
    unreadNumber: 20,
  },
  getters: {
    hidden(state) {
      // eslint-disable-next-line no-unused-vars
      const temp = state.current;
      if (typeof document.hasFocus !== "function") {
        return document.hidden;
      }
      return !document.hasFocus();
    },
  },
  mutations: {
    setActiveTab(state, options) {
      state.activeTab = options
    },
    startComputeCurrent(state) {
      state.intervalID = setInterval(() => {
        state.current = Date.now();
      }, 500);
    },
    updateUnreadTotal(state, options) {
      state.unreadCount = options.unreadCount;
      state.unreadNumber = options.unreadNumber;
    },
    stopComputeCurrent(state) {
      clearInterval(state.intervalID);
      state.intervalID = 0;
    },
    showMessage(state, options) {
      if (state.message) {
        state.message.close()
      }
      state.message = Message({
        message: options.message,
        type: options.type || "success",
        duration: options.duration || 2000,
        offset: 40,
      })
    },
  },
  actions: {
    // logout(){
    // }
  },
  modules: {
    conversation,
    group,
    friend,
    blacklist,
    user,
    message,
    video,
  },
});
