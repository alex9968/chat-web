<template>
  <div class="current-friend">
    <div class="top-part">
      <!-- 头像 -->
      <div class="avatar">
        <el-avatar :size="100" :src="friend.Avatar"></el-avatar>
      </div>
      <div class="name">{{ friend.Name }}</div>
      <div
        class="send-btn"
        v-if="currentFriendRelated"
        @click="openConversation"
      >
        发送消息
      </div>
      <div class="handle-btn" v-if="showHandleBtn">
        <el-button type="success" @click="handleFriend(RELATION_AGREE)" round
          >同意</el-button
        >
        <el-button type="danger" @click="handleFriend(RELATION_REFUSE)" round
          >拒绝</el-button
        >
      </div>
    </div>

    <!-- 详细资料 -->
    <div class="bottom-part">
      <div v-for="(v, k) in renderKeys" :key="k" class="item">
        <div>
          <span style="margin-right: 10px; color: grey"
            >{{ v.label }}:&nbsp;</span
          >
          <span style="margin-right: 5px">{{
            v.transform ? v.transform(friend[k]) : friend[k]
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { activeTabName } from '@/assets/consts'

export default {
  data() {
    return {
      RELATION_REFUSE: 2,
      RELATION_AGREE: 1,
      renderKeys: {
        ID: {
          key: 'ID',
          label: '账号ID',
        },
        Gender: {
          key: 'Gender',
          label: '性别',
          transform: (v) => (v == 1 ? '男' : '女'),
        },
        Age: {
          key: 'Age',
          label: '年龄',
        },
        SchoolCode: {
          key: 'SchoolCode',
          label: '学校代码',
        },
      },
    }
  },
  computed: {
    ...mapState({
      friend: (state) => state.friend.currentFriend,
      currentFriendRelated: (state) => state.friend.currentFriendRelated,
      currentRelationID: (state) => state.friend.currentRelation.ID,
      showHandleBtn: (state) =>
        state.user.userID == state.friend.currentRelation.RelatedId && state.friend.currentRelation.State === 0,
    }),
  },
  watch: {},
  methods: {
    openConversation() {
      this.$store.commit('setActiveTab', activeTabName.CONVERSATION_LIST)
      // 切换到当前会话
      this.$store.dispatch('friend2Conversation', this.friend.ID)
    },
    handleFriend(handleSig) {
      console.log('agreeToFriend', handleSig)
      this.API.handleFriendRelation({
        handleSig,
        userID: localStorage.getItem('userID'),
        relationID: this.currentRelationID,
      }).then(() => {
        // console.log('friendList:', data)
        // context.commit("updateFriendData", data);
        this.$message.success("添加好友成功!")
        openConversation()
      })
    },
    getInitData() {
      // this.API.getUserInfo(this.currentToUID)
      //   .then((res) => {
      //     if (res && res.code === 200) {
      //       console.log('200 ff', res)
      //       this.userInfo = res.data.user
      //       this.userPairs = res.data.pairs
      //       this.$store.commit('updateCurrentConversationTitle', res.data.user)
      //     }
      //   })
      //   .catch((err) => {
      //     console.error('数据请求失败!', err)
      //     this.userInfo = null
      //     this.userPairs = null
      //   })
    },
  },
}
</script>

<style lang="stylus" scoped>
.current-friend {
  height: 80vh;
  border-left: 1px solid lightgrey;
  background-color: #f5f5f5;
  width: 100%;
  overflow-y: scroll;

  .top-part {
    position: relative;
    height: 40%;
    width: 100%;
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);

    .avatar {
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #7d8197;
      box-shadow: inset -20px -20px 0px #6a6e80, inset 20px 20px 0px #9094ae;
    }

    .name {
      font-size: 30px;
      color: #fff;
      position: absolute;
      left: 50%;
      top: 60%;
      transform: translate(-50%, 0%);
    }

    .send-btn {
      background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
      border-radius: 25px;
      width: 160px;
      height: 50px;
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 80%;
      line-height: 50px;
      text-align: center;
      transform: translate(-50%, 0%);

      &:hover {
        background-color: #fcb69f;
      }
    }

    .handle-btn {
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 80%;
      line-height: 50px;
      text-align: center;
      transform: translate(-50%, 0%);
    }
  }

  .bottom-part {
    width: 60%;
    margin: 0 auto;
    padding: 40px 0;
    font-weight: 400;

    .item {
      font-size: 20px;
      font-weight: 400;
      display: inline-block;
      padding: 20px 0;
      width: 50%;
      padding-bottom: 0;
    }
  }

  .empty {
    width: 100%;
    height: 500px;
    line-height: 500px;
    text-align: center;
  }
}
</style>
