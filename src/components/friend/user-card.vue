<template>
  <div>
    <!-- 图片资料 -->
    <div v-if="currentImgs.length !== 0" class="images">
      <span v-for="v in currentImgs" :key="v" @click="handlePreview(v)">
        <el-image class="img-item" :src="v" fit="cover"></el-image>
      </span>
    </div>
    <div v-else class="empty">
      <i style="margin-right: 10px" class="el-icon-warning-outline" />
      <span>暂无图片</span>
    </div>

    <!-- 头像 -->
    <div class="avatar">
        <el-avatar size="medium" :src="data.avatar"></el-avatar>
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
      currentSex: 1,
      currentAge: '',
      showAgeDialog: false,
      showSexDialog: false,
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
       
        height: {
          key: 'height',
          label: '身高',
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
      },
    }
  },
  created() {
    this.currentSex = this.data.sex
    this.currentAge = this.data.age
  },
  computed: {
    currentImgs() {
      const res = []
      const isActiveUrl = (url) => {
        if (url !== '' && url !== null && url !== undefined) return true
        return false
      }
      ;[0, 1, 2, 3, 4, 5].forEach((v) => {
        const key = v === 0 ? 'full_url_photo' : `full_url_photo${v}`
        isActiveUrl(this.data[key]) && res.push(this.data[key])
      })
      console.log('res imgs', res)
      return res
    },
  },
  watch: {
    data() {
      this.currentSex = this.data.sex
      this.currentAge = this.data.age
    },
  },
  methods: {
    handelUserInfoUpdate(attr) {
      const data = { uid: this.data.uid }
      if (attr === 'sex') {
        data['sex'] = this.currentSex
        if(this.data.sex === this.currentSex) {
          this.$message.warning('请选择')
          return
        }
        this.showSexDialog = false
      } else {
        data['age'] = this.currentAge
        if(this.data.age === this.currentAge) {
          this.$message.warning('请选择')
          return
        }
        this.showAgeDialog = false
      }
       this.API.updateUserInfo({ uid: this.data.uid, data })
        .then((res) => {
          console.log('aa', data, res)
          if (res.code === 200 && res.message === 'success') {
            this.data.age = this.currentAge
            this.data.sex = this.currentSex
            // 更新会话标题
            this.$store.commit('updateCurrentConversationTitle', this.data)
            this.$message.success('修改成功')
          } else {
            this.$message.warning('修改失败')
          }
        })
        .catch((err) => {
          console.log('修改失败', err)
          this.$message.warning('修改失败')
        })
    },
    handlePreview(url) {
      this.$bus.$emit('image-preview', {url, urlList: this.currentImgs})
    },
  },
}
</script>

<style lang="stylus" scoped>
.images {
  width: 100%;
  height: 200px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  margin-bottom: 40px;

  .img-item {
    width: 145px;
    height: 200px;
    margin: 0 5px;
  }
}

.empty {
  width: 100%;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  display: flex;
  justify-content: left;
  align-items: center;
}

.info {
  height: auto;
  font-size: 14px;
  font-weight: 400;

  .item {
    font-size: 12px;
    font-weight: 400;
    display: inline-block;
    padding: 10px 0;
    width: 50%;
    padding-bottom: 0;
  }
}
</style>
