
export const sexMap = {
    1: '男',
    2: '女'
}

export const sxoMap = {
    1: '男',
    2: '女'
}

//1 成功 0 未支付 2 退款
export const orderStateMap = {
    0: '未支付',
    1: '成功',
    2: '退款'
}

export const fpdxLikeMap = {
    1: '年龄必须比我大',
    2: '年龄必须比我小',
    3: '身高必须比我高',
    4: '身高必须比我矮',
    5: '尽量和我同校',
    6: '尽量和我同城',
    7: '必须和我不同校',
    8: '接受同省调剂',
    9: '同乡'
}

export default {
    sexMap,
    sxoMap,
    orderStateMap,
    fpdxLikeMap,
    MATCH_STATUS_ALIAS,
    MATCH_STATUS,
    getMatchStatus
}


export const MATCH_STATUS_ALIAS = {
    'MATCHING': '匹配中', // 匹配中
    'FAILED': '匹配失败',     // 匹配失败
    'SUCCESS': '匹配成功',   // 匹配成功
    'UNHAPPY': '不满意',   // 不满意
    'REFUNDED': '已退款', // 已退款
    'ATTENDNEXT': '报名下一期', // 报名下一期
    'FINISHED': '活动已完成', // 已结束
    'REPAIR_FAILED': '重匹失败', // 重匹失败
    'NO_CONFIRM': '未确认',  // 未确认
    'FAILED_NO_FOLLOW': '未关注匹配失败', //未关注匹配失败
    'ATTENDNEXT_NO_FOLLOW': '未关注报名下一期', //未关注报名下一期
    'REFUNDED_NO_FOLLOW': '未关注已退款', //未关注已退款
}

const MATCH_STATUS = {
    'MATCHING': 'MATCHING', // 匹配中
    'FAILED': 'FAILED',     // 匹配失败
    'SUCCESS': 'SUCCESS',   // 匹配成功
    'UNHAPPY': 'UNHAPPY',   // 不满意
    'REFUNDED': 'REFUNDED', // 已退款
    'ATTENDNEXT': 'ATTENDNEXT', // 报名下一期
    'FINISHED': 'FINISHED', // 已结束
    'REPAIR_FAILED': 'REPAIR_FAILED', // 重匹失败
    'NO_CONFIRM': 'NO_CONFIRM',  // 未确认
    'FAILED_NO_FOLLOW': 'FAILED_NO_FOLLOW', //未关注匹配失败
    'ATTENDNEXT_NO_FOLLOW': 'ATTENDNEXT_NO_FOLLOW', //未关注报名下一期
    'REFUNDED_NO_FOLLOW': 'REFUNDED_NO_FOLLOW', //未关注已退款
}

/**
 * 根据期数据获取匹配状态
 */
function getMatchStatus (pairData) {
    let state = pairData.state
    let stateHead = parseInt(state / 100)

    let matchStatus = ''
    switch (stateHead) {
        case 0:
            matchStatus = MATCH_STATUS['MATCHING']
            break
        case 1: 
            matchStatus = MATCH_STATUS['MATCHING']
            break
        case 2:
            matchStatus = ''
            break
        case 3: 
            matchStatus = MATCH_STATUS['FAILED']
            break
        case 4: 
            // eslint-disable-next-line no-case-declarations
            let isRematchedTime = parseInt(new Date().getTime() / 1000) > pairData.rematched_at
            if( pairData.rematch == 1 && !pairData.assoc_id && isRematchedTime ) {
                matchStatus = MATCH_STATUS['REPAIR_FAILED']
            } else {
                matchStatus = MATCH_STATUS['SUCCESS']
            }
            break
        case 5:
            matchStatus = MATCH_STATUS['UNHAPPY']
            break
        case 6:
            matchStatus = MATCH_STATUS['REFUNDED']
            break
        case 7:
            matchStatus = MATCH_STATUS['ATTENDNEXT']
            break
        case 8:
            // 80x 没有对象, 单方未确认, 被解散
            if( !pairData.assoc_id && pairData.confirm == 0 && pairData.stage_id >= 53 ) {
                matchStatus = MATCH_STATUS['NO_CONFIRM']
            } else if ( !pairData.assoc_id && pairData.rematch == 1 && pairData.confirm != 0 && pairData.stage_id >= 53 ) {
                matchStatus = MATCH_STATUS['REPAIR_FAILED']
            } else {
                let isRematchedTime = parseInt(new Date().getTime() / 1000) > pairData.rematched_at

                // 重匹成功, 但是没到公布时间
                if( pairData.rematch == 1 && !isRematchedTime ) {
                    matchStatus = MATCH_STATUS['SUCCESS']
                } else {
                    matchStatus = MATCH_STATUS['FINISHED']
                }
            }
            break
        case 9:
            matchStatus = MATCH_STATUS['FAILED_NO_FOLLOW']
            break
        case 10:
            matchStatus = MATCH_STATUS['ATTENDNEXT_NO_FOLLOW']
            break
        case 11: 
            matchStatus = MATCH_STATUS['REFUNDED_NO_FOLLOW']
            break
    }

    return matchStatus
}
