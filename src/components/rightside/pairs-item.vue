<template>
  <div v-if="data">
    <div class="item">
      <div class="title">基本信息:</div>
      <div class="info" v-if="data">
        <div v-for="(v, k) in renderKeys" :key="k" class="info-item">
          <div>
            <span style="margin-right:10px">{{ v.label }}:</span>
            <span style="margin-right: 5px">{{
              v.transform ? v.transform(data[k]) : data[k]
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="item">
      <div class="title" style="">订单信息:</div>
      <div v-if="data.orders.length === 0" style="color: grey">暂无</div>
      <div v-else>
        <user-order v-for="(v,i) in data.orders" :key="i"  />
      </div>
    </div>

    <div class="item">
      <div class="title" style="">匹配对象信息:</div>
      <div v-if="data.other.length === 0" style="color: grey">暂无</div>
      <div v-else>
          <user-card :data="data.other.user" />
          <pairs-item :data="data.other.pairs" />
      </div>
    </div>
  </div>
</template>

<script>
import map from '@assets/consts'
import dayjs from 'dayjs'
import UserOrder from './user-order.vue'
import UserCard from './user-card.vue'
import PairsItem from './pairs-item.vue'

export default {
  name: 'PairsItem',
  props: {
    data: Object,
  },
  components: { PairsItem,UserOrder, UserCard },
  data() {
    return {
      renderKeys: {
        assoc_id: {
          label: 'assoc_id',
        },
        create_time: {
          label: '报名时间',
          transform: (val) => {
            return dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        data: {
          label: '报名机型',
        },
        fx_money: {
          label: '被分销金额',
        },
        group_id: {
          label: '群组',
        },
        id: {
          label: '报名id',
        },
        keep: {
          label: '是否继续保持CP',
          transform: (val) => {
            return val ? '是' : '否'
          },
        },
        last_assoc: {
          label: '重配前对象id',
        },
        login_time: {
          label: '活动3天内登录时间',
          transform: (val) => {
            return dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        order_id: {
          label: '订单id',
        },
        add_score: {
          label: '额外分数',
        },
        media_id: {
          label: '公众号',
        },

        pay: {
          label: '支付金额',
          transform: (val) => {
            return val + '元'
          },
        },
        score: {
          label: '分数',
        },
        sex: {
          label: '性别',
          transform: (val) => {
            return map.sexMap[val]
          },
        },
        stage_id: {
          label: '期数',
        },
        state: {
          label: '匹配状态',
        //   transform: (val, data) => {
        //     return map.MATCH_STATUS_ALIAS[map.getMatchStatus(data)] + `(${val})`
        //   },
        },
        confirm: {
          key: 'confirm',
          label: '是否确认',
          transform: (val) => {
            val < 0 ? -1 : val > 0 ? 1 : 0
            var confirmMap = { '-1': '重配', 0: '未操作', 1: '确认' }
            return confirmMap[val.toString()]
          },
        },
        rematch: {
          key: 'rematch',
          label: '是否重配',
          transform: (val) => {
            return val == 1 ? '是' : '否'
          },
        },
        room_id: {
          key: 'room_id',
          label: 'CP编号',
        },
      },
    }
  },
  mounted() {
    console.log('data', this.data)
  },
}
</script>

<style lang="stylus" scoped>
.item {
  font-weight: 450;
  margin-bottom: 20px;
  margin-left: 10px;
}

.info {
  height: auto;
  font-size: 14px;
  .info-item {
    font-size: 12px;
    font-weight: 400;
    display: inline-block;
    padding: 10px 0;
    width: 50%;
    padding-bottom: 0;
  }
}

.title {
  font-size: 14px;
}
</style>
