/**
 * 수정용 config
 */
let transactionConfig = {
  menu: {
    insert: {
      url: '/api/common/menu',
    },
    edit: {
      url: '/api/common/menu',
    },
  },
  gridCol: {
    save: {
      url: '/api/common/grid/usergridcol',
    },
    delete: {
      url: '/api/common/grid/usergridcol/{0}/{1}/{2}/{3}/{4}',
    },
  },
  sso: {
    insert: {
      url: '/api/auth/sso',
    },
  },
  // 시스템 관리 Config
  manage: {
    process: {
      insert: {
        url: '/api/manage/process',
      },
      edit: {
        url: '/api/manage/process',
      },
    },
    dept: {
      insert: {
        url: '/api/manage/depts',
      },
      update: {
        url: '/api/manage/depts',
      },
    },
    codeMaster: {
      insert: {
        url: '/api/manage/codemaster',
      },
      edit: {
        url: '/api/manage/codemaster',
      },
    },
    codeDomain: {
      insert: {
        url: '/api/manage/codedomain',
      },
      edit: {
        url: '/api/manage/codedomain',
      },
    },
    codeGroup: {
      insert: {
        url: '/api/manage/codegroup',
      },
      edit: {
        url: '/api/manage/codegroup',
      },
    },
    notice: {
      insert: {
        url: '/api/manage/notice',
      },
      edit: {
        url: '/api/manage/notice',
      },
      delete: {
        url: '/api/manage/notice/{0}',
      },
    },
    apprDelegate: {
      insert: {
        url: '/api/manage/apprdelegate/{0}',
      },
    },
    apprLine: {
      insert: {
        url: '/api/manage/apprline',
      },
      edit: {
        url: '/api/manage/apprline',
      },
      change: {
        url: '/api/manage/changeapprline/{0}',
      },
    },
    apprRequest: {
      insert: {
        url: '/api/manage/apprrequest',
      },
      edit: {
        url: '/api/manage/apprrequest',
      },
    },
    appr: {
      insert: {
        url: '/api/manage/appr',
      },
      edit: {
        url: '/api/manage/appr',
      },
      editParam: {
        url: '/api/manage/apprparam/{0}/{1}',
      },
      all: {
        url: '/api/manage/apprall',
      },
      collect: {
        url: '/api/manage/collectappr/{0}',
      },
    },
    alarm: {
      edit: {
        url: '/api/manage/alarm',
      },
      insert: {
        url: '/api/manage/alarm',
      },
    },

    log: {
      menulog: {
        url: 'api/manage/log/menulog',
      },
      impoAction: {
        insert: {
          url: 'api/manage/log/impoaction',
        },
        edit: {
          url: 'api/manage/log/impoaction',
        },
      },
      batch: {
        insert: {
          url: 'api/manage/log/batch',
        },
        edit: {
          url: 'api/manage/log/batch',
        },
      },
      mailLog: {
        try: {
          url: 'api/manage/log/try/maillog',
        },
      },
      smsLog: {
        try: {
          url: 'api/manage/log/try/smslog',
        },
      },
    },

    attachSetting: {
      insert: {
        url: '/api/manage/attachsetting',
      },
      edit: {
        url: '/api/manage/attachsetting',
      },
    },

    board: {
      insert: {
        url: '/api/manage/boardMaster/board',
      },
      edit: {
        url: '/api/manage/boardMaster/board',
      },
      delete: {
        url: '/api/manage/boardMaster/board',
      },
    },
    // 다국어 관리
    lang: {
      // 라벨타입
      lblMst: {
        insert: {
          url: '/api/manage/lbl/lblMst',
        },
        edit: {
          url: '/api/manage/lbl/lblMst',
        },
      },
      // 라벨코드
      lblDtl: {
        insert: {
          url: '/api/manage/lbl/lblDtl',
        },
        edit: {
          url: '/api/manage/lbl/lblDtl',
        },
      },
    },
  },
  // 보건 Config
  hea: {
    workMeasurePlan: {
      insert: {
        url: '/api/hea/workmeasure/workmeasureplan',
      },
      edit: {
        url: '/api/hea/workmeasure/workmeasureplan',
      },
      delete: {
        url: '/api/hea/workmeasure/workmeasureplan',
      },
    },
    workMeasureResult: {
      insert: {
        url: '/api/hea/workmeasure/workmeasureresult',
      },
      edit: {
        url: '/api/hea/workmeasure/workmeasureresult',
      },
      delete: {
        url: '/api/hea/workmeasure/workmeasureresult',
      },
      excelUpload: {
        url: '/api/hea/workmeasure/excel/workmeasureresults',
      },
    },
    checkupOrg: {
      insert: {
        url: '/api/hea/baseinfo/checkuporg',
      },
      edit: {
        url: '/api/hea/baseinfo/checkuporg',
      },
    },
    testItem: {
      insert: {
        url: '/api/hea/baseinfo/testitem',
      },
      edit: {
        url: '/api/hea/baseinfo/testitem',
      },
    },
    drugManage: {
      insert: {
        url: '/api/hea/drug/drugmanage',
      },
      edit: {
        url: '/api/hea/drug/drugmanage',
      },
    },
    disease: {
      insert: {
        url: '/api/hea/baseinfo/disease',
      },
      edit: {
        url: '/api/hea/baseinfo/disease',
      },
    },
    hazard: {
      insert: {
        url: '/api/hea/workingenvmanage/hazard',
      },
      edit: {
        url: '/api/hea/workingenvmanage/hazard',
      },
    },
    consult: {
      insert: {
        url: '/api/hea/infirmary/consult',
      },
      edit: {
        url: '/api/hea/infirmary/consult',
      },
      delete: {
        url: '/api/hea/infirmary/consult',
      },
    },
    checkupResultDiag: {
      insert: {
        url: '/api/hea/checkup/checkupresultdiag',
      },
      multiDelete: {
        url: '/api/hea/checkup/checkupresultdiags',
      },
    },
    testItemResult: {
      insert: {
        url: '/api/hea/checkup/testitemresult',
      },
      multiDelete: {
        url: '/api/hea/checkup/testitemresults',
      },
    },
    checkupResult: {
      insert: {
        url: '/api/hea/checkup/checkupresult',
      },
      edit: {
        url: '/api/hea/checkup/checkupresult',
      },
      upload: {
        url: '/api/hea/checkup/excel/checkupresults',
      },
    },
    suspectUser: {
      insert: {
        url: '/api/hea/infirmary/createsuspectuser',
      },
      request: {
        url: '/api/hea/infirmary/requstsuspectusers',
      },
      update: {
        url: '/api/hea/infirmary/requstsuspectusers',
      },
    },
    hearingMgr: {
      edit: {
        url: '/api/hea/infirmary/hearingmgr',
      },
      delete: {
        url: '/api/hea/infirmary/hearingmgr/{0}',
      },
    },
    checkupPlan: {
      insert: {
        url: '/api/hea/checkup/checkupplan',
      },
      edit: {
        url: '/api/hea/checkup/checkupplan',
      },
      delete: {
        url: '/api/hea/checkup/checkupplan',
      },
    },
    checkupUser: {
      insert: {
        url: '/api/hea/checkup/checkupusers',
      },
      delete: {
        url: '/api/hea/checkup/checkupusers',
      },
      insertAll: {
        url: '/api/hea/checkup/checkupallusers',
      },
    },
    // SK E&S
    muscResearch: {
      insert: {
        url: '/api/hea/muscresearch/muscresearch',
      },
      edit: {
        url: '/api/hea/muscresearch/muscresearch',
      },
      complete: {
        url: '/api/hea/muscresearch/muscresearchcmpt',
      },
      delete: {
        url: '/api/hea/muscresearch/muscresearch/{0}',
      },
    },
    muscResearchResult: {
      complete: {
        url: '/api/hea/muscresearch/muscresearchresultcmpt',
      },
      allComplete: {
        url: '/api/hea/muscresearch/muscresearchresultcmpt/all',
      },
    },
    unitWork: {
      insert: {
        url: '/api/hea/muscresearch/muscunitwork',
      },
      edit: {
        url: '/api/hea/muscresearch/muscunitwork',
      },
      delete: {
        url: '/api/hea/muscresearch/muscunitwork',
      },
    },
    survey: {
      edit: {
        url: '/api/hea/muscresearch/muscchklist',
      },
    },
    harmful: {
      edit: {
        url: '/api/hea/muscresearch/muscharmful',
      },
      delete: {
        url: '/api/hea/muscresearch/muscharmful',
      },
    },
  },
  // 환경 Config
  env: {
    tms: {
      baseInfo: {
        tmsStation: {
          insert: {
            url: '/api/env/tms/baseinfo/tmsstation',
          },
          edit: {
            url: '/api/env/tms/baseinfo/tmsstation',
          },
          delete: {
            url: '/api/env/tms/baseinfo/tmsstation',
          },
        },
        tmsItem: {
          insert: {
            url: '/api/env/tms/baseinfo/tmsitem',
          },
          edit: {
            url: '/api/env/tms/baseinfo/tmsitem',
          },
          delete: {
            url: '/api/env/tms/baseinfo/tmsitem',
          },
        },
        tmsStationItem: {
          insert: {
            url: '/api/env/tms/baseinfo/tmsstationitem',
          },
          edit: {
            url: '/api/env/tms/baseinfo/tmsstationitem',
          },
          delete: {
            url: '/api/env/tms/baseinfo/tmsstationitem',
          },
        },
        tmsStationItemStd: {
          insert: {
            url: '/api/env/tms/baseinfo/tmsstationitemstd',
          },
        },
      },
    },
    air: {
      baseInfo: {
        testItem: {
          insert: {
            url: '/api/env/air/baseinfo/testitem',
          },
          edit: {
            url: '/api/env/air/baseinfo/testitem',
          },
        },
        outlet: {
          insert: {
            url: '/api/env/air/baseinfo/outlet/outlet',
          },
          edit: {
            url: '/api/env/air/baseinfo/outlet/outlet',
          },
        },
        fuel: {
          insert: {
            url: '/api/env/air/baseinfo/fuel',
          },
          edit: {
            url: '/api/env/air/baseinfo/fuel',
          },
        },
        ingredient: {
          insert: {
            url: '/api/env/air/baseinfo/ingredient',
          },
          edit: {
            url: '/api/env/air/baseinfo/ingredient',
          },
        },
        chemBase: {
          insert: {
            url: '/api/env/air/baseinfo/chembase',
          },
          edit: {
            url: '/api/env/air/baseinfo/chembase',
          },
        },
        oplogBase: {
          insert: {
            url: '/api/env/air/baseinfo/oplogbase/oplogbase',
          },
          edit: {
            url: '/api/env/air/baseinfo/oplogbase/oplogbase',
          },
        },
      },
      facility: {
        discharge: {
          insert: {
            url: '/api/env/air/facility/facility/dischargefacility',
          },
          edit: {
            url: '/api/env/air/facility/facility/dischargefacility',
          },
        },
        prevention: {
          insert: {
            url: '/api/env/air/facility/facility/preventionfacility',
          },
          edit: {
            url: '/api/env/air/facility/facility/preventionfacility',
          },
        },
        preventionChangeHistory: {
          insert: {
            url: '/api/env/air/facility/facility/preventionfacilitychangehistory',
          },
          edit: {
            url: '/api/env/air/facility/facility/preventionfacilitychangehistory',
          },
          delete: {
            url: '/api/env/air/facility/facility/preventionfacilitychangehistory',
          },
        },
        preventionFacActCarbHist: {
          insert: {
            url: '/api/env/air/facility/facility/preventionfacactcarbhist',
          },
          edit: {
            url: '/api/env/air/facility/facility/preventionfacactcarbhist',
          },
          delete: {
            url: '/api/env/air/facility/facility/preventionfacactcarbhist',
          },
        },

        selfMeasurement: {
          insert: {
            url: '/api/env/air/selfmeasurement/selfmeasurement',
          },
          edit: {
            url: '/api/env/air/selfmeasurement/selfmeasurement',
          },
          delete: {
            url: '/api/env/air/selfmeasurement/selfmeasurement/{0}',
          },
          excelUpload: {
            url: '/api/env/air/selfmeasurement/excel/upload',
          },
        },

        preventionMaintenanceHistory: {
          insert: {
            url: '/api/env/air/facility/facility/preventionfacilitymaintenancehistory',
          },
          edit: {
            url: '/api/env/air/facility/facility/preventionfacilitymaintenancehistory',
          },
          delete: {
            url: '/api/env/air/facility/facility/preventionfacilitymaintenancehistory',
          },
        },
      },
      opLog: {
        createOplogResult: {
          edit: {
            url: '/api/env/air/oplog/updateoplogresult',
          },
        },
        admin: {
          createOplogResultAdmin: {
            edit: {
              url: '/api/env/air/oplog/updateoplogresultadmin',
            },
          },
        },
      },
    },
    waste: {
      baseInfo: {
        codeMaster: {
          insert: {
            url: '/api/env/waste/baseinfo/codemaster',
          },
          edit: {
            url: '/api/env/waste/baseinfo/codemaster',
          },
        },
        wasteDisposalMethod: {
          insert: {
            url: '/api/env/waste/baseinfo/wastedisposalmethod',
          },
          edit: {
            url: '/api/env/waste/baseinfo/wastedisposalmethod',
          },
        },
        wasteClass: {
          insert: {
            url: '/api/env/waste/baseinfo/wasteclass',
          },
          edit: {
            url: '/api/env/waste/baseinfo/wasteclass',
          },
        },
        waste: {
          insert: {
            url: '/api/env/waste/baseinfo/waste',
          },
          edit: {
            url: '/api/env/waste/baseinfo/waste',
          },
        },
      },
      operationLog: {
        disposalRequest: {
          insert: {
            url: '/api/env/waste/disposal/disposalrequest',
          },
          edit: {
            url: '/api/env/waste/disposal/disposalrequest',
          },
          delete: {
            url: '/api/env/waste/disposal/disposalrequest/{0}',
          },
        },
        disposalResult: {
          insert: {
            url: '/api/env/waste/disposal/disposalresult',
          },
          edit: {
            url: '/api/env/waste/disposal/disposalresult',
          },
          delete: {
            url: '/api/env/waste/disposal/disposalresult/{0}',
          },
          complete: {
            url: '/api/env/waste/disposal/disposalresultcomplete',
          },
        },
        disporate: {
          insert: {
            url: '/api/env/waste/disporate/disporates',
          },
          edit: {
            url: '/api/env/waste/disporate/disporates',
          },
        },
        allbaro: {
          insert: {
            url: '/api/env/waste/operationLog/allbaro',
          },
        },
      },
    },
    envEffectEval: {
      envEffectEval: {
        insert: {
          url: '/api/env/envEffectEval/envEffectEvals',
        },
        editBasicInfo: {
          url: '/api/env/envEffectEval/envEffectEval',
        },
        editTabInfo: {
          url: '/api/env/envEffectEval/envEffectEval/tabs',
        },
        delete: {
          url: '/api/env/envEffectEval/envEffectEval/{0}',
        },
      },
    },
    water: {
      baseInfo: {
        supply: {
          insert: {
            url: '/api/env/water/baseinfo/supply/supply',
          },
          edit: {
            url: '/api/env/water/baseinfo/supply/supply',
          },
        },
        discharge: {
          insert: {
            url: '/api/env/water/baseinfo/discharge/discharge',
          },
          edit: {
            url: '/api/env/water/baseinfo/discharge/discharge',
          },
        },
        testItem: {
          insert: {
            url: '/api/env/water/baseinfo/testitem/testitem',
          },
          edit: {
            url: '/api/env/water/baseinfo/testitem/testitem',
          },
        },
        monPos: {
          insert: {
            url: '/api/env/water/baseinfo/monpos/monpos',
          },
          edit: {
            url: '/api/env/water/baseinfo/monpos/monpos',
          },
        },
        ingredient: {
          insert: {
            url: '/api/env/water/baseinfo/ingredient/ingredient',
          },
          edit: {
            url: '/api/env/water/baseinfo/ingredient/ingredient',
          },
        },
        chemical: {
          insert: {
            url: '/api/env/water/baseinfo/chemical/chemical',
          },
          edit: {
            url: '/api/env/water/baseinfo/chemical/chemical',
          },
        },
        basicUnit: {
          insert: {
            url: '/api/env/water/baseinfo/basicunit/insertoplogbasedept',
          },
        },
      },
      facility: {
        wasteDischFac: {
          insert: {
            url: '/api/env/water/facility/wastedischfac/wastedischfac',
          },
          edit: {
            url: '/api/env/water/facility/wastedischfac/wastedischfac',
          },
        },
        pwrMeter: {
          insert: {
            url: '/api/env/water/facility/pwrmeter/pwrmeter',
          },
          edit: {
            url: '/api/env/water/facility/pwrmeter/pwrmeter',
          },
        },
        guided: {
          edit: {
            url: '/api/env/water/facility/guided/guided',
          },
        },
        preventFac: {
          insert: {
            url: '/api/env/water/facility/preventfac/preventfac',
          },
          edit: {
            url: '/api/env/water/facility/preventfac/preventfac',
          },
        },
        preventFacBreakHist: {
          insert: {
            url: '/api/env/water/facility/preventfacbreakhist/preventfacbreakhist',
          },
          edit: {
            url: '/api/env/water/facility/preventfacbreakhist/preventfacbreakhist',
          },
          delete: {
            url: '/api/env/water/facility/preventfacbreakhist/preventfacbreakhist',
          },
        },
        wasteBasicUnit: {
          insert: {
            url: '/api/env/water/facility/wastebasicunit/wastebasicunit',
          },
          edit: {
            url: '/api/env/water/facility/wastebasicunit/wastebasicunit',
          },
        },
      },
      operationLog: {
        dailyReport: {
          edit: {
            url: '/api/env/water/operationlog/operation/dailyreport',
          },
          insert: {
            url: '/api/env/water/operationlog/operation/dailyreport',
          },
        },
        sludgeProcess: {
          edit: {
            url: '/api/env/water/operationlog/operation/sludge',
          },
        },
        suplChkResult: {
          edit: {
            url: '/api/env/water/operationlog/operation/suplchkresult',
          },
        },
        dischChkResult: {
          edit: {
            url: '/api/env/water/operationlog/operation/dischchkresult',
          },
        },
        chemChkResult: {
          edit: {
            url: '/api/env/water/operationlog/operation/chemchkresult',
          },
        },
        pwrcChkResult: {
          edit: {
            url: '/api/env/water/operationlog/operation/pwrcchkresult',
          },
        },
        ingrChkResult: {
          edit: {
            url: '/api/env/water/operationlog/operation/ingrchkresult',
          },
        },
        testItemResult: {
          edit: {
            url: '/api/env/water/operationlog/operation/testitemresult',
          },
        },
        dischRunTm: {
          edit: {
            url: '/api/env/water/operationlog/operation/dischruntm',
          },
        },
        preventRunTm: {
          edit: {
            url: '/api/env/water/operationlog/operation/preventruntm',
          },
        },
      },
    },
    gas: {
      baseInfo: {
        disAct: {
          insert: {
            url: 'api/env/gas/baseinfo/disact',
          },
          edit: {
            url: 'api/env/gas/baseinfo/disact',
          },
        },
        disFac: {
          insert: {
            url: 'api/env/gas/baseinfo/disfac',
          },
          edit: {
            url: 'api/env/gas/baseinfo/disfac',
          },
        },
        gasType: {
          insert: {
            url: 'api/env/gas/baseinfo/gastype',
          },
          edit: {
            url: 'api/env/gas/baseinfo/gastype',
          },
        },
        gasUnit: {
          insert: {
            url: 'api/env/gas/baseinfo/gasunit',
          },
          edit: {
            url: 'api/env/gas/baseinfo/gasunit',
          },
        },
      },
      actDataMaster: {
        insert: {
          url: '/api/env/gas/activity/data/master',
        },
        update: {
          url: '/api/env/gas/activity/data/master',
        },
      },
      dischargeFacility: {
        insert: {
          url: '/api/env/gas/discharge/facility/master',
        },
        update: {
          url: '/api/env/gas/discharge/facility/master',
        },
        delete: {
          url: '/api/env/gas/discharge/facility/master/revdelete',
        },
        revInsert: {
          url: '/api/env/gas/discharge/facility/master/revInsert',
        },
      },
      facMgtYear: {
        insert: {
          url: '/api/env/gas/discharge/facility/year',
        },
        delete: {
          url: '/api/env/gas/discharge/facility/year/{0}/{1}',
        },
      },
      facFacYear: {
        save: {
          url: '/api/env/gas/discharge/cal/year',
        },
      },
      emissions: {
        insert: {
          url: '/api/env/gas/discharge/emission',
        },
        update: {
          url: '/api/env/gas/discharge/emission',
        },
        accept: {
          url: '/api/env/gas/discharge/emission/accept',
        },
      },
      actData: {
        insert: {
          url: '/api/env/gas/actdata',
        },
        edit: {
          url: '/api/env/gas/actdata',
        },
        complete: {
          url: '/api/env/gas/complete/actda',
        },
        cancelComplete: {
          url: '/api/env/gas/cancel-complete/actda',
        },
        delete: {
          url: '/api/env/gas/actdata/{0}',
        },
        calActData: {
          url: '/api/env/gas/calactdate',
        },
      },
      alloc: {
        edit: {
          url: '/api/env/gas/alloc/editalloc',
        },
      },
      emstr: {
        edit: {
          url: '/api/env/gas/emstr/editemstr',
        },
      },
    },
  },
  // 기초정보 Config
  baseInfo: {
    // 자재
    SAPMAT: {
      save: {
        url: '/api/baseinfo/sapmat/sapmatvendor',
      },
    },
    facilityType: {
      insert: {
        url: '/api/baseinfo/facilitytype',
      },
      edit: {
        url: '/api/baseinfo/facilitytype',
      },
    },
    facilityTypeItem: {
      insert: {
        url: '/api/baseinfo/facilitytypeitem',
      },
      edit: {
        url: '/api/baseinfo/facilitytypeitem',
      },
    },
    inspBefOper: {
      insert: {
        url: '/api/baseinfo/preopercheckitem',
      },
      edit: {
        url: '/api/baseinfo/preopercheckitem',
      },
    },
    facilityCheckItem: {
      insert: {
        url: '/api/baseinfo/facilitycheckitem',
      },
      edit: {
        url: '/api/baseinfo/facilitycheckitem',
      },
    },
    // 시설
    safFacility: {
      facilityMst: {
        insert: {
          url: '/api/baseinfo/saffacility/facilitymst',
        },
        edit: {
          url: '/api/baseinfo/saffacility/facilitymst',
        },
      },
    },
  },
  // 공사안전 Config
  constSafe: {
    const: {
      insert: {
        url: '/api/saf/const/const',
      },
      edit: {
        url: '/api/saf/const/const',
      },
      delete: {
        url: '/api/saf/const/const/{0}',
      },
      editStep: {
        url: '/api/saf/const/constsubconnstep',
      },
      complete: {
        url: '/api/saf/const/constcomplete/{0}/{1}',
      },
      completeConst: {
        url: '/api/saf/const/conststepcomplete/{0}/{1}',
      },
    },
  },
  // 안전 Config
  saf: {
    inspection: {
      insert: {
        url: '/api/saf/inspection/inspection',
      },
      edit: {
        url: '/api/saf/inspection/inspection',
      },
      delete: {
        url: '/api/saf/inspection/inspection/{0}',
      },
      deptdelete: {
        url: '/api/saf/inspection/inspectionDept',
      },
    },
    inspectionresult: {
      insert: {
        url: '/api/saf/inspection/inspectionresult',
      },
      delete: {
        url: '/api/saf/inspection/inspectionresult/{0}',
      },
    },
    emergency: {
      insert: {
        url: '/api/saf/emergency/emergency',
      },
      edit: {
        url: '/api/saf/emergency/emergency',
      },
      delete: {
        url: '/api/saf/emergency/emergency/{0}',
      },
      deptdelete: {
        url: '/api/saf/emergency/emergencyDept',
      },
      complete: {
        url: '/api/saf/emergency/emergencyComplete/{0}',
      },
    },
    emergencyResult: {
      insert: {
        url: '/api/saf/emergency/emergencyResult',
      },
      edit: {
        url: '/api/saf/emergency/emergencyResult',
      },
      complete: {
        url: '/api/saf/emergency/emergencyResultComplete/{0}',
      },
    },
    auditPlan: {
      insert: {
        url: '/api/saf/psm/auditplan/auditplan',
      },
      edit: {
        url: '/api/saf/psm/auditplan/auditplan',
      },
      delete: {
        url: '/api/saf/psm/auditplan/auditplan',
      },
      request: {
        url: '/api/saf/psm/auditplan/apprrequestauditplan',
      },
    },
    auditResult: {
      edit: {
        url: '/api/saf/psm/auditresult/auditresult',
      },
      complete: {
        url: '/api/saf/psm/auditresult/auditresultcomplete',
      },
    },
    auditItem: {
      insert: {
        url: '/api/saf/baseinfo/audititem',
      },
      edit: {
        url: '/api/saf/baseinfo/audititem',
      },
      delete: {
        url: '/api/saf/baseinfo/audititem',
      },
    },
    auditUser: {
      insert: {
        url: '/api/saf/baseinfo/audituser',
      },
      edit: {
        url: '/api/saf/baseinfo/audituser',
      },
      delete: {
        url: '/api/saf/baseinfo/audituser',
      },
    },
    cto: {
      insert: {
        url: '/api/saf/cto/cto',
      },
      edit: {
        url: '/api/saf/cto/cto',
      },
      delete: {
        url: '/api/saf/cto/cto/{0}',
      },
      checkListInsert: {
        url: '/api/saf/cto/checkList',
      },
      checkListEdit: {
        url: '/api/saf/cto/checkList',
      },
    },
    map: {
      insert: {
        url: '/api/saf/baseinfo/map',
      },
      edit: {
        url: '/api/saf/baseinfo/map',
      },
    },
    electTitle: {
      insert: {
        url: '/api/saf/baseinfo/electtitle',
      },
      edit: {
        url: '/api/saf/baseinfo/electtitle',
      },
    },
    hazardousRiskMechanism: {
      delete: {
        url: '/api/saf/hazardousriskmechanism/hazardousriskmechanism',
      },
      insert: {
        url: '/api/saf/hazardousriskmechanism/hazardousriskmechanism',
      },
      edit: {
        url: '/api/saf/hazardousriskmechanism/hazardousriskmechanism',
      },
    },
    electHis: {
      insert: {
        url: '/api/saf/elect/electhis',
      },
      edit: {
        url: '/api/saf/elect/electhis',
      },
      delete: {
        url: '/api/saf/elect/electhis/{0}',
      },
      revdelete: {
        url: 'api/saf/elect/revdelete',
      },
    },
    change: {
      insert: {
        url: '/api/saf/change/change',
      },
      edit: {
        url: '/api/saf/change/change',
      },
      delete: {
        url: '/api/saf/change/change/{0}',
      },
      complete: {
        url: '/api/saf/change/change/step/4',
      },
    },
    checkKind: {
      insert: {
        url: '/api/saf/baseinfo/createcheckkind',
      },
      edit: {
        url: '/api/saf/baseinfo/updatecheckkind',
      },
    },
    checkItem: {
      insert: {
        url: '/api/saf/baseinfo/createcheckitem',
      },
      edit: {
        url: '/api/saf/baseinfo/updatecheckitem',
      },
    },
    wkodChkItem: {
      insert: {
        url: '/api/saf/wkod/wkodchkitem',
      },
      edit: {
        url: '/api/saf/wkod/wkodchkitem',
      },
    },
    wkodMaster: {
      insert: {
        url: '/api/saf/wkod/wkodmaster',
      },
      edit: {
        url: '/api/saf/wkod/wkodmaster',
      },
      delete: {
        url: '/api/saf/wkod/wkodmaster',
      },
      deleteFacility: {
        url: '/api/saf/wkod/wkodmasterfacility',
      },
      complete: {
        url: '/api/saf/wkod/wkodmaster/step/1',
      },
      over: {
        url: '/api/saf/wkod/wkodmaster/step/2',
      },
      cancel: {
        url: '/api/saf/wkod/wkodmaster/step/3',
      },
    },
    imprAct: {
      insert: {
        url: '/api/saf/impract/impract',
      },
      edit: {
        url: '/api/saf/impract/impract',
      },
      delete: {
        url: '/api/saf/impract/impract',
      },
      cancel: {
        url: '/api/saf/impract/cancelimpract/{0}',
      },
      immSave: {
        url: '/api/saf/impract/immimpract',
      },
      immDelete: {
        url: '/api/saf/impract/immimpract',
      },
      insertAll: {
        url: '/api/saf/impract/impracts',
      },
      uploadExcel: {
        url: '/api/saf/impract/excelUpload',
      },
      excelInsert: {
        url: '/api/saf/impract/excelinsert',
      },
    },
    checkSchedule: {
      insert: {
        url: '/api/saf/check/checkschedule',
      },
      edit: {
        url: '/api/saf/check/checkschedule',
      },
      complete: {
        url: '/api/saf/check/completecheckschedule',
      },
      delete: {
        url: '/api/saf/check/checkschedule/{0}',
      },
    },
    checkPlan: {
      insert: {
        url: '/api/saf/check/checkplan',
      },
      edit: {
        url: '/api/saf/check/checkplan',
      },
      complete: {
        url: '/api/saf/check/completecheckplan',
      },
      delete: {
        url: '/api/saf/check/checkplan/{0}/{1}',
      },
    },
    checkResult: {
      insert: {
        url: '/api/saf/check/checkresult',
      },
      edit: {
        url: '/api/saf/check/checkresult',
      },
      complete: {
        url: '/api/saf/check/completecheckresult',
      },
      delete: {
        url: '/api/saf/check/checkresult/{0}/{1}',
      },
    },
    referenceRoom: {
      insert: {
        url: '/api/saf/board/referenceroom',
      },
      update: {
        url: '/api/saf/board/referenceroom',
      },
      delete: {
        url: '/api/saf/board/referenceroom/{0}/{1}',
      },
      revdelete: {
        url: 'api/saf/board/referenceroom/revdelete',
      },
      insertPlants: {
        url: '/api/saf/board/referenceroom/plants',
      },
    },
    licensingStatus: {
      insert: {
        url: '/api/saf/board/licensingStatus',
      },
      update: {
        url: '/api/saf/board/licensingStatus',
      },
      delete: {
        url: '/api/saf/board/licensingStatus/{0}',
      },
      revdelete: {
        url: 'api/saf/board/licensingStatus/revdelete',
      },
    },
    facilityCheckResult: {
      edit: {
        url: '/api/saf/facility/facilitycheckresult',
      },
      deletes: {
        url: '/api/saf/facility/facilitycheckresults',
      },
    },
    facilChkPlan: {
      insert: {
        url: '/api/saf/facility/facilchkplan',
      },
      edit: {
        url: '/api/saf/facility/facilchkplan',
      },
      delete: {
        url: '/api/saf/facility/facilchkplan/{0}',
      },
      complete: {
        url: '/api/saf/facility/facilchkplan/complete',
      },
    },
    befInspPlan: {
      insert: {
        url: '/api/saf/facility/preoperchkplan',
        sub: {
          url: '/api/saf/facility/sub/preoperchkplan',
        },
      },
      edit: {
        url: '/api/saf/facility/preoperchkplan',
      },
      delete: {
        url: '/api/saf/facility/preoperchkplan/{0}',
        typeItems: {
          url: '/api/saf/facility/preoperchkplan/typeitem/{0}/{1}/{2}',
        },
      },
      complete: {
        url: '/api/saf/facility/preoperchkplan/complete',
      },
    },
    facilChkResult: {
      edit: {
        url: '/api/saf/facility/facilchkresult',
      },
    },
    facilityMst: {
      insert: {
        url: '/api/saf/facility/facilitymst',
      },
      edit: {
        url: '/api/saf/facility/facilitymst',
      },
    },
    facilityInspection: {
      schedules: {
        insert: {
          url: '/api/saf/facilityinspection/facilityinspectionschedule',
        },
        edit: {
          url: '/api/saf/facilityinspection/facilityinspectionschedule',
        },
        delete: {
          url: '/api/saf/facilityinspection/facilityinspectionschedule/{0}',
        },
      },
      facilityInspectionPlan: {
        edit: {
          url: '/api/saf/facilityinspection/facilityinspectionplanresult',
        },
        delete: {
          url: '/api/saf/facilityinspection/facilityinspectionplanresult/{0}',
        },
      },
    },
    patrol: {
      insert: {
        url: '/api/saf/patrol/patrol',
      },
      edit: {
        url: '/api/saf/patrol/patrol',
      },
      delete: {
        url: '/api/saf/patrol/patrol/{0}',
      },
    },
    patrolMst: {
      insert: {
        url: '/api/saf/master/patrol/patrol',
      },
      edit: {
        url: '/api/saf/master/patrol/patrol',
      },
      delete: {
        url: '/api/saf/master/patrol/patrol/{0}',
      },
      complete: {
        url: '/api/saf/master/patrol/complete/{0}',
      },
    },
    consolMst: {
      insert: {
        url: '/api/saf/master/consol/consol',
      },
      edit: {
        url: '/api/saf/master/consol/consol',
      },
      delete: {
        url: '/api/saf/master/consol/consol/{0}/{1}',
      },
      complete: {
        url: '/api/saf/master/consol/complete/{0}',
      },
    },
    consolPlan: {
      insert: {
        url: '/api/saf/plan/consol/consol',
      },
      edit: {
        url: '/api/saf/plan/consol/consol',
      },
      delete: {
        url: '/api/saf/plan/consol/consol/{0}',
      },
      complete: {
        url: '/api/saf/plan/consol/complete/{0}',
      },
    },
    spe: {
      insert: {
        url: '/api/saf/spe/spe',
      },
      edit: {
        url: '/api/saf/spe/spe',
      },
    },
    speRqst: {
      insert: {
        url: '/api/saf/spe/sperqst',
      },
      edit: {
        url: '/api/saf/spe/sperqst',
      },
      complete: {
        url: '/api/saf/spe/sperqstcmpt',
      },
      delete: {
        url: '/api/saf/spe/sperqst/{0}',
      },
    },
    speGive: {
      insert: {
        url: '/api/saf/spe/spegive',
      },
      edit: {
        url: '/api/saf/spe/spegive',
      },
      complete: {
        url: '/api/saf/spe/spegivecmpt',
      },
    },
    speNoRqstGive: {
      insert: {
        url: '/api/saf/spe/spenorqstgive',
      },
      edit: {
        url: '/api/saf/spe/spenorqstgive',
      },
      complete: {
        url: '/api/saf/spe/spenorqstgivecmpt',
      },
      delete: {
        url: '/api/saf/spe/spenorqstgive/{0}',
      },
    },
    noAccidentResult: {
      insert: {
        url: '/api/saf/noaccident/createnoaccident',
      },
      edit: {
        url: '/api/saf/noaccident/updatenoaccident',
      },
      delete: {
        url: '/api/saf/noaccident/deletenoaccident',
      },
    },
    deptNoAccidentResult: {
      insert: {
        url: '/api/saf/noaccident/createdeptnoaccident',
      },
      edit: {
        url: '/api/saf/noaccident/updatedeptnoaccident',
      },
      delete: {
        url: '/api/saf/noaccident/deletedeptnoaccident',
      },
    },
    accidentHumanDamage: {
      insert: {
        url: '/api/saf/baseinfo/humandamage',
      },
      edit: {
        url: '/api/saf/baseinfo/humandamage',
      },
    },
    accidentImmCause: {
      insert: {
        url: '/api/saf/baseinfo/immcause',
      },
      edit: {
        url: '/api/saf/baseinfo/immcause',
      },
    },
    accidentIndCause: {
      insert: {
        url: '/api/saf/baseinfo/indcause',
      },
      edit: {
        url: '/api/saf/baseinfo/indcause',
      },
    },
    accidentOccurrForm: {
      insert: {
        url: '/api/saf/baseinfo/occurrform',
      },
      edit: {
        url: '/api/saf/baseinfo/occurrform',
      },
    },
    accidentOccurrAtt: {
      insert: {
        url: '/api/saf/baseinfo/occurratt',
      },
      edit: {
        url: '/api/saf/baseinfo/occurratt',
      },
    },
    accident: {
      insert: {
        url: '/api/saf/accident/accident',
      },
      edit: {
        url: '/api/saf/accident/accident',
      },
      delete: {
        url: '/api/saf/accident/accident/{0}',
      },
    },
    accidentCauMeas: {
      delete: {
        url: '/api/saf/accident/accidentcaumeas/{0}/{1}',
      },
    },
    nearmiss: {
      insert: {
        url: '/api/saf/accident/createnearmiss',
      },
      edit: {
        url: '/api/saf/accident/updatenearmiss',
      },
      delete: {
        url: '/api/saf/accident/deletenearmiss',
      },
      editComple: {
        url: '/api/saf/accident/complenearmiss',
      },
    },
    education: {
      eduCourse: {
        insert: {
          url: '/api/saf/education/educourse',
        },
        edit: {
          url: '/api/saf/education/educourse',
        },
      },
      eduCourseGrp: {
        edit: {
          url: '/api/saf/education/educoursegrp/{0}',
        },
      },
      eduMasterMobile: {
        insert: {
          url: '/api/saf/education/mobile/createuseranswer',
        },
        edit: {
          url: '/api/saf/education/mobile/edituseranswer',
        },
      },
      eduMaster: {
        insert: {
          url: '/api/saf/education/edumaster',
        },
        edit: {
          url: '/api/saf/education/edumaster',
        },
        delete: {
          url: '/api/saf/education/deleteedumaster/{0}/{1}',
        },
      },
      eduMasterUser: {
        edit: {
          url: '/api/saf/education/updatereedumaster',
        },
        complete: {
          url: '/api/saf/education/updatereedumastercomplet/{0}',
        },
      },
      eduProblemMgt: {
        insert: {
          url: '/api/saf/eduproblem/eduproblem',
        },
        edit: {
          url: '/api/saf/eduproblem/eduproblem',
        },
        delete: {
          url: '/api/saf/eduproblem/eduproblem/delete/{0}',
        },
      },
      eduQuestion: {
        insert: {
          url: '/api/saf/eduquestion/eduquestionlist',
        },
        edit: {
          url: '/api/saf/eduquestion/eduquestionlist',
        },
        delete: {
          url: '/api/saf/eduquestion/eduquestionlist/{0}',
        },
      },
      eduGroup: {
        insert: {
          url: '/api/saf/edugroup/edugroup',
        },
        edit: {
          url: '/api/saf/edugroup/edugroup',
        },
        delete: {
          url: '/api/saf/edugroup/edugroup/{0}',
        },
      },
      eduResult: {
        edit: {
          url: '/api/saf/education/eduresult',
        },
      },
    },
    facilityInsType: {
      insert: {
        url: '/api/saf/baseinfo/facilityinstype',
      },
      edit: {
        url: '/api/saf/baseinfo/facilityinstype',
      },
    },
    facilityInsTypeCkItem: {
      insert: {
        url: '/api/saf/baseinfo/facilitytypecheckitem',
      },
      edit: {
        url: '/api/saf/baseinfo/facilitytypecheckitem',
      },
    },
    obsrItm: {
      insert: {
        url: '/api/saf/baseinfo/obsrItm',
      },
      edit: {
        url: '/api/saf/baseinfo/obsrItm',
      },
    },
    majDisaInsp: {
      save: {
        url: '/api/saf/majdisainsp/majdisainsp',
      },
      delete: {
        url: '/api/saf/majdisainsp/majdisainsp/{0}',
      },
    },
    govImplChkResult: {
      save: {
        url: '/api/saf/inspection/govImplChkResult',
      },
      delete: {
        url: '/api/saf/inspection/govImplChkResult/{0}',
      },
    },
  },

  // 직무위험성평가 Config
  rsa: {
    variable: {
      insert: {
        url: '/api/rsa/baseinfo/variable',
      },
      edit: {
        url: '/api/rsa/baseinfo/variable',
      },
    },
    planmgmt: {
      insert: {
        url: '/api/rsa/planmgmt/planmgmt',
      },
      edit: {
        url: '/api/rsa/planmgmt/planmgmt',
      },
      delete: {
        url: '/api/rsa/planmgmt/planmgmt/{0}',
      },
    },
    planmgmt2: {
      insert: {
        url: '/api/rsa/planmgmt2/planmgmt',
      },
      insert2: {
        url: '/api/rsa/planmgmt2/planmgmt2',
      },
      insertNoPlanResult: {
        url: '/api/rsa/planmgmt2/lsPlanmgmtResult',
      },
      insertAssessJob: {
        url: '/api/rsa/planmgmt2/createAssessJob',
      },
      insertReEval: {
        url: '/api/rsa/planmgmt2/importantPlanmgmtInsert',
      },
      edit: {
        url: '/api/rsa/planmgmt2/planmgmt',
      },
      edit2: {
        url: '/api/rsa/planmgmt2/updateRiskAssessPlan',
      },
      edit3: {
        url: '/api/rsa/planmgmt2/updateRiskAssessResult',
      },
      editNoPlanResult: {
        url: '/api/rsa/planmgmt2/updatelsPlanmgmtResult',
      },
      appr: {
        url: '/api/rsa/planmgmt2/apprCompleteRiskAssessPlan',
      },
      apprResult: {
        url: '/api/rsa/planmgmt2/apprCompleteRiskAssessResult',
      },
      delete: {
        url: '/api/rsa/planmgmt2/planmgmt/{0}',
      },
      deleteRslt: {
        url: '/api/rsa/planmgmt2/deletePlanmgmtRslt/{0}/{1}/{2}',
      },
      deleteUploadPlan: {
        url: '/api/rsa/planmgmt2/deletePlanmgmtUploadPlan/{0}',
      },
      deleteUploadRslt: {
        url: '/api/rsa/planmgmt2/deletePlanmgmtUploadRslt/{0}/{1}/{2}',
      },
      completeResult: {
        url: '/api/rsa/planmgmt2/completeResultmgmt',
      },
    },
    planmgmtdeptlist: {
      delete: {
        url: '/api/rsa/planmgmt/planmgmtdeptlist',
      },
    },
    planmgmtdeptlist2: {
      delete: {
        url: '/api/rsa/planmgmt2/planmgmtdeptlist',
      },
    },
    resultmgmt: {
      insert: {
        url: '/api/rsa/planmgmt/resultmgmt',
      },
      delete: {
        url: '/api/rsa/planmgmt/resultmgmt/{0}',
      },
    },
    resultmgmt2: {
      insert: {
        url: '/api/rsa/planmgmt2/resultmgmt',
      },
      completeAppr: {
        url: '/api/rsa/planmgmt2/resultmgmtApprComplete',
      },
      delete: {
        url: '/api/rsa/planmgmt2/resultmgmt/{0}',
      },
    },
    assessType: {
      insert: {
        url: '/api/rsa/baseinfo/assesstype',
      },
      edit: {
        url: '/api/rsa/baseinfo/assesstype',
      },
      revdelete: {
        url: '/api/rsa/baseinfo/riskmatrixs/revdelete',
      },
    },
    assessAction: {
      insert: {
        url: '/api/rsa/assess/assessaction',
      },
      insertList: {
        url: '/api/rsa/assess/assessaction/list',
      },
      insertJsa: {
        url: '/api/rsa/assess/assessactionjsa',
      },
    },
    assessResult: {
      insert: {
        url: '/api/rsa/assess/assessresult',
      },
    },
    riskHazard: {
      insert: {
        url: '/api/rsa/baseinfo/riskhazard',
      },
      edit: {
        url: '/api/rsa/baseinfo/riskhazard',
      },
    },
    job: {
      insert: {
        url: '/api/rsa/baseinfo/job',
      },
      edit: {
        url: '/api/rsa/baseinfo/job',
      },
    },
    jobStep: {
      insert: {
        url: '/api/rsa/baseinfo/jobstep',
      },
      edit: {
        url: '/api/rsa/baseinfo/jobstep',
      },
    },
    jobHistory: {
      revdelete: {
        url: '/api/rsa/baseinfo/jobHistory/revdelete',
      },
    },
    jobRiskHazard: {
      insert: {
        url: '/api/rsa/baseinfo/jobriskhazard',
      },
      delete: {
        url: '/api/rsa/baseinfo/jobriskhazard',
      },
    },
    assessPlan: {
      insert: {
        url: '/api/rsa/assess/assessplan',
      },
      edit: {
        url: '/api/rsa/assess/assessplan',
      },
    },
    jobRiskBook: {
      delete: {
        url: '/api/rsa/jobriskbook/jobriskbook',
      },
    },
    riskAssessDept: {
      insert: {
        url: '/api/rsa/assess/riskassessdept',
        multiple: {
          url: '/api/rsa/assess/multi/riskassessdept',
        },
      },
      edit: {
        url: '/api/rsa/assess/riskassessdept',
      },
      delete: {
        url: '/api/rsa/assess/riskassessdept',
        multiple: {
          url: '/api/rsa/assess/multi/riskassessdept',
        },
      },
    },
    deptAssessJob: {
      insert: {
        url: '/api/rsa/assess/deptassessjob',
      },
    },
  },
  // 물질관리
  chm: {
    // 실적관리
    mat: {
      storageFacilityManagement: {
        insert: {
          url: '/api/chm/mat/storage/storagefacilitymanagement',
        },
        edit: {
          url: '/api/chm/mat/storage/storagefacilitymanagement',
        },
      },
    },
    chemicalBranch: {
      insert: {
        url: '/api/chm/baseinfo/chemicalbranch',
      },
      edit: {
        url: '/api/chm/baseinfo/chemicalbranch',
      },
    },
    chemicalRegulItem: {
      insert: {
        url: '/api/chm/baseinfo/chemicalreguiItem',
      },
      edit: {
        url: '/api/chm/baseinfo/chemicalreguiItem',
      },
    },
    chemicalPermitCls: {
      insert: {
        url: '/api/chm/baseinfo/chemicalpermitcls',
      },
      edit: {
        url: '/api/chm/baseinfo/chemicalpermitcls',
      },
    },
    chemPermitProdHis: {
      insert: {
        url: '/api/chm/chem/permitprodhis',
      },
      edit: {
        url: '/api/chm/chem/permitprodhis',
      },
      delete: {
        url: '/api/chm/chem/revdelete',
      },
      deleteLatest: {
        url: '/api/chm/chem/permit-prod-his-status/{0}',
      },
    },
    chemicalUnit: {
      insert: {
        url: '/api/chm/baseinfo/chemicalunit',
      },
      edit: {
        url: '/api/chm/baseinfo/chemicalunit',
      },
    },
    deptChemprod: {
      insert: {
        url: '/api/chm/deptchemprod/deptchemprod',
      },
      edit: {
        url: '/api/chm/deptchemprod/deptchemprod',
      },
    },
    chem: {
      insert: {
        url: '/api/chm/chem/chem',
      },
      edit: {
        url: '/api/chm/chem/chem',
      },
    },
    chemprod: {
      insert: {
        url: '/api/chm/chem/chemprod',
      },
      edit: {
        url: '/api/chm/chem/chemprod',
      },
    },
    chemprodChem: {
      insert: {
        url: '/api/chm/chem/chemprodchem',
      },
    },
    MSDS: {
      insert: {
        url: '/api/chm/chem/msds',
      },
      edit: {
        url: '/api/chm/chem/msds',
      },
    },
    processManage: {
      insert: {
        url: '/api/chm/chem/processmanage',
      },
      edit: {
        url: '/api/chm/chem/processmanage',
      },
    },
    matCheckRequest: {
      insert: {
        url: '/api/chm/wholeprocess/matcheckrequest',
      },
      edit: {
        url: '/api/chm/wholeprocess/matcheckrequest',
      },
      delete: {
        url: '/api/chm/wholeprocess/matcheckrequest/{0}',
      },
      sapMatCheckRequest: {
        url: '/api/chm/wholeprocess/matcheckrequest/sapmatcheckrequest',
      },
      confirm: {
        url: '/api/chm/wholeprocess/matcheckrequest/confirm',
      },
      confirmenv: {
        url: '/api/chm/wholeprocess/matcheckrequest/confirmenv',
      },
      reject: {
        url: '/api/chm/wholeprocess/matcheckrequest/reject',
      },
    },
    matCheckRequestCompo: {
      insert: {
        url: '/api/chm/wholeprocess/matcheckrequestcompo',
      },
    },
    chemicalReagentLab: {
      insert: {
        url: '/api/chm/baseinfo/chemicalreagentlab',
      },
      edit: {
        url: '/api/chm/baseinfo/chemicalreagentlab',
      },
    },
    chemicalReagentInout: {
      insert: {
        url: '/api/chm/baseinfo/chemicalreagentinout',
      },
      edit: {
        url: '/api/chm/baseinfo/chemicalreagentinout',
      },
      delete: {
        url: '/api/chm/baseinfo/chemicalreagentinout/{0}',
      },
    },
    chemicalreguldbhist: {
      upload: {
        url: '/api/chm/baseinfo/reguldbhist',
      },
      apply: {
        url: '/api/chm/baseinfo/reguldbhistapply/{0}',
      },
      delete: {
        url: '/api/chm/baseinfo/reguldbhist/{0}',
      },
    },
  },
  // 경영
  mgt: {
    investItem: {
      insert: {
        url: '/api/saf/baseinfo/investItemAdd',
      },
      edit: {
        url: '/api/saf/baseinfo/investItemAdd',
      },
    },
    budgetAct: {
      save: {
        url: '/api/mgt/baseinfo/budgetact',
      },
    },
    scheduleManagement: {
      insert: {
        url: '/api/mgt/schedulemanagement',
      },
      edit: {
        url: '/api/mgt/schedulemanagement',
      },
      delete: {
        url: '/api/mgt/schedulemanagement/{0}',
      },
    },
    perRptData: {
      insert: {
        url: '/api/mgt/perrptdata',
      },
      edit: {
        url: '/api/mgt/perrptdata',
      },
      delete: {
        url: '/api/mgt/perrptdata/{0}',
      },
      complete: {
        url: '/api/mgt/perrptdata/complete',
      },
    },
    safetyActionBizField: {
      insert: {
        url: '/api/mgt/baseinfo/safetyactionbizfield',
      },
      edit: {
        url: '/api/mgt/baseinfo/safetyactionbizfield',
      },
    },
    safetyActionBizFieldItem: {
      insert: {
        url: '/api/mgt/baseinfo/safetyactionbizfielditem',
      },
      edit: {
        url: '/api/mgt/baseinfo/safetyactionbizfielditem',
      },
    },
    mgtTarget: {
      mgtTarget: {
        insert: {
          url: '/api/mgt/mgttarget/mgttarget',
        },
        insertRslt: {
          url: '/api/mgt/mgttarget/mgttargetrslt',
        },
        edit: {
          url: '/api/mgt/mgttarget/mgttarget',
        },
        delete: {
          url: '/api/mgt/mgttarget/mgttarget/{0}',
        },
        deleteRslt: {
          url: '/api/mgt/mgttarget/mgttarget/{0}/{1}',
        },
      },
    },
    mgtLaw: {
      lawMakingCheck: {
        insert: {
          url: '/api/mgt/mgtlaw/lawmakingcheck',
        },
        edit: {
          url: '/api/mgt/mgtlaw/lawmakingcheck',
        },
        delete: {
          url: '/api/mgt/mgtlaw/lawmakingcheck/{0}',
        },
        user: {
          url: '/api/mgt/mgtlaw/lawmakingcheck/user',
        },
        confirmUser: {
          url: '/api/mgt/mgtlaw/lawmakingcheck/confirm/user',
        },
        opinion: {
          url: '/api/mgt/mgtlaw/lawmakingcheck/opinion',
        },
        confirmOpinion: {
          url: '/api/mgt/mgtlaw/lawmakingcheck/confirm/opinion',
        },
      },
    },
    mgtInfoItem: {
      insert: {
        url: '/api/saf/baseinfo/mgtinfoitem',
      },
      edit: {
        url: '/api/saf/baseinfo/mgtinfoitem',
      },
    },
    industrialSafetyHealthCommittee: {
      insert: {
        url: '/api/mgt/industrialsafetyhealthcommittee/industrialsafetyhealthcommittee',
      },
      edit: {
        url: '/api/mgt/industrialsafetyhealthcommittee/industrialsafetyhealthcommittee',
      },
      delete: {
        url: '/api/mgt/industrialsafetyhealthcommittee/industrialsafetyhealthcommittee',
      },
      complete: {
        url: '/api/mgt/industrialsafetyhealthcommittee/completeindustrialsafetyhealthcommittee',
      },
      imprDelete: {
        url: '/api/mgt/industrialsafetyhealthcommittee/imprDelete/{0}/{1}',
      },
    },
    budgetManagement: {
      budgetAct: {
        save: {
          url: '/api/mgt/budgetmanagement/mgtbudgetact',
        },
        budgetActDept: {
          save: {
            url: '/api/mgt/budgetmanagement/mgtbudgetactdept',
          },
          delete: {
            url: '/api/mgt/budgetmanagement/mgtbudgetactdept/{0}/{1}',
          },
        },
      },
      budgetExec: {
        save: {
          url: '/api/mgt/budgetmanagement/mgtbudgetactexec',
        },
        delete: {
          url: '/api/mgt/budgetmanagement/mgtbudgetactexec/{0}',
        },
      },
    },
    electEvalMgmt: {
      plan: {
        save: {
          url: '/api/mgt/electevalmgmt/electevalplan',
        },
        delete: {
          url: '/api/mgt/electevalmgmt/electevalplan/{0}',
        },
        deleteEvalUser: {
          url: '/api/mgt/electevalmgmt/electevalplan/delevalusers/{0}',
        },
      },
      rslt: {
        me: {
          save: {
            url: '/api/mgt/electevalmgmt/electevalmerslt',
          },
          cancel: {
            url: '/api/mgt/electevalmgmt/electevalmerslt/cancel',
          },
        },
        up: {
          save: {
            url: '/api/mgt/electevalmgmt/electevaluprslt',
          },
        },
      },
    },
  },
  psm: {
    facilityChemprod: {
      delete: {
        url: '/api/psm/chemprodchem/facilitychemprod',
      },
    },
    pipeChemprod: {
      insert: {
        url: '/api/psm/chemprodchem/pipechemprod',
      },
      delete: {
        url: '/api/psm/chemprodchem/pipechemprod',
      },
    },
    processFacility: {
      powerMachine: {
        insert: {
          url: '/api/psm/processFacility/powermachine',
        },
      },
      equipment: {
        insert: {
          url: '/api/psm/processFacility/equipment',
        },
      },
      safetyValve: {
        insert: {
          url: '/api/psm/processFacility/safetyvalve',
        },
      },
      pipe: {
        insert: {
          url: '/api/psm/processFacility/pipe',
        },
        delete: {
          url: '/api/psm/processFacility/pipe',
        },
      },
    },
    processChart: {
      interLock: {
        insert: {
          url: '/api/psm/processChart/interlock',
        },
        edit: {
          url: '/api/psm/processChart/interlock',
        },
        delete: {
          url: '/api/psm/processChart/interlock',
        },
      },
    },
    buildingFacilitiesLayout: {
      fireProofs: {
        insert: {
          url: '/api/psm/buildingFacilitiesLayout/fireproofs',
        },
        edit: {
          url: '/api/psm/buildingFacilitiesLayout/fireproofs',
        },
        delete: {
          url: '/api/psm/buildingFacilitiesLayout/fireproofs',
        },
      },
      extingushing: {
        insert: {
          url: '/api/psm/buildingFacilitiesLayout/extingushing',
        },
        edit: {
          url: '/api/psm/buildingFacilitiesLayout/extingushing',
        },
        delete: {
          url: '/api/psm/buildingFacilitiesLayout/extingushing',
        },
      },
      fireDetection: {
        insert: {
          url: '/api/psm/buildingFacilitiesLayout/fireDetection',
        },
        edit: {
          url: '/api/psm/buildingFacilitiesLayout/fireDetection',
        },
        delete: {
          url: '/api/psm/buildingFacilitiesLayout/fireDetection',
        },
      },
      gasDetector: {
        insert: {
          url: '/api/psm/buildingFacilitiesLayout/gasDetector',
        },
        edit: {
          url: '/api/psm/buildingFacilitiesLayout/gasDetector',
        },
        delete: {
          url: '/api/psm/buildingFacilitiesLayout/gasDetector',
        },
      },
      washup: {
        insert: {
          url: '/api/psm/buildingFacilitiesLayout/washup',
        },
        edit: {
          url: '/api/psm/buildingFacilitiesLayout/washup',
        },
        delete: {
          url: '/api/psm/buildingFacilitiesLayout/washup',
        },
      },
      localVentilation: {
        insert: {
          url: '/api/psm/buildingFacilitiesLayout/localventilation',
        },
        edit: {
          url: '/api/psm/buildingFacilitiesLayout/localventilation',
        },
        delete: {
          url: '/api/psm/buildingFacilitiesLayout/localventilation',
        },
      },
    },
  },

  board: {
    insert: {
      url: '/api/board/{0}/save',
    },
    edit: {
      url: '/api/board/{0}/save',
    },
    updateCnt: {
      url: '/api/board/{0}/cntup',
    },
    delete: {
      url: '/api/board/{0}/delete',
    },
    // 댓글 등록
    replyInsert: {
      url: '/api/board/{0}/replysave',
    },
    replyEdit: {
      url: '/api/board/{0}/replysave',
    },
    replyDelete: {
      url: '/api/board/{0}/replydelete',
    },
  },
  authGrpUser: {
    insert: {
      url: '/api/manage/authgrpuser',
    },
    delete: {
      url: '/api/manage/authgrpuser',
    },
  },
  authGrpDept: {
    insert: {
      url: '/api/manage/authgrpdept',
    },
    delete: {
      url: '/api/manage/authgrpdept',
    },
  },
  // 권한 그룹
  authGrp: {
    insert: {
      url: '/api/manage/authgrp',
    },
    edit: {
      url: '/api/manage/authgrp/{0}',
    },
  },
  authGrpMenu: {
    insert: {
      url: '/api/manage/authgrpmenu',
    },
    save: {
      url: '/api/manage/authgrpmenuaccess',
    },
    edit: {
      url: '/api/manage/authgrpmenuwrite',
    },
  },
  userAuthGrp: {
    insert: {
      url: '/api/manage/userauthgrp',
    },
    delete: {
      url: '/api/manage/userauthgrp',
    },
    insertDept: {
      url: '/api/manage/deptauthgrp',
    },
    deleteDept: {
      url: '/api/manage/deptauthgrp',
    },
    insertAuthDept: {
      url: '/api/manage/deptauth',
    },
    deleteAuthDept: {
      url: '/api/manage/deptauth',
    },
    insertAuthUser: {
      url: '/api/manage/userauth',
    },
  },
  user: {
    insert: {
      url: '/api/manage/user',
    },
    update: {
      url: '/api/manage/user',
    },
    // 사용자 암호변경
    password: {
      url: '/api/manage/password',
    },
    favoritesInsert: {
      url: '/api/manage/user/favorites',
    },
    favoritesDelete: {
      url: '/api/manage/user/favorites',
    },
    signatureUpdate: {
      url: '/api/manage/user/signature',
    },
  },
  deptProcess: {
    insert: {
      url: '/api/manage/deptprocess',
    },
    delete: {
      url: '/api/manage/deptprocess',
    },
  },
  login: {
    insert: {
      url: '/api/auth/login',
    },
    update: {
      url: '/api/auth/logout/{0}',
    },
  },
  attachFile: {
    insert: {
      url: '/api/attachfile/uploadfiles',
    },
    delete: {
      url: '/api/attachfile/deletefile/{0}',
    },
    deleteMulti: {
      url: '/api/attachfile/deletemultifile',
    },
    deleteAll: {
      url: '/api/attachfile/deletefiles',
    },
    apply: {
      url: '/api/attachfile/applyuploadfiles',
    },
    editExplain: {
      url: '/api/attachfile/editexplain',
    },
    deleteAllDocu: {
      url: '/api/attachfile/deletefile/{0}/{1}',
    },
  },
  safAttachFile: {
    insert: {
      url: '/api/attachfile/safUploadfiles',
    },
    edit: {
      url: '/api/attachfile/safUploadfiles',
    },
    delete: {
      url: '/api/attachfile/safDeletefile/{0}',
    },
    deleteMulti: {
      url: '/api/attachfile/safdeletemultifile',
    },
  },
  diagramFile: {
    insert: {
      url: '/api/attachfile/diagramuploadfiles',
    },
    edit: {
      url: '/api/attachfile/diagramuploadfiles',
    },
  },
  vendor: {
    baseInfo: {
      subconEvalItem: {
        insert: {
          url: '/api/vendor/baseinfo/subconevalitem',
        },
        edit: {
          url: '/api/vendor/baseinfo/subconevalitem',
        },
      },
      vendorMaster: {
        insert: {
          url: '/api/vendor/baseinfo/chemicalvendormaster',
        },
        edit: {
          url: '/api/vendor/baseinfo/chemicalvendormaster',
        },
        reset: {
          url: '/api/vendor/baseinfo/chemicalvendormasterpwdreset/{0}/{1}',
        },
      },
    },
    assmnSfhlc: {
      insert: {
        url: '/api/vendor/assmnSfhlc/assmnSfhlcplan',
      },
      edit: {
        url: '/api/vendor/assmnSfhlc/assmnSfhlcplan',
      },
      delete: {
        url: '/api/vendor/assmnSfhlc/assmnSfhlcplan/{0}',
      },
      vendorDelete: {
        url: '/api/vendor/assmnSfhlc/deleteAssmnSfhlcVendor',
      },
    },
    assmnSfhlcResult: {
      insert: {
        url: '/api/vendor/assmnSfhlc/assmnSfhlcresult',
      },
      edit: {
        url: '/api/vendor/assmnSfhlc/assmnSfhlcresult',
      },
      delete: {
        url: '/api/vendor/assmnSfhlc/assmnSfhlcresult/{0}',
      },
    },
    subconNotice: {
      insert: {
        url: '/api/vendor/subconnotice/subconnotice',
      },
      edit: {
        url: '/api/vendor/subconnotice/subconnotice',
      },
      delete: {
        url: '/api/vendor/subconnotice/subconnotice/{0}',
      },
    },
  },
  sop: {
    emergencyState: {
      trainingScenario: {
        insert: {
          url: '/api/sop/emergencyState/trainingScenario',
        },
        edit: {
          url: '/api/sop/emergencyState/trainingScenario',
        },
        revdelete: {
          url: '/api/sop/emergencyState/trainingScenario',
        },
      },
    },
  },
};

export default transactionConfig;
