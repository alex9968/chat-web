<template>
  <div
    @click="handleFriendClick"
    @dblclick="handleFriendDoubleClick"
    class="scroll-container"
  >
    <div class="friend-item">
      <avatar :src="friend.Avatar" />
      <div class="friend-name text-ellipsis">{{ friend.Name }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    friend: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  methods: {
    handleFriendClick() {
      console.log('handleFriendClick(')
      this.$store.commit('setCurrentFriend', this.friend.ID)
      setTimeout(() => {
        console.log('(:', this.user)
      })
    },

    handleFriendDoubleClick() {
      console.log('handleFriendDoubleClick(')
    },
    addConversation() {
      this.API.addConversation({
        chatID: `C2C${this.friend.ID}`,
        userID: localStorage.getItem('userID'),
      })
        .then(({ data }) => {
          this.$store.commit('updateCurrentConversation', data)
        })
        .catch((error) => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message,
          })
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
.scroll-container {
  overflow-y: scroll;
  flex: 1;

  .friend-item {
    display: flex;
    padding: 10px 20px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: 0.2s;

    &:hover {
      background-color: $background;
    }

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .friend-name {
      flex: 1;
      color: $font-light;
      line-height: 30px;
    }
  }
}
</style>