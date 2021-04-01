import API from "@/services/index";

const friendModules = {
  state: {
    friendList: [],
    relationList: [],
    createGroupModelVisible: false,
    currentFriend: {},
    currentRelation: {},
    currentFriendRelated: false
  },
  mutations: {
    updateFriendData(state, data) {
      state.friendList = data.friends;
      state.relationList = data.relations;
    },
    reset(state) {
      Object.assign(state, {
        friendList: [],
        createGroupModelVisible: false,
      });
    },
    setCurrentFriend(state, friendID) {
      // console.log("setCurrentFriend(", friendID);
      state.currentFriendRelated = true
      state.friendList.forEach((v) => {
        // console.log("id", v.id);
        if (v.ID === friendID) {
          state.currentFriend = v;
        }
      });
    },
    setCurrentRelation(state, { UserId, Is2Me }) {
      state.currentFriendRelated = false
      state.relationList.forEach((v) => {
        // console.log("id", v.id);
        if (!Is2Me && v.RelatedId === UserId) {
          state.currentFriend = v.RelatedProfile;
        }
        if (Is2Me && v.UserId === UserId) {
          state.currentFriend = v.UserProfile;
        }
      });
    },
  },
  actions: {
    getFriendList(context) {
      API.getFriendList({ id: localStorage.getItem("userID") })
        .then(({ data }) => {
          // console.log("friendList:", friendList  )
          context.commit("updateFriendData", data);
          data.friends.length && context.commit("setCurrentFriend", data.friends[0].ID);
        })
        .catch((error) => {
          context.commit("showMessage", {
            type: "error",
            message: error.message,
          });
        })
        .catch((error) => {
          this.$store.commit("showMessage", {
            type: "error",
            message: error.message,
          });
        });
    },
    //切换当前朋友
    checkoutFriend(context, conversationID) {
      context.commit(
        "updateCurrentConversation",
        context.state.conversationObject[conversationID]
      );
    },
   
  },
};

export default friendModules;
