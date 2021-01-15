import API from "@/services/index"

const friendModules = {
  state: {
    friendList: [],
    createGroupModelVisible: false
  },
  mutations: {
    upadteFriendList(state, friendList) {
      state.friendList = friendList
    },
    reset(state) {
      Object.assign(state, {
        friendList: [],
        createGroupModelVisible: false
      })
    }
  },
  actions: {
    getFriendList(context) {
      API.getFriendList({ id: localStorage.getItem('userID') })
        .then(({ data: friendList }) => {
          console.log("friendList:", friendList  )
          context.commit('upadteFriendList', friendList)
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
    }

  }
}

export default friendModules
