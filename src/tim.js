import TIM from 'tim-js-sdk'
import COSSDK from 'cos-js-sdk-v5'


function genTestUserSig(userID) {
  var SDKAPPID =
    process.env.NODE_ENV === 'development' ? 1400407288 : 1400284328
  var EXPIRETIME = 604800
  var SECRETKEY =
    '0f6624e1d7436f1d55904d226d841a253d8b708e6c5799cbaad66e46f55ee708'
  var generator = new window.LibGenerateTestUserSig(
    SDKAPPID,
    SECRETKEY,
    EXPIRETIME
  )
  var userSig = generator.genTestUserSig(userID)
  return {
    SDKAppID: SDKAPPID,
    userSig: userSig,
  }
}
window.genTestUserSig = genTestUserSig

// 初始化 SDK 实例
const tim = TIM.create({
  SDKAppID: window.genTestUserSig('').SDKAppID
})

window.setLogLevel = tim.setLogLevel

// 无日志级别
tim.setLogLevel(4)

// 注册 cos
tim.registerPlugin({'cos-js-sdk':COSSDK})
export default tim