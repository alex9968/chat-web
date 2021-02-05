import API from '@/services/index'

const friendModules = {
  state: {
    friendList: [],
    createGroupModelVisible: false,
    currentFriend: {"ss":23},
  },
  mutations: {
    upadateFriendList(state, friendList) {
      state.friendList = friendList
    },
    reset(state) {
      Object.assign(state, {
        friendList: [],
        createGroupModelVisible: false
      })
    },
    setCurrentFriend(state, friendID) {
        console.log('setCurrentFriend(', friendID)
      state.friendList.forEach(v => {
        console.log('id',v.id)
        if (v.ID === friendID) {
          state.currentFriend = v
        }
      })
    }
  },
  actions: {
    getFriendList(context) {
      API.getFriendList({ id: localStorage.getItem('userID') })
        .then(({ data: friendList }) => {
          // console.log("friendList:", friendList  )
          context.commit('upadateFriendList', friendList)
          context.commit('setCurrentFriend', friendList[0].ID)
        })
        .catch((error) => {
          context.commit('showMessage', {
            type: 'error',
            message: error.message,
          })
        })
        .catch((error) => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message,
          })
        })
    },
    //切换当前朋友
    checkoutFriend(context, conversationID) {
      context.commit(
        'updateCurrentConversation',
        context.state.conversationObject[conversationID]
      )
    },

  }
}

export default friendModules
