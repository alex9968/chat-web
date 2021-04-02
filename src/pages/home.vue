<template>
  <div class="container">
    <div
      class="loading"
      v-loading="showLoading"
      element-loading-text="正在拼命初始化..."
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="chat-header">
        <header-bar />
      </div>
      <div class="chat-wrapper">
        <el-row>
          <el-col :xs="10" :sm="10" :md="10" :lg="8" :xl="7">
            <side-bar />
          </el-col>
          <el-col
            v-show="showConversationList"
            :xs="14"
            :sm="14"
            :md="14"
            :lg="16"
            :xl="17"
          >
            <current-conversation />
          </el-col>
          <el-col
            v-show="showGroupList"
            :xs="14"
            :sm="14"
            :md="14"
            :lg="16"
            :xl="17"
          >
            <current-group />
          </el-col>
          <el-col
            v-show="showFriendList"
            :xs="14"
            :sm="14"
            :md="14"
            :lg="16"
            :xl="17"
          >
            <current-friend />
          </el-col>

          <!-- <el-col :xs="0" :sm="4" :md="4" :lg="5" :xl="5">
            <right-side />
          </el-col> -->
        </el-row>
      </div>

      <image-previewer />
    </div>
    <div class="bg" />
  </div>
</template>

<script>
import { Notification } from 'element-ui'
import Vue from 'vue'
import { mapState } from 'vuex'
import CurrentConversation from '../components/conversation/current-conversation'
import CurrentGroup from '../components/group/current-group'
import CurrentFriend from '../components/friend/current-friend'
import SideBar from '../components/layout/side-bar'
import HeaderBar from '../components/layout/header-bar'
import ImagePreviewer from '../components/message/image-previewer.vue'
import { activeTabName, OP_TYPE  } from '../assets/consts'
import { ACTION } from '../utils/trtcCustomMessageMap'
import MTA from '../utils/mta'

const socketUrl = process.env.NODE_ENV === "production" ? 'ws://39.105.116.143:8000/ws' : 'ws://127.0.0.1:8000/ws'
// let websocket = new WebSocket(socketUrl)

export default {
  title: 'TIMSDK DEMO',
  components: {
    SideBar,
    CurrentConversation,
    CurrentFriend,
    CurrentGroup,
    ImagePreviewer,
    HeaderBar,
  },

  computed: {
    ...mapState({
      currentUserProfile: (state) => state.user.currentUserProfile,
      currentConversation: (state) => state.conversation.currentConversation,
      isLogin: (state) => state.user.isLogin,
      isWsReady: (state) => state.user.isWsReady,
      isBusy: (state) => state.video.isBusy,
      userID: (state) => state.user.userID,
      conversationPageSize: (state) => state.conversation.conversationPageSize,
      activeTab: (state) => state.activeTab,
      showConversationList: (state) =>
        state.activeTab === activeTabName.CONVERSATION_LIST,
      showGroupList: (state) => state.activeTab === activeTabName.GROUP_LIST,
      showFriendList: (state) => state.activeTab === activeTabName.FRIEND_LIST,
    }),
    // 是否显示 Loading 状态
    showLoading() {
      return !this.isWsReady
    },
    // showConversationList() {
    //   return localStorage.getItem("activeTab") === activeTabName.CONVERSATION_LIST
    // },
    // showGroupList() {
    //   return localStorage.getItem("activeTab") === activeTabName.GROUP_LIST
    // },
    // showFriendList() {
    //   return localStorage.getItem("activeTab") === activeTabName.FRIEND_LIST
    // },
  },
  watch: {
    activeTab(cur) {},
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.$store.commit('setUserInfo', userInfo)

    // 初始化监听器
    // this.initListener()
    this.initWebSocket()
  },
  data() {
    return {
      websock: null,
    }
  },
  watch: {
    isLogin(next) {
      if (next) {
        MTA.clickStat('link_two', { show: 'true' })
      }
    },
  },
  methods: {
    //初始化weosocket
    initWebSocket() {
      // const wsuri = process.env.WS_API + '/websocket/threadsocket'
      Vue.prototype.ws = new WebSocket(socketUrl)

      //  this.$store.commit('initWebsocket', data)

      this.ws.onmessage = this.websocketonmessage
      this.ws.onopen = this.websocketopen
      this.ws.onclose = this.websocketclose
    },
    websocketopen() {
      // let data = { authToken: localStorage.getItem('token'), roomID:  }
      //websocket onopen
      const authToken =  localStorage.getItem('token')

       this.ws.send(JSON.stringify({authToken, cop: OP_TYPE.COP_AUTH}))
      //取出当前的会话列表
      this.onReady()
    },
    //数据接收, 处理
    websocketonmessage(e) {
      if(!e.data) return
      const data = JSON.parse(e.data)
      console.log("new ws:", data)
      this.$store.commit('pushCurrentMessageList', { msg: data, store: this.$store})
      // // console.log('websocketonmessage', data)
      // if (data.op == 3) {
      // } else if (data.op == 4) {
      //   // get room user count
      //   // $("#roomOnlineMemberNum").text(data.count);
      // } else if (data.op == 5) {
      //   // get room user list
      //   // this.$store.commit('addConversationList', [data])
      // }
    },
    websocketsend(agentData) {
      //数据发送
      this.ws.send(agentData)
    },
    websocketclose(e) {
      //关闭
      console.log('connection closed (' + e.code + ')')
    },
    initListener() {
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      // this.tim.on(this.TIM.EVENT.SDK_READY, this.onReady, this)
      // // SDK NOT READT
      // this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this)
      // 被踢出
      this.tim.on(this.TIM.EVENT.KICKED_OUT, this.onKickOut)
      // SDK内部出错
      this.tim.on(this.TIM.EVENT.ERROR, this.onError)
      // 收到新消息
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage)
      // 会话列表更新
      this.tim.on(
        this.TIM.EVENT.CONVERSATION_LIST_UPDATED,
        this.onUpdateConversationList
      )
      // 群组列表更新
      // this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList)
      // 网络监测
      this.tim.on(this.TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange)
      // 已读回执
      this.tim.on(this.TIM.EVENT.MESSAGE_READ_BY_PEER, this.onMessageReadByPeer)
    },
    addHistoryFriendList() {
      this.$store.commit('addConversationList', res.data.contact_list)
      this.$store.commit('setTotalConvasation', res.data.total)
      this.$store.commit('updateUnreadTotal', {
        unreadCount: res.data.unread_count,
        unreadNumber: res.data.unread_number,
      })
    },
    onReceiveMessage({ data: messageList }) {
      this.handleVideoMessage(messageList)
      this.handleAt(messageList)
      this.handleQuitGroupTip(messageList)
      this.$store.commit('pushCurrentMessageList', messageList)
    },
    onError({ data }) {
      if (data.message !== 'Network Error') {
        this.$store.commit('showMessage', {
          message: data.message,
          type: 'error',
        })
      }
    },
    onMessageReadByPeer() {},

    //登录成功后
    onReady() {
      this.$store.commit('toggleIsWsReady', true)
      this.API.getChatList({ userID: localStorage.getItem('userID') }).then(
        (res) => {
          console.log('getRoomInfo', res)
          const firstConversationID =
            res.data.list[0].Sort + res.data.list[0].ID
          this.$store.commit('initConversationList', res.data.list)
          //自动选择第一个会话
          this.$store.dispatch('checkoutConversation', firstConversationID)
          this.$store.dispatch('getFriendList')
          this.$store.dispatch('getGroupList')
        }
      )

      // if (this.isSDKReady) {
      //   this.tim
      //     .getMyProfile()
      //     .then(({ data }) => {
      //       this.$store.commit('updateCurrentUserProfile', data)
      //     })
      //     .catch((error) => {
      //       this.$store.commit('showMessage', {
      //         type: 'error',
      //         message: error.message,
      //       })
      //     })
      //   this.$store.dispatch('getBlacklist')
      // }
    },
    kickedOutReason(type) {
      switch (type) {
        case this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
          return '由于多实例登录'
        case this.TIM.TYPES.KICKED_OUT_MULT_DEVICE:
          return '由于多设备登录'
        case this.TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          return '由于 userSig 过期'
        default:
          return ''
      }
    },
    checkoutNetState(state) {
      switch (state) {
        case this.TIM.TYPES.NET_STATE_CONNECTED:
          return { message: '已接入网络', type: 'success' }
        case this.TIM.TYPES.NET_STATE_CONNECTING:
          return { message: '当前网络不稳定', type: 'warning' }
        case this.TIM.TYPES.NET_STATE_DISCONNECTED:
          return { message: '当前网络不可用', type: 'error' }
        default:
          return ''
      }
    },
    onNetStateChange(event) {
      this.$store.commit('showMessage', this.checkoutNetState(event.data.state))
    },
    onKickOut(event) {
      this.$store.commit('showMessage', {
        message: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
        type: 'error',
      })
      this.$store.commit('toggleIsLogin', false)
      this.$store.commit('reset')
    },
    onUpdateConversationList(event) {
      //更新会话联系人列表
      console.log('更新会话联系人列表', event)
      this.$store.commit('updateConversationList', event.data)
    },
    // onUpdateGroupList(event) {
    //   this.$store.commit('updateGroupList', event.data)
    // },
    // onReceiveGroupSystemNotice(event) {
    //   const isKickedout = event.data.type === 4
    //   const isCurrentConversation =
    //     `GROUP${event.data.message.payload.groupProfile.groupID}` ===
    //     this.currentConversation.conversationID
    //   // 在当前会话被踢，需reset当前会话
    //   if (isKickedout && isCurrentConversation) {
    //     this.$store.commit('resetCurrentConversation')
    //   }
    //   Notification({
    //     title: '新系统通知',
    //     message: translateGroupSystemNotice(event.data.message),
    //     duration: 3000,
    //     onClick: () => {
    //       const SystemConversationID = '@TIM#SYSTEM'
    //       this.$store.dispatch('checkoutConversation', SystemConversationID)
    //     },
    //   })
    // },
    /**
     * 处理 @ 我的消息
     * @param {Message[]} messageList
     */
    handleAt(messageList) {
      // 筛选有 @ 符号的文本消息
      const atTextMessageList = messageList.filter(
        (message) =>
          message.type === this.TIM.TYPES.MSG_TEXT &&
          message.payload.text.includes('@')
      )
      for (let i = 0; i < atTextMessageList.length; i++) {
        const message = atTextMessageList[i]
        const matched = message.payload.text.match(/@\w+/g)
        if (!matched) {
          continue
        }
        // @ 我的
        if (matched.includes(`@${this.currentUserProfile.userID}`)) {
          // 当前页面不可见时，调用window.Notification接口，系统级别通知。
          if (this.$store.getters.hidden) {
            this.notifyMe(message)
          }
          Notification({
            title: `有人在群${message.conversationID.slice(5)}提到了你`,
            message: message.payload.text,
            duration: 3000,
          })
          this.$bus.$emit('new-messsage-at-me', {
            data: { conversationID: message.conversationID },
          })
        }
      }
    },
    selectConversation(conversationID) {
      if (conversationID !== this.currentConversation.conversationID) {
        this.$store.dispatch('checkoutConversation', conversationID)
      }
    },
    isJsonStr(str) {
      try {
        JSON.parse(str)
        return true
      } catch {
        return false
      }
    },
    handleVideoMessage(messageList) {
      const videoMessageList = messageList.filter(
        (message) =>
          message.type === this.TIM.TYPES.MSG_CUSTOM &&
          this.isJsonStr(message.payload.data)
      )
      if (videoMessageList.length === 0) return
      const videoPayload = JSON.parse(videoMessageList[0].payload.data)
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_DIALING) {
        if (this.isBusy) {
          this.$bus.$emit('busy', videoPayload, videoMessageList[0])
          return
        }
        this.$store.commit('GENERATE_VIDEO_ROOM', videoPayload.room_id)
        this.selectConversation(videoMessageList[0].conversationID) // 切换当前会话页
        if (videoMessageList[0].from !== this.userID) {
          this.$bus.$emit('isCalled')
        }
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_CANCEL) {
        this.$bus.$emit('missCall')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_REJECT) {
        this.$bus.$emit('isRefused')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_TIMEOUT) {
        this.$bus.$emit('missCall')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ACCEPTED) {
        this.$bus.$emit('isAccept')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_HANGUP) {
        this.$bus.$emit('isHungUp')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_LINE_BUSY) {
        this.$bus.$emit('isRefused')
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ERROR) {
        this.$bus.$emit('isRefused')
      }
    },
    /**
     * 使用 window.Notification 进行全局的系统通知
     * @param {Message} message
     */
    notifyMe(message) {
      // 需检测浏览器支持和用户授权
      if (!('Notification' in window)) {
        return
      } else if (window.Notification.permission === 'granted') {
        this.handleNotify(message)
      } else if (window.Notification.permission !== 'denied') {
        window.Notification.requestPermission().then((permission) => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === 'granted') {
            this.handleNotify(message)
          }
        })
      }
    },
    handleNotify(message) {
      const notification = new window.Notification('有人提到了你', {
        icon:
          'https://webim-1252463788.file.myqcloud.com/demo/img/logo.dc3be0d4.png',
        body: message.payload.text,
      })
      notification.onclick = () => {
        window.focus()
        this.$store.dispatch('checkoutConversation', message.conversationID)
        notification.close()
      }
    },
    handleLinkClick() {
      MTA.clickStat('link_two', { click: 'true' })
    },
    /**
     * 收到有群成员退群/被踢出的groupTip时，需要将相关群成员从当前会话的群成员列表中移除
     * @param {Message[]} messageList
     */
    handleQuitGroupTip(messageList) {
      // 筛选出当前会话的退群/被踢群的 groupTip
      const groupTips = messageList.filter((message) => {
        return (
          this.currentConversation.conversationID === message.conversationID &&
          message.type === this.TIM.TYPES.MSG_GRP_TIP &&
          (message.payload.operationType === this.TIM.TYPES.GRP_TIP_MBR_QUIT ||
            message.payload.operationType ===
              this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT)
        )
      })
      // 清理当前会话的群成员列表
      if (groupTips.length > 0) {
        groupTips.forEach((groupTip) => {
          if (
            Array.isArray(groupTip.payload.userIDList) ||
            groupTip.payload.userIDList.length > 0
          ) {
            this.$store.commit(
              'deleteGroupMemberList',
              groupTip.payload.userIDList
            )
          }
        })
      }
    },
  },
}
</script>

<style lang="stylus">
body {
  overflow: hidden;
  margin: 0;
  font-family: 'Microsoft YaHei', '微软雅黑', 'MicrosoftJhengHei', 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif;
  // font-family  "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif
  // text-shadow: $regular 0 0 0.05em
  background-color: #f5f5f5;
  -ms-scroll-chaining: chained;
  -ms-overflow-style: none;
  -ms-content-zooming: zoom;
  -ms-scroll-rails: none;
  -ms-content-zoom-limit-min: 100%;
  -ms-content-zoom-limit-max: 500%;
  -ms-scroll-snap-type: proximity;
  -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
  -ms-overflow-style: none;
  overflow: auto;

  div {
    box-sizing: border-box;

    &::before, &::after {
      box-sizing: border-box;
    }
  }
}

#wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 100px;
}

.container {
  position: relative;
  height: 100vh;
}

.loading {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-wrapper {
  width: $width;
  height: $height;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);
  max-width: 1280px;
}

.chat-header {
  position: absolute;
  top: 0;
  left: 0;
}

.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  background: url('~@/./assets/image/bg.jpg') no-repeat 0 0;
  background-size: cover;
  // filter blur(67px)
}

/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
