// eslint-disable-next-line quotes
import API from "@/services/index";

const groupModules = {
  state: {
    groupList: [],
    currentGroup: {},
    currentMemberList: [],
    createGroupModelVisible: false,
  },
  getters: {
    hasGroupList: (state) => state.groupList.length > 0,
  },
  mutations: {
    updateGroupList(state, groupList) {
      state.groupList = groupList;
    },
    updateCreateGroupModelVisible(state, visible) {
      state.createGroupModelVisible = visible;
    },
    updateCurrentMemberList(state, memberList) {
      state.currentMemberList = [...state.currentMemberList, ...memberList];
    },
    deleteGroupMemeber(state, userID) {
      state.currentMemberList = state.currentMemberList.filter(
        (member) => member.userID !== userID
      );
    },
    deleteGroupMemberList(state, userIDList) {
      state.currentMemberList = state.currentMemberList.filter(
        (member) => !userIDList.includes(member.userID)
      );
    },
    resetCurrentMemberList(state) {
      state.currentMemberList = [];
    },
    reset(state) {
      Object.assign(state, {
        groupList: [],
        currentMemberList: [],
        createGroupModelVisible: false,
      });
    },
    setCurrentGroup(state, groupID) {
      console.log("setCurrentGroup(", groupID);
      state.groupList.forEach((v) => {
        if (v.ID === groupID) {
          state.currentGroup = v;
        }
      });
    },
  },
  actions: {
    updateGroupList(context, groupList) {
      context.commit("updateGroupList", groupList);
    },
    getGroupMemberList(context, groupID) {
      return API.getUserGroupMemberList({
        groupID: groupID,
        offset: context.state.currentMemberList.length,
        count: 30,
      }).then((imResponse) => {
        context.commit("updateCurrentMemberList", imResponse.data.memberList);
        return imResponse;
      });
    },
    getGroupList(context) {
      API.getGroupList({ id: localStorage.getItem("userID") })
        .then(({ data: groupList }) => {
          context.dispatch("updateGroupList", groupList);
        })
        .catch((error) => {
          context.commit("showMessage", {
            type: "error",
            message: error.message,
          });
        });
    },
  },
};

export default groupModules;
