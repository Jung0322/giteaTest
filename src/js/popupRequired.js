/*
  목적 : 미입력란 상세팝업
  작성자 : kcg.winscore
  Detail : 페이지별 미입력필드를 팝업으로 알려줍니다.
  examples:
*/
import comm from "./common";

let popupRequired = {
  check: function(pageName, inputs, errors) {

    /*
      안전 > 사고관리 > 아차사고 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'nearmissDetail') {
      if (!inputs.nearmiss.nearKindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001213'), // 사고자구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.tempOccTypeCd && inputs.tempOccTypeCd.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001214'), // 사고종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.nearmissDateTime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001215'), // 발생일시를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001216'), // 발생부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.area) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001217'), // 발생장소를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.prcsStateCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001218'), // 공정상태를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.wethCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001219'), // 날씨를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.contents) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001220'), // 사고개요를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.occPtnClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001221'), // 대분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.occPtnMClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001222'), // 중분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.immCauseCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001223'), // 직접원인을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.indCauseCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001224'), // 간접원인을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.nearmiss.assMatCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001225'), // 가해물을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 사고관리 > 사고등록 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'accidentDetail') {
      if (!inputs.accident.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.accident.accidentTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001227'), // 사고명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.tempAccKindCds.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001213'), // 사고자구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.tempAccidentTypes.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001214'), // 사고종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.accident.accidentDateTime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001215'), // 발생일시를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.accident.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001216'), // 발생부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.accident.area) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001217'), // 발생장소를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.accident.weatherCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001219'), // 날씨를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.accident.contents) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001220'), // 사고개요를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 비상조치훈련 > 훈련 시나리오 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'trainingScenarioDetail') {
      if (!inputs.trainingScenario.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.trainingScenario.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000455'), // 부서를 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.trainingScenario.trainSceTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001105'), // 분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.trainingScenario.sceNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001228'), // 발의번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.trainingScenario.title) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001229'), // 제목을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 비상조치훈련 > 훈련 계획/일정 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'trainingPlan' || pageName === 'trainingResult') {
      if (!inputs.training.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001230'), // 훈련구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainYmd || inputs.training.trainYmd.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001231'), // 훈련일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainSTime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001232'), // 훈련시작시간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainETime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001233'), // 훈련종료시간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001234'), // 훈련주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainDeptNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001235'), // 훈련교관을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001236'), // 훈련명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainPlace) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001237'), // 훈련장소를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.trainContent) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001238'), // 훈련내용요약을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 비상조치훈련 > 훈련 시나리오 > 상세 > 불참자재훈련 (등록, 수정, 완료 공통)
    */
    if (pageName === 'absenteeReTraining') {
      if (!inputs.training.reTrainYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001231'), // 훈련일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.reTrainSTime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001232'), // 훈련시작시간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.reTrainETime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001233'), // 훈련종료시간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.training.reTrainPlace) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001239'), // 훈련장소를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 기준정보 > 인적피해 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'humanDamageDetail') {
      if (!inputs.codeMaster.code) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001240'), // 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeMaster.codeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001320'), // 인적피해명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 기준정보 > 원인(직접)명 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'immCauseDetail') {
      if (!inputs.codeMaster.code) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001240'), // 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeMaster.codeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001321'), // 원인(직접)명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 기준정보 > 원인(간점)명 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'indCauseDetail') {
      if (!inputs.codeMaster.code) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001240'), // 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeMaster.codeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001241'), // 원인(간접)명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 기준정보 > 발생형태 > 상세 및 신규등록 > 대분류 (등록, 수정 공통)
    */
    if (pageName === 'occurrFormAttDetail') {
      if (!inputs.codeMaster.code) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001240'), // 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeMaster.codeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001242'), // 대분류명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 기준정보 > 발생형태 > 상세 및 신규등록 > 중분류 (등록, 수정 공통)
    */
    if (pageName === 'occurrAtt') {
      if (!inputs.codeMaster.code) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001240'), // 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeMaster.codeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001243'), // 중분류명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 안전점검 > 연간안전점검일정 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkScheduleDetail' || pageName === 'checkScheduleDetailAppr') {
      if (!inputs.checkResult.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResult.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001244'), // 점검종류 상세를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResult.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001245'), // 점검주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResult.checkMasterTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001246'), // 점검(일정)명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 안전점검 > 안전점검계획 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkResultPlanDetail') {
      if (!inputs.checkResultDetail.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001244'), // 점검종류 상세를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001245'), // 점검주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.checkSchYmd || inputs.checkResultDetail.checkSchYmd.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001247'), // 점검예정일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.tgtDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000715'), // 점검대상부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.checkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001248'), // 세부점검계획을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.checkResult) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000708'), // 점검결과요약을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 안전점검 > 안전점검결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkResultDetail') {
      if (!inputs.checkResultDetail.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001244'), // 점검종류 상세를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.checkYmd || inputs.checkResultDetail.checkYmd.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001249'), // 점검일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001250'), // 점검주관부서를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.tgtDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001251'), // 점검대상부서를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.checkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001248'), // 세부점검계획을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkResultDetail.checkResult) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001252'), // 결과요약을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 순회점검 > 연간순회점검일정 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'patrolPlanbyYearDetail') {
      if (!inputs.patrolPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.patrolPlan.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001253'), // 순회주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.patrolPlan.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001244'), // 점검종류 상세를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.patrolPlan.title) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001254'), // 점검(일정)명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 순회점검 > 순회점검계획 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'patrolPlanDetail') {
      if (!inputs.checkPlanDetail.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001253'), // 순회주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001244'), // 점검종류 상세를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.checkSchYmd || inputs.checkPlanDetail.checkSchYmd.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001247'), // 점검예정일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.tgtClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001255'), // 순회대상을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.checkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001256'), // 세부점검계획을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 순회점검 > 순회점검결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'patrolResultDetail') {
      if (!inputs.checkPlanDetail.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001253'), // 순회주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001244'), // 점검종류 상세를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.checkYmd || inputs.checkPlanDetail.checkYmd.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001257'), // 순회일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.checkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001258'), // 순회명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkPlanDetail.tgtClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001255'), // 순회대상을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 설비점검 > 설비점검계획 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilChkPlanDetail' || pageName === 'facilChkPlanDetailAppr') {
      if (!inputs.facilChkPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilChkPlan.safCheckTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000712'), // 점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilChkPlan.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001259'), // 점검부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilChkPlan.safFacilChkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001260'), // 점검명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 설비점검 > 설비점검결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilChkResultDetail') {
      if (!inputs.facilChkPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilChkPlan.safCheckTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000712'), // 점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilChkPlan.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001259'), // 점검부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilChkPlan.safFacilChkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001261'), // 설비점검명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 설비점검 > 설비점검결과 > 상세 및 신규등록 > 결과탭
    */
    if (pageName === 'facilChkResultItem') {
      if (!inputs.safFacilChkResult.chkYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001262'), // 점검완료일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safFacilChkResult.chkResultCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001263'), // 점검결과를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safFacilChkResult.chkEndYn) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001264'), // 점검완료여부를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safFacilChkResult.chkResult) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000708'), // 점검결과요약을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 시설점검 > 연간시설점검일정 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilityInspectionScheduleDetail') {
      if (!inputs.facilityInspectionMaster.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionMaster.comFacilityCheckCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000712'), // 점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionMaster.comFacilityCheckTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001265'), // 일정명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionMaster.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001259'), // 점검부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 사고관리 > 아차사고 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilityInspectionPlanDetail') {
      if (!inputs.facilityInspectionSchedule.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionSchedule.comFacilityCheckCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000712'), // 점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionSchedule.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001259'), // 점검부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.sumName) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001266'), // 시설유형/시설명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 시설점검 > 시설점검결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilityInspectionResultDetail') {
      if (!inputs.facilityInspectionSchedule.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionSchedule.comFacilityCheckCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000712'), // 점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionSchedule.facilityCheckYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001249'), // 점검일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionSchedule.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001259'), // 점검부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.sumName) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001266'), // 시설유형/시설명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityInspectionSchedule.facilityCheckNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001260'), // 점검명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 가동전점검 > 가동전점검계획 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'inspBefOperPlanDetails') {
      if (!inputs.inspBefChkPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.inspBefChkPlan.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001259'), // 점검부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.inspBefChkPlan.safFacilChkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001267'), // 점검명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 가동전점검 > 가동전점검결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'inspBefOperResultDetail') {
      if (!inputs.preOperChkResult.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preOperChkResult.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001259'), // 점검부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preOperChkResult.safFacilChkTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001260'), // 점검명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 기준정보 > 안전점검종류 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkKindDetail') {
      if (!inputs.checkKind.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkKind.safCheckKindNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001268'), // 점검종류 상세를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkKind.chngKind) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000712'), // 점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 기준정보 > 안전점검 점검항목 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkItemDetail') {
      if (!inputs.checkItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkItem.safCheckKindNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001244'), // 점검종류 상세를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkItem.safCheckTypeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001269'), // 점검항목명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      안전 > 사고관리 > 아차사고 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilityCheckItemDetail') {
      if (!inputs.facilityCheckItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityCheckItem.safFacilityTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001270'), // 설비유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityCheckItem.safCheckTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001271'), // 설비점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityCheckItem.safFacilityCheckNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001272'), // 설비점검항목명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityCheckItem.sortOrder) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001273'), // 정렬순서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 기준정보 > 시설유형 점검항목 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilityTypeCheckItemDetail') {
      if (!inputs.facilityTypeCkItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityTypeCkItem.facilityTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001274'), // 시설유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityTypeCkItem.facilityCheckCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001275'), // 시설점검종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityTypeCkItem.facilityCheckItemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001276'), // 점검항목을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityTypeCkItem.sortOrder) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001277'), // 정렬순서를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      점검 > 기준정보 > 가동전점검항목 > 대,중,소분류 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'inspBefOperResultItemDetail') {
      if (!inputs.befOperationItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.befOperationItem.safCheckTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001278'), // 점검유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.befOperationItem.ppSafFacilityCheckNm && errors.has('ppSafFacilityCheckNm')) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001279'), // 대분류내용을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.befOperationItem.ppSafFacilityCheckNm && !inputs.befOperationItem.pSafFacilityCheckNm && errors.has('pSafFacilityCheckNm')) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001222'), // 중분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.befOperationItem.safFacilityCheckNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001280'), // 점검내용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 공정도 정보 > 공정설명서 > 공정설명서 탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'safAttachFileDialog') {
      if (!inputs.sheDouc.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001281'), // 공정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.sheDouc.docuTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001282'), // 문서명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 공정도 정보 > 공정설명서 > 인터락 작동조건 및 가동중지 탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'interLockDialog') {
      if (!inputs.interLock.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.interLock.interLockNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001283'), // 인터록번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.interLock.facilityNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001284'), // 대상설비를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 공정도 정보 > 공정흐름도(PFD) > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'diagramFileDialog') {
      if (!inputs.diagram.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.diagram.diagramNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001285'), // 도면번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.diagram.diagTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001286'), // 도면명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 건물 설비 배치도 > 안전시설정보 > 내화구조 명세 > 내화구조 명세 탭 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'fireProofsDialog') {
      if (!inputs.fireProofs.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fireProofs.category) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001287'), // 구분을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fireProofs.fireProofsNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001288'), // 내화설비 또는 지역을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fireProofs.fireProofPart) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001289'), // 내화부위를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fireProofs.testStnd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001290'), // 내화시험기준 및 시간을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 건물 설비 배치도 > 안전시설정보 > 소화설비 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'extingushingDialog') {
      if (!inputs.extingushing.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.extingushing.location) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001291'), // 설치지역을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 건물 설비 배치도 > 안전시설정보 > 화재탐지설비 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'fireDetectionDialog') {
      if (!inputs.fireDetection.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fireDetection.location) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001291'), // 설치지역을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 건물 설비 배치도 > 안전시설정보 > 가스누출감지 설비 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'gasDetectorDialog') {
      if (!inputs.gasDetector.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.gasDetector.mgrNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001292'), // 감지기번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.gasDetector.sensingObj) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001293'), // 감지대상을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 건물 설비 배치도 > 안전시설정보 > 세척시설/보호구 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'washupDialog') {
      if (!inputs.washup.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.washup.usage) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001294'), // 세안세척시설을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.washup.location) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001295'), // 안전보호장구 보관시설을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      공정안전자료 > 건물 설비 배치도 > 안전시설정보 > 국소배기장치 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'localVentilationDialog') {
      if (!inputs.localVentilation.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.localVentilation.source) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001296'), // 발생원을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.localVentilation.processNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001297'), // 공정또는작업장명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.localVentilation.inoutFlag) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001298'), // 실내외구분을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.localVentilation.harmfulType) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001299'), // 유해물질종류를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      변경관리 > 변경관리 > 변경발의 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'changeDetail') {
      if (!inputs.change.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.change.chngAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001300'), // 변경구문을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.change.prevMocLvlCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001301'), // 등급을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.change.bizNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001229'), // 제목을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.change.chngContents) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001302'), // 요청내용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }

      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      자체감사 > 계획 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'auditPlanDetail') {
      if (!inputs.safPsmAuditRslt.auditYear) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001303'), // 년도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safPsmAuditRslt.auditType) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001304'), // 감사종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.safPsmAuditRslt.period1.length === 0 || inputs.safPsmAuditRslt.period1[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001305'), // 대상기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.safPsmAuditRslt.period2.length === 0 || inputs.safPsmAuditRslt.period2[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001306'), // 감사기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safPsmAuditRslt.auditNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001307'), // 감사명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.safPsmAuditRslt.safPsmAuditRsltDepts.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001308'), // 대상부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      자체감사 > 감사범위 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'auditItemDetail') {
      if (!inputs.auditItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditItem.auditStdNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001309'), // 감사범위를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditItem.auditStdDesc) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001310'), // 감사기준을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditItem.convFactor) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001311'), // 환산계수를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditItem.chargeDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001312'), // 주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditItem.sortOrder) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001277'), // 정렬순서를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      자체감사 > 감사원관리 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'auditUserDetail') {
      if (!inputs.auditUser.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditUser.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001303'), // 년도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditUser.auditTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001313'), // 구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.auditUser.deptNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001314'), // 부서/감사원을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      위험성평가 > JSA > 평가계획 수립 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'assessPlanDetail') {
      if (!inputs.riskAssessPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.riskAssessPlan.assessTypeNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001315'), // 위험Matrix명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.riskAssessPlan.assessPriod === null || inputs.riskAssessPlan.assessPriod.length === 0 || inputs.riskAssessPlan.assessPriod[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001316'), // 평가기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.riskAssessPlan.userNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001317'), // 평가담당자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.riskAssessPlan.assessNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001318'), // 평가명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.riskAssessPlan.regRegdem) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001319'), // 정기/수시를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      위험성평가 > 기준정보 > JSA 작업단계 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'jobDetail') {
      if (!inputs.job.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.job.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000455'), // 부서를 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.job.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001281'), // 공정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.job.jobCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001322'), // 작업코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.job.jobNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001323'), // 작업명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.job.jobRevno) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001324'), // Rev No를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      위험성평가 > 기준정보 > JSA 유해위험요인 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'riskHazardDetail') {
      if (!inputs.riskHazard.priskHazardNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001325'), // 유해위험요인 분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.riskHazard.riskHazardNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001326'), // 유해위험요인을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      교육 > 교육계획및결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'eduPlan') {
      if (!inputs.eduMaster.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001327'), // 교육구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001328'), // 교육대분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001329'), // 교육분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.safEduCourseNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001330'), // 교육과정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.addUser) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001331'), // 교육담당자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001332'), // 교육명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduSYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001333'), // 교육시작일시(날짜)를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.startHour) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001334'), // 교육시작일시(시간)를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.startMinute) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001335'), // 교육시작일시(분)를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduEYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001336'), // 교육종료일시(날짜)를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.endHour) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001337'), // 교육종료일시(시간)를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.endMinute) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001338'), // 교육종료일시(분)를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduTimePlan) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001339'), // 교육시간을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduPlace) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001340'), // 교육장소를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduTeacher) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001341'), // 교육강사를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduContent) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001342'), // 교육내용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      교육 > 기준정보 > 교육문제등록 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'eduPlanExamAdd') {
      if (!inputs.eduMaster.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001328'), // 교육대분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.eduTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001329'), // 교육분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaster.safEduCourseNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001330'), // 교육과정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      교육 > 기준정보 > 과정별 교육자료 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'educationMaterialDetail') {
      if (!inputs.eduMaterial.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaterial.eduAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001328'), // 교육대분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaterial.eduTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001329'), // 교육분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaterial.safEduCourseNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001330'), // 교육과정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaterial.title) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001229'), // 제목을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduMaterial.contents) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001343'), // 내용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      교육 > 기준정보 > 교육과정관리 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'eduCourseDetail') {
      if (!inputs.safEduCourse.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safEduCourse.eduAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001328'), // 교육대분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safEduCourse.eduTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001329'), // 교육분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safEduCourse.eduCourseNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001344'), // 교육과정명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safEduCourse.lawEduTm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000261'), // 교육이수시간을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safEduCourse.studyTgt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001345'), // 학습목표를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.safEduCourse.studyContents) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001346'), // 주요학습내용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      교육 > 기준정보 > 교육대상자그룹 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'educationGroupDetail') {
      if (!inputs.eduGroup.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.eduGroup.grpNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001347'), // 그룹명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 검진 > 검진계획 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkupPlanDetail') {
      if (!inputs.checkupPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupPlan.heaCheckupClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001348'), // 검진종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupPlan.heaCheckupPlanNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001349'), // 검진 계획명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupPlan.period || inputs.checkupPlan.period.length === 0 || inputs.checkupPlan.period[0] == null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001350'), // 검진기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 검진 > 검진결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkupResultDetail') {
      if (!inputs.checkupResult.userNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001351'), // 성명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupResult.heaCheckedYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001352'), // 검진일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupResult.heaCheckupPlanNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001353'), // 검진계획을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupResult.heaCheckupOrgNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000407'), // 검진기관을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 작업환경측정 > 작업환경측정 계획 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'workMeasurePlanDetail') {
      if (!inputs.workMeasurePlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.workMeasurePlan.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001354'), // 측정년도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.workMeasurePlan.halfYearCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001355'), // 분기를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.workMeasurePlan.measDt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001356'), // 측정일자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.workMeasurePlan.measAgency) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001357'), // 측정기관을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.workMeasurePlan.measPlanNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001358'), // 측정계획명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 근골격계 > 조사계획등록 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'checkListDetailNew') {
      if (!inputs.muscResearch.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.muscResearch.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001303'), // 년도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.muscResearch.researchNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001359'), // 조사계획명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.muscResearch.periodTemp === null || inputs.muscResearch.periodTemp.length === 0 || inputs.muscResearch.periodTemp[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001360'), // 조사기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.muscResearch.muscResearchDepts.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001361'), // 조사대상부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 보호구관리 > 보호구 목록 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'speDetail') {
      if (!inputs.spe.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.spe.speKindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001362'), // 보호구 종류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.spe.speNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001363'), // 보호구명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.spe.giveUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.spe.unitCost) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001365'), // 단가를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.spe.giveCyclCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001366'), // 보호구 지급주기를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 기준정보 > 검진항목 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'envTestItemDetail') {
      if (!inputs.testItem.heaTestClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.testItem.heaTestItemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001367'), // 검진항목명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.testItem.heaResultTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001368'), // 결과타입을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 기준정보 > 검진기관 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'checkupOrgDetail') {
      if (!inputs.checkupOrgan.heaCheckupOrgNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001369'), // 검진기관명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupOrgan.businessNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001370'), // 사업자번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.checkupOrgan.telNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001371'), // 담당자 전화번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 기준정보 > 질환 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'diseaseDetail') {
      if (!inputs.disease.heaDiseaseClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001372'), // 질환종류명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disease.heaDiseaseNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001373'), // 질환명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      보건 > 기준정보 > 유해인자 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'hazardDetail') {
      if (!inputs.hazard.hazardClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001374'), // 유해인자 대분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.hazard.hazardGradCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001375'), // 유해인자 분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.hazard.hazardNmKo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001376'), // 유해인자명(한글)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 자가측정 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'selfMeasurementDetail') {
      if (!inputs.selfMeasure.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001377'), // 관리부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.eairOutletNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001378'), // 배출구를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.measureYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001356'), // 측정일자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.weatherCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001219'), // 날씨를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.temp) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001379'), // 온도를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.hum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001380'), // 습도(%)를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.airPress) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001381'), // 기압(mb)를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.windDir) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001382'), // 풍향(풍)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.windSpeed) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001383'), // 풍속(m/sec)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.selfMeasure.methodCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001384'), // 자가측정방법을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 기준정보 > 측정물질 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'testItemDetail') {
      if (!inputs.testItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001385'), // 검진검사를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.testItem.eairTestItemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001386'), // 검사항목명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.testItem.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 기준정보 > 배출구 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'outletDetail') {
      if (!inputs.outlet.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.mgDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001377'), // 관리부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.eairOutletNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001387'), // 배출구일련번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.mainDischFacNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001388'), // 배출구명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.eairOutletPermitNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001389'), // 배출구허가증상배출구번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.eairOutletDiam) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001390'), // 배출구직경(m)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.eairOutletHt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001391'), // 배출구높이(m)를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.airPerdCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001392'), // 측정횟수를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.outlet.preventFacExemYn) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001393'), // 방지시설면제여부를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 기준정보 > 연료 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'fuelDetail') {
      if (!inputs.fuel.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fuel.eairFuelNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001394'), // 연료명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fuel.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fuel.sulfurContent) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001395'), // 황함량(%)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fuel.calVal) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001396'), // 발열량을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.fuel.calValUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001397'), // 발열량단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 기준정보 > 원료 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'ingredientDetail') {
      if (!inputs.ingredient.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ingredient.eairIngrNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001398'), // 원료명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ingredient.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 기준정보 > 약품 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemBaseDetail') {
      if (!inputs.chemBase.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemBase.eairChemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001161'), // 약품명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemBase.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 시설관리 > 배출시설 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'dischargeDetail') {
      if (!inputs.discharge.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.discharge.mgDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001377'), // 관리부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.discharge.eairDischFacNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001399'), // 배출시설명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.discharge.mgrNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001400'), // 관리번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 시설관리 > 방지시설 > 기본정보탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'prevention') {
      if (!inputs.prevention.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.prevention.mgDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001377'), // 관리부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.prevention.eairPreventFacClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001401'), // 방지시설분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.prevention.eairPreventFacNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001402'), // 방지시설명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.prevention.eairPreventFacNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001403'), // 방지시설일련번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.prevention.eairPreventFacInhNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001404'), // 고유방지시설번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventChgHist.dispoCap) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001405'), // 처리용량(㎡/min)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventChgHist.dispoConc) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001406'), // 처리농도(mg/S㎥)를 해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventChgHist.dispoEff) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001407'), // 처리효율(%)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventChgHist.eairPolluCds) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001408'), // 처리오염물질을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 시설관리 > 방지시설 > 변경관리정보탭 > 상세 및 신규등록 (등록, 수정 공통)
    */
    if (pageName === 'preventChgHist') {
      if (!inputs.preventChgHist.startYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001409'), // 적용일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventChgHist.dispoCap) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001405'), // 처리용량(㎡/min)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventChgHist.dispoEff) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001407'), // 처리효율(%)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.preventChgHist.eairPolluCds.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001408'), // 처리오염물질을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventChgHist.endCause) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001410'), // 변경사유를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001408'), // 처리오염물질을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 시설관리 > 방지시설 > 보수관리정보탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'preventMaintHist') {
      if (!inputs.preventMaintHist.maintPeriod || inputs.preventMaintHist.maintPeriod.length === 0 || inputs.preventMaintHist.maintPeriod[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001411'), // 보수기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventMaintHist.worker) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001412'), // 보수자를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.preventMaintHist.remark) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001413'), // 보수명세를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 대기 > 시설관리 > 방지시설 > 활성탄교체탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'activatedCarbonChange') {
      if (!inputs.activatedCarbon.chngDate || inputs.activatedCarbon.chngDate.length === 0 || inputs.activatedCarbon.chngDate === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001414'), // 교체일자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.activatedCarbon.chngCost) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001415'), // 교체비용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.activatedCarbon.unitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 기준정보 > 공급수 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'supplyDetail') {
      if (!inputs.ewtrSupl.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrSupl.ewtrSuplClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001416'), // 공급수 분류명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrSupl.ewtrSuplNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001417'), // 공급수명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 기준정보 > 배출수 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'waterDischargeDetail') {
      if (!inputs.ewtrDisch.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrDisch.ewtrDischClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001418'), // 배출수분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrDisch.ewtrDischNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001419'), // 배출수명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 기준정보 > 검사항목 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'waterTestItemDetail') {
      if (!inputs.ewtrTestItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrTestItem.ewtrTestItemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001386'), // 검사항목명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrTestItem.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrTestItem.inputTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001313'), // 구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 기준정보 > 측정위치 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'monPosDetail') {
      if (!inputs.ewtrMonPos.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrMonPos.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001377'), // 관리부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrMonPos.ewtrMonPosNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001420'), // 측정위치명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrMonPos.wtrPerdCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001392'), // 측정횟수를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 기준정보 > 원료(첨가제) > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'waterIngredientDetail') {
      if (!inputs.ewtrIngr.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrIngr.ewtrIngrNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001398'), // 원료명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 기준정보 > 약품 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'waterChemBaseDetail') {
      if (!inputs.ewtrChem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrChem.ewtrChemCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001421'), // 약품일련번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrChem.ewtrChemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001161'), // 약품명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrChem.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 시설관리 > 클린센터관리 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'wasteBasicUnitDetail') {
      if (!inputs.wasteBasicUnitInfo.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteBasicUnitInfo.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001377'), // 관리부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteBasicUnitInfo.ewtrCleanFacClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001422'), // 시설분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteBasicUnitInfo.ewtrCleanFacNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001423'), // 시설명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteBasicUnitInfo.wtrChemRegCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001424'), // 약품사용여부를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 시설관리 > 오염방지시설 > 기본정보탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'ewtrPrevention') {
      if (!inputs.ewtrPreventFac.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPreventFac.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001377'), // 관리부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPreventFac.ewtrPreventFacNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001402'), // 방지시설명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPreventFac.ewtrDispoMtdCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001425'), // 오염처리방법을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPreventFac.ewtrCleanFacNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001426'), // 클린센터를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPreventFac.vol) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001427'), // 용량을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPreventFac.unitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001428'), // 용량 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 시설관리 > 오염방지시설 > 고장이력정보탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'preventBreakHist') {
      if (!inputs.starttime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001429'), // 고장발생일시를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.endtime) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001430'), // 조치완료일시를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 시설관리 > 전력량계 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'pwrMeterDetail') {
      if (!inputs.ewtrPwrMeter.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPwrMeter.ewtrPwrMeterNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001431'), // 전력량계명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPwrMeter.ewtrCleanFacNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001426'), // 클린센터를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrPwrMeter.pwrMeterMagn) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001432'), // 전력계배율을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 폐기물 > 처리요청 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'dispoRequestDetail') {
      if (!inputs.disposalRequest.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalRequest.ewstWasteNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001433'), // 폐기물을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalRequest.reqYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001434'), // 요청일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!(inputs.disposalRequest.reqDeptNm || inputs.disposalRequest.reqUserNm)) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001435'), // 요청자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalRequest.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 폐기물 > 처리결과 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'dispoResultDetail') {
      if (!inputs.disposalResult.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.dispoYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001436'), // 처리일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.ewstClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001437'), // 폐기물 분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.ewstWasteNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001433'), // 폐기물을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.ewstDispoDivCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001438'), // 처리구분을을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.ewstDispoMtdCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001439'), // 처리방법을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.amtLoaded) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001440'), // 계근중량을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.amtEmpty) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001441'), // 공차중량을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.amtGen) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001442'), // 처리량을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.envUnitCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001364'), // 단위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!(
        inputs.disposalResult.dispoDeptNm || inputs.disposalResult.dispoUserNm
      )) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001443'), // 처리담당자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.carrier) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001444'), // 운반자차량번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.vendorNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001445'), // 운반업체를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.freightNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001446'), // 처리업체를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.freightCost) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001447'), // 처리단가를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.disposalResult.freightCostSum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001448'), // 처리단가합계를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 폐기물 > 분배율 입력 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'dispoRateDetail') {
      if (!inputs.ingredient.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ingredient.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001449'), // 연도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ingredient.ewstClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001437'), // 폐기물 분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ingredient.ewstWasteNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001433'), // 폐기물을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 폐기물 > 기준정보 > 폐기물분류탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'wasteClassDetail') {
      if (!inputs.wasteClass.ewstClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001450'), // 폐기물분류코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteClass.ewstClassNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001451'), // 폐기물분류명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteClass.ewstDivCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001452'), // 폐기물구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 폐기물 > 기준정보 > 폐기물처리방법탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'wasteDispoMtdDetail') {
      if (!inputs.wasteDispoMtd.ewstDispoMtdCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001453'), // 처리방법코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteDispoMtd.ewstDispoMtdNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001454'), // 처리방법을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.wasteDispoMtd.ewstDispoClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001455'), // 처리분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 폐기물 > 기준정보 > 폐기물탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'wasteDetail') {
      if (!inputs.waste.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.waste.ewstClassCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001456'), // 폐기물분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.waste.ewstWasteNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001457'), // 폐기물명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.waste.ewstDispoMtdCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001439'), // 처리방법을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.waste.ewstPhaseCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001458'), // 성질/상태를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.waste.ewstDispoDivCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001459'), // 처리구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.waste.ewstDispoCyCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001460'), // 처리주기를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.waste.sapCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001461'), // ERP 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 온실가스 > 할당량 관리 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'allocMgtDetail') {
      if (!inputs.ghgAlloc.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgAlloc.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001462'), // 대상연도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 온실가스 > 배출량 거래이력 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'emsHisDetail') {
      if (!inputs.ghgEmstrHis.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgEmstrHis.trYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001463'), // 거래일자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgEmstrHis.trGubun) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001464'), // 거래구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgEmstrHis.trVendorNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001465'), // 거래업체를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgEmstrHis.trPlantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgEmstrHis.gubun) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001466'), // 구매/판매 구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 온실가스 > 기준정보 > 기초정보 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'dischargeActDetail') {
      if (!inputs.dischargeAct.disClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001467'), // 배출활동구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.dischargeAct.disActCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001468'), // 배출활동코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.dischargeAct.disActNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001469'), // 배출활동명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 온실가스 > 기준정보 > 온실가스 배출시설 등록 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'dischargeFacilityDetail') {
      if (!inputs.ghgFclt.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgFclt.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000455'), // 부서를 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgFclt.fcltNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001470'), // 배출시설명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgFclt.ghgFcltCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001471'), // 배출시설분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgFclt.ngmsFceqNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001472'), // NGMS시설일련번호를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ghgFclt.revisionNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001473'), // 개정번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 화학물질별 규제현황 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemDetail') {
      if (!inputs.chem.casNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001474'), // CAS No.를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chem.chemNmKr) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001475'), // 화학물질명(국문)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chem.chemNmEn) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001476'), // 화학물질명(영문)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }
    /*
      화학물질 > 사전검토 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'matCheckRequestDetail') {
      if (!inputs.matCheckRequest.sapMatCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001477'), // 자재번호를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.chemProdNmKr) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001478'), // 화학자재명(국문)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.chemProdNmEn) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001479'), // 화학자재명(영문)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.vendorNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001480'), // 납품업체/국가를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.makecpNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001481'), // 제조업체/국가를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.rqstType) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001482'), // 요청구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.property) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001483'), // 성상을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.bizCatCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001484'), // 사업구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.usageCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001485'), // 용도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.matCheckRequest.prodCatCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001486'), // 제품구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 화학자재 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemprodDetail') {
      if (!inputs.chemprod.chemProdNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001487'), // 자재/자재코드를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.vendorNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001488'), // 납품업체/코드를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.makerNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001489'), // 제조업체/코드를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001490'), // 대표사업장을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.property) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001483'), // 성상을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.bizCatCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001484'), // 사업구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.prodCatCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001486'), // 제품구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.usageCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001485'), // 용도를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.mixYn) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001491'), // 물질구성을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemprod.cfmMtdCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001492'), // 성분확인방법을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 부서공정별 화학자재 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'dpcDetail') {
      if (!inputs.deptProcessChemprod.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.deptProcessChemprod.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000455'), // 부서를 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.deptProcessChemprod.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001281'), // 공정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > MSDS > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'MSDSDetail') {
      if (!inputs.msds.chemProdNmKr) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001493'), // 화학자재명(국문)을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.msds.vendorNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001488'), // 납품업체/코드를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.msds.makecpNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001489'), // 제조업체/코드를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.msds.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.msds.writeDt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001494'), // MSDS작성일자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 시약관리 > 입출고 입력 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'reagentDispensingDetail') {
      if (!inputs.chmReagentInout.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chmReagentInout.inoutDt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001495'), // 입출고일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chmReagentInout.inoutFlag) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001496'), // 입출고구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chmReagentInout.labNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001497'), // 실험실을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chmReagentInout.chemProdNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001498'), // 시약을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chmReagentInout.inoutAmt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001499'), // 입고량을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chmReagentInout.unitNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001500'), // 단위를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 시약관리 > 실험실 목록 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'reagentLaboratoryDetail') {
      if (!inputs.chmReagentLab.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chmReagentLab.labNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001501'), // 실험실명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 인허가현황 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemicalOriginStatusDetail') {
      if (!inputs.permitProdHist.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.permitProdHist.permitClsNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001502'), // 인허가종류을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.permitProdHist.permitDt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001503'), // 신고일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.permitProdHist.revNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001473'), // 개정번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.permitProdHist.revContents) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001504'), // 개정내용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 공정자재관리요령 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemProcessManageDetail') {
      if (!inputs.processManage.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.processManage.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000455'), // 부서를 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.processManage.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001281'), // 공정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 기준정보 > 법규별 규제항목 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemicalRegulItemDetail') {
      if (!inputs.chemicalRegulItem.regulLawCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001505'), // 규제법규를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalRegulItem.regulItmNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001506'), // 규제항목명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalRegulItem.regulOrgCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001507'), // 기관을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 기준정보 > 인허가신고종류 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemicalPermitClsDetail') {
      if (!inputs.chemicalPermitCls.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalPermitCls.permitClsNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001508'), // 인허가신고명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalPermitCls.permitClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001509'), // 인허가신고코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalPermitCls.permitKindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001510'), // 인허가구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      화학물질 > 기준정보 > 물질단위관리 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'chemicalUnitDetail') {
      if (!inputs.chemicalUnit.unitNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001511'), // 단위명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      협력업체 관리 > 협력업체 관리 > 협력업체평가 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'subconEvalResultDetail') {
      if (!inputs.evalPeriod || inputs.evalPeriod.length === 0 || inputs.evalPeriod[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001316'), // 평가기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalResult.subconEvalClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001512'), // 평가구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalResult.subconEvalAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001513'), // 평가유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalResult.evalNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001514'), // 공사명/평가명을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalResult.vendorNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001515'), // 업체를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      협력업체 관리 > 협력업체 관리 > 협력업체평가 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'subconNoticeDetailView') {
      if (!inputs.subconNotice.kindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001516'), // 분류를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconNotice.vendorRgeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001517'), // 업체조회범위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.subconNotice.vendorRgeCd !== 'CVR01' && !inputs.subconNotice.vendorAttCds) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000830'), // 업체유형범위를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconNotice.title) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001518'), // 제목을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      협력업체 관리 > 기준정보 > 평가항목 관리 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'subconEvalItemDetail') {
      if (!inputs.subconEvalItem.subconEvalPlantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalItem.subconEvalClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001512'), // 평가구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalItem.subconEvalAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001513'), // 평가유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalItem.subconEvalItemPnt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001519'), // 배점을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.subconEvalItem.subconEvalItemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001520'), // 평가항목명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      기초정보 > 작업공정 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'processAddDetail') {
      if (!inputs.process.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001521'), // 공정코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.process.processNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001522'), // 공정을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      기초정보 > 설비 관리 > 설비마스터 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'createFacilityMst') {
      if (!inputs.facilityMst.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityMst.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001523'), // 관리부서을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityMst.processCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001281'), // 공정을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityMst.safFacilityTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001270'), // 설비유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityMst.safFacilityCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001524'), // 설비코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityMst.facilityNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001525'), // 설비명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      기초정보 > 설비 관리 > 설비유형 관리 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilityTypeDetail') {
      if (!inputs.facilityType.safFacilityTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001526'), // 설비유형코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityType.safFacilityTypeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001527'), // 설비유형명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      기초정보 > 설비 관리 > 설비유형별 세부항목 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'facilityTypeItemDetail') {
      if (!inputs.facilityTypeItem.safFacilityTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001270'), // 설비유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.facilityTypeItem.safFacilityTypeItemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001528'), // 세부항목명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      기초정보 > 협력업체 정보 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'vendorMasterDetail') {
      if (!inputs.chemicalVendorMaster.originCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001529'), // 국가를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalVendorMaster.vendorTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001530'), // 업체분류/유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalVendorMaster.vendorAttCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001530'), // 업체분류/유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalVendorMaster.vendorCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001531'), // 업체코드(SAP)를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalVendorMaster.vendorNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001532'), // 업체명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalVendorMaster.bizNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001370'), // 사업자번호를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.chemicalVendorMaster.portalId) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001533'), // 포털접속ID를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.chemicalVendorMaster.plantCds.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001534'), // 관련사업장을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 결재 > 결재선 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'apprLineDetail') {
      if (!inputs.appr.apprBizCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001535'), // 결재문서 유형코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.appr.bizNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001536'), // 업무명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.appr.apprUrl) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001537'), // 결재URL을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.appr.apprParameter) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001538'), // 결재 파라미터를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.appr.sortOrder) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001539'), // 정렬순서을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 공용코드 > 코드 도메인 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'codeDomainDetail') {
      if (!inputs.codeDomain.codeDomainCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001540'), // 코드도메인코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeDomain.codeDomainNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001541'), // 코드도메인명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 공용코드 > 코드 그룹 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'codeGroupDetail') {
      if (!inputs.codeGroup.codeDomainCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001542'), // 코드도메인을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeGroup.codeGroupCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001543'), // 코드그룹코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeGroup.codeGroupNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001544'), // 코드그룹명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 공용코드 > 코드 마스터 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'codeMasterDetail') {
      if (!inputs.codeMaster.codeGroupCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001545'), // 코드그룹을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeMaster.code) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001240'), // 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.codeMaster.codeNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001546'), // 코드명(KOR)을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 첨부파일 설정 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'attachSettingDetail') {
      if (!inputs.attachSetting.taskClassNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001547'), // 첨부파일구분을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.attachSetting.taskClassDesc) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001548'), // 첨부파일구분설명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.attachSetting.acceptExt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001549'), // 허용파일 확장자를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 로그관리 > 액션로그관리 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'impoAction') {
      if (!inputs.impoAction.servletPath) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001550'), // 경로를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.impoAction.crudCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001551'), // 유형을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 다국어관리 > 라벨관리 > 라벨타입관리탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'labelMst') {
      if (!inputs.lblMst.mstCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001552'), // 라벨타입 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lblMst.mstNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001553'), // 라벨타입 명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 다국어관리 > 라벨관리 > 라벨관리탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'labelDtl') {
      if (!inputs.lblDtl.mstCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001552'), // 라벨타입 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lblDtl.lblVal) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001554'), // 한국어를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 다국어관리 > 메시지 관리 > 메시지타입관리탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'msgMst') {
      if (!inputs.msgMst.mstCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001555'), // 메시지타입 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.msgMst.mstNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001556'), // 메시지타입 명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      시스템 > 다국어관리 > 메시지 관리 > 메시지관리탭 > 상세 및 신규등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'msgDtl') {
      if (!inputs.msgDtl.mstCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001555'), // 메시지타입 코드를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.msgDtl.msgVal) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001554'), // 한국어를 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 수질 > 운영일지 (등록, 수정, 완료 공통)
    */
    if (pageName === 'wtrOperationLogBase') {
      if (!inputs.ewtrOpLogResult.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrOpLogResult.ewtrCleanFacNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001426'), // 클린센터를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.ewtrOpLogResult.measureYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001557'), // 작성일자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      경영 > 법규/규정 > 입법예고법규 > 검토 > 상세보기 (등록, 수정, 완료 공통)
    */
    if (pageName === 'lawmakingCheckDetail') {
      if (!inputs.lawMakingCheck.checkRqstTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001558'), // 검토요청 제목을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lawMakingCheck.lawMakingCheckDepts || inputs.lawMakingCheck.lawMakingCheckDepts.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001558'), // 검토부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 환경영향평가 > 환경영향평가 목록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'envEffectEvalDetail') {
      if (!inputs.envEffectEval.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.envEffectEval.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001312'), // 주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.envEffectEval.evalGubun) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001512'), // 평가구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.envEffectEval.businessName) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001559'), // 사업명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.envEffectEval.period.length === 0 || inputs.envEffectEval.period[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001560'), // 사업기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.envEffectEval.businessContents) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001561'), // 사업내용을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      경영 > 법규/규정 > 법규준수평가 > 평가계획 (등록, 수정, 완료 공통)
    */
    if (pageName === 'lawComplAssessPlanDetail') {
      if (!inputs.lawComplAssessPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lawComplAssessPlan.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001312'), // 주관부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lawComplAssessPlan.assessPeriod) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001569'), // 평가주기를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lawComplAssessPlan.assessNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001318'), // 평가명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      if (inputs.lawComplAssessPlan.period.length === 0 || inputs.lawComplAssessPlan.period[0] === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001316'), // 평가기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      경영 > 법규/규정 > 법규준수평가 > 평가결과 (등록, 수정, 완료 공통)
    */
    if (pageName === 'lawComplAssessRsltDetail') {
      if (!inputs.lawComplAssessRslt.assessEmp) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001584'), // 평가자를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lawComplAssessRslt.assessDt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001585'), // 평가일을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      경영 > 법규/규정 > 법규준수평가 > 평가계획 > 신규등록 > 조문추가 > 조문등록 (등록, 수정, 완료 공통)
    */
    if (pageName === 'addJomun') {
      if (!inputs.addJomunInfo.lnameKor) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001576'), // 법령명/조문을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (!inputs.lawComplAssessPlanProv.assessDeptCd || inputs.lawComplAssessPlanProv.assessDeptCd.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001577'), // 평가부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      if (errors.any()) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001226'), // 필수입력값을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }

    /*
      환경 > 환경영향평가(신규) > 환경영향평가 계획 등록/수정
    */
    if (pageName === 'envEffectEvalPlan') {
      if (!inputs.evalPlan.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000066'), // 사업장을 선택하세요.
          type: 'warning',
        });
        return false;
      }
      else if (!inputs.evalPlan.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000725'), // 주관부서를 선택해 주세요.
          type: 'warning',
        });
        return false;
      }
      else if (!inputs.evalPlan.envEffEvalDivCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001512'), // 평가구분을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      else if (!inputs.evalPlan.evalYear) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001611'), // 평가년도를 선택하세요.
          type: 'warning',
        });
        return false;
      }
      else if (inputs.evalPlan.evalStartYmd == null || inputs.evalPlan.evalEndYmd == null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001316'), // 평가기간을 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      else if (!inputs.evalPlan.evalTitle) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001318'), // 평가명을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      else if (!inputs.evalPlan.tgtDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000001308'), // 대상부서를 선택해주세요.
          type: 'warning',
        });
        return false;
      }
      else if (!inputs.evalPlan.tgtProcessCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: comm.getLangSpecInfoMessage('M0000000454'), // 대상공정을 입력해주세요.
          type: 'warning',
        });
        return false;
      }
      return true;
    }


    return true;
  },
}

export default popupRequired;
