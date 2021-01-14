import { message } from 'element-ui'
import { conversationFormate, messageFormate } from '../../utils/formatTIMData'
import API from '@/services/index'

export default {
  getMessageList(context, conversationID) {
    if (context.state.isCompleted) {
      context.commit('showMessage', {
        message: '已经没有更多的历史消息了哦',
        type: 'info',
      })
      return
    }
    const { currentMessageList } = context.state
    API.getMessageList({ chatID: conversationID, pageNum: 1, pageSize: 20 })
      .then((res) => {
        // 更新messageID，续拉时要用到
        // context.state.nextReqMessageID = imReponse.data.nextReqMessageID
        context.state.isCompleted = res.data.isCompleted
        // 更新当前消息列表，从头部插入
        //console.log('new currentMessageList', imReponse.data.messageList, currentMessageList)
        context.state.currentMessageList = [
          ...res.data.messageList,
          ...currentMessageList,
        ]
      })
  },
  getMoreHistoryMessageList(context, conversationID) {
    // const kfUid = localStorage.getItem('kfUid')
    //     // context.commit('showMessage', {
    //     //   message: '已经没有更多的历史消息了哦',
    //     //   type: 'warning',
    //     // })
    //   const messageList = messageFormate(
    //     res.data.messages,
    //     conversationID
    //   ).sort((a, b) => {
    //     return a.time - b.time
    //   })
    //   //console.log('messageList', messageList, res.data.messages)
    //   const { currentMessageList } = context.state
    //   context.state.currentMessageList = [
    //     ...messageList,
    //     ...currentMessageList,
    //   ]
    //   context.state.moreMessagePage++
  },
  getHistoryMessageList(context, conversationID) {
    // console.log('getHistoryMessageList', conversationID)
    // const userID = localStorage.getItem("userID");
    API.getMessageList({ chatID: 2, pageNum: 1, pageSize: 10 }).then((res) => {
      // console.log('message list',res)

      const messageList = messageFormate(res.data.messages, conversationID)
      // console.log('messageList', messageList, res.data.messages)
      const { currentMessageList } = context.state
      context.state.currentMessageList = [
        ...messageList,
        ...currentMessageList,
      ].sort((a, b) => {
        return a.time - b.time
      })
    })
  },
  searchConversation(context, toUid) {
    // const conversationID = 'C2Cim_account_10'
    API.getContactList({
    }).then((res) => {
      console.log('res search', res)
      if (
        res.data.contact_list.length &&
        res.data.contact_list[0].friend_uid == toUid
      ) {
        context.state.currentToUID = toUid
        const currentConversation = Object.values(
          conversationFormate(res.data.contact_list)
        )[0]
        // console.log('currentConversation',currentConversation)
        context.commit('updateCurrentConversation', currentConversation)
        // 获取消息列表
        context.dispatch(
          'getHistoryMessageList',
          currentConversation.conversationID
        )
        // return Promise.resolve()
        message.success('搜索成功')
      } else {
        message.warning('未找到该用户')
        // return Promise.reject()
      }
    })
  },
  /**
   * 切换会话
   * 调用时机：切换会话时
   * @param {Object} context
   * @param {String} conversationID
   */
  checkoutConversation(context, conversationID) {
    //context.commit('resetCurrentMemberList')
    // 1.切换会话前，将切换前的会话进行已读上报
    // if (context.state.currentConversation.conversationID) {
    //   const prevConversationID = context.state.currentConversation.conversationID
    //   tim.setMessageRead({ conversationID: prevConversationID })
    // }
    // 2.待切换的会话也进行已读上报

    // tim.setMessageRead({ conversationID })
    // if (conversationID.slice(3).slice(0, 3) === 'sys') {
    //   message.warning('系统消息无法打开')
    //   return
    // }

    context.commit(
      'updateCurrentConversation',
      context.state.conversationObject[conversationID]
    )
    context.dispatch('getMessageList', conversationID)

    // 3. 获取会话信息
    // return tim.getConversationProfile(conversationID).then(({ data }) => {
    //   // 3.1 更新当前会话
    //   context.commit('updateCurrentConversation', data.conversation)
    //   // 3.2 获取消息列表
    //   context.dispatch('getMessageList', conversationID)
    //   // 3.3 拉取第一页群成员列表
    //   // if (data.conversation.type === TIM.TYPES.CONV_GROUP) {
    //   //   return context.dispatch('getGroupMemberList', data.conversation.groupProfile.groupID)
    //   // }
    //   return Promise.resolve()
    // })
  },
}
