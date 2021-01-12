import TIM from "tim-js-sdk";

// export const userFormate = (messageList, conversationID) => {
// }

export const messageFormate = (messageList, conversationID) => {
  const _messageList = [];
  messageList.forEach((v) => {
    const messageContent = v.msg;
    const type = TIM.TYPES.MSG_TEXT;
    const messagePayload = {};

    //解析图片
    // if (type === TIM.TYPES.MSG_IMAGE) {
    //   //console.log('message type', type)
    //   //图片唯一id String
    //   messagePayload["uuid"] = messageContent.UUID;
    //   //图片格式类型， Number , JPG/JPEG = 1，GIF = 2，PNG = 3，BMP = 4，其他 = 255
    //   messagePayload["imageFormat"] = messageContent.ImageFormat;
    //   //图片信息 Array.<Object>
    //   messagePayload["imageInfoArray"] = messageContent.ImageInfoArray;
    // }
    //解析文本
    if (type === TIM.TYPES.MSG_TEXT) {
      //console.log('message type', type)
      messagePayload["text"] = messageContent;
    }
    //解析声音
    // if (type === TIM.TYPES.MSG_SOUND) {
    //   //console.log('声音', type)
    //   // uuid	String	唯一标识
    //   messagePayload["uuid"] = messageContent.UUID;
    //   // url	String	音频地址，可用于播放
    //   messagePayload["url"] = messageContent.Url;
    //   // size	Number	文件大小，单位：Byte
    //   messagePayload["size"] = messageContent.Size;
    //   // second	Number	音频时长，单位：秒
    //   messagePayload["second"] = messageContent.Second;
    // }

    //     code: 0
    // createTime: "2020-12-18 11:52:43"
    // fromUserId: 5
    // fromUserName: "alen9968"
    // msg: "2"
    // op: 3
    // roomId: 1
    // toUserId: 0
    // toUserName: ""

    _messageList.push({
      // ID: v.,
      avatar: "",
      clientSequence: 49812,
      conversationID: v.roomId,
      conversationSubType: undefined,
      conversationType: "C2C",
      //in 为收到的消息, out 为发出的消息
      flow: `C2C${v.fromUserId}` === "C2C5" ? "in" : "out",
      from: v.fromUserId,
      //geo: null,
      // isPeerRead: v.read === 1,
      isPlaceMessage: 0,
      // isRead: v.read === 0,
      isResend: false,
      isRevoked: false,
      isSystemMessage: false,
      nick: "",
      payload: messagePayload,
      // isFork: v.star_at,
      // priority: 'Normal',
      // protocol: 'JSON',
      // random: v.msgRandom,
      // sequence: v.content.MsgSeq,
      status: "success",
      time: v.createTime,
      to: v.toUserId,
      type: type,
    });
  });
  return _messageList;
};

export const conversationFormate = (conversationList) => {
  const conversationObject = {};
  conversationList.forEach((v) => {
    conversationObject[`C2C${v.id}`] = {
      conversationID: `C2C${v.id}`,
      lastMessage: {
        lastTime: null,
        fromAccount: "",
        messageForShow: "",
        type: "TIMCustomElem",
      },
      peerReadTime: 0,
      type: "C2C",
      unreadCount: 0,
      userProfile: {
        userID: v.id,
        nick: v.name,
        avatar: v.avatar,
      },
      // onlineList: { 5: "alen9968", 6: "alen2" },
    };
  });
  return conversationObject;
};
