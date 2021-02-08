<template>
  <div class="base" :class="[ isMine ? 'right' : 'left']">
    <div class="name text-ellipsis">{{ from }}</div>
    <div class="date">{{ date }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'MessageHeader',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      currentConversation: state => state.conversation.currentConversation,
      currentUserProfile: state => state.user.currentUserProfile,
      currentMemberList: state => state.group.currentMemberList
    }),
    date() {
       return dayjs(this.message.time).format('YYYY-MM-DD HH:mm:ss');
    },
    from() {
      // const isC2C = this.currentConversation.type === this.TIM.TYPES.CONV_C2C
      // 自己发送的用昵称渲染
     
      if (this.currentConversation.type === this.TIM.TYPES.CONV_SYSTEM) {
        return  '群系统通知'
      }
      // 2. 群组消息，用消息体中的 nick 渲染。nameCard暂时支持不完善
      return this.message.userInfo.Name
    },
    isMine() {
      return this.message.flow === 'out'
    }
  }
}
</script>

<style lang="stylus" scoped>
.right {
  display: flex;
  flex-direction: row-reverse;
}

.left {
  display: flex;
  flex-direction: row;
}

.base {
  color: $secondary;
  font-size: 12px;
}

.name {
  padding: 0 4px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
