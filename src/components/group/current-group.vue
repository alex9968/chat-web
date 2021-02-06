<template>
  <div class="current-group">
    <div class="top-part">
      <!-- 头像 -->
      <div class="avatar">
        <el-avatar :size="100" :src="group.Avatar"></el-avatar>
      </div>

      <div class="info">
        <div class="name">{{ group.Name }}</div>
        <div class="btn">打开群聊</div>
      </div>
    </div>

    <!-- 详细资料 -->
    <div class="bottom-part">
      <div class="intro">群ID：{{ group.ID }}</div>
      <div class="intro">群介绍：{{ group.Intro }}</div>
      
      <div class="intro">群成员:</div>


      <div class="member-list">
        <div v-for="(v, k) in group.Members" :key="k" class="user-item">
          <el-avatar :size="40" :src="v.Avatar"></el-avatar>
          <div style="text-align:center">{{ v.Name }}</div>
          <div v-if="group.UserID == v.ID" class="leader">群主</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      renderKeys: {
        ID: {
          key: 'ID',
          label: '群ID',
        },
        UserID: {
          key: 'UserID',
          label: '群主ID',
        },
      },
    }
  },
  computed: {
    ...mapState({
      group: (state) => state.group.currentGroup,
    }),
  },
  watch: {},
  methods: {
    getInitData() {
      // this.API.getUserInfo(this.currentToUID)
      //   .then((res) => {
      //     if (res && res.code === 200) {
      //       console.log('200 ff', res)
      //       this.groupInfo = res.data.group
      //       this.groupPairs = res.data.pairs
      //       this.$store.commit('updateCurrentConversationTitle', res.data.group)
      //     }
      //   })
      //   .catch((err) => {
      //     console.error('数据请求失败!', err)
      //     this.groupInfo = null
      //     this.groupPairs = null
      //   })
    },
  },
}
</script>

<style lang="stylus" scoped>
.current-group {
  height: 80vh;
  border-left: 1px solid lightgrey;
  background-color: #f5f5f5;
  width: 100%;
  overflow-y: scroll;

  .top-part {
    position: relative;
    height: 40%;
    width: 100%;

    background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);

    .avatar {
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #7d8197;
      box-shadow: inset -20px -20px 0px #6a6e80, inset 20px 20px 0px #9094ae;
    }

    .info {
      position: absolute;
      left: 50%;
      top: 60%;
      transform: translate(-50%, 0%);
      text-align: center;

      .name {
        font-size: 30px;
        color: #fff;
      }

      .btn {
        background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
        border-radius: 25px;
        width: 160px;
        height: 50px;
        font-size: 20px;
        color: #fff;
        cursor: pointer;
        line-height: 50px;
        text-align: center;
        margin-top: 20px;

        &:hover {
          background-color: #fcb69f;
        }
      }
    }
  }

  .bottom-part {
    width: 60%;
    margin: 0 auto;
    padding: 40px 0;
    font-weight: 400;

    .intro {
      text-align: left;
      font-size: 16px;
      color: grey;
      margin-bottom: 20px;
    }
    .member-list {
      display: flex;
      justify-content: flex-start;
      .user-item {
        font-size: 12px;
        padding-left: 20px;
      }
      .leader {
        text-align: center;
        font-size: 14px;
        color: grey;
      }
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
