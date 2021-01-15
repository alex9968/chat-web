<template>
   <div @click="handleFriendClick" class="scroll-container">
    <div class="friend-item">
        <avatar :src="friend.Avatar" />
      <div class="friend-name text-ellipsis">{{ friend.Name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    friend: {
      type: Object,
      required: true
    }
  },
  methods:{
    handleFriendClick() {
      // this.tim.getConversationProfile(`C2C${this.friend.ID}`).then(({data})=>{
      //   this.$store.commit('updateCurrentConversation', data)
      // })
      // .catch(error => {
      //     this.$store.commit('showMessage', {
      //       type: 'error',
      //       message: error.message
      //     })
      //   })
    }
  }
}
</script>

<style lang="stylus" scoped>
.scroll-container
  overflow-y scroll
  flex 1
  .friend-item
    display flex
    padding 10px 20px
    cursor pointer
    position relative
    overflow hidden
    transition .2s
    &:hover
      background-color $background
    .avatar
      width 30px
      height 30px
      border-radius 50%
      margin-right 10px
      flex-shrink 0
    .friend-name
      flex 1
      color $font-light
      line-height 30px
</style>