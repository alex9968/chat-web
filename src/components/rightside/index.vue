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

        <!-- userID:<el-input v-model="userID"></el-input> Text:
        <el-input v-model="messageText"></el-input>
        <el-button @click="sendMessage">发送</el-button> -->
      </el-tab-pane>
      <!-- <order-item style="margin-top: 30px;" v-for="(item, index) in currentOrderData" :key="index" :data="item"></order-item>
      <user-card v-if="currentOtherData.user" :data="currentOtherData.user"></user-card>
      <attend-item style="margin-top: 30px;" v-if="currentOtherData.pair" :data="currentOtherData.pair"></attend-item> -->

      <!-- 活动报名  -->
      <el-tab-pane label="活动报名" style="height: 100%" name="second">
        <div style="height: 90vh, overflow-y: scroll">
          <div class="empty" v-if="userPairs === null">
            <i style="margin-right: 10px" class="el-icon-warning-outline" />
            <span>用户资料加载失败</span>
          </div>
          <div class="empty" v-else-if="userPairs.length === 0">
            <i style="margin-right: 10px" class="el-icon-warning-outline" />
            <span>暂无报名记录</span>
          </div>
          <el-collapse v-else v-model="activePanes" @change="handlePaneChange">
            <el-collapse-item
              v-for="v in userPairs"
              :key="v.state_id"
              :title="'第' + v.stage_id + '期'"
              :name="v.state_id"
            >
              <div>
                <pairs-item :data="v" />
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import map from '@assets/consts'
import PairsItem from './pairs-item.vue'
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
        be_vip_at: {
          key: 'be_vip_at',
          label: '普通会员开启时间',
          transform: (val) => {
            return val
              ? dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')
              : '不是会员'
          },
        },
        feed_sex: {
          key: 'feed_sex',
          label: '信息流性别',
        },
        fpdx_like: {
          key: 'fpdx_like',
          label: '匹配偏好',
        },
        height: {
          key: 'height',
          label: '身高',
        },
        home: {
          key: 'home',
          label: '故乡',
        },
        identity_auth: {
          key: 'identity_auth',
          label: '认证照片',
          transform: (val) => {
            return val || '无'
          },
        },
        login_at: {
          key: 'login_at',
          label: '上次登录时间',
          transform: (val) => {
            return dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        pair_max_age: {
          key: 'pair_max_age',
          label: '匹配最大年龄',
        },
        pair_min_age: {
          key: 'pair_max_age',
          label: '匹配最小年龄',
        },
        partner_id: {
          key: 'partner_id',
          label: '卡片id',
        },
        phone: {
          key: 'phone',
          label: '手机号',
        },
        qq: {
          key: 'qq',
          label: 'qq',
          transform: (val) => {
            return val || '无'
          },
        },
        weixin: {
          key: 'weixin',
          label: '微信',
          transform: (val) => {
            return val || '无'
          },
        },
        sex: {
          key: 'sex',
          label: '性别',
          modify: true,
          transform: (val) => {
            return map.sxoMap[val]
          },
        },
        sxo: {
          key: 'sxo',
          label: '性取向',
          transform: (val) => {
            return map.sxoMap[val]
          },
        },
        supvip_endat: {
          key: 'supvip_endat',
          label: 'svip到期时间',
          transform: (val) => {
            if (!val) {
              return '不是svip'
            }
            return dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        wx_auth: {
          key: 'wx_auth',
          label: '是否微信认证',
          transform: (val) => {
            return val ? '是' : '否'
          },
        },

        gold_flower: {
          key: 'gold_flower',
          label: '金花',
        },
        red_flower: {
          key: 'red_flower',
          label: '红花',
        },
        expect: {
          key: 'expect',
          label: '自我描述',
        },
      },
    }
  },
  components: { PairsItem, UserCard },
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
      this.API.getUserInfo(this.currentToUID)
        .then((res) => {
          if (res && res.code === 200) {
            console.log('200 ff', res)
            this.userInfo = res.data.user
            this.userPairs = res.data.pairs
            this.$store.commit('updateCurrentConversationTitle', res.data.user)
          }
        })
        .catch((err) => {
          console.error('数据请求失败!', err)
          this.userInfo = null
          this.userPairs = null
        })
    },
    // sendMessage() {
    //   let message = this.tim.createTextMessage({
    //     to: this.userID,
    //     conversationType: this.TIM.TYPES.CONV_C2C,
    //     // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
    //     // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
    //     // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
    //     payload: {
    //       text: this.messageText,
    //     },
    //   })
    //   // 2. 发送消息
    //   let promise = this.tim.sendMessage(message)
    //   promise
    //     .then(function (imResponse) {
    //       // 发送成功
    //       console.log(this.messageText, 'success', imResponse)
    //     })
    //     .catch(function (imError) {
    //       // 发送失败
    //       console.warn('sendMessage error:', imError)
    //     })
    // },
    // async getFriendList() {
    //   const res = await this.API.getFriendList()
    //   if (res && res.code === 200) {
    //     console.log('getFriendList', res)
    //   } else {
    //     // eslint-disable-next-line no-console
    //     console.error('数据请求失败!', res)
    //   }
    // },
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
