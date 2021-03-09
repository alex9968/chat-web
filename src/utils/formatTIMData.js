import TIM from "@/assets/tim";

export const messageFormate = (messageList, conversationID) => {
  const _messageList = [];
  messageList.forEach((v) => {
    const messagePayload = {};

    //     ChatID: 1
    // Content: "helloroot3"
    // CreatedAt: "2021-02-03T15:00:17+08:00"
    // DeletedAt: null
    // ID: 3
    // Type: "TIMTextElem"
    // UpdatedAt: "2021-02-03T15:00:17+08:00"
    // UserID: 1

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
    if (v.Type === TIM.TYPES.MSG_TEXT) {
      //console.log('message type', type)
      messagePayload["text"] = v.Content;
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
    //   // second	Number	音频时长，单位：秒 //   messagePayload["second"] = messageContent.Second;
    // }
    const isMine = localStorage.getItem("userID") === v.UserID + "";
    // console.log("mine",localStorage.getItem('userID'), v.UserID )

    _messageList.push({
      // ID: v.,
      avatar: "",
      clientSequence: 49812,
      conversationID: v.ChatID,
      conversationSubType: undefined,
      conversationType: v.ChatSort,
      //in 为收到的消息, out 为自己发出的消息
      flow: isMine ? "out" : "in",
      from: v.UserId,
      // isPeerRead: v.read === 1,
      isPlaceMessage: 2,
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
      sequence: v.uuid,
      time: v.CreatedAt,
      // to: v.toUserId,
      type: v.Type,
      userInfo: v.UserInfo
    });
  });
  return _messageList;
};

export const conversationFormate = (conversationList) => {
  const conversationObject = {};
  conversationList.forEach((v) => {
    const ID = `${v.Sort}${v.ID}`;
    conversationObject[ID] = {
      conversationID: ID,
      lastMessage: v.LastMessage,
      sort: v.Sort,
      id: v.ID,
      type: v.Sort,
      unreadCount: 1,
      userInfo: v.userInfo,
      userProfile: {},
      groupProfile: {},
      time: v.CreatedAt,
    };

    if (v.Sort === "C2C" && v.UserProfile) {
      conversationObject[ID]["userProfile"] = {
        userID: v.UserProfile.ID,
        nick: v.UserProfile.Name,
        avatar: v.UserProfile.Avatar,
        gender: v.UserProfile.Gender,
        age: v.UserProfile.Age || '未知',
        home: v.UserProfile.Profile.Home || '未知',
      };
    } 
    
    if (v.Sort === "GROUP" && v.GroupProfile)  {
      conversationObject[ID]["groupProfile"] = {
        groupID: v.GroupProfile.ID,
        nick: v.GroupProfile.Name,
        avatar: v.GroupProfile.Avatar,
        intro: v.GroupProfile.Intro,
        userID: v.GroupProfile.UserID
      };
    }
  });
  return conversationObject;
};

export const conversationIDFormate = (conversationID) => {
  var reg = /(\d+)$/g;
  var result = reg.exec(conversationID);
  return result[0];
};
