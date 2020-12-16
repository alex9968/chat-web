
<template>
  <div class="info" v-if="data">
    <div v-for="(v, k) in renderKeys" :key="k" class="info-item">
      <div>
        <span style="margin-right: 10px">{{ v.label }}:</span>
        <span style="margin-right: 5px">{{
          v.transform ? v.transform(data[k]) : data[k]
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import map from '@assets/consts'
import dayjs from 'dayjs'
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      // data: {
      //   balance_fee: 2,
      //   cash_fee: 0,
      //   create_at: 1602420046,
      //   flower: 0,
      //   id: 1157298,
      //   order_state: 3,
      //   total_fee: 990,
      //   uid: 52208367,
      // },
      renderKeys: {
        create_at: {
          label: '创建时间',
          transform: (val) => {
            return dayjs(val * 1000).format('YYYY-MM-DD HH:mm:ss')
          },
        },
        flower: {
          label: '支付金额',
        },
        id: {
          // eslint-disable-next-line vue/no-parsing-error
          label: 'id',
        },
        order_state: {
          label: '订单状态', //1 成功 0 未支付 2 退款
          transform: (val) => {
            return map.orderStateMap[val]
          },
        },
        cash_fee: {
          label: '实付',
          transform: (val) => {
            return (val / 100).toFixed(2) + '元'
          },
        },
        total_fee: {
          label: '应付',
          transform: (val) => {
            return (val / 100).toFixed(2) + '元'
          },
        },
        uid: {
          label: 'uid',
        },
      },
    }
  },
}
</script>

<style lang="stylus" scoped >
.item {
  font-weight: 450;
  margin-bottom: 20px;
  margin-left: 10px;
}

.info {
  height: auto;
  font-size: 14px;
  border-bottom : 1px solid grey;

  .info-item {
    font-size: 12px;
    font-weight: 400;
    display: inline-block;
    padding: 10px 0;
    width: 50%;
    padding-bottom: 0;
  }
}
</style>
