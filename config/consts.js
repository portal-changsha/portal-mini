/**
 * @description 系统全局常量配置
 */
import config from './index.js'
export default {
  LOCAL_DOC_IMG: config.VUE_APP_IMG_URL + 'ico-doctor.png',
  JSON_CLEAN: {},
  ARRAY_CLEAN: [],
  RESULT_SUCCESS: '1',
  RESULT_FAILED: '2',
  RESULT_EXCEPTION: '3',
  //二维码默认颜色 黑色
  QR_CODE_COLOR: '#000000',
  //写死的机构ID
  ORG_ID: '1001',
  //写死的区域级别ID
  AREA_LEVEL: '2',
  //重复挂号约定错误码
  REPEAT_REGISTER_ERROR_CODE: '11031329',
  //第一次调用计数
  FIRST_LOAD_DATA: 999999,
  //区域平台ID
  HEALTH_ARCHIVE_GLOBLE_ID: 'globalId',
  //高血压
  HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_GXY: 'B0401.03',
  //糖尿病
  HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_TNB: 'B0402.02',
  //精神病
  HEALTH_ARCHIVE_VISIT_DIRECTORY_CODE_JSB: 'B0403.02',
  //健康档案校验身份失败
  HEALTH_ARCHIVE_VERIFY_FAILED: '13000013',
  HEALTH_ARCHIVE_SESSION_FAILED: '13000014',
  //智慧医院监管页面定时刷新间隔时间
  TIME_SENDER_MILLIS: 60000 * 30,
  //写死的直属医院ID
  COMPARISON_HOS_ID: '9999999',
  //当前选择模块
  SELECTED_MODULE: 'selectedModule',
  //STORAGE key值
  STORAGE_KEY: {
    SELECT_SMART_HOS: "selectSmartHos",
    SELECT_SMART_HOS_BEGIN_AND_END_TIME: "selectSmartHosBeginAndEndTime",
    INIT_FLAG: 'initFlag',
  },
  //当前选择模块
  WECHART_PAY_APPID: 'wx563314d21c5f5cbd',
  //业务类型
  BUSI_TYPE: {
    REGISTRATION_PAYMENT: '1006', //挂号缴费
    OUT_PATIENT_PAYMENT: '1301', //门诊缴费
    IN_PATIENT_RECHARGE_PAYMENT: '1502', //住院预缴金充值
  },

  //订单类型
  ORDER_TYPE: {
    REGISTRATION_TYPE: 1, //挂号
    OUT_PATIENT_TYPE: 2 //门诊处方
  },

  //订单状态
  ORDER_STATUS: {
    UN_PAYMENT: '1', //未支付
    PAYING: '2', //支付中
    ALREADY_PAYMENT: '3', //已支付
    ALREADY_CANCEL: '4', //已撤销
    RETUNING_FEE: '5', //退费中
    ALREADY_RETUNEED: '6', //已退费
    PAY_FAILED: '7', //支付失败(明确失败)
    PAY_EXCEPTION: '8', //支付异常(网络问题)
    RETUNED_FAILED: '9', //退费失败(明确失败)
    RETUNED_EXCEPTION: '10' //退费异常(网络问题)
  },

  // 挂号支付状态
  REGISTERED_PAY_STATUS: {
    UNPAY_UNABLE_PAY: '1', // 未支付(不可支付)
    UNPAY_ENABLE_PAY: '2', // 未支付(可支付)
    PAID_UNABLE_RETURN_FEE: '3', // 已支付(不可退费)
    PAID_ENABLE_RETURN_FEE: '4', // 已支付(可退费)
    RETURNED_FEE_NUM: '5', // 已退费(已退号)
    RETURNED_FEE_WITHOUT_NUM: '6' // 已退号(未退费)
  },


  //挂号业务状态
  REGISTERED_BUSI_STATUS: {
    STOP_UN_NOTIFICATION: '1', //停诊未通知
    STOP_NOTIFICATION: '2', //停诊已通知
    INVALID: '3', //失约作废
    RESERVED: '4', //已预约
    CANCELED: '5', //已取消
    REPORTED: '6', //已报到
    CALLED: '7', //已叫号
    FINISHED: '8', //已完成
    REFUNDED: '9', //已退号
  },
  //HIS通知状态
  HIS_NOTIFY_STATUS: {
    NOTIFY_WITHOUT: '1', //未通知
    NOTIFY_FAILED: '2', //通知失败
    NOTIFY_RETURNED_FEE: '3', //需要退费
    NOTIFY_SUCCESS: '4', //通知成功
  },
  //医院ID
  HOSPITAL_ID: {
    CSSDYRMYY: '430105001', //一医院
    CSSDSRMYY: '430103001', //三医院
    CSSSSRMYY: '430104001', //四医院
    CSSDBRMYY: '430121002', //八医院
    CSSFYBJY: '430111002', //妇幼保健院
    CSSZXYY: '430111001', //中心医院
    CSSKQYY: '430102002', //口腔医院
  },

  //调用方式
  INVOKE_TYPE: {
    APP_INVOKE: '1', //app
    WAP_INVOKE: '2', //wap
    QR_INVOKE: '3', //扫码
    NATIVE_INVOKE: '4', //native
    H5_INVOKE: '5', //H5
  },

  //医院跳转方式
  JUMP_TYPE: {
    IN_LINK: '1', //内部链接
    OUT_LINK: '2' //外部链接
  },

  //支付渠道
  PAY_TYPE: {
    WX_PAY: '4', //app
    ALI_PAY: '5', //wap
    UNION_PAY: '7', //扫码
    HB_PAY: '12', //和包支付
    SELF_PAY: '8', //和包支付
  },

  //支付渠道
  CARD_TYPE: {
    ID_CARD: '3', //二代身份证
    HEALTH_CARD: '4', //电子健康卡
  },

  /*
  1、未办理住院手续
  2、住院中
  3、办理出院结算
  4、出院
  */
  //住院状态
  INPATIENT_STATUS: {
    NO_IN_HOS: '1',
    IN_HOS_ING: '2',
    OUT_HOS_ING: '3',
    FINISH_OUT_HOS: '4',
  },

  //智能分诊
  TRIAGE: {
    //人群 1男 2女 3儿童
    CROWD: {
      MAN: '1',
      WOMAN: '2',
      CHILDREN: '3',
    },
    //正面反面 1正面 0背面
    DIRECT: {
      FRONT: '1',
      BACK: '0'
    },
    //显示头部 1头部 0非头部
    HEAD: {
      YES: '1',
      NO: '0'
    }
  },
  LAB_HIGH_LOW_FLAG: {
    OK: '1',
    HIGH: '2',
    LOW: '3'
  },
  DEPT_SORT_TYPE: {
    REGISTER: 1,
    DISTANCE: 2,
    SATISFACTION: 3
  },
  TX_CODE: {
    WALLET: 'YYJK01',
    PAY: 'YYJK02',
  },
  QB_FLAG: {
    OPEN: '1',
    NOT_OPEN: '0',
  },

  /*
  线上登录方式：
      1	短信验证码登录
      2	密码登录
      3	微信授权码登录
      4	微信unionId登录
   */
  ONLINE_LOGIN_TYPE: {
    VERIFICATION_CODE: '1',
    USER_PASSWORD: '2',
    WECHAT_CODE: '3',
    WECHAT_UNIONID: '4'
  },
  /*
  满意度调查评价：
      0	未评价
      1	已评价
   */
  SURVEY_IS_EVALUATIVE: {
    HAVE_NOT: '0',
    ALREADY: '1'
  },
  /*
  绑定用户操作session：
      0	不需要（默认）
      1	需要
   */
  BIND_USER_SESSION: {
    NO_NEED: '0',
    NEED: '1'
  },

  /*
  病种类型
      1	传染病
      2	发热病
      3	腹泻病
   */
  DISEASE_TYPE: {
    INFECT: '1',
    EXOTHERMIC: '2',
    DYSENTERY: '3'
  },
  /*
药品类型
    1:药品总费用维度
    2:抗菌药品费用维度
    3:基本药品费用维度
    4:辅助药品费用维度
 */
  SMART_HOSPITAL_SEARCH_TYPE: {
    TOTAL_FEE: '1',
    KJ_DRUG_FEE: '2',
    JB_DRUG_FEE: '3',
    FZ_DRUG_FEE: '4',
  },
  /*
  药品类型
    1:药品总费用维度
    2:抗菌药品费用维度
    3:基本药品费用维度
    4:辅助药品费用维度
 */
  SMART_HOSPITAL_FONT_STYLE: {
    TAB_TITLE_STYLE: 'font-weight: bold;'
  },
  /*
 监控权限控制
   0: 无
   1: 有
*/
  MONITOR_ROLE: {
    ADMIN_ROLE: '1',
    NORMAL_ROLE: '0'
  },
  /*
  接口调用模块标识
   1.挂号
   2.缴费
   3.报告
   4.排队候诊
   5.挂号记录
   6.缴费记录
   7.电子处方
   8.满意度调查
   9.来院导航
   10.院内导航
   11.住院预缴金充值
   12.住院费用查询
   13.住院充值记录查询
   14.健康体检
*/
  MODULE_IDS: {
    REG: '1',
    PAY: '2',
    REPORT: '3',
    WAIT_INFO: '4',
    REG_LIST: '5',
    PAY_LIST: '6',
    PRE_LIST: '7',
    SURVEY_LIST: '8',
    OUT_MAP: '9',
    IN_MAP: '10',
    IN_HOS_RECHARGE: '11',
    IN_HOS_FEE_LIST: '12',
    IN_HOS_RECHARGE_LIST: '13',
    HEALTH_CHECK: '14',
  },
  MODULE_URL: {
    REG: 'departDoctor',
    PAY: 'clinicUnpayList',
    REPORT: 'myReport',
    WAIT_INFO: 'waitDoctor',
    REG_LIST: 'myRegister',
    PAY_LIST: 'myPay',
    PRE_LIST: 'myPrescription',
    SURVEY_LIST: 'surveyDoctorList',
    OUT_MAP: 'outMap',
    IN_MAP: 'inMap',
    IN_HOS_RECHARGE: 'inpatientRecharge',
    IN_HOS_FEE_LIST: 'hospitalCostList',
    IN_HOS_RECHARGE_LIST: 'myRecharge',
    HEALTH_CHECK: 'healthCheck',
  }
}

