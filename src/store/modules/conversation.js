import tim from "tim";
import TIM from "tim-js-sdk";
import API from "@/services/index";
import { message } from "element-ui";
import store from "..";
import { titleNotify } from "../../utils";
import actions from "./conversation-actions";
import { conversationFormate, messageFormate } from "../../utils/formatTIMData";
// import mutations from './conversation-mutations'

const conversationModules = {
  state: {
    currentConversation: {},
    moreMessagePage: 2,
    currentMessageList: [],
    nextReqMessageID: "",
    isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
    conversationObject: {},
    totalConvasation: 0,
    conversationPageNum: 1,
    conversationPageSize: 100,
    forkList: ["C2Cim_account_3"],
  },
  getters: {
    toAccount: (state) => {
      if (
        !state.currentConversation ||
        !state.currentConversation.conversationID
      ) {
        return "";
      }
      switch (state.currentConversation.type) {
        case "C2C":
          return state.currentConversation.conversationID.replace("C2C", "");
        case "GROUP":
          return state.currentConversation.conversationID.replace("GROUP", "");
        default:
          return state.currentConversation.conversationID;
      }
    },

    currentConversationType: (state) => {
      if (!state.currentConversation || !state.currentConversation.type) {
        return "";
      }
      return state.currentConversation.type;
    },
    totalUnreadCount: (state) => {
      const conversationList = Object.values(state.conversationObject);
      const result = { count: 0, people: 0 };
      result.count = conversationList.reduce((count, conversation) => {
        // 当前会话不计算总未读
        if (
          !store.getters.hidden &&
          state.currentConversation.conversationID ===
            conversation.conversationID
        ) {
          return count;
        }
        if (conversation.unreadCount !== 0) {
          result.people++;
        }
        return count + conversation.unreadCount;
      }, 0);
      titleNotify(result);
      return result;
    },
    // 用于当前会话的图片预览
    imgUrlList: (state) => {
      return state.currentMessageList
        .filter((v) => v.type === TIM.TYPES.MSG_IMAGE && !v.isRevoked) // 筛选出没有撤回并且类型是图片类型的消息
        .map(
          (v) =>
            v.payload.imageInfoArray[0].url || v.payload.imageInfoArray[0].URL
        );
    },
    conversationIdList: (state) => {
      return state.map((v) => v.conversationID);
    },
  },
  mutations: {
    /* 更新当前会话 */
    updateCurrentConversation(state, conversation) {
      state.currentConversation = { ...conversation, unreadCount: 0};
      state.conversationObject[conversation.conversationID] = { ...conversation, unreadCount: 0};
      state.currentMessageList = [];
      state.nextReqMessageID = "";
      state.isCompleted = false;
    },
    resetCurrentConversationUnread(state) {
      state.currentConversation.unreadCount = 0;
    },
    setTotalConvasation(state, total) {
      // state.totalConvasation  = total
    },
    //  初始化会话列表
    initConversationList(state, conversationList) {
      const list = conversationFormate(conversationList)
      // console.log('初始化联系人列表', list)
      window.initConversationObject = list
      state.conversationObject = list
      console.log("on",Object.values(list)[0])
      state.currentConversation = Object.values(list)[0]
      state.currentMessageList = [];
    },
    updateConversationList(state, conversationList) {
      const conversationObject = {};
      conversationList.forEach((v) => {
        // if(state.forkList.indexOf(v.conversationID) !== -1){
        //   v.isFork = true
        // }
        conversationObject[v.conversationID] = v;
      });
      console.log("新的会话列表", conversationObject);
      window.conversationObject = conversationObject;
      state.conversationObject = Object.assign(
        state.conversationObject,
        conversationObject
      );
    },

    resetCurrentConversation(state) {
      state.currentConversation = {};
    },
    sendMessage(state, msg) {
      console.log("commit sendMessage");
    },
    /**
     * 将消息插入当前会话列表
     * 调用时机：接受实时推送的消息
     */
    pushCurrentMessageList(state, msg) {
      // 还没当前会话，则跳过s
      console.log("pushCurrentMessageList", msg, state.currentMessageList);
      const data = messageFormate([msg])[0];
      state.currentMessageList = [...state.currentMessageList, data];
    },

    /**
     * 从当前消息列表中删除某条消息
     * @param {Object} state
     * @param {Message} message
     */
    removeMessage(state, message) {
      const index = state.currentMessageList.findIndex(
        ({ ID }) => ID === message.ID
      );
      if (index >= 0) {
        state.currentMessageList.splice(index, 1);
      }
    },
    reset(state) {
      Object.assign(state, {
        currentConversation: {},
        currentMessageList: [],
        nextReqMessageID: "",
        isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
        conversationList: [],
      });
    },
    sendContactStar(state, { conversationID, UID, isFork }) {
      console.log("forkConversation3", isFork);
      // message.warning('取消收藏失败')
    },
  },
  actions,
};

export default conversationModules;
