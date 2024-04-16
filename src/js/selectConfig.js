/**
 * 조회용 config
 */
let selectConfig = {
  jcoTest: {
    url: '/api/manage/swtest/jcotest',
  },
  login: {
    refresh: {
      url: '/api/auth/refresh',
    },
    valid: {
      url: '/api/auth/valid',
    },
  },
  language: {
    url: '/api/langs',
  },

  codeMaster: {
    list: {
      url: '/api/manage/codemaster/codemasters',
    },
    get: {
      url: '/api/manage/codemaster/codemaster/{0}/{1}/{2}',
    },
    getSelect: {
      url: '/api/manage/codemaster/getselect/{0}',
    },
    getSelectAttr: {
      url: '/api/manage/codemaster/getselectattr/{0}/{1}/{2}/{3}',
    },
    allList: {
      url: '/api/manage/codemaster/codeallmasters',
    },
    getDuplicationCheck: {
      url: '/api/manage/codemaster/duplicationCheck/{0}',
    },
  },
  codeGroup: {
    list: {
      url: '/api/manage/codegroups',
    },
    get: {
      url: '/api/manage/codegroup/{0}',
    },
  },
  codeDomain: {
    list: {
      url: '/api/manage/codedomains',
    },
    get: {
      url: '/api/manage/codedomain/{0}',
    },
  },
  lawMakinglist: {
    list: {
      url: '/api/mgt/mgtlaw/shelawmaking/lawmakinglist',
    },
  },
  lawMakingCheck: {
    list: {
      url: '/api/mgt/mgtlaw/lawmakingchecks',
    },
    get: {
      url: '/api/mgt/mgtlaw/lawmakingcheck',
    },
  },
  lawJomun: {
    get: {
      url: '/api/mgt/mgtlaw/shelawrevision/law-jomun',
    },
  },
  lawRevisionlist: {
    list: {
      url: '/api/mgt/mgtlaw/shelawrevision/lawrevisionlist',
    },
    combo: {
      url: '/api/mgt/mgtlaw/shelawrevision/lawrevisioncombo',
    },
  },

  // /SK E&S
  // 메인
  main: {
    portlet: {
      plan: {
        list: {
          url: 'api/main/portlet/planstatus',
        },
      },
      myInfo: {
        get: {
          url: 'api/main/portlet/myinfo',
        },
      },
      constWkod: {
        list: {
          url: 'api/main/portlet/constwkodstatus',
        },
      },
      she: {
        list: {
          url: 'api/main/portlet/she',
        },
      },
      dailyWorkStatus: {
        list: {
          url: 'api/main/portlet/dailyworkstatus',
        },
      },
      imprActStatus: {
        list: {
          url: 'api/main/portlet/impractstatus',
        },
      },
      noAccident: {
        list: {
          url: 'api/main/portlet/moaccident',
        },
        status: {
          url: 'api/main/portlet/noaccidentstatus',
        },
      },
      notice: {
        list: {
          url: 'api/main/portlet/recentnotices',
        },
        popup: {
          url: 'api/main/portlet/opennotices',
        },
      },
    },
  },
  // 시스템 관리 Config
  manage: {
    dept: {
      list: {
        url: 'api/manage/depts',
      },
      get: {
        url: 'api/manage/dept/{0}',
      },
      count: {
        url: 'api/manage/countdept',
      },
      treelist: {
        url: 'api/manage/treedepts',
      },
      leveldepts: {
        url: 'api/manage/leveldepts',
      },
      getProcess: {
        url: 'api/manage/process/{0}',
      },
    },
    user: {
      list: {
        url: 'api/manage/users',
      },
      get: {
        url: 'api/manage/user/{0}',
      },
      count: {
        url: 'api/manage/countuser',
      },
      favorites: {
        url: '/api/manage/user/favorites',
      },
    },
    position: {
      list: {
        url: 'api/manage/positions',
      },
    },
    duty: {
      list: {
        url: 'api/manage/dutys',
      },
    },
    loginuser: {
      get: {
        url: 'api/manage/loginuserinfo',
      },
    },
    process: {
      list: {
        url: '/api/manage/processes',
      },
      get: {
        url: '/api/manage/process',
      },
      check: {
        url: '/api/manage/checkprocess',
      },
    },
    codeMaster: {
      list: {
        url: '/api/manage/codemasters',
      },
      get: {
        url: '/api/manage/codemaster/{0}',
      },
      getSelect: {
        url: '/api/manage/codemaster/getselect/{0}',
      },
    },
    notice: {
      list: {
        url: '/api/manage/notices',
      },
      get: {
        url: '/api/manage/notice/{0}',
      },
    },
    apprLine: {
      list: {
        url: '/api/manage/apprbizlist',
      },
      get: {
        url: '/api/manage/apprline/{0}',
      },
      count: {
        url: '/api/manage/apprbizcodecount/{0}',
      },
    },
    apprRequest: {
      get: {
        url: '/api/manage/apprrequest',
      },
    },
    appr: {
      whichList: {
        url: '/api/manage/whichapprs',
      },
      getline: {
        url: '/api/manage/whichapprline/{0}',
      },
      authCheck: {
        url: '/api/manage/authcheck/{0}/{1}',
      },
      getCollect: {
        url: '/api/manage/collectcheck/{0}/{1}',
      },
      requestList: {
        url: '/api/manage/requestapprs',
      },
      get: {
        url: '/api/manage/appr/{0}',
      },
      groupwareDetail: {
        url: '/api/manage/groupwareappr/{0}',
      },
      getRejectDetail: {
        url: '/api/manage/rejectappr/{0}',
      },
      getApprProgress: {
        url: '/api/manage/apprprogress/{0}',
      },
    },
    apprDelegate: {
      getDelegator: {
        url: '/api/manage/apprdelegators',
      },
    },
    alarm: {
      list: {
        url: '/api/manage/alarms',
      },
      get: {
        url: '/api/manage/alarm/{0}',
      },
      check: {
        url: '/api/manage/alarm/check',
      },
    },
    log: {
      loginLog: {
        list: {
          url: '/api/manage/log/loginlog',
        },
      },
      errorLog: {
        list: {
          url: '/api/manage/log/errorlog',
        },
        detail: {
          url: '/api/manage/log/errorlogdetail/{0}',
        },
      },
      mailLog: {
        list: {
          url: '/api/manage/log/maillog',
        },
        detail: {
          url: '/api/manage/log/maillogdetail/{0}',
        },
      },
      menuLog: {
        list: {
          url: '/api/manage/log/menulog',
        },
      },
      crudLog: {
        list: {
          url: 'api/manage/log/crudloglist',
        },
      },
      batch: {
        list: {
          url: 'api/manage/log/batchs',
        },
        get: {
          url: '/api/manage/log/batch/{0}',
        },
        check: {
          url: 'api/manage/log/batch/check',
        },
      },
      impoAction: {
        list: {
          url: 'api/manage/log/impoaction',
        },
      },
      smsLog: {
        list: {
          url: 'api/manage/log/smslog',
        },
      },
      batchLog: {
        list: {
          url: 'api/manage/log/batchlogs',
        },
      },
    },
    attachSetting: {
      list: {
        url: '/api/manage/attachsettings',
      },
      get: {
        url: '/api/manage/attachsetting/{0}',
      },
      checkDuplicate: {
        url: '/api/manage/attachsettingcheckduplicate/{0}',
      },
    },
    board: {
      list: {
        url: '/api/manage/boardMaster/boards',
      },
      get: {
        url: '/api/manage/boardMaster/board',
      },
    },
    // 다국어 관리
    lang: {
      // 라벨타입
      lblMst: {
        list: {
          url: '/api/manage/lbl/lblMsts',
        },
        get: {
          url: '/api/manage/lbl/lblMst/{0}',
        },
        check: {
          url: '/api/manage/lbl/check/lblMst',
        },
      },
      // 라벨코드
      lblDtl: {
        list: {
          url: '/api/manage/lbl/lblDtls/{0}',
        },
        get: {
          url: '/api/manage/lbl/lblDtl/{0}',
        },
        check: {
          url: '/api/manage/lbl/check/lblDtl',
        },
      },
    },
  },

  // 보건 Config
  hea: {
    checkList: {
      list: {
        url: '/api/hea/baseinfo/checklists',
      },
      get: {
        url: '/api/hea/baseinfo/checklist/{0}',
      },
      check: {
        url: '/api/hea/baseinfo/checkchecklist',
      },
    },
    workMeasurePlan: {
      list: {
        url: '/api/hea/workmeasure/workmeasureplans',
      },
      get: {
        url: '/api/hea/workmeasure/workmeasureplan/{0}',
      },
      results: {
        url: '/api/hea/workmeasure/workmeasureplanresults',
      },
      status: {
        url: '/api/hea/workmeasure/workmeasurestatss',
      },
      check: {
        url: '/api/hea/workmeasure/checkworkmeasureplan',
      },
      getPlanResult: {
        url: '/api/hea/workmeasure/workmeasureplanresult/{0}',
      },
    },
    workMeasureResult: {
      list: {
        url: '/api/hea/workmeasure/workmeasureresults',
      },
      get: {
        url: '/api/hea/workmeasure/workmeasureresult/{0}',
      },
      excelDown: {
        url: '/api/hea/workmeasure/excel/workmeasureresulttemplete',
      },
      status: {
        url: '/api/hea/workmeasure/workmeasureresultstatus',
      },
      chart: {
        url: '/api/hea/workmeasure/workmeasureresultchart',
      },
    },
    checkupOrg: {
      list: {
        url: '/api/hea/baseinfo/checkuporgs',
      },
      get: {
        url: '/api/hea/baseinfo/checkuporg/{0}',
      },
    },
    testItem: {
      list: {
        url: '/api/hea/baseinfo/testitems',
      },
      get: {
        url: '/api/hea/baseinfo/testitem/{0}',
      },
    },
    disease: {
      list: {
        url: '/api/hea/baseinfo/diseases',
      },
      get: {
        url: '/api/hea/baseinfo/disease/{0}',
      },
    },
    checkupResult: {
      list: {
        url: '/api/hea/checkup/checkupresults',
      },
      get: {
        url: '/api/hea/checkup/checkupresult/{0}/{1}',
      },
      check: {
        url: '/api/hea/checkup/validcheckupresult',
      },
      excel: {
        normal: {
          url: '/api/hea/checkup/checkupresultexceldownload/normal',
        },
        special: {
          url: '/api/hea/checkup/checkupresultexceldownload/special',
        },
      },
      resultHistory: {
        url: '/api/hea/checkup/checkuppastresults',
      },
    },
    checkupResultDiag: {
      list: {
        url: '/api/hea/checkup/checkupresultdiags',
      },
    },
    testItemResult: {
      list: {
        url: '/api/hea/checkup/testitemresults',
      },
    },
    drugManage: {
      list: {
        url: '/api/hea/drug/drugmanages',
      },
      get: {
        url: '/api/hea/drug/drugmanage/{0}',
      },
    },
    infirmaryUsageHistory: {
      list: {
        url: '/api/hea/infirmary/infirmaryusagehistorys',
      },
    },
    checkupHistory: {
      list: {
        url: '/api/hea/infirmary/checkuphistorys',
      },
    },
    suspectUser: {
      list: {
        url: '/api/hea/infirmary/suspectusers',
        appoint: {
          url: '/api/hea/infirmary/suspectappointusers',
        },
        release: {
          url: '/api/hea/infirmary/suspectreleaseusers',
        },
        all: {
          url: '/api/hea/infirmary/suspectusersofall',
        },
        get: {
          url: '/api/hea/infirmary/suspectusers/{0}',
        },
      },
    },
    hearingMgr: {
      list: {
        url: '/api/hea/infirmary/hearingmgrs',
      },
      excel: {
        url: '/api/hea/infirmary/excel/hearingmgrsexceldownload',
      },
      excelUpload: {
        url: '/api/hea/infirmary/excel/hearingmgrs',
      },
      excelDownload: {
        url: '/api/hea/infirmary/exceldown/hearingmgrs',
      },
      get: {
        url: '/api/hea/infirmary/hearingmgr/{0}',
      },
    },
    hazard: {
      list: {
        url: '/api/hea/workingenvmanage/hazards',
      },
      get: {
        url: '/api/hea/workingenvmanage/hazard/{0}',
      },
      count: {
        url: '/api/hea/workingenvmanage/counthazard',
      },
    },
    consult: {
      list: {
        url: '/api/hea/infirmary/consults',
      },
      get: {
        url: '/api/hea/infirmary/consult/{0}',
      },
    },
    checkupPlan: {
      list: {
        url: '/api/hea/checkup/checkupplans',
      },
      get: {
        url: '/api/hea/checkup/checkupplan/{0}',
      },
    },
    checkupUser: {
      list: {
        url: '/api/hea/checkup/checkupusers',
      },
    },
    checkupUserNoTarget: {
      list: {
        url: '/api/hea/checkup/checkupusersnotarget',
      },
    },
    // SK E&S 근골격계
    muscResearch: {
      list: {
        url: '/api/hea/muscresearch/muscresearchs',
      },
      get: {
        url: '/api/hea/muscresearch/muscresearch/{0}',
      },
      insert: {
        url: '/api/hea/muscresearch/muscresearch',
      },
      resultlist: {
        url: '/api/hea/muscresearch/muscresults',
      },
      excelSample: {
        url: '/api/hea/muscresearch/exceldown',
      },
      excelUpload: {
        url: '/api/hea/muscresearch/excel-upload',
      },
    },
    muscResearchDept: {
      list: {
        url: '/api/hea/muscresearch/muscresearchdepts',
      },
    },
    unitWork: {
      list: {
        url: '/api/hea/muscresearch/muscunitworks',
      },
      get: {
        url: '/api/hea/muscresearch/muscunitwork/{0}',
      },
      check: {
        url: '/api/hea/muscresearch/checkmuscunitwork',
      },
    },
    unitWorkChklist: {
      list: {
        url: '/api/hea/muscresearch/muscchklists',
      },
    },
    surveyResult: {
      list: {
        url: '/api/hea/muscresearch/muscrslts',
      },
      excel: {
        url: '/api/hea/muscresearch/excel/muscrslts',
      },
    },
    surveyResultChklist: {
      list: {
        url: '/api/hea/muscresearch/muscrsltschklist',
      },
      excel: {
        url: '/api/hea/muscresearch/excel/muscrsltschklist',
      },
    },
    harmful: {
      excel: {
        url: 'api/hea/muscresearch/harmful-exceldown',
      },
      list: {
        url: '/api/hea/muscresearch/muscharmfuls',
      },
      get: {
        url: '/api/hea/muscresearch/muscharmful/{0}',
      },
      excelUpload: {
        url: 'api/hea/muscresearch/harmful-excel-upload',
      },
    },
  },

  // 환경 Config
  env: {
    tms: {
      baseInfo: {
        tmsStation: {
          list: {
            url: '/api/env/tms/baseinfo/tmsstations',
          },
          get: {
            url: '/api/env/tms/baseinfo/tmsstation/{0}',
          },
          check: {
            url: '/api/env/tms/baseinfo/checktmsstation',
          },
          deleteCheck: {
            url: '/api/env/tms/baseinfo/deletechecktmsstation',
          },
          outlet: {
            url: '/api/env/tms/baseinfo/outletfacilitys',
          },
        },
        tmsItem: {
          list: {
            url: '/api/env/tms/baseinfo/tmsitems',
          },
          get: {
            url: '/api/env/tms/baseinfo/tmsitem/{0}',
          },
          check: {
            url: '/api/env/tms/baseinfo/checktmsitem',
          },
          deleteCheck: {
            url: '/api/env/tms/baseinfo/deletechecktmsitem',
          },
        },
        tmsStationItem: {
          list: {
            url: '/api/env/tms/baseinfo/tmsstationitems',
          },
          get: {
            url: '/api/env/tms/baseinfo/tmsstationitem/{0}',
          },
          check: {
            url: '/api/env/tms/baseinfo/checktmsstationitem',
          },
          deleteCheck: {
            url: '/api/env/tms/baseinfo/deletechecktmsstationitem',
          },
        },
        tmsStationItemStd: {
          list: {
            url: '/api/env/tms/baseinfo/tmsstationitemstds',
          },
          get: {
            url: '/api/env/tms/baseinfo/tmsstationitemstd',
          },
        },
      },
      recent: {
        list: {
          url: '/api/env/tms/recent/tms5recents',
        },
        chart: {
          url: '/api/env/tms/recent/tms5recentchart',
        },
      },
      status: {
        list: {
          url: '/api/env/tms/status/tms5status',
        },
        excel: {
          url: '/api/env/tms/status/exceltms5status',
        },
      },
      total: {
        list: {
          url: '/api/env/tms/total/tmsamttotal',
        },
      },
    },
    envEffectEval: {
      envEffectEval: {
        list: {
          url: '/api/env/envEffectEval/envEffectEvals',
        },
        get: {
          url: '/api/env/envEffectEval/envEffectEval/{0}',
        },
      },
    },
    air: {
      baseInfo: {
        testItem: {
          list: {
            url: '/api/env/air/baseinfo/testitems',
          },
          get: {
            url: '/api/env/air/baseinfo/testitem/{0}',
          },
          check: {
            url: '/api/env/air/baseinfo/check/testitem',
          },
        },
        outletN: {
          list: {
            url: '/api/env/air/baseinfo/outlet/outlets',
          },
          get: {
            url: '/api/env/air/baseinfo/outlet/outlet/{0}',
          },
          check: {
            url: '/api/env/air/baseinfo/outlet/check/outlet',
          },
        },
        fuel: {
          list: {
            url: '/api/env/air/baseinfo/fuels',
          },
          get: {
            url: '/api/env/air/baseinfo/fuel/{0}',
          },
          check: {
            url: '/api/env/air/baseinfo/check/fuel',
          },
        },
        ingredient: {
          list: {
            url: '/api/env/air/baseinfo/ingredients',
          },
          get: {
            url: '/api/env/air/baseinfo/ingredient/{0}',
          },
          check: {
            url: '/api/env/air/baseinfo/check/ingredient',
          },
        },
        chemBase: {
          list: {
            url: '/api/env/air/baseinfo/chembases',
          },
          get: {
            url: '/api/env/air/baseinfo/chembase/{0}',
          },
          check: {
            url: '/api/env/air/baseinfo/check/chembase',
          },
        },

        oplogBase: {
          list: {
            url: '/api/env/air/baseinfo/oplogbase/oplogbase',
          },
        },
      },
      facility: {
        dischargeN: {
          list: {
            url: '/api/env/air/facility/facility/dischargefacilities',
          },
          get: {
            url: '/api/env/air/facility/facility/dischargefacility/{0}',
          },
          check: {
            url: '/api/env/air/facility/facility/check/dischargefacility',
          },
        },

        preventionN: {
          list: {
            url: '/api/env/air/facility/facility/preventionfacilities',
          },
          get: {
            url: '/api/env/air/facility/facility/preventionfacility/{0}',
          },
          check: {
            url: '/api/env/air/facility/facility/check/preventionfacility',
          },
          checkInhNum: {
            url: '/api/env/air/facility/facility/check/preventioninhnum',
          },
        },
        preventionChangeHistory: {
          list: {
            url: '/api/env/air/facility/facility/preventionfacilitychangehistories',
          },
          get: {
            url: '/api/env/air/facility/facility/preventionfacilitychangehistory/{0}/{1}',
          },
        },
        preventionFacActCarbHist: {
          list: {
            url: '/api/env/air/facility/facility/preventionfacactcarbhist',
          },
          get: {
            url: '/api/env/air/facility/facility/preventionfacactcarbhist/{0}',
          },
        },

        selfMeasurement: {
          list: {
            url: '/api/env/air/selfmeasurement/selfmeasurements',
          },
          get: {
            url: '/api/env/air/selfmeasurement/selfmeasurement/{0}',
          },
          check: {
            url: '/api/env/air/selfmeasurement/check',
          },
          excelDown: {
            url: '/api/env/air/selfmeasurement/excel/down',
          },
        },

        preventionMaintenanceHistory: {
          list: {
            url: '/api/env/air/facility/facility/preventionfacilitymaintenancehistories',
          },
          get: {
            url: '/api/env/air/facility/facility/preventionfacilitymaintenancehistory/{0}',
          },
        },
      },
      operationLog: {
        check: {
          url: '/api/env/air/operation/operationlogresult/check',
        },

        getDepts: {
          url: '/api/env/air/operation/operationlog/depts',
        },
        ingredientCheckResult: {
          get: {
            url: '/api/env/air/operation/ingredientcheckresults/{0}/{1}',
          },
        },
        allbaro: {
          excelUpload: {
            url: '/api/env/waste/operationLog/excel/allbaro',
          },
        },
      },
      opLog: {
        list: {
          url: '/api/env/air/oplog/oplogs',
        },
        get: {
          url: '/api/env/air/oplog/oplog/{0}/{1}/{2}',
        },
        oplogAll: {
          url: '/api/env/air/oplog/oplogall/{0}/{1}/{2}',
        },
        outletDischCheck: {
          url: '/api/env/air/oplog/outletdischcheck/{0}/{1}/{2}',
        },
        outletPeventCheck: {
          url: '/api/env/air/oplog/outletpeventcheck/{0}/{1}/{2}',
        },
        outletPreventChem: {
          url: '/api/env/air/oplog/outletpreventchem/{0}/{1}',
        },
        preventmainthist: {
          url: '/api/env/air/oplog/preventmainthist/{0}/{1}',
        },
        dischFuelResult: {
          url: '/api/env/air/oplog/dischfuelresult/{0}/{1}',
        },
        getIngrChkResult: {
          url: '/api/env/air/oplog/getingrchkresult/{0}/{1}/{2}',
        },
        operationstatus: {
          url: '/api/env/air/oplog/operationstatus',
        },
        print: {
          url: '/api/env/air/oplog/operationlogreportexcel/{0}/{1}/{2}',
        },
        sems: {
          list: {
            url: '/api/env/air/oplog/sems/sems',
          },
          excelDown: {
            url: '/api/env/air/oplog/sems/sems/excelDown',
          },
        },
        check: {
          url: '/api/env/air/oplog/operationlogresult/check',
        },
        admin: {
          list: {
            url: '/api/env/air/oplog/oplogadmins',
          },
          all: {
            url: '/api/env/air/oplog/oplogadminall/{0}/{1}',
          },
          dept: {
            url: '/api/env/air/oplog/oplogadmin/dept/{0}/{1}',
          },
        },
      },
    },
    waste: {
      baseInfo: {
        codeGroup: {
          list: {
            url: '/api/env/waste/baseinfo/codegroups',
          },
          get: {
            url: '/api/env/waste/baseinfo/codegroup/{0}',
          },
        },
        codeMaster: {
          list: {
            url: '/api/env/waste/baseinfo/codemasters',
          },
          get: {
            url: '/api/env/waste/baseinfo/codemaster/{0}/{1}',
          },
        },
        wasteDisposalMethod: {
          list: {
            url: '/api/env/waste/baseinfo/wastedisposalmethods',
          },
          get: {
            url: '/api/env/waste/baseinfo/wastedisposalmethod/{0}',
          },
          dupleCheck: {
            url: '/api/env/waste/baseinfo/duplecheck/{0}',
          },
        },
        wasteClass: {
          list: {
            url: '/api/env/waste/baseinfo/wasteclasses',
          },
          get: {
            url: '/api/env/waste/baseinfo/wasteclass/{0}',
          },
          dupleCheck: {
            url: '/api/env/waste/baseinfo/wasteclass/duplecheck/{0}',
          },
        },
        waste: {
          list: {
            url: '/api/env/waste/baseinfo/wastes',
          },
          get: {
            url: '/api/env/waste/baseinfo/waste/{0}',
          },
          dupleCheck: {
            url: '/api/env/waste/baseinfo/waste/duplecheck/{0}/{1}',
          },
        },
        disposalCompany: {
          list: {
            url: '/api/env/waste/baseinfo/disposalcompanies',
          },
        },
      },
      operationLog: {
        disposalRequest: {
          list: {
            url: '/api/env/waste/disposal/disposalrequests',
          },
          get: {
            url: '/api/env/waste/disposal/disposalrequest/{0}',
          },
          request: {
            url: '/api/env/waste/disposal/getresult/{0}',
          },
        },
        disposalResult: {
          list: {
            url: '/api/env/waste/disposal/disposalresults',
          },
          get: {
            url: '/api/env/waste/disposal/disposalresult/{0}',
          },
          mtd: {
            url: '/api/env/waste/disposal/disposalresultmtd',
          },
          sap: {
            url: '/api/env/waste/disposal/disposalresult/sysinfo',
          },

          excel: {
            url: '/api/env/waste/disposal/disposalresultexcel/{0}/{1}',
          },
        },
        disporate: {
          list: {
            url: '/api/env/waste/disporate/disporates',
          },
          get: {
            url: '/api/env/waste/disporate/disporate/{0}/{1}',
          },
          check: {
            url: '/api/env/waste/disporate/disporate/check',
          },
        },
        dailyReport: {
          wstDispoStatus: {
            list: {
              url: '/api/env/waste/operation/wstDispoStatus',
            },
          },
          wstBasicUnitStatus: {
            list: {
              url: '/api/env/waste/operation/wstBasicUnitStatus',
            },
          },
        },
      },
      operationStatus: {
        wstGenStatus: {
          list: {
            url: '/api/env/waste/operationStatus/wstGenStatus',
          },
        },
      },
    },
    water: {
      baseInfo: {
        supply: {
          list: {
            url: '/api/env/water/baseinfo/supply/supplys',
          },
          get: {
            url: '/api/env/water/baseinfo/supply/supply/{0}',
          },
          check: {
            url: '/api/env/water/baseinfo/supply/supplycheck',
          },
        },
        discharge: {
          list: {
            url: '/api/env/water/baseinfo/discharge/discharges',
          },
          get: {
            url: '/api/env/water/baseinfo/discharge/discharge/{0}',
          },
          check: {
            url: '/api/env/water/baseinfo/discharge/dischargecheck',
          },
        },

        testItem: {
          list: {
            url: '/api/env/water/baseinfo/testitem/testitems',
          },
          get: {
            url: '/api/env/water/baseinfo/testitem/testitem/{0}',
          },
          check: {
            url: '/api/env/water/baseinfo/testitem/check',
          },
        },
        monPos: {
          list: {
            url: '/api/env/water/baseinfo/monpos/monposs',
          },
          get: {
            url: '/api/env/water/baseinfo/monpos/monpos/{0}',
          },
          check: {
            url: '/api/env/water/baseinfo/monpos/check',
          },
        },
        ingredient: {
          list: {
            url: '/api/env/water/baseinfo/ingredient/ingredients',
          },
          get: {
            url: '/api/env/water/baseinfo/ingredient/ingredient/{0}',
          },
          check: {
            url: '/api/env/water/baseinfo/ingredient/checkingre',
          },
        },
        chemical: {
          list: {
            url: '/api/env/water/baseinfo/chemical/chemicals',
          },
          get: {
            url: '/api/env/water/baseinfo/chemical/chemical/{0}',
          },
          check: {
            url: '/api/env/water/baseinfo/chemical/checkChemical',
          },
        },
        basicUnit: {
          list: {
            url: '/api/env/water/baseinfo/basicunit/getewtrCleans',
          },
          deltList: {
            url: '/api/env/water/baseinfo/basicunit/getewtrdeptlist/{0}',
          },
        },
      },
      facility: {
        wasteDischFac: {
          list: {
            url: '/api/env/water/facility/wastedischfac/wastedischfacs',
          },
          get: {
            url: '/api/env/water/facility/wastedischfac/wastedischfac/{0}',
          },
          check: {
            url: '/api/env/water/facility/wastedischfac/count',
          },
        },
        pwrMeter: {
          list: {
            url: '/api/env/water/facility/pwrmeter/pwrmeters',
          },
          get: {
            url: '/api/env/water/facility/pwrmeter/pwrmeter/{0}',
          },
          check: {
            url: '/api/env/water/facility/pwrmeter/count',
          },
        },
        guided: {
          list: {
            url: '/api/env/water/facility/guided/guideds',
          },
          get: {
            url: '/api/env/water/facility/guided/guided/{0}/{1}/{2}/{3}',
          },
        },
        preventFac: {
          list: {
            url: '/api/env/water/facility/preventfac/preventfacs',
          },
          get: {
            url: '/api/env/water/facility/preventfac/preventfac/{0}',
          },
        },

        wasteBasicUnit: {
          list: {
            url: '/api/env/water/facility/wastebasicunit/wastebasicunits',
          },
          get: {
            url: '/api/env/water/facility/wastebasicunit/wastebasicunit/{0}',
          },
          check: {
            url: '/api/env/water/facility/wastebasicunit/count',
          },
        },
        preventFacBreakHist: {
          list: {
            url: '/api/env/water/facility/preventfacbreakhist/preventfacbreakhists',
          },
          get: {
            url: '/api/env/water/facility/preventfacbreakhist/preventfacbreakhist/{0}',
          },
        },
      },
      operationLog: {
        dailyReport: {
          list: {
            url: '/api/env/water/operationlog/operation/dailyreports',
          },
          get: {
            url: '/api/env/water/operationlog/operation/dailyreportinfo',
          },
          check: {
            url: '/api/env/water/operationlog/operation/dailyreport/check',
          },
          delete: {
            url: '/api/env/water/operationlog/operation/dailyreport/{0}/{1}',
          },
          table: {
            url: '/api/env/water/operationlog/operation/dailyreportlist',
          },
        },
        suplChkResult: {
          list: {
            url: '/api/env/water/operationlog/operation/suplchkresults',
          },
        },
        preventBreakHist: {
          list: {
            url: '/api/env/water/operationlog/operation/prevnetbreakhists',
          },
        },
        dischChkResult: {
          list: {
            url: '/api/env/water/operationlog/operation/dischchkresults',
          },
        },
        chemChkResult: {
          list: {
            url: '/api/env/water/operationlog/operation/chemchkresults',
          },
        },
        pwrcChkResult: {
          list: {
            url: '/api/env/water/operationlog/operation/pwrcchkresults',
          },
        },
        ingrChkResult: {
          list: {
            url: '/api/env/water/operationlog/operation/ingrchkresults',
          },
        },
        testItemResult: {
          list: {
            url: '/api/env/water/operationlog/operation/testitemresults',
          },
          items: {
            url: '/api/env/water/operationlog/operation/newitems',
          },
          default: {
            url: '/api/env/water/operationlog/operation/testitemresultsNew',
          },
        },
        dischRunTm: {
          list: {
            url: '/api/env/water/operationlog/operation/dischruntms',
          },
        },
        preventRunTm: {
          list: {
            url: '/api/env/water/operationlog/operation/preventruntms',
          },
        },
        print: {
          url: '/api/env/water/operationlog/operation/operationlogreportexcel/{0}/{1}/{2}/{3}',
        },
      },
      operationStatus: {
        list: {
          url: '/api/env/water/operationlog/operation/operationstatus',
        },
        item: {
          url: '/api/env/water/operationlog/operation/statusnewitems',
        },
      },
    },
    gas: {
      baseInfo: {
        disAct: {
          list: {
            url: '/api/env/gas/baseinfo/disacts',
          },
          get: {
            url: '/api/env/gas/baseinfo/disact/{0}',
          },
          check: {
            url: '/api/env/gas/baseinfo/count/disact/{0}',
          },
        },
        disFac: {
          list: {
            url: '/api/env/gas/baseinfo/disfacs',
          },
          get: {
            url: '/api/env/gas/baseinfo/disfac/{0}',
          },
          check: {
            url: '/api/env/gas/baseinfo/count/disfac/{0}',
          },
        },
        gasType: {
          list: {
            url: '/api/env/gas/baseinfo/gastypes',
          },
          get: {
            url: '/api/env/gas/baseinfo/gastype/{0}',
          },
          check: {
            url: '/api/env/gas/baseinfo/count/gastype/{0}',
          },
        },
        gasUnit: {
          list: {
            url: '/api/env/gas/baseinfo/gasunits',
          },
          get: {
            url: '/api/env/gas/baseinfo/gasunit/{0}',
          },
          check: {
            url: '/api/env/gas/baseinfo/count/gasunit/{0}',
          },
          listCdNm: {
            url: '/api/env/gas/baseinfo/gasunitcdnms',
          },
        },
      },
      actDataMaster: {
        list: {
          url: '/api/env/gas/activity/data/masters',
        },
        get: {
          url: '/api/env/gas/activity/data/master/{0}',
        },
        getParent: {
          url: '/api/env/gas/activity/data/master/parent',
        },
        check: {
          url: '/api/env/gas/activity/data/master/count/{0}',
        },
        items: {
          url: '/api/env/gas/activity/data/master/items/{0}/{1}/{2}',
        },
      },
      dischargeFacility: {
        list: {
          url: '/api/env/gas/discharge/facility/masters',
        },
        get: {
          url: '/api/env/gas/discharge/facility/master/{0}',
        },
        dataItems: {
          url: '/api/env/gas/discharge/facility/datas/{0}',
        },
        histroys: {
          url: '/api/env/gas/discharge/facility/histroys/{0}',
        },
        check: {
          url: '/api/env/gas/discharge/facility/master/check',
        },
      },
      facMgtYear: {
        list: {
          url: '/api/env/gas/discharge/facility/years',
        },
        get: {
          url: '/api/env/gas/discharge/facility/year/{0}/{1}',
        },
      },
      facFacYear: {
        list: {
          url: '/api/env/gas/discharge/cal/years',
        },
        get: {
          url: '/api/env/gas/discharge/cal/year/{0}/{1}/{2}/{3}',
        },
      },
      actData: {
        list: {
          url: '/api/env/gas/actdatas',
        },
        get: {
          url: '/api/env/gas/actdata/{0}',
        },
        getItems: {
          url: '/api/env/gas/items/actdata/{0}/{1}',
        },
        getUpdatedItems: {
          url: '/api/env/gas/udateditems/actdata/{0}',
        },
        check: {
          url: '/api/env/gas/count/actdata/{0}/{1}',
        },
      },
      emissions: {
        list: {
          url: '/api/env/gas/discharge/emissions',
        },
        etlist: {
          url: '/api/env/gas/discharge/et/emissions',
        },
        get: {
          url: '/api/env/gas/discharge/emission/{0}/{1}/{2}/{3}',
        },
        getStatus: {
          url: '/api/env/gas/discharge/emission/actdatastatus',
        },
        getSpeSheet: {
          url: '/api/env/gas/discharge/emission/getspesheet',
        },
      },
      alloc: {
        list: {
          url: '/api/env/gas/alloc/getallocs',
        },
        get: {
          url: '/api/env/gas/alloc/getalloc/{0}',
        },
        check: {
          url: '/api/env/gas/alloc/checkduple/{0}/{1}',
        },
      },
      emstr: {
        list: {
          url: '/api/env/gas/emstr/getemstrs',
        },
        get: {
          url: '/api/env/gas/emstr/getemstr/{0}',
        },
        check: {
          url: '/api/env/gas/emstr/duplecheck/{0}/{1}/{2}/{3}',
        },
      },
    },
  },

  // 공사안전 Config
  constSafe: {
    const: {
      list: {
        url: '/api/saf/const/consts',
      },
      get: {
        url: '/api/saf/const/const/{0}',
      },
      check: {
        url: '/api/saf/const/constcheck',
      },
      getLOTO: {
        url: '/api/saf/const/constlotos',
      },
      getKindSubconns: {
        url: '/api/saf/const/constkindsubconns',
      },
      getKindSubconnsWorkers: {
        url: '/api/saf/const/constkindsubconnsworkers',
      },
    },
  },
  // 안전 Config
  saf: {
    auditResult: {
      list: {
        url: '/api/saf/psm/auditresult/auditresults',
      },
      get: {
        url: '/api/saf/psm/auditresult/auditresult/{0}',
      },
      print: {
        url: '/api/saf/psm/auditresult/printauditresult/{0}',
      },
    },
    inspection: {
      list: {
        url: '/api/saf/inspection/planlists',
      },
      get: {
        url: '/api/saf/inspection/planinfo/{0}',
      },
      deptList: {
        url: '/api/saf/inspection/plandeptlist',
      },
    },
    inspectionresult: {
      list: {
        url: '/api/saf/inspection/resultlists',
      },
      get: {
        url: '/api/saf/inspection/resultinfo/{0}',
      },
      getimprstatus: {
        url: '/api/saf/inspection/imprstatus/{0}',
      },
      getstatus: {
        url: '/api/saf/inspection/resultstatus',
      },
    },
    auditAnalysis: {
      analyList: {
        url: '/api/saf/psm/auditanalysis/analysisstatus',
      },
      getSelect: {
        url: '/api/saf/psm/auditanalysis/auditResults',
      },
      gridSetting: {
        url: '/api/saf/psm/auditanalysis/gridsetting',
      },
    },
    auditImpr: {
      list: {
        url: '/api/saf/psm/auditresult/auditresultimpr',
      },
    },

    auditPlan: {
      list: {
        url: '/api/saf/psm/auditplan/auditplans',
      },
      get: {
        url: '/api/saf/psm/auditplan/auditplan/{0}',
      },
      check: {
        url: '/api/saf/psm/auditplan/auditplanCheck',
      },
    },
    auditItem: {
      list: {
        url: '/api/saf/baseinfo/audititems',
      },
      get: {
        url: '/api/saf/baseinfo/audititem/{0}',
      },
      checkStdUrl: {
        url: '/api/saf/baseinfo/audititemstdusecheck/{0}',
      },
      checkItemUrl: {
        url: '/api/saf/baseinfo/audititemusecheck',
      },
    },
    auditItemInfo: {
      list: {
        url: '/api/saf/baseinfo/audititeminfos',
      },
    },
    auditUser: {
      list: {
        url: '/api/saf/baseinfo/auditusers',
      },
      get: {
        url: '/api/saf/baseinfo/audituser/{0}',
      },
      checkUrl: {
        url: '/api/saf/baseinfo/auditusercheck/{0}',
      },
    },
    cto: {
      list: {
        url: '/api/saf/cto/ctos',
      },
      get: {
        url: '/api/saf/cto/cto/{0}',
      },
      checkList: {
        url: '/api/saf/cto/checkList',
      },
      checkListItem: {
        url: '/api/saf/cto/checkList/{0}',
      },
      checkListItemCheck: {
        url: '/api/saf/cto/checkList/check',
      },
    },

    map: {
      list: {
        url: '/api/saf/baseinfo/map',
      },
      getMapIdByPlantCd: {
        url: '/api/saf/baseinfo/getMapIdByPlantCd',
      },
    },
    electTitle: {
      list: {
        url: '/api/saf/baseinfo/electtitles',
      },
      get: {
        url: '/api/saf/baseinfo/electtitle/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/checkelecttitle',
      },
      electTitlLcn: {
        url: '/api/saf/baseinfo/electtitllcns',
      },
    },
    safCheckLog: {
      get: {
        url: '/api/saf/hazardousriskmechanism/safchecklog/{0}',
      },
    },
    safCheckUser: {
      get: {
        url: '/api/saf/hazardousriskmechanism/safcheckuser/{0}',
      },
    },
    hazardousRiskMechanism: {
      list: {
        url: '/api/saf/hazardousriskmechanism/hazardousriskmechanisms',
      },
      get: {
        url: '/api/saf/hazardousriskmechanism/hazardousriskmechanism/{0}',
      },
    },

    electHis: {
      list: {
        url: '/api/saf/elect/electhises',
      },
      revlist: {
        url: '/api/saf/elect/electhirevs/{0}',
      },
      get: {
        url: '/api/saf/elect/electhis/{0}',
      },
      check: {
        url: '/api/saf/elect/checkelecthis',
      },
      checkNm: {
        url: '/api/saf/elect/checkelecthis/name/{0}/{1}/{2}',
      },
      electStatusList: {
        url: '/api/saf/elect/electStatusLists',
      },
    },

    electHisHr: {
      getLcn: {
        url: '/api/saf/elect/hrsearchlcns',
      },
    },
    change: {
      list: {
        url: '/api/saf/change/changes',
      },
      get: {
        url: '/api/saf/change/change/{0}',
      },
      default: {
        url: '/api/saf/change/default/change',
      },
      changNum: {
        url: '/api/saf/change/changenum',
      },
      dashboad: {
        url: '/api/saf/change/change/dashboad',
      },
    },
    changeCommi: {
      get: {
        url: '/api/saf/change/changecommi/{0}',
      },
    },
    changeRefWork: {
      list: {
        url: '/api/saf/change/changerefwork',
      },
    },

    checkKind: {
      list: {
        url: '/api/saf/baseinfo/getcheckkindlist',
      },
      get: {
        url: '/api/saf/baseinfo/getcheckkinditem/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/checkkind/check',
      },
    },
    checkItem: {
      list: {
        url: '/api/saf/baseinfo/getcheckitemlist',
      },
      get: {
        url: '/api/saf/baseinfo/getcheckitem/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/checkitem/check',
      },
    },
    wkodChkItem: {
      list: {
        url: '/api/saf/wkod/wkodchkitems',
      },
      get: {
        url: '/api/saf/wkod/wkodchkitem/{0}',
      },
      check: {
        url: '/api/saf/wkod/check/wkodchkitems',
      },
    },
    wkodMaster: {
      list: {
        url: '/api/saf/wkod/wkodmasters',
      },
      get: {
        url: '/api/saf/wkod/wkodmaster/{0}',
      },
      getChkItemBase: {
        url: '/api/saf/wkod/wkodmaster/base/wkodchkitems',
      },
      getMap: {
        url: '/api/saf/wkod/wkodmaster/map',
      },
      getLotos: {
        url: '/api/saf/wkod/wkodlotos',
      },
      print: {
        url: '/api/saf/wkod/wkodmasterprint/{0}',
      },
      templete: {
        url: '/api/saf/wkod/wkodmastertemplete/{0}',
      },
      status: {
        url: '/api/saf/wkod/wkodmasterstatus',
      },
      status2: {
        url: '/api/saf/wkod/wkodmasterstatussub',
      },
      getFacilities: {
        url: '/api/saf/wkod/wkodmasterfacility',
      },
      getLegalLcns: {
        url: '/api/saf/wkod/wkodlegallcns',
      },
      getSubconnWorkers: {
        url: '/api/saf/wkod/wkodsubconnworkers',
      },
    },
    imprAct: {
      list: {
        url: '/api/saf/impract/impracts',
      },
      get: {
        url: '/api/saf/impract/impract/{0}',
      },
      status: {
        url: '/api/saf/impract/impractstatus',
      },
      print: {
        url: '/api/saf/impract/printimpract',
      },
      newlist: {
        url: '/api/saf/impract/newimpracts',
      },
      template: {
        url: '/api/saf/impract/planTemplate',
      },
      validate: {
        url: '/api/saf/impract/validate',
      },
    },
    checkSchedule: {
      list: {
        url: '/api/saf/check/checkschedulelist',
      },
      get: {
        url: '/api/saf/check/checkschedule/{0}',
      },
    },
    checkPlan: {
      list: {
        url: '/api/saf/check/checkplanlist',
      },
      get: {
        url: '/api/saf/check/checkplan/{0}',
      },
    },
    checkResult: {
      list: {
        url: '/api/saf/check/checkresults',
      },
      status: {
        url: '/api/saf/check/checkresultstatus',
      },
      status2: {
        url: '/api/saf/check/checkresultstatussub',
      },
    },
    checkInspector: {
      list: {
        url: '/api/saf/check/checkinspectors',
      },
    },
    checkItemResult: {
      list: {
        url: '/api/saf/check/checkitemresults',
      },
    },
    facilityMst: {
      list: {
        url: '/api/saf/facility/facilitymsts',
      },
      get: {
        url: '/api/saf/facility/facilitymst',
      },
      count: {
        url: '/api/saf/facility/countfacilitymst',
      },
      facilityTypeItem: {
        url: '/api/saf/facility/facilitytypeitems',
      },
    },
    facilityMstStatus: {
      list: {
        url: '/api/saf/facility/facilitymststatus',
      },
    },

    facilityCheckResult: {
      list: {
        url: '/api/saf/facility/facilitycheckresults',
      },
      rlist: {
        url: '/api/saf/facility/rfacilitycheckresults',
      },
      duplicateCheck: {
        url: '/api/saf/facility/duplicatecheck',
      },
      status: {
        url: '/api/saf/facility/facilitycheckresultstatus',
      },
      status2: {
        url: '/api/saf/facility/facilitycheckresultstatussub',
      },
    },
    facilChkPlan: {
      list: {
        url: '/api/saf/facility/facilchkplans',
      },
      get: {
        url: '/api/saf/facility/facilchkplan/{0}',
      },
      rlist: {
        url: '/api/saf/facility/rfacilchkplans',
      },
    },
    befInspPlan: {
      list: {
        url: '/api/saf/facility/preoperchkplans',
      },
      get: {
        url: '/api/saf/facility/preoperchkplan/{0}',
      },
      inspector: {
        url: '/api/saf/facility/preoperchkplan/inspector',
      },
    },
    befInspResult: {
      status: {
        url: '/api/saf/facility/preoperchkresultstatus',
      },
      status2: {
        url: '/api/saf/facility/preoperchkresultstatussub',
      },
      rlist: {
        url: '/api/saf/facility/preoperchkresulttable',
      },
      items: {
        url: '/api/saf/facility/preoperresultitems',
        result: {
          url: '/api/saf/facility/result/preoperresultitems',

          print: {
            preStart: {
              url: '/api/saf/facility/result/print/prestart',
              excel: {
                url: '/api/saf/facility/result/print/prestart/excel',
              },
            },
            preStartReport: {
              url: '/api/saf/facility/result/print/prestartreport',
              excel: {
                url: '/api/saf/facility/result/print/prestartreport/excel',
              },
            },
          },
        },
      },
      forEachType: {
        url: '/api/saf/facility/foreachtype/preopertypes',
      },
    },
    facilChkResult: {
      list: {
        url: '/api/saf/facility/facilchkresults',
      },
      get: {
        url: '/api/saf/facility/facilchkresult',
      },
      status: {
        url: '/api/saf/facility/facilchkresultstatus',
      },
      status2: {
        url: '/api/saf/facility/facilchkresultstatussub',
      },
      rlist: {
        url: '/api/saf/facility/facilchkresulttable',
      },
    },
    facilityInspection: {
      facilityType: {
        list: {
          url: '/api/saf/facilityinspection/comfacilitytypes',
        },
      },
      schedules: {
        list: {
          url: '/api/saf/facilityinspection/facilityinspectionschedules',
        },
        get: {
          url: '/api/saf/facilityinspection/facilityinspectionschedule/{0}',
        },
      },
      facilityInspectionPlan: {
        list: {
          url: '/api/saf/facilityinspection/facilityinspectionplans',
        },
        get: {
          url: '/api/saf/facilityinspection/facilityinspectionplan/{0}',
        },
      },
      facilityInspectionResult: {
        list: {
          url: '/api/saf/facilityinspection/facilityinspectionresults',
        },
        status: {
          url: '/api/saf/facilityinspection/facilityinspectionresultstatus',
        },
        status2: {
          url: '/api/saf/facilityinspection/facilityinspectionresultstatussub',
        },
      },
      facilityInspectionInspector: {
        list: {
          url: '/api/saf/facilityinspection/facilityinsinspectors',
        },
      },
      facilityInspectionItemResult: {
        list: {
          url: '/api/saf/facilityinspection/facilityinspectionitemresults',
        },
      },
    },
    patrol: {
      list: {
        url: '/api/saf/patrol/patrols',
      },
      get: {
        url: '/api/saf/patrol/patrol/{0}',
      },
      inspector: {
        url: '/api/saf/patrol/inspector',
      },
      status: {
        url: '/api/saf/patrol/patrolstatus',
      },
      status2: {
        url: '/api/saf/patrol/patrolstatussub',
      },
      resultItem: {
        url: '/api/saf/patrol/patrolresultitems',
      },
    },
    patrolMst: {
      list: {
        url: '/api/saf/master/patrol/patrols',
      },
      get: {
        url: '/api/saf/master/patrol/patrol/{0}',
      },
    },
    consolMst: {
      list: {
        url: '/api/saf/master/consol/consols',
      },
      get: {
        url: '/api/saf/master/consol/consol/{0}',
      },
      inspDept: {
        url: '/api/saf/master/consol/inspdept/{0}',
      },
    },
    consolPlan: {
      list: {
        url: '/api/saf/plan/consol/consols',
      },
      get: {
        url: '/api/saf/plan/consol/consol/{0}',
      },
      inspector: {
        url: '/api/saf/plan/consol/inspector/{0}',
      },
      resultItem: {
        url: '/api/saf/plan/consol/resultItem',
      },
    },
    nearmiss: {
      list: {
        url: '/api/saf/accident/getnearmisslist',
      },
      get: {
        url: '/api/saf/accident/getnearmiss/{0}',
      },
    },
    spe: {
      list: {
        url: '/api/saf/spe/spes',
      },
      get: {
        url: '/api/saf/spe/spe/{0}',
      },
      kinds: {
        url: '/api/saf/spe/spekinds',
      },
    },
    speRqst: {
      list: {
        url: '/api/saf/spe/sperqsts',
      },
      get: {
        url: '/api/saf/spe/sperqst/{0}',
      },
      getPayList: {
        url: '/api/saf/spe/paylist',
      },
    },
    speRqstDtl: {
      list: {
        url: '/api/saf/spe/sperqstdtls',
      },
    },
    speGive: {
      list: {
        url: '/api/saf/spe/spegives',
      },
    },
    accidentHumanDamage: {
      list: {
        url: '/api/saf/baseinfo/humandamages',
      },
      get: {
        url: '/api/saf/baseinfo/humandamage/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/checkhumandamage',
      },
    },
    accidentImmCause: {
      list: {
        url: '/api/saf/baseinfo/immcauses',
      },
      get: {
        url: '/api/saf/baseinfo/immcause/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/checkimmcause',
      },
    },
    accidentIndCause: {
      list: {
        url: '/api/saf/baseinfo/indcauses',
      },
      get: {
        url: '/api/saf/baseinfo/indcause/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/checkindcauses',
      },
    },
    accidentOccurrForm: {
      list: {
        url: '/api/saf/baseinfo/occurrforms',
      },
      get: {
        url: '/api/saf/baseinfo/occurrform/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/checkoccurrform',
      },
    },
    accidentOccurrAtt: {
      list: {
        url: '/api/saf/baseinfo/occurratts',
      },
      get: {
        url: '/api/saf/baseinfo/occurratt/{0}/{1}',
      },
      check: {
        url: '/api/saf/baseinfo/checkoccurratt',
      },
      checkAtts: {
        url: '/api/saf/baseinfo/checkoccurratts',
      },
    },
    accident: {
      list: {
        url: '/api/saf/accident/accidents',
      },
      getOccur: {
        url: '/api/saf/accident/accident/1/{0}',
      },
      getReception: {
        url: '/api/saf/accident/accident/2/{0}',
      },
      getResult: {
        url: '/api/saf/accident/accident/3/{0}',
      },
      status: {
        url: '/api/saf/accident/accidentstatus',
      },
      print: {
        url: '/api/saf/accident/accidentprint/{0}',
      },
      resultStatus: {
        url: '/api/saf/accident/accidentresultstatus',
      },
    },
    accidentFacility: {
      list: {
        url: '/api/saf/accident/accidentfacilitys',
      },
    },
    accidentChemprod: {
      list: {
        url: '/api/saf/accident/accidentchemprods',
      },
    },
    accidentVictim: {
      list: {
        url: '/api/saf/accident/accidentvictims',
      },
    },
    accidentInvestPsn: {
      list: {
        url: '/api/saf/accident/accidentinvestpsns',
      },
    },
    accidentRefPsn: {
      list: {
        url: '/api/saf/accident/accidentrefpsns',
      },
    },
    accidentCauMeas: {
      list: {
        url: '/api/saf/accident/accidentcaumeass',
      },
    },
    noAccidentResult: {
      list: {
        url: '/api/saf/noaccident/noaccidents',
      },
      get: {
        url: '/api/saf/noaccident/getnoaccident/{0}',
      },
      check: {
        url: '/api/saf/noaccident/countnoaccident',
      },
    },
    deptNoAccidentResult: {
      list: {
        url: '/api/saf/noaccident/deptnoaccidents',
      },
      get: {
        url: '/api/saf/noaccident/getdeptnoaccident/{0}',
      },
      check: {
        url: '/api/saf/noaccident/countdeptnoaccident',
      },
    },
    emergency: {
      list: {
        url: '/api/saf/emergency/emergencylists',
      },
      get: {
        url: '/api/saf/emergency/emergencyInfo/{0}',
      },
      deptList: {
        url: '/api/saf/emergency/emergencyDeptList/{0}/{1}',
      },
    },
    emergencyResult: {
      list: {
        url: '/api/saf/emergency/emergencyresultlists',
      },
      get: {
        url: '/api/saf/emergency/emergencyresultinfo/{0}',
      },
      status: {
        url: '/api/saf/emergency/emergencyresultstatus',
      },
    },
    // spe: {
    //   list: {
    //     url: '/api/saf/spe/facilitytypes'
    //   },
    // },
    education: {
      eduCourse: {
        list: {
          url: '/api/saf/education/educourses',
        },
        get: {
          url: '/api/saf/education/educourse/{0}',
        },
        check: {
          url: '/api/saf/education/educoursecheck/{0}/{1}/{2}/{3}',
        },
      },
      eduCourseGrp: {
        get: {
          url: '/api/saf/education/educoursegrp/{0}',
        },
      },
      combo: {
        eduGrplist: {
          url: '/api/saf/education/edugrp/{0}',
        },
        preEdulist: {
          url: '/api/saf/education/preedu',
        },
      },
      eduMaster: {
        get: {
          url: '/api/saf/education/edumaster/{0}',
        },
        getUser: {
          url: '/api/saf/education/getedumasteruser/{0}',
        },
        getGroupUser: {
          url: '/api/saf/education/edumastergroupuser/{0}',
        },
        getYearlyPlanUser: {
          url: '/api/saf/education/yearlyplandeptusers',
        },
        getQuestion: {
          url: '/api/saf/education/eduplanquestions',
        },
        getProblems: {
          url: '/api/saf/education/eduplanproblems/{0}/{1}',
        },
        getProblemsResult: {
          url: '/api/saf/education/eduplanproblemresults/{0}',
        },
        getAnswer: {
          url: '/api/saf/education/eduplanquestion',
        },
        excelSample: {
          url: '/api/saf/education/excelsample',
        },
        excelUpload: {
          url: '/api/saf/education/excelupload',
        },
        getEduCoursePsn: {
          url: '/api/saf/education/educoursepsn',
        },
        getMobileQuestionChk: {
          url: '/api/saf/education/mobile/answerchk',
        },
        getMobileQuestionYmdChk: {
          url: '/api/saf/education/mobile/questionymdchk/{0}',
        },
        getMobileQuestionScore: {
          url: '/api/saf/education/mobile/score',
        },
        getMobileQuestion: {
          url: '/api/saf/education/mobile/eduplanquestion',
        },
      },
      eduMasterUser: {
        getComplete: {
          url: '/api/saf/education/updatereedumastercompletchk/{0}',
        },
      },
      eduHrd: {
        get: {
          url: '/api/saf/education/eduhrd',
        },
      },
      eduProblemMgt: {
        list: {
          url: '/api/saf/eduproblem/eduproblems',
        },
        get: {
          url: '/api/saf/eduproblem/eduproblem/{0}',
        },
      },
      eduRegProblemMgt: {
        get: {
          url: '/api/saf/eduproblem/eduregproblem/{0}',
        },
      },
      eduQuestion: {
        list: {
          url: '/api/saf/eduquestion/eduquestions',
        },
        get: {
          url: '/api/saf/eduquestion/eduquestion/{0}',
        },
        items: {
          url: '/api/saf/eduquestion/eduquestionlist/{0}',
        },
      },
      eduGroup: {
        list: {
          url: '/api/saf/edugroup/edugroups',
        },
        get: {
          url: '/api/saf/edugroup/edugroup/{0}',
        },
      },
      eduDetailPerson: {
        list: {
          url: '/api/saf/education/edudetailpersons',
        },
        getOutsides: {
          url: '/api/saf/education/edudetailoutsidepersons',
        },
      },
      eduStatus: {
        list: {
          url: '/api/saf/education/edustatuss',
        },
        checkUrl: {
          url: '/api/saf/education/mobile/edudtlpsncnt',
        },
      },
      eduUserList: {
        list: {
          url: '/api/saf/education/eduuserlists',
        },
      },
      eduOutUserList: {
        list: {
          url: '/api/saf/education/eduoutuserlists',
        },
      },
      eduComYTotalList: {
        list: {
          url: '/api/saf/education/educomytotallists',
        },
      },
      resultEdu: {
        list: {
          url: '/api/saf/education/resultedus',
        },
        status: {
          url: '/api/saf/education/resultstatus',
        },
      },
      eduResultList: {
        list: {
          url: '/api/saf/education/eduresultlists',
        },
      },
      eduDeptStatus: {
        list: {
          url: '/api/saf/education/edudeptstatuss',
        },
      },
      eduPersonStatus: {
        list: {
          url: '/api/saf/education/edupersonstatuss',
        },
      },
      eduUserSchedule: {
        list: {
          url: '/api/saf/education/eduuserschedules',
        },
      },
      eduProblems: {
        list: {
          url: '/api/saf/education/eduProblemss',
        },
      },
    },
    facilityInsType: {
      list: {
        url: '/api/saf/baseinfo/facilityinstypelist',
      },
      check: {
        url: '/api/saf/baseinfo/checkfacilitytype',
      },
      get: {
        url: '/api/saf/baseinfo/facilityinstype/{0}',
      },
    },
    facilityInsTypeCkItem: {
      list: {
        url: '/api/saf/baseinfo/facilitytypecheckitemlist',
      },
      check: {
        url: '/api/saf/baseinfo/checkfacilitytypecheckitem',
      },
      get: {
        url: '/api/saf/baseinfo/facilitytypecheckitem/{0}',
      },
    },
    obsrItm: {
      list: {
        url: '/api/saf/baseinfo/obsrItms',
      },
      get: {
        url: '/api/saf/baseinfo/obsrItm/{0}',
      },
      check: {
        url: '/api/saf/baseinfo/obsrItm/check',
      },
    },
    majDisaInsp: {
      list: {
        url: '/api/saf/majdisainsp/majdisainsps',
      },
      get: {
        url: '/api/saf/majdisainsp/majdisainsp/{0}',
      },
      status: {
        url: '/api/saf/majdisainsp/majdisainspstatus',
      },
    },
    govImplChkResult: {
      list: {
        url: '/api/saf/inspection/govImplChkResults',
      },
      get: {
        url: '/api/saf/inspection/govImplChkResult/{0}',
      },
      status: {
        url: '/api/saf/inspection/govImplChkStatus',
      },
    },
  },
  // 기초정보 Config
  baseInfo: {
    // 자재
    SAPMAT: {
      list: {
        url: '/api/baseinfo/sapmat/sapmats',
      },
      get: {
        url: '/api/baseinfo/sapmat/sapmat/{0}',
      },
      groups: {
        url: '/api/baseinfo/sapmat/sapmatgroups',
      },
    },
    facilityType: {
      list: {
        url: '/api/baseinfo/facilitytypes',
      },
      get: {
        url: '/api/baseinfo/facilitytype/{0}',
      },
      check: {
        url: '/api/baseinfo/checkfacilitytype',
      },
    },
    inspBefOper: {
      list: {
        url: '/api/baseinfo/preopercheckitems',
      },
      get: {
        url: '/api/baseinfo/preopercheckitem/{0}',
      },
      check: {
        url: '/api/baseinfo/checkpreopercheckitem',
      },
      items: {
        url: '/api/baseinfo/checkpreopercheckitem/items/{0}/{1}/{2}/{3}/{4}',
      },
    },
    facilityTypeItem: {
      list: {
        url: '/api/baseinfo/facilitytypeitems',
      },
      get: {
        url: '/api/baseinfo/facilitytypeitem/{0}',
      },
      check: {
        url: '/api/baseinfo/checkfacilitytypeitem',
      },
    },
    facilityCheckItem: {
      list: {
        url: '/api/baseinfo/facilitycheckitems',
      },
      get: {
        url: '/api/baseinfo/facilitycheckitem/{0}',
      },
      check: {
        url: '/api/baseinfo/checkfacilitycheckitem',
      },
    },
    // 시설
    safFacility: {
      facilityType: {
        list: {
          url: '/api/baseinfo/saffacility/facilitytypes',
        },
      },
      facilityMst: {
        list: {
          url: '/api/baseinfo/saffacility/facilitymsts',
        },
        get: {
          url: '/api/baseinfo/saffacility/facilitymst/{0}',
        },
      },
    },
  },
  // 메뉴 트리 기초 정보
  menuTreeBases: {
    list: {
      url: '/api/common/menutreebases',
    },
  },
  menu: {
    list: {
      url: '/api/common/menus',
    },
  },
  gridCol: {
    list: {
      url: '/api/common/grid/usergridcol',
    },
  },
  export: {
    url: '/api/common/export',
  },
  // 직무위험성평가 Config
  rsa: {
    variable: {
      list: {
        url: '/api/rsa/baseinfo/variables',
      },
      get: {
        url: '/api/rsa/baseinfo/variable/{0}',
      },
      check: {
        url: '/api/rsa/baseinfo/checkvariables',
      },
    },
    hazop: {
      assessPlan: {
        list: {
          url: '/api/rsa/assess/assessplans/hazop',
        },
      },
    },
    planmgmt: {
      list: {
        url: '/api/rsa/planmgmt/planmgmtlists',
      },
      get: {
        url: '/api/rsa/planmgmt/planmgmtinfo/{0}',
      },
      deptList: {
        url: '/api/rsa/planmgmt/planmgmtdetplist',
      },
      getstatus: {
        url: '/api/rsa/planmgmt/planmgmtstatus/{0}',
      },
      getimprstatus: {
        url: '/api/rsa/planmgmt/planmgmtimprstatus/{0}',
      },
    },
    planmgmt2: {
      list: {
        url: '/api/rsa/planmgmt2/planmgmtlists',
      },
      list2: {
        url: '/api/rsa/planmgmt2/planmgmtlists2',
      },
      list4: {
        url: '/api/rsa/planmgmt2/planmgmtlists4',
      },
      list5: {
        url: '/api/rsa/planmgmt2/planmgmtlists5',
      },
      list6: {
        url: '/api/rsa/planmgmt2/planmgmtlists6',
      },
      get: {
        url: '/api/rsa/planmgmt2/planmgmtinfo/{0}',
      },
      getRevisionList: {
        url: '/api/rsa/planmgmt2/revisionList/{0}',
      },
      getResult: {
        url: '/api/rsa/planmgmt2/planmgmtResultinfo/{0}',
      },
      getCompleteResultList: {
        url: '/api/rsa/planmgmt2/getCompleteResultList',
      },
      getRevList: {
        url: '/api/rsa/planmgmt2/showRiskAssessResultList',
      },
      getExcelSample: {
        url: '/api/rsa/planmgmt2/excelsample',
      },
      getExcelUpload: {
        url: '/api/rsa/planmgmt2/resultExcelupload',
      },
      getPlanExcelDown: {
        url: '/api/rsa/planmgmt2/printPlanmgmt',
      },
      getResultExcelDown: {
        url: '/api/rsa/planmgmt2/printPlanmgmt2',
      },
      getResultZipDown: {
        url: '/api/rsa/planmgmt2/zipPlanmgmt',
      },
      getRsltNos: {
        url: '/api/rsa/planmgmt2/getRsltNos',
      },
      get2: {
        url: '/api/rsa/planmgmt2/planmgmtinfo2/{0}',
      },
      getAppr: {
        url: '/api/rsa/planmgmt2/apprRiskAssessPlan/{0}',
      },
      getProcessPlanAppr: {
        url: '/api/rsa/planmgmt2/apprProcessAssessPlan/{0}',
      },
      getProcessResultAppr: {
        url: '/api/rsa/planmgmt2/apprProcessAssessResult/{0}',
      },
      getApprResult: {
        url: '/api/rsa/planmgmt2/apprRiskAssessResult/{0}',
      },
      deptList: {
        url: '/api/rsa/planmgmt2/planmgmtdetplist',
      },
      getstatus: {
        url: '/api/rsa/planmgmt2/planmgmtstatus/{0}',
      },
      getimprstatus: {
        url: '/api/rsa/planmgmt2/planmgmtimprstatus/{0}',
      },
      getClassificationList: {
        url: '/api/rsa/planmgmt2/classificaionList',
      },
      getClassificationListForDepts: {
        url: '/api/rsa/planmgmt2/classificaionListForDepts',
      },
      getProcessList: {
        url: '/api/rsa/planmgmt2/processList',
      },
      getPlanmgmtPrint: {
        url: '/api/rsa/planmgmt2/printPlanmgmtReport',
      },
      getDeptAlias: {
        url: '/api/rsa/planmgmt2/deptInfo',
      },
    },
    resultmgmt: {
      list: {
        url: '/api/rsa/planmgmt/resultmgmtlists',
      },
      get: {
        url: '/api/rsa/planmgmt/resultmgmtinfo/{0}/{1}',
      },
      status: {
        url: '/api/rsa/planmgmt/resultstatus',
      },
    },
    // resultmgmt2 : 한화에너지 패키지 이전하며 옮겨둠, 추후 미사용시 삭제 예정
    resultmgmt2: {
      list: {
        url: '/api/rsa/planmgmt2/resultmgmtlists',
      },
      get: {
        url: '/api/rsa/planmgmt2/resultmgmtinfo/{0}/{1}',
      },
      status: {
        url: '/api/rsa/planmgmt2/resultstatus',
      },
    },
    assessPlan: {
      list: {
        url: '/api/rsa/assess/assessplans',
      },
      resultList: {
        url: '/api/rsa/assess/assessplanresults',
      },
      get: {
        url: '/api/rsa/assess/assessplan/{0}',
      },
    },
    assessAction: {
      jsaJobList: {
        url: '/api/rsa/assess/assessactionsjsajob',
      },
      jsaList: {
        url: '/api/rsa/assess/assessactionsjsa',
      },
      get: {
        url: '/api/rsa/assess/riskassesses',
      },
      getJsa: {
        url: '/api/rsa/assess/riskassessesjsa',
      },
      matrixeList: {
        url: '/api/rsa/assess/riskmatrixes',
      },
      excelSample: {
        url: '/api/rsa/assess/excelsample',
      },
      excelUpload: {
        url: '/api/rsa/assess/excelupload',
      },
    },
    assessResult: {
      jsaList: {
        url: '/api/rsa/assess/assessresultsjsa',
      },
    },
    assessTotal: {
      list: {
        url: '/api/rsa/assess/assesstotals',
      },
      imprActList: {
        url: '/api/rsa/assess/impracts',
      },
      assessJobList: {
        url: '/api/rsa/assess/assessjob',
      },
    },
    riskAssessDept: {
      list: {
        url: '/api/rsa/assess/riskassessdepts',
      },
      get: {
        url: '/api/rsa/assess/riskassessdept',
      },
    },
    deptAssessJob: {
      list: {
        url: '/api/rsa/assess/deptassessjobs',
      },
    },
    jobRiskBookJSA: {
      list: {
        url: '/api/rsa/jobriskbook/jobriskbookjsas',
      },
    },
    workMeasureResult: {
      excelUpload: {
        url: '/api/rsa/workmeasureresult/excel/workmeasureresults',
      },
    },
    assessType: {
      list: {
        url: '/api/rsa/baseinfo/assesstypes',
      },
      get: {
        url: '/api/rsa/baseinfo/assesstype/{0}',
      },
      check: {
        url: '/api/rsa/baseinfo/checkassessnm',
      },
      history: {
        url: '/api/rsa/baseinfo/assesstypehistorys',
      },
    },
    riskHazard: {
      list: {
        url: '/api/rsa/baseinfo/riskhazards',
      },
      get: {
        url: '/api/rsa/baseinfo/riskhazard/{0}',
      },
      check: {
        url: '/api/rsa/baseinfo/riskhazardcheck',
      },
    },
    job: {
      list: {
        url: '/api/rsa/baseinfo/jobs',
      },
      get: {
        url: '/api/rsa/baseinfo/job/{0}',
      },
      count: {
        url: '/api/rsa/baseinfo/countjob',
      },
    },
    jobStep: {
      list: {
        url: '/api/rsa/baseinfo/jobsteps',
      },
      get: {
        url: '/api/rsa/baseinfo/jobstep/{0}',
      },
      history: {
        url: '/api/rsa/baseinfo/jobstephistorys',
      },
      checkRev: {
        url: '/api/rsa/baseinfo/jobstepcheckrev',
      },
      hazard: {
        url: '/api/rsa/baseinfo/jobstepriskhazards',
      },
    },
    jobRiskHazard: {
      list: {
        url: '/api/rsa/baseinfo/jobriskhazards',
      },
      listall: {
        url: '/api/rsa/baseinfo/allriskhazards',
      },
    },
    jobHistory: {
      list: {
        url: '/api/rsa/baseinfo/jobhistories',
      },
    },
  },
  // 물질관리
  chm: {
    // 실적관리
    mat: {
      storageFacilityManagement: {
        list: {
          url: '/api/chm/mat/storage/storagefacilitymanagements',
        },
        get: {
          url: '/api/chm/mat/storage/storagefacilitymanagement/{0}/{1}',
        },
        check: {
          url: '/api/chm/mat/storage/storagefacilitymanagementcheck',
        },
        dgrList: {
          url: '/api/chm/mat/storage/chemdgrattamts',
        },
        sapList: {
          url: '/api/chm/mat/storage/sapmatstrg',
        },
        matStatus: {
          url: '/api/chm/mat/storage/chemmatstoragestatus',
        },
      },
    },
    chemicalBranch: {
      list: {
        url: '/api/chm/baseinfo/chemicalbranchs',
      },
      get: {
        url: '/api/chm/baseinfo/chemicalbranch/{0}',
      },
      check: {
        url: '/api/chm/baseinfo/checkchemicalbranch',
      },
    },
    chemicalRegulItem: {
      list: {
        url: '/api/chm/baseinfo/chemicalreguiItems',
      },
      get: {
        url: '/api/chm/baseinfo/chemicalreguiItem/{0}',
      },
      check: {
        url: '/api/chm/baseinfo/checkchemicalreguiItem',
      },
    },
    chemicalPermitCls: {
      list: {
        url: '/api/chm/baseinfo/chemicalpermitclses',
      },
      listsimple: {
        url: '/api/chm/baseinfo/chemicalpermitclslist',
      },
      get: {
        url: '/api/chm/baseinfo/chemicalpermitcls/{0}',
      },
      check: {
        url: '/api/chm/baseinfo/checkchemicalpermitcls',
      },
      permitRegul: {
        url: '/api/chm/baseinfo/chemicalpermitreguls',
      },
    },
    chemPermitProdHis: {
      list: {
        url: '/api/chm/chem/permitprodhises',
      },
      get: {
        url: '/api/chm/chem/permitprodhis/{0}',
      },
      check: {
        url: '/api/chm/chem/checkpermitprodhis',
      },
      revisions: {
        url: '/api/chm/chem/revisions',
      },
    },
    chemicalOrigin: {
      list: {
        url: '/api/chm/baseinfo/chemicalorigins',
      },
    },
    chemicalUnit: {
      list: {
        url: '/api/chm/baseinfo/chemicalunits',
      },
      get: {
        url: '/api/chm/baseinfo/chemicalunit/{0}',
      },
      check: {
        url: '/api/chm/baseinfo/checkchemicalunit',
      },
    },
    // 부서별 화학물질
    deptChemprod: {
      list: {
        url: '/api/chm/deptchemprod/deptchemprods',
      },
      get: {
        url: '/api/chm/deptchemprod/deptchemprod',
      },
      check: {
        url: '/api/chm/deptchemprod/checkdeptchemprod',
      },
    },
    chemicalVendorMaster: {
      list: {
        url: '/api/chm/baseinfo/chemicalvendormasters',
      },
    },
    chemicalRegulItmChemVal: {
      list: {
        url: '/api/chm/chem/chemicalregulitmchemvals',
      },
      get: {
        url: '/api/chm/chem/chemicalregulitmchemval/{0}',
      },
    },
    chem: {
      list: {
        url: '/api/chm/chem/chems',
      },
      listpage: {
        url: '/api/chm/chem/chemspage',
      },
      get: {
        url: '/api/chm/chem/chem/{0}',
      },
      getunion: {
        url: '/api/chm/chem/chemunion/{0}',
      },
      check: {
        url: '/api/chm/chem/checkchem',
      },
      chemNoRegul: {
        url: '/api/chm/chem/chemnoreguls',
      },
      chemNoRegulpage: {
        url: '/api/chm/chem/chemnoregulspage',
      },
    },
    chemprod: {
      list: {
        url: '/api/chm/chem/chemprods',
      },
      listpage: {
        url: '/api/chm/chem/chemprodspage',
      },
      get: {
        url: '/api/chm/chem/chemprod/{0}',
      },
      check: {
        url: '/api/chm/chem/checkchemprod',
      },
      regul: {
        url: '/api/chm/chem/chemprodregul',
      },
      chemprodNoRegul: {
        url: '/api/chm/chem/chemprodnoreguls',
      },
      chemprodNoRegulpage: {
        url: '/api/chm/chem/chemprodnoregulspage',
      },
    },
    chemprodChem: {
      list: {
        url: '/api/chm/chem/chemprodchems',
      },
    },
    MSDS: {
      list: {
        url: '/api/chm/chem/msdses',
      },
      get: {
        url: '/api/chm/chem/msds/{0}',
      },
      check: {
        url: '/api/chm/chem/checkmsds',
      },
      report: {
        url: '/api/chm/chem/msds/report/{0}',
      },
      revdelete: {
        url: '/api/chm/chem/revMsdsDelete',
      },
      delete: {
        url: '/api/chm/chem/delete/{0}',
      },
    },
    processManage: {
      list: {
        url: '/api/chm/chem/processmanages',
      },
      get: {
        url: '/api/chm/chem/processmanage/{0}',
      },
      chemprodvals: {
        url: '/api/chm/chem/processmanagechemprodvals/{0}',
      },
      print: {
        url: '/api/chm/chem/processmanageprint/{0}',
      },
    },
    matCheckRequest: {
      list: {
        url: '/api/chm/wholeprocess/matcheckrequests',
      },
      get: {
        url: '/api/chm/wholeprocess/matcheckrequest/{0}',
      },
      getchild: {
        url: '/api/chm/wholeprocess/matcheckrequest/child/{0}',
      },
      check: {
        url: '/api/chm/wholeprocess/checkmatcheckrequest',
      },
      reguldbcheck: {
        url: '/api/chm/wholeprocess/matcheckrequest/reguldbcheck',
      },
    },
    matCheckRequestCompo: {
      list: {
        url: '/api/chm/wholeprocess/matcheckrequestcompos',
      },
      regul: {
        url: '/api/chm/wholeprocess/matcheckrequestcomporegul',
      },
    },
    chemicalReagentLab: {
      list: {
        url: '/api/chm/baseinfo/chemicalreagentlabs',
      },
      get: {
        url: '/api/chm/baseinfo/chemicalreagentlab/{0}',
      },
      check: {
        url: '/api/chm/baseinfo/checkchemicalreagentlab',
      },
    },
    chemicalReagentInout: {
      list: {
        url: '/api/chm/baseinfo/chemicalreagentinouts',
      },
      get: {
        url: '/api/chm/baseinfo/chemicalreagentinout/{0}',
      },
      check: {
        url: '/api/chm/baseinfo/checkchemicalreagentinout',
      },
    },
    chemicalreguldbhist: {
      list: {
        url: '/api/chm/baseinfo/reguldbhists',
      },
      get: {
        url: '/api/chm/baseinfo/reguldbhist/{0}',
      },
      affprodlist: {
        url: '/api/chm/baseinfo/reguldbhistaffected/chemprod/{0}',
      },
      affchemlist: {
        url: '/api/chm/baseinfo/reguldbhistaffected/chem/{0}',
      },
      affprodapplylist: {
        url: '/api/chm/baseinfo/reguldbhistaffected/chemprodapply/{0}',
      },
      affchemapplylist: {
        url: '/api/chm/baseinfo/reguldbhistaffected/chemapply/{0}',
      },
      excelDown: {
        url: '/api/chm/baseinfo/reguldbhist/excel',
      },
    },
    chemicalreguldb: {
      list: {
        url: '/api/chm/baseinfo/reguldbs',
      },
    },
    chemicalprodregul: {
      list: {
        url: '/api/chm/chem/stat/chemicalprodregul',
      },
      prodlist: {
        url: '/api/chm/chem/stat/chemprodbyregulitmno/{0}',
      },
      chemlist: {
        url: '/api/chm/chem/stat/chemicalsbyregulitmno/{0}',
      },
    },
  },
  // 경영
  mgt: {
    sapaDashboard: {
      list: {
        url: '/api/mgt/sapaDashboard/imprLists',
      },
    },
    scheduleManagement: {
      list: {
        url: '/api/mgt/schedulemanagements',
      },
      get: {
        url: '/api/mgt/schedulemanagement/{0}',
      },
    },
    safetyActionBizField: {
      list: {
        url: '/api/mgt/baseinfo/safetyactionbizfields',
      },
      get: {
        url: '/api/mgt/baseinfo/safetyactionbizfield/{0}',
      },
      check: {
        url: '/api/mgt/baseinfo/checksafetyactionbizfield',
      },
    },
    safetyActionBizFieldItem: {
      list: {
        url: '/api/mgt/baseinfo/safetyactionbizfielditems',
      },
      get: {
        url: '/api/mgt/baseinfo/safetyactionbizfielditem/{0}',
      },
      check: {
        url: '/api/mgt/baseinfo/checksafetyactionbizfielditem',
      },
    },
    mgtTarget: {
      mgtTarget: {
        list: {
          url: '/api/mgt/mgttarget/mgttargets',
        },
        get: {
          url: '/api/mgt/mgttarget/mgttarget/{0}',
        },
        check: {
          url: '/api/mgt/mgttarget/checkmgttarget',
        },
      },
      mgtTargetItem: {
        list: {
          url: '/api/mgt/mgttarget/mgttargetitems',
        },
      },
      mgtTargetRslt: {
        list: {
          url: '/api/mgt/mgttarget/mgttargetrslts',
        },
        get: {
          url: '/api/mgt/mgttarget/mgttargetrslt/{0}',
        },
      },
      mgtTargetStatus: {
        list: {
          url: '/api/mgt/mgttarget/mgttargetstatus',
        },
      },
    },
    referenceRoom: {
      list: {
        url: '/api/saf/board/referenceroom',
      },
      get: {
        url: '/api/saf/board/referenceroom/{0}',
      },
      revlist: {
        url: '/api/saf/board/referenceroom/revision',
      },
    },
    licensingStatus: {
      list: {
        url: '/api/saf/board/licensingStatus',
      },
      get: {
        url: '/api/saf/board/licensingStatus/{0}',
      },
      revlist: {
        url: '/api/saf/board/licensingStatus/revision',
      },
    },
    mgtInfoItem: {
      list: {
        url: '/api/saf/baseinfo/mgtinfoitem',
      },
      get: {
        url: '/api/saf/baseinfo/mgtinfoitem/{0}',
      },
      comboList: {
        url: '/api/saf/baseinfo/mgtinfoitemNm',
      },
      checkMgtInfoItem: {
        url: '/api/saf/baseinfo/checkmgtinfoitem',
      },
    },
    investItem: {
      list: {
        url: '/api/saf/baseinfo/investItem',
      },
      middleList: {
        url: '/api/saf/baseinfo/investItemMiddle',
      },
      get: {
        url: '/api/saf/baseinfo/investItem/{0}/{1}',
      },
    },
    budgetAct: {
      list: {
        url: '/api/mgt/baseinfo/budgetacts',
      },
      detail: {
        url: '/api/mgt/baseinfo/budgetact/{0}/{1}',
      },
      budgetActMsts: {
        url: '/api/mgt/baseinfo/budgetactmsts',
      },
    },
    perRptData: {
      list: {
        url: '/api/mgt/perrptdatas',
      },
      get: {
        url: '/api/mgt/perrptdata/{0}',
      },
    },
    industrialSafetyHealthCommittee: {
      list: {
        url: '/api/mgt/industrialsafetyhealthcommittee/industrialsafetyhealthcommittees',
      },
      get: {
        url: '/api/mgt/industrialsafetyhealthcommittee/industrialsafetyhealthcommittee/{0}',
      },
      status: {
        url: '/api/mgt/industrialsafetyhealthcommittee/status',
      },
    },
    meetingAgendaImprAct: {
      list: {
        url: '/api/mgt/industrialsafetyhealthcommittee/meetingAgendaImpr',
      },
    },
    meetingAgendaImprActPopup: {
      list: {
        url: '/api/mgt/industrialsafetyhealthcommittee/meetingAgendaImprPopup',
      },
    },
    listenResultMgmtPopup: {
      list: {
        url: '/api/mgt/industrialsafetyhealthcommittee/listenResultMgmtPopup',
      },
    },
    budgetManagement: {
      budgetAct: {
        list: {
          url: '/api/mgt/budgetmanagement/mgtbudgetacts',
        },
        get: {
          url: '/api/mgt/budgetmanagement/mgtbudgetact/{0}',
        },
        budgetActDept: {
          get: {
            url: '/api/mgt/budgetmanagement/mgtbudgetactdept/{0}/{1}',
          },
          getByStat: {
            url: '/api/mgt/budgetmanagement/mgtbudgetactdeptbystatinfo',
          },
        },
      },
      budgetExec: {
        list: {
          url: '/api/mgt/budgetmanagement/mgtbudgetactexecs',
        },
        get: {
          url: '/api/mgt/budgetmanagement/mgtbudgetactexec/{0}',
        },
        budgetActMstList: {
          url: '/api/mgt/budgetmanagement/budgeting/mgtbudgetactmsts',
        },
        execPsblAmt: {
          url: '/api/mgt/budgetmanagement/mgtbudgetactexec/execpsblamt',
        },
      },
      status: {
        budgetActDeptItem: {
          url: '/api/mgt/budgetmanagement/mgtbudgetingstatus',
        },
        budgetExec: {
          url: '/api/mgt/budgetmanagement/mgtbudgetstatus',
        },
      },
    },
    electEvalMgmt: {
      electHis: {
        list: {
          url: '/api/mgt/electevalmgmt/electhisevaltarget',
        },
      },
      plan: {
        list: {
          url: '/api/mgt/electevalmgmt/electevalplans',
        },
        get: {
          url: '/api/mgt/electevalmgmt/electevalplan/{0}',
        },
        evalItems: {
          url: '/api/mgt/electevalmgmt/electevalplan/evalitem/{0}',
        },
      },
      rslt: {
        me: {
          list: {
            url: '/api/mgt/electevalmgmt/electevalmerslts',
          },
          get: {
            url: '/api/mgt/electevalmgmt/electevalmerslt/{0}',
          },
        },
        up: {
          list: {
            url: '/api/mgt/electevalmgmt/electevaluprslts',
          },
          get: {
            url: '/api/mgt/electevalmgmt/electevaluprslt/{0}',
          },
        },
      },
      status: {
        list: {
          url: '/api/mgt/electevalmgmt/electevalrsltstatus',
        },
      },
    },
  },
  psm: {
    facilityChemprod: {
      riskHazard: {
        url: '/api/psm/chemprodchem/riskHazards',
      },
      list: {
        url: '/api/psm/chemprodchem/facilitychemprods',
      },
      print: {
        url: '/api/psm/chemprodchem/print/{0}/{1}',
        excel: {
          url: '/api/psm/chemprodchem/excel/print/{0}/{1}',
        },
      },
    },
    pipeChemprod: {
      list: {
        url: '/api/psm/chemprodchem/pipechemprods',
      },
    },
    processFacility: {
      powerMachine: {
        list: {
          url: '/api/psm/processFacility/powermachines',
        },
        get: {
          url: '/api/psm/processFacility/powermachine/{0}',
        },
      },
      equipment: {
        list: {
          url: '/api/psm/processFacility/equipments',
        },
        get: {
          url: '/api/psm/processFacility/equipment/{0}/{1}',
        },
      },
      pipe: {
        list: {
          url: '/api/psm/processFacility/pipes',
        },
        get: {
          url: '/api/psm/processFacility/pipe/{0}/{1}',
        },
      },
      safetyValve: {
        list: {
          url: '/api/psm/processFacility/safetyvalves',
        },
        get: {
          url: '/api/psm/processFacility/safetyvalve/{0}',
        },
      },
    },
    processChart: {
      interLock: {
        list: {
          url: '/api/psm/processChart/interlocks',
        },
        get: {
          url: '/api/psm/processChart/interlock/{0}',
        },
        check: {
          url: '/api/psm/processChart/interlockcheck/{0}/{1}',
        },
      },
    },
    buildingFacilitiesLayout: {
      fireProofs: {
        list: {
          url: '/api/psm/buildingFacilitiesLayout/fireproofses',
        },
        get: {
          url: '/api/psm/buildingFacilitiesLayout/fireproofs/{0}',
        },
      },
      extingushing: {
        list: {
          url: '/api/psm/buildingFacilitiesLayout/extingushings',
        },
        get: {
          url: '/api/psm/buildingFacilitiesLayout/extingushing/{0}',
        },
      },
      fireDetection: {
        list: {
          url: '/api/psm/buildingFacilitiesLayout/fireDetections',
        },
        get: {
          url: '/api/psm/buildingFacilitiesLayout/fireDetection/{0}',
        },
      },
      gasDetector: {
        list: {
          url: '/api/psm/buildingFacilitiesLayout/gasDetectors',
        },
        get: {
          url: '/api/psm/buildingFacilitiesLayout/gasDetector/{0}',
        },
      },
      washup: {
        list: {
          url: '/api/psm/buildingFacilitiesLayout/washups',
        },
        get: {
          url: '/api/psm/buildingFacilitiesLayout/washup/{0}',
        },
      },
      localVentilation: {
        list: {
          url: '/api/psm/buildingFacilitiesLayout/localventilations',
        },
        get: {
          url: '/api/psm/buildingFacilitiesLayout/localventilation/{0}',
        },
      },
    },
  },
  // 게시판
  board: {
    list: {
      url: '/api/board/{0}/list',
    },
    // 댓글 목록
    replylist: {
      url: '/api/board/{0}/replylist',
    },
  },
  authGrpUser: {
    list: {
      url: '/api/manage/authgrpusers',
    },
  },
  authGrpDept: {
    list: {
      url: '/api/manage/authgrpdepts',
    },
  },
  // 권한 그룹
  authGrp: {
    list: {
      url: '/api/manage/authgrps',
    },
    count: {
      url: '/api/manage/countauthgrp',
    },
  },
  authGrpMenu: {
    list: {
      url: '/api/manage/authgrpmenus/{0}',
    },
  },
  authGrpUserDept: {
    list: {
      url: '/api/manage/authgrpuserdepts',
    },
  },
  authGrpPlantDept: {
    list: {
      url: '/api/manage/authgrpplantdepts',
    },
    authGrpSubDept: {
      url: '/api/manage/authGrpSubDept',
    },
  },
  userMenu: {
    list: {
      url: '/api/manage/usermenus',
    },
    get: {
      url: '/api/manage/usermenus/',
    },
    favorites: {
      url: '/api/manage/user/favorite/menu/{0}',
    },
  },
  // 첨부파일
  attachFile: {
    list: {
      url: '/api/attachfile/uploadfiles',
    },
    zip: {
      url: '/api/attachfile/zipping',
    },
    getBeforList: {
      url: '/api/attachfile/getfilelist',
    },
    image64: {
      url: '/api/file/down/image64byte',
    },
    file64: {
      url: '/api/file/down/base64byte',
    },
  },
  safAttachFile: {
    list: {
      url: '/api/attachfile/safFileList',
    },
  },
  diagramFile: {
    list: {
      url: '/api/attachfile/diagramlist',
    },
    get: {
      url: '/api/attachfile/checkdiagram',
    },
  },
  // 협력업체 관리
  vendor: {
    baseInfo: {
      subconEvalItem: {
        list: {
          url: '/api/vendor/baseinfo/subconevalitems',
        },
        get: {
          url: '/api/vendor/baseinfo/subconevalitem/{0}',
        },
        check: {
          url: '/api/vendor/baseinfo/checksubconevalitem',
        },
      },
      vendorMaster: {
        list: {
          url: '/api/vendor/baseinfo/chemicalvendormasters',
        },
        get: {
          url: '/api/vendor/baseinfo/chemicalvendormaster/{0}',
        },
        check: {
          url: '/api/vendor/baseinfo/checkchemicalvendormaster',
        },
        checkPortalId: {
          url: '/api/vendor/baseinfo/checkportalid',
        },
        checkBizNum: {
          url: '/api/vendor/baseinfo/checkbiznum',
        },
        worker: {
          list: {
            url: '/api/vendor/baseinfo/chemicalvendormaster/worker',
          },
        },
      },
    },
    assmnSfhlc: {
      list: {
        url: '/api/vendor/assmnSfhlc/planmgmtlists',
      },
      get: {
        url: '/api/vendor/assmnSfhlc/planmgmtinfo/{0}',
      },
      itemlist: {
        url: '/api/vendor/assmnSfhlc/searchAssmnSfhlcItem/{0}/{1}/{2}',
      },
      getstatus: {
        url: '/api/vendor/assmnSfhlc/planmgmtstatus/{0}',
      },
      vendorList: {
        url: '/api/vendor/assmnSfhlc/planmgmtVendorList',
      },
      status: {
        url: '/api/vendor/assmnSfhlc/status',
      },
      statusPopup: {
        url: '/api/vendor/assmnSfhlc/statusPopup',
      },
    },
    assmnSfhlcResult: {
      list: {
        url: '/api/vendor/assmnSfhlc/resultlists',
      },
      get: {
        url: '/api/vendor/assmnSfhlc/resultinfo/{0}',
      },
    },
    subconCheckPatrol: {
      list: {
        url: '/api/vendor/subconcheckpatrol/subconcheckpatrols',
      },
      get: {
        url: '/api/vendor/subconcheckpatrol/subconcheckpatrol/{0}',
      },
      itemResult: {
        url: '/api/vendor/subconcheckpatrol/subconcheckpatrolitemresult/{0}',
      },
      inspector: {
        url: '/api/vendor/subconcheckpatrol/subconcheckpatrolinspector/{0}',
      },
    },
    subconNotice: {
      list: {
        url: '/api/vendor/subconnotice/subconnotices',
      },
      get: {
        url: '/api/vendor/subconnotice/subconnotice/{0}',
      },
    },
    education: {
      list: {
        url: '/api/vendor/education/educationlist',
      },
    },
    warning: {
      list: {
        url: '/api/vendor/warning/vendorwarninglist',
      },
    },
  },
  sop: {
    emergencyState: {
      trainingScenario: {
        list: {
          url: '/api/sop/emergencyState/trainingScenarios',
        },
        detail: {
          url: '/api/sop/emergencyState/trainingScenario/{0}',
        },
        revList: {
          url: '/api/sop/emergencyState/trainingScenarioRev/{0}',
        },
      },
    },
  },
};

export default selectConfig;
