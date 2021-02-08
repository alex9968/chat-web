<template>
  <div class="login-box">
    <div class="login-wrapper">
      <img class="logo" :src="logo" />
      <el-form
        ref="login"
        :rules="rules"
        :model="form"
        label-width="0"
        style="width: 100%"
        @keydown.enter.native="submit"
      >
        <!-- 线上版本登录方式 -->
        <el-form-item prop="userID">
          <!-- <el-input
            v-model="form.userID"
            placeholder="请输入用户名"
            type="text"
            clearable
          ></el-input> -->
          <el-select v-model="form.userID" placeholder="请选择用户名">
            <el-option
              v-for="item in userOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        @click="submit"
        style="width: 100%; margin-top: 6px"
        :loading="loading"
        >登录</el-button
      >

      <div style="width: 240px;text-align: right">
        <el-button
          type="text"
          @click="handelRegister"
          >去注册</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Loading } from 'element-ui'
import logo from '../assets/image/logo.png'

let loadingInstance = null

export default {
  name: 'Login',
  components: {
    ElForm: Form,
    // ElFormItem: FormItem,
    // ElSelect: Select,
    // ElOption: Option,
  },
  data() {
    const checkUserID = (rule, value, callback) => {
      if (!/^[a-zA-Z][a-zA-Z0-9_]{3,23}$/.test(value)) {
        callback(new Error('不合法（字母开头+字母/数字，长度4-24)'))
      } else {
        callback()
      }
    }
    return {
      form: {
        userID: 'root',
        password: 'root',
      },
      rules: {
        userID: [
          { required: true, message: '请输入 userID', trigger: 'blur' },
          { validator: checkUserID, trigger: 'blur' },
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      logo: logo,
      registerVisible: false,
      loading: false,
      userOptions: [
        {
          name: 'root',
        },
        {
          name: 'root2',
        },
      ],
    }
  },
  beforeMount() {
    // this.login()
  },
  methods: {
    submit() {
      this.$refs['login'].validate((valid) => {
        if (valid) {
          this.submitLogin()
        }
      })
    },
    handelRegister() {

    },

    submitLogin(userID, userSig) {
      loadingInstance = Loading.service()
      this.API.login({
        name: this.form.userID,
        pwd: this.form.password,
      })
        .then((res) => {
          this.loading = false
          this.$store.commit('toggleIsLogin', true)
          this.$store.commit('startComputeCurrent')
           
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close()
          })
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userID', res.data.userInfo.ID)
          localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
          this.$router.push('/home')
          this.$store.commit('showMessage', {
            type: 'success',
            message: '登录成功',
          })
        })
        .catch((error) => {
          this.loading = false
          this.$store.commit('showMessage', {
            message: '登录失败：444' + error.message,
            type: 'error',
          })
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
/deep/ .el-input__inner {
  width: 240px;
}

.login-box {
  width: 100%;
  margin-top: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 400px;
  padding: 20px 80px 50px;
  background: $white;
  color: $black;
  border-radius: 5px;
  box-shadow: 0 11px 20px 0 rgba(0, 0, 0, 0.3);

  .logo {
    width: 130px;
    height: 130px;
  }

  .register-button {
    width: 100%;
    margin: 6px 0 0 0;
  }

  .user-selector {
    width: 100%;
  }
}
</style>
