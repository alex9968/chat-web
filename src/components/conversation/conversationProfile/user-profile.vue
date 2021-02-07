<template>
  <div class="profile-user">
    <!-- <el-avatar :title="userProfile.userID" :src="userProfile.avatar" /> -->
    <div class="item text-ellipsis">
      <span :title="userProfile.nick">
       昵称<i class="el-icon-user-solid"></i>：{{ userProfile.nick }}
      </span>
    </div>
     <div class="item" >
      性别：
      <i v-if="userProfile.gender == 1" class="el-icon-male"></i>
      <i v-else class="el-icon-female"></i>
    </div>
    <div class="item" >
      家乡<i class="el-icon-s-home"></i>：
      <span>{{userProfile.home}}</span>
    </div>
      <div class="item">
      年龄：{{userProfile.age}}
    </div>
    
    <!-- <el-button
      title="将该用户加入黑名单"
      type="text"
      @click="addToBlackList"
      v-if="!isInBlacklist && userProfile.userID !== myUserID"
      class="btn-add-blacklist"
      >加入黑名单</el-button
    >
    <el-button title="将该用户移出黑名单" type="text" @click="removeFromBlacklist" v-else-if="isInBlacklist">移出黑名单</el-button> -->
    <!-- 拉黑 和 反拉黑 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    userProfile: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      // blacklist: state => state.blacklist.blacklist,
      myUserID: state => state.user.currentUserProfile.userID
    }),
    isInBlacklist() {
      return this.blacklist.findIndex(item => item.userID === this.userProfile.userID) >= 0
    },
    gender() {
      switch (this.userProfile.gender) {
        case this.TIM.TYPES.GENDER_MALE:
          return '男'
        case this.TIM.TYPES.GENDER_FEMALE:
          return '女'
        default:
          return '未设置'
      }
    },
    genderClass() {
      switch (this.userProfile.gender) {
        case this.TIM.TYPES.GENDER_MALE:
          return 'icon-male'
        case this.TIM.TYPES.GENDER_FEMALE:
          return 'icon-female'
        default:
          return ''
      }
    }
  },
  methods: {
    addToBlackList() {
      this.tim
        .addToBlacklist({ userIDList: [this.userProfile.userID] })
        .then(() => {
          this.$store.dispatch('getBlacklist')
        })
        .catch(imError => {
          this.$store.commit('showMessage', {
            message: imError.message,
            type: 'error'
          })
        })
    },
    removeFromBlacklist() {
      this.tim.removeFromBlacklist({ userIDList: [this.userProfile.userID] }).then(() => {
        this.$store.commit('removeFromBlacklist', this.userProfile.userID)
      })
      .catch(error => {
          this.$store.commit('showMessage', {
            type: 'error',
            message: error.message
          })
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.profile-user
  width 100%
  text-align left
  padding 0 10px
  .item
    width: 100%
    color grey
    font-size 14px
    line-height 30px
    padding-top 10px 
    // border-left 3px solid $border-base
  .btn-add-blacklist
    color $danger
</style>
