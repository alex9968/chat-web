import API from "@/services/index";
import { OP_TYPE } from "@/assets/consts";

const friendModules = {
  state: {
    friendList: [],
    relationList: [],
    createGroupModelVisible: false,
    currentFriend: {},
    currentRelation: {},
    currentFriendRelated: false,
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
      state.currentFriendRelated = true;
      state.currentRelation = {};
      state.friendList.forEach((v) => {
        // console.log("id", v.id);
        if (v.ID === friendID) {
          state.currentFriend = v;
        }
      });
    },
    setCurrentRelation(state, { UserId, Is2Me }) {
      state.currentFriendRelated = false;
      state.relationList.forEach((v) => {
        // console.log("id", v.id);
        if (!Is2Me && v.RelatedId === UserId) {
          state.currentFriend = v.RelatedProfile;
          state.currentRelation = v;
        }
        if (Is2Me && v.UserId === UserId) {
          state.currentFriend = v.UserProfile;
          state.currentRelation = v;
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
          data.friends.length &&
            context.commit("setCurrentFriend", data.friends[0].ID);
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
    // 切换当前朋友
    checkoutFriend(context, conversationID) {
      context.commit(
        "updateCurrentConversation",
        context.state.conversationObject[conversationID]
      );
    },
    handleFriendRelation(context, { ws, handleSig, relationID }) {
      const authToken = localStorage.getItem("token");
      const handleReq = {
        cop: OP_TYPE.COP_NEW_CHAT,
        authToken,
        data: JSON.stringify({
          handleSig,
          userID: parseInt(localStorage.getItem('userID')),
          relationID
        })
      }
      // send by ws
      ws.send(JSON.stringify(handleReq))
    },
  },
};

export default friendModules;
