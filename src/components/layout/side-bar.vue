<template>
  <div class="side-bar-wrapper">
    <div class="bar-left">
      <my-profile />
      <div class="tab-items" @click="handleClick">
        <div
          id="conversation-list"
          class="iconfont icon-conversation"
          :class="{ active: showConversationList }"
          title="会话列表"
        >
          <sup class="unread" v-if="totalUnreadCount.count !== 0">
            <template v-if="totalUnreadCount.count > 99">99+</template>
            <template v-else>{{ totalUnreadCount.count }}</template>
          </sup>
        </div>
        <div
          id="group-list"
          class="iconfont icon-group"
          :class="{ active: showGroupList }"
          title="群组列表"
        ></div>
        <div
          id="friend-list"
          class="iconfont icon-contact"
          :class="{ active: showFriendList }"
          title="好友列表"
        ></div>
        <div
          id="black-list"
          class="iconfont icon-blacklist"
          :class="{ active: showBlackList }"
          title="黑名单列表"
        ></div>
      </div>
      <div class="bottom">
        <div class="iconfont icon-tuichu" @click="logout" title="退出"></div>
      </div>
    </div>

    <div class="bar-right">
      <conversation-list v-show="showConversationList" />
      <group-list v-show="showGroupList" />
      <friend-list v-show="showFriendList" />
      <black-list v-show="showBlackList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MyProfile from '../my-profile'
import ConversationList from '../conversation/conversation-list'
import GroupList from '../group/group-list'
import FriendList from '../friend/friend-list'
import BlackList from '../blacklist/blacklist'
import { activeTabName } from '../../assets/consts'


export default {
  name: 'SideBar',
  components: {
    MyProfile,
    ConversationList,
    GroupList,
    FriendList,
    BlackList,
  },
  data() {
    return {
      active: activeTabName.CONVERSATION_LIST,
      activeTabName: activeTabName,
    }
  },
  computed: {
    ...mapGetters(['totalUnreadCount']),
    showConversationList() {
      return this.active === activeTabName.CONVERSATION_LIST
    },
    showGroupList() {
      return this.active === activeTabName.GROUP_LIST
    },
    showFriendList() {
      return this.active === activeTabName.FRIEND_LIST
    },
    showBlackList() {
      return this.active === activeTabName.BLACK_LIST
    },
    showAddButton() {
      return [activeTabName.CONVERSATION_LIST, activeTabName.GROUP_LIST].includes(
        this.active
      )
    },
  },

  watch: {
    active(val){
      // localStorage.setItem("activeTab", val)
      // console.log('ss',val)
      this.$store.commit('setActiveTab', val)
    }

  },
  methods: {
    checkoutActive(name) {
      this.active = name
    },
    handleClick(event) {
      switch (event.target.id) {
        case activeTabName.CONVERSATION_LIST:
          this.checkoutActive(activeTabName.CONVERSATION_LIST)
          break
        case activeTabName.GROUP_LIST:
          this.checkoutActive(activeTabName.GROUP_LIST)
          break
        case activeTabName.FRIEND_LIST:
          this.checkoutActive(activeTabName.FRIEND_LIST)
          break
        case activeTabName.BLACK_LIST:
          this.checkoutActive(activeTabName.BLACK_LIST)
          break
      }
    },
    logout() {
      API.logout({ token: localStorage.getItem('token') }).then(
        (res) => {
          console.log('logout')
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      )
    },
    // handleRefresh() {
    //   switch (this.active) {
    //     case activeTabName.CONVERSATION_LIST:
    //       this.tim.getConversationList().catch((error) => {
    //         this.$store.commit('showMessage', {
    //           type: 'error',
    //           message: error.message,
    //         })
    //       })
    //       break
    //     case activeTabName.GROUP_LIST:
    //       this.getGroupList()
    //       break
    //     case activeTabName.FRIEND_LIST:
    //       this.getFriendList()
    //       break
    //     case activeTabName.BLACK_LIST:
    //       this.$store.dispatch('getBlacklist')
    //       break
    //   }
    // },
   
   
  },
}
</script>

<style lang="stylus" scoped>
.side-bar-wrapper {
  height: 100%;
  color: black;
  // border-right: 1px solid lightgrey;
  display: flex;
  width: 100%;
  overflow: hidden;

  .bar-left {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    width: 80px;
    height: $height;
    background-color: #303841;

    .tab-items {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .iconfont {
        position: relative;
        margin: 0;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
        color: $first;
        user-select: none;
        -moz-user-select: none;
      }

      .active {
        color: $white;
        background-color: #363e47;

        &::after {
          content: ' ';
          display: block;
          position: absolute;
          top: 0;
          z-index: 0;
          height: 70px;
          // border-left 4px solid $border-highlight
          border-left: 4px solid $light-primary;
        }
      }

      .unread {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 999;
        display: inline-block;
        height: 18px;
        padding: 0 6px;
        font-size: 12px;
        color: #FFF;
        line-height: 18px;
        text-align: center;
        white-space: nowrap;
        border-radius: 10px;
        background-color: $danger;
      }
    }

    .bottom {
      height: 70px;

      &>span {
        display: block;
      }

      .btn-more {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        color: $first;
        text-align: center;
        cursor: pointer;
      }

      .iconfont {
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
        color: $first;
        user-select: none;
        -moz-user-select: none;
      }

      .iconfont:hover {
        color: white;
      }
    }

    .btn-more:hover {
      color: $white;
    }
  }

  .bar-right {
    // flex 1
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    height: $height;
    position: relative;
    background-color: $background-dark;
  }
}
</style>
