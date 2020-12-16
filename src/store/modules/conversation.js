import tim from 'tim'
import TIM from 'tim-js-sdk'
import API from '@/services/index'
import { message } from 'element-ui'
import store from '..'
import { titleNotify } from '../../utils'
import actions from './conversation-actions'
import { conversationFormate } from '../../utils/formatTIMData';
// import mutations from './conversation-mutations'

const conversationModules = {
  state: {
    currentConversation: {},
    currentConversationTitle: '',
    currentToUID: null,
    moreMessagePage: 2,
    currentMessageList: [],
    nextReqMessageID: '',
    isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
    conversationObject: {},
    totalConvasation: 0,
    conversationPageNum: 1,
    conversationPageSize: 100,
    forkList: ['C2Cim_account_3']
  },
  getters: {
    toAccount: state => {
      if (!state.currentConversation || !state.currentConversation.conversationID) {
        return ''
      }
      switch (state.currentConversation.type) {
        case 'C2C':
          return state.currentConversation.conversationID.replace('C2C', '')
        case 'GROUP':
          return state.currentConversation.conversationID.replace('GROUP', '')
        default:
          return state.currentConversation.conversationID
      }
    },
    
    currentConversationType: state => {
      if (!state.currentConversation || !state.currentConversation.type) {
        return ''
      }
      return state.currentConversation.type
    },
    totalUnreadCount: state => {
      const conversationList = Object.values(state.conversationObject)
      const result = { count: 0, people: 0} 
      result.count = conversationList.reduce((count, conversation) => {
        // 当前会话不计算总未读
        if (!store.getters.hidden && state.currentConversation.conversationID === conversation.conversationID) {
          return count
        }
        if(conversation.unreadCount !== 0) {
          result.people++
        }
        return count + conversation.unreadCount
      }, 0)
      titleNotify(result)
      return result
    },
    // 用于当前会话的图片预览
    imgUrlList: state => {
      return state.currentMessageList
        .filter(v => v.type === TIM.TYPES.MSG_IMAGE && !v.isRevoked) // 筛选出没有撤回并且类型是图片类型的消息
        .map(v => v.payload.imageInfoArray[0].url || v.payload.imageInfoArray[0].URL)
    },
    conversationIdList: state => {
      return state.map(v => v.conversationID)
    },
  },
  mutations: {
     /* 更新当前会话 */
    updateCurrentConversation(state, conversation) {
      state.currentConversation = conversation
      state.currentMessageList = []
      state.nextReqMessageID = ''
      state.isCompleted = false
    },
    resetCurrentConversationUnread(state) {
      state.currentConversation.unreadCount = 0
    },
    updateCurrentConversationTitle(state, user) {
      const age = new Date().getFullYear() - parseInt((user['age']+'').slice(0,4))
      let conversationTitle = user.uid  + ' ' + (user.sex === 1 ? '男' : '女')  + ' ' + age + '【' + user.platform + '】' + '【type=' + user.user_type+ '】'
      state.currentConversationTitle = conversationTitle
    },
    setTotalConvasation(state, total) {
      state.totalConvasation  = total
    },
    //  初始化会话列表
    addConversationList(state, conversationList) {
      const list = conversationFormate(conversationList)
      
      console.log('初始化联系人列表', list)
      window.initConversationObject  =list 
      state.conversationObject = list
    },
    addMoreConversationList(state) {
      if(parseInt(state.totalConvasation/state.conversationPageSize)+1 <= state.conversationPageNum) {
        message.warning('没有更多了')
        return
      }
      API.getContactList({
        kf_uid: localStorage.getItem('kfUid'),
        page: state.conversationPageNum +1,
        per_page: state.conversationPageSize
      }).then((res) => { 
        console.log('getContactList' , res.data.contact_list)
        const list = conversationFormate(res.data.contact_list)
        state.conversationPageNum++
        state.conversationObject = {...state.conversationObject, ...list} 

      })

    },
    updateConversationList(state, conversationList) {
      const conversationObject = {}
      conversationList.forEach(v => {
        // if(state.forkList.indexOf(v.conversationID) !== -1){
        //   v.isFork = true
        // }
        conversationObject[v.conversationID] = v
      })
      console.log('新的会话列表', conversationObject)
      window.conversationObject  =conversationObject 
      state.conversationObject = Object.assign(state.conversationObject, conversationObject)
    },
    /**
     * 重置当前会话
     * 调用时机：需要重置当前会话时，例如：当前会话是一个群组，正好被踢出群时（被踢群事件触发），重置当前会话
     * @param {Object} state
     */
    resetCurrentConversation(state) {
      state.currentConversation = {}
    },
    /**
     * 将消息插入当前会话列表
     * 调用时机：收/发消息事件触发时
     * @param {Object} state
     * @param {Message[]|Message} data
     * @returns
     */
    pushCurrentMessageList(state, data) {
      // 还没当前会话，则跳过
      if (!state.currentConversation.conversationID) {
        return
      }
      if (Array.isArray(data)) {
        // 筛选出当前会话的消息
        const result = data.filter(item => item.conversationID === state.currentConversation.conversationID)
        state.currentMessageList = [...state.currentMessageList, ...result]
      } else if (data.conversationID === state.currentConversation.conversationID) {
        state.currentMessageList = [...state.currentMessageList, data]
      }
    },
    /**
     * 从当前消息列表中删除某条消息
     * @param {Object} state
     * @param {Message} message
     */
    removeMessage(state, message) {
      const index = state.currentMessageList.findIndex(({ ID }) => ID === message.ID)
      if (index >= 0) {
        state.currentMessageList.splice(index, 1)
      }
    },
    reset(state) {
      Object.assign(state, {
        currentConversation: {},
        currentMessageList: [],
        nextReqMessageID: '',
        isCompleted: false, // 当前会话消息列表是否已经拉完了所有消息
        conversationList: []
      })
    },
    sendContactStar(state, {conversationID,UID, isFork }) {
      console.log('forkConversation3', isFork)
      if(!isFork) {
        API.contactStar({contactUid: UID}).then(res => {
          if(res.code === 200) {
            state.forkList.push(conversationID)
            message.success('收藏成功')
            console.log('contact Star success', state.forkList)
            return
          }
          message.warning('收藏失败')
        }) 
        return
      }
      API.contactUnStar({contactUid: UID}).then(res => {
        if(res.code === 200) {
          const localForkListIndex = state.forkList.indexOf(conversationID)
          if(localForkListIndex !== -1) { //存在本地记录
            console.log('contactUnStar', localForkListIndex, state.forkList )
            const newforkList =  state.forkList
            newforkList.splice(localForkListIndex,1) 
            state.forkList = newforkList 
            console.log('contactUnStar success', state.forkList)
            message.success('取消成功')
          }

          return
        }
          message.warning('取消收藏失败')
      })
    },
  },
  actions
}

export default conversationModules
