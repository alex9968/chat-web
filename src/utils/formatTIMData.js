import TIM from "tim-js-sdk";

// export const userFormate = (messageList, conversationID) => {
// }

export const messageFormate = (messageList, conversationID) => {
  const _messageList = [];
  messageList.forEach((v) => {
    const messageContent = v.content.MsgBody[0].MsgContent;
    const type = v.content.MsgBody[0].MsgType;
    const messagePayload = {};

    //解析自定义消息
    if (type === TIM.TYPES.MSG_CUSTOM) {
      //console.log('message type', type)
      //data	String	自定义消息的 data 字段
      messagePayload["data"] = "2322id";
      // description	String	自定义消息的 description 字段
      messagePayload["description"] = "description";
      //extension	String	自定义消息的 extension 字段
      messagePayload["extension"] = "extension";
    }
    //解析图片
    if (type === TIM.TYPES.MSG_IMAGE) {
      //console.log('message type', type)
      //图片唯一id String
      messagePayload["uuid"] = messageContent.UUID;
      //图片格式类型， Number , JPG/JPEG = 1，GIF = 2，PNG = 3，BMP = 4，其他 = 255
      messagePayload["imageFormat"] = messageContent.ImageFormat;
      //图片信息 Array.<Object>
      messagePayload["imageInfoArray"] = messageContent.ImageInfoArray;
    }
    //解析文本
    if (type === TIM.TYPES.MSG_TEXT) {
      //console.log('message type', type)
      messagePayload["text"] = messageContent.Text;
    }
    //解析声音
    if (type === TIM.TYPES.MSG_SOUND) {
      //console.log('声音', type)
      // uuid	String	唯一标识
      messagePayload["uuid"] = messageContent.UUID;
      // url	String	音频地址，可用于播放
      messagePayload["url"] = messageContent.Url;
      // size	Number	文件大小，单位：Byte
      messagePayload["size"] = messageContent.Size;
      // second	Number	音频时长，单位：秒
      messagePayload["second"] = messageContent.Second;
    }
    _messageList.push({
      ID: v.content.MsgKey,
      avatar: "",
      clientSequence: 49812,
      conversationID: conversationID,
      conversationSubType: undefined,
      conversationType: "C2C",
      //in 为收到的消息, out 为发出的消息
      flow: `C2C${v.fromAccount}` === conversationID ? "in" : "out",
      from: v.fromAccount,
      //geo: null,
      isPeerRead: v.read === 1,
      isPlaceMessage: 0,
      // isRead: v.read === 0,
      isResend: false,
      isRevoked: false,
      isSystemMessage: false,
      nick: "",
      payload: messagePayload,
      isFork: v.star_at,
      // priority: 'Normal',
      // protocol: 'JSON',
      random: v.msgRandom,
      sequence: v.content.MsgSeq,
      status: "success",
      time: v.msgTimeStamp,
      to: v.toAccount,
      type: type,
    });
  });
  return _messageList;
};

export const conversationFormate = (conversationList) => {
  const conversationObject = {};
  conversationList.forEach((v) => {
    conversationObject[`C2C${v.user.im_account}`] = {
      conversationID: `C2C${v.user.im_account}`,
      lastMessage: {
        lastTime: v.last_at,
        fromAccount: v.last_msg,
        messageForShow: v.last_msg,
        type: "TIMCustomElem",
      },
      peerReadTime: 0,
      type: "C2C",
      unreadCount: v.unread_cnt,
      userProfile: {
        userID: v.user.im_account,
        nick: v.user.nickname,
        avatar: v.user.avatar,
        // profileCustomField: [{ key: 'Tag_Profile_Custom_Uid', value: v.user.uid }]
      },
    };
    //存入本地收藏列表
    if (v.star_at) {
      state.forkList.push(`C2C${v.user.im_account}`);
    }
  });
  return conversationObject;
};
