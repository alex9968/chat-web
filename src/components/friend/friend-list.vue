<template>
  <div class="friend-list-container">
     <div class="header-bar">
       <div>好友列表</div>
    </div>
     <div class="group-container">
    <div v-if="hasRelation">
      <friend-item :related="false" v-for="user in relationList" :key="user.userID" :friend="user" />
    </div>

    <div v-if="hasFriend">
      <friend-item :related="true" v-for="user in friendList" :key="user.userID" :friend="user" />
    </div>
    <div class="null" v-else>暂无好友</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FriendItem from './friend-item.vue'
export default {
  components: {
    FriendItem
  },
  computed: {
    ...mapState({
      friendList: state => state.friend.friendList,
      relationList: state => state.friend.relationList
    }),
    hasFriend() {
      return this.friendList.length > 0
    },
    hasRelation() {
      return this.relationList.length > 0
    }
  }
}
</script>

<style lang="stylus" scpoed>
.friend-list-container
  height 100%
  width 100%
  display flex
  flex-direction column
 .group-container 
    overflow-y scroll
    flex 1
    .null 
      color gray
      height 50%
      width 100%
      display flex
      align-items center
      justify-content center



.header-bar
    display: flex;
    flex-shrink 0
    height 50px
    border-bottom 1px solid $background-deep-dark
    padding 10px 10px 10px 20px
    justify-content center
    color #a5b5c1
</style>
