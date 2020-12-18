<template>
  <div class="list-container">
    <div class="header-bar">
      <!-- <button title="刷新列表" @click="handleRefresh">
        <i class="tim-icon-refresh"></i>
      </button> -->
      <el-input size="mini" placeholder="输入UID查找" v-model="searchToUid" @change="handleAddButtonClick">
        <el-button  slot="append" title="添加会话" size="mini" @click="handleAddButtonClick">
          <i class="el-icon-search"/>
        </el-button>
      </el-input>
     
    </div>

    <div class="scroll-container">
      <conversation-item
        :conversation="item"
        v-for="item in conversationList"
        :key="item.conversationID"
      />
    </div>
    <!-- <div class="more">
      <el-button type="text" @click="$store.commit('addMoreConversationList')"
        >查看更多</el-button
      >
    </div> -->

    <!-- <el-dialog title="快速发起会话" :visible.sync="showDialog" width="30%">
      <el-input
        placeholder="请输入用户ID"
        v-model="userID"
        @keydown.enter.native="handleConfirm"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import ConversationItem from './conversation-item'
import { mapState } from 'vuex'
export default {
  name: 'ConversationList',
  components: { ConversationItem },
  data() {
    return {
      showDialog: false,
      searchToUid: '',
      isCheckouting: false, // 是否正在切换会话
      timeout: null,
    }
  },
  computed: {
    ...mapState({
      conversationList: (state) => {
        console.log('conversationList render', state.conversation.forkList)
        const forkConversation = []
        const normalConversation = []
        //排序过滤
        Object.values(
          state.conversation.conversationObject
        ).forEach((v, i) => {
          if (state.conversation.forkList.indexOf(v.conversationID) !== -1) {
            v.isFork = true
            forkConversation.push(v)
          } else {
            
            v.isFork = false
            normalConversation.push(v)
          }
        })
        console.log(
          'sort',
          normalConversation.sort((a, b) => {
            if (a.unreadCount) {
              return -a.unreadCount
            } else {
              b.lastMessage.lastTime - a.lastMessage.lastTime
            }
          })
        )

        return [
          ...forkConversation,
          ...normalConversation.sort((a, b) => {
            if (a.unreadCount) {
              return true
            } else {
              b.lastMessage.lastTime - a.lastMessage.lastTime
            }
          }),
        ]
      },
      currentConversation: (state) => state.conversation.currentConversation,
    }),
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleRefresh() {
      this.refreshConversation()()
    },
    refreshConversation() {
      let that = this
      return function () {
        if (!that.timeout) {
          that.timeout = setTimeout(() => {
            that.timeout = null
            that.tim.getConversationList().then(() => {
              that.$store.commit('showMessage', {
                message: '刷新成功',
                type: 'success',
              })
            })
          }, 1000)
        }
      }
    },
    handleAddButtonClick() {
      console.log('adsd',this.searchToUid)
        this.$store.dispatch('searchConversation',this.searchToUid).then(() => {
          this.searchToUid = ''
        })
    },
    handleKeydown(event) {
      if (
        (event.keyCode !== 38 && event.keyCode !== 40) ||
        this.isCheckouting
      ) {
        return
      }
      const currentIndex = this.conversationList.findIndex(
        (item) =>
          item.conversationID === this.currentConversation.conversationID
      )
      if (event.keyCode === 38 && currentIndex - 1 >= 0) {
        this.checkoutPrev(currentIndex)
      }
      if (
        event.keyCode === 40 &&
        currentIndex + 1 < this.conversationList.length
      ) {
        this.checkoutNext(currentIndex)
      }
    },
    checkoutPrev(currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex - 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
    },
    checkoutNext(currentIndex) {
      this.isCheckouting = true
      this.$store
        .dispatch(
          'checkoutConversation',
          this.conversationList[currentIndex + 1].conversationID
        )
        .then(() => {
          this.isCheckouting = false
        })
        .catch(() => {
          this.isCheckouting = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column; // -reverse

  .header-bar {
    // flex-shrink: 0;
    display flex
    justify-content space-around
    align-items center
    height: 50px;
    border-bottom: 1px solid $background-deep-dark;
    padding: 10px 10px 10px 20px;
  }

  .scroll-container {
    overflow-y: scroll;
    flex: 1;
    position relative
  }

  .more {
    position absolute
    bottom: 0
    left 0
    border-top: 1px solid #d3d3d3
    // background lightgrey
    width: 100%
    display flex 
    justify-content: center;
    font-size: 12px;
  }
}

.bottom-circle-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.refresh {
  bottom: 70px;
}
</style>
