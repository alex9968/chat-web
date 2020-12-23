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

    <!-- 详细资料 -->
    <div class="info" v-if="data">
      <div v-for="(v, k) in renderKeys" :key="k" class="item">
        <div>
          <span style="margin-right: 10px">{{ v.label }}:&nbsp;</span>
          <span style="margin-right: 5px">{{
            v.transform ? v.transform(data[k]) : data[k]
          }}</span>
          <el-button
            v-if="k === 'age'"
            size="mini"
            icon="el-icon-edit"
            @click="showAgeDialog = true"
            type="primary"
          ></el-button>
          <el-button
            v-if="k === 'sex'"
            size="mini"
            icon="el-icon-edit"
            @click="showSexDialog = true"
            type="primary"
          ></el-button>
        </div>
      </div>
    </div>

    <el-dialog title="修改生日" :visible.sync="showAgeDialog" width="30%">
      <el-date-picker
        v-model="currentAge"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      >
      </el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAgeDialog = false">取 消</el-button>
        <el-button type="primary" @click="handelUserInfoUpdate('age')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="修改性别" :visible.sync="showSexDialog" width="30%">
      <el-radio v-model="currentSex" :label="1">男</el-radio>
      <el-radio v-model="currentSex" :label="2">女</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSexDialog = false">取 消</el-button>
        <el-button type="primary" @click="handelUserInfoUpdate('sex')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
