<template>
  <div class="right-side">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <!-- 用户信息  -->
      <el-tab-pane label="用户信息" name="first">
        <div class="empty" v-if="userInfo === null">
          <i style="margin-right: 10px" class="el-icon-warning-outline" />
          <span>用户资料加载失败</span>
        </div>
        <div v-else-if="currentToUID">
          <user-card :data="userInfo" />
        </div>
        <div class="empty" v-else>
          <i style="margin-right: 10px" class="el-icon-warning-outline" />
          <span>未选择用户</span>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import map from '@assets/consts'
import UserCard from './user-card.vue'
import { mapState } from 'vuex'
export default {
  // name: 'RightSide',
  data() {
    return {
      userID: 'im_account_17',
      messageText: 'new message',
      activeTab: 'first',
      activePanes: ['1'],

      userInfo: {},
      userPairs: [],
      renderKeys: {
        uid: {
          key: 'uid',
          label: 'uid',
        },
        nickname: {
          key: 'nickname',
          label: '昵称',
        },
        school: {
          key: 'school',
          label: '学校',
        },
        address: {
          key: 'address',
          label: '常居地',
        },
        age: {
          key: 'age',
          label: '生日',
          modify: true,
        },
        feed_sex: {
          key: 'feed_sex',
          label: '信息流性别',
        },
       
      },
    }
  },
  components: { UserCard },
  computed: {
    ...mapState({
      currentToUID: (state) => state.conversation.currentToUID,
    }),
  },
  beforeMount() {
    this.getInitData()
    //this.getFriendList()
  },
  watch: {
    currentToUID() {
      this.getInitData()
      this.activeTab = 'first'
    },
  },
  methods: {
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
   
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    handlePaneChange(val) {
      console.log(val)
    },
  },
}
</script>

<style lang="stylus" scoped>
.right-side {
  height: 94vh;
  padding: 20px;
  border-left: 1px solid lightgrey;
  width: 100%;
  overflow-y: scroll;

  .empty {
    width: 100%;
    height: 500px;
    line-height: 500px;
    text-align: center;
  }

  /deep/ .el-collapse-item__header {
    background: #f5f5f5;
  }

  /deep/ .el-collapse-item__wrap {
    background: #f5f5f5;
  }
}
</style>
