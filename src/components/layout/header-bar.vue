<template>
  <div class="header-bar">
    <div class="header-bar-left">
      <my-profile />
      <div class="title">客服系统</div>
    </div>
    <!-- 右边 -->
    <div>
      <div class="total">
        <!-- 当前未读: {{ unreadCount }}人{{ unreadNumber }}条消息 -->
        当前未读: {{ totalUnreadCount.people }}人{{ totalUnreadCount.count }}条消息 
      </div>
      <div class="bottom">
        <div
          class="iconfont icon-tuichu"
          @click="$store.dispatch('logout')"
          title="退出"
        ></div>
      </div>
       <i @click="fullScreenPage" class="el-icon-full-screen full-screen"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import MyProfile from '../my-profile'
export default {
  name: 'HeaderBar',
  computed: {
    ...mapState({
      unreadCount: (state) => state.unreadCount,
      unreadNumber: (state) => state.unreadNumber,
    }),
    ...mapGetters(['totalUnreadCount']),
  },
  components: { MyProfile },
  data() {
    return {}
  },
  methods: {
    fullScreenPage() {
      const url = window.location.href
      console.log('current href', url)
      window.open(url)
    }
  },
}
</script>

<style lang="stylus" scoped>
.header-bar {
  height: 6vh;
  line-height: 6vh;
  color: $white;
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid lightgrey;
  // box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);
  align-items: center;
  overflow: hidden;

  .header-bar-left {
    display: flex;
    align-items: center;
  }

  .title {
    display: inline-block;
    margin-left: 10px;
    height: 100%;
    vertical-align: center;
    border-bottom: 2px solid green;
    font-size: 24px;
    color: green;
  }

  .total {
    display: inline-block;
    margin-right: 20px;
    word-spacing: 10px;
    letter-spacing: 5px;
    font-size: 20px;
    color: grey;
  }

  .full-screen {
    color: #a5b5c1;
    font-size: 30px;
    margin-right: 20px;
    &:hover {
      color black;
    }
  }

  .bottom {
    height: 70px;
    margin: 0 20px;
    display: inline-block;

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
      color: black;
    }

    .btn-more:hover {
      color: $white;
    }
  }
}
</style>
