<template>
  <div v-if="related" @click="handleFriendClick" class="scroll-container">
    <div
      :class="{ 'friend-item': true, active: friend.ID === currentFriendID }"
    >
      <avatar :src="friend.Avatar" />
      <div class="friend-name text-ellipsis">{{ friend.Name }}</div>
    </div>
  </div>

  <!-- 你加别人的申请 -->
  <div v-else-if="friend.UserId === userID" @click="handleRelationClick" class="scroll-container">
    <div
      :class="{
        'friend-item': true,
        active: friend.RelatedId === currentFriendID,
      }"
    >
        <avatar :src="friend.RelatedProfile.Avatar" />
        <div class="friend-name text-ellipsis">
          {{ friend.RelatedProfile.Name }}
        </div>
        <div v-if="friend.State === 0" style="font-size: 12px">
          已申请,等待对方同意
        </div>
        <div v-if="friend.State === 1" style="font-size: 12px">已添加</div>
        <div v-if="friend.State === 2" style="font-size: 12px">对方已拒绝</div>
     
    </div>
  </div>

<!-- 别人加你 -->
  <div v-else @click="handleRelation2Click" class="scroll-container">
    <div
      :class="{
        'friend-item': true,
        active: friend.RelatedId === currentFriendID,
      }"
    >
        <avatar :src="friend.UserProfile.Avatar" />
        <div class="friend-name text-ellipsis">
          {{ friend.UserProfile.Name }}
        </div>
        <div v-if="friend.State === 0" style="font-size: 12px">申请加你为好友,待处理</div>
        <div v-if="friend.State === 1" style="font-size: 12px">已添加</div>
        <div v-if="friend.State === 2" style="font-size: 12px">对方已拒绝</div>
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
    related: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState({
      currentFriendID: (state) => state.friend.currentFriend.ID,
      userID: (state) => state.user.userID,
    }),
  },
  methods: {
    handleFriendClick() {
      // console.log('handleFriendClick(')
      this.$store.commit('setCurrentFriend', this.friend.ID)
    },
    handleRelationClick() {
      this.$store.commit('setCurrentRelation', {UserId: this.friend.RelatedId, Is2Me: false})
    },
    handleRelation2Click() {
      this.$store.commit('setCurrentRelation', {UserId: this.friend.UserId, Is2Me: true})
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

  .active {
    color: $white;
    background-color: $background;
  }

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