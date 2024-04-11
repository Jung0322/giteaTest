<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div>
    <template>
      <el-dialog
        :title="label"
        :visible.sync="isOpen"
        :fullscreen="fullscreen"
        center
        @close="popupClose"
        >
        <div v-if="type === 'checkupUser'">
          <checkup-user 
            :isPopupOpen="isPopupOpen"
            ref="popupBody"
            :checkupPlanNo="childProps.checkupPlanNo"
            @selectionChanged="selectionChanged" 
          />
        </div>
        <div v-if="type === 'checkupResultConsent'">
          <checkup-result-consent 
            :isPopupOpen="isPopupOpen"
            ref="popupBody"
            :heaCheckupPlanNo="childProps.heaCheckupPlanNo"
            :heaCheckedOrgNo="childProps.heaCheckedOrgNo"
            @selectionChanged="selectionChanged" 
          />
        </div>
        <div v-if="type === 'menuSearch'">
          <menu-search
            :isPopupOpen="isPopupOpen"
            ref="popupBody"
            @selectionChanged="selectionChanged" />
        </div>
        <div v-if="type === 'passwordChange'">
          <password-change 
           :isPopupOpen="isPopupOpen"
            ref="popupBody" />
        </div>
        <!-- 기존에 만들어진 컴포넌트가 아닌 직접 바인딩 해야 할 경우 아래의 popupBody 슬롯에 추가 -->
        <slot name="popupBody"></slot>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="popupConfirm">{{$comm.getLangSpecInfoLabel(confirmButtonText)}}</el-button>
          <el-button @click="popupClose">{{$comm.getLangSpecInfoLabel(closeButtonText)}}</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
// TODO : 팝업 본문에 표현되어야 할 페이지를 아래와 같이 선언 후 components에 등록
import checkupUser from '@/pages/hea/checkup/checkupUser';
import checkupResultConsent from '@/pages/hea/user/checkupResultConsent';
import menuSearch from '@/pages/manage/menuManage/menuSearch';
import passwordChange from '@/pages/manage/userManage/passwordChange';

export default {
  /** attributes: name, components, props, data **/
  name: 'y-popup',  // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  components: {
    // 팝업 본문에 추가해야 할 컴포넌트 선언
    checkupUser,
    checkupResultConsent,
    menuSearch,
    passwordChange
  },
  props: {
    id: {
      type: String,
      default: 'popup'
    },
    name: {
      type: String
    },
    label: {  // 부모로 부터 받아온 라벨 정보
      type: String,
      default: 'Popup'
    },
    // 쓰기 권한 여부
    editable: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
    },
    isPopupOpen: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'lg'
    },
    // 팝업 본문 vue에 파라미터 전달할 속성
    childProps: {
      type: Object
    },
    // 팝업 사이즈
    fullscreen: {
      type: Boolean,
      default: true
    },
    confirmButtonText: {
      type: String,
      default: "L0000003321", // 확인
    },
    closeButtonText: {
      type: String,
      default: "L0000000881", // 닫기
    },
    getPopupDataFuncName: {
      type: String,
      default: ''
    }
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data () {
    return {
      popupData: {},  // 팝업에 관련된 정보
      isOpen:  false
    };
  },
  watch: {
    isPopupOpen () {
      this.isOpen = this.isPopupOpen;
    }
  },
  computed: {
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    this.init();
  },
  mounted () {
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.isOpen = this.isPopupOpen;
    });
  },
  beforeDestory () {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
    },
    /** /초기화 관련 함수 **/
    
    /** Call API service
    * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
    * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
    * ex) getExamData () {}
    * ex) getExamDatas () {}
    */

    /** /Call API service **/

     /** Component Events, Callbacks (버튼 제외) **/
     /**
      * 팝업에서 선택된 값이 변경되어 부모 창에 데이터를 보내기 위해
      * popupData에 정보를 담는다.
      */
     selectionChanged (_popupData) {
      this.popupData = _popupData;
    },
      /** /Component Events, Callbacks (버튼 제외) **/
    
    /** Button 관련 event **/
    /**
     * 팝업 창을 닫을 경우 처리
     */
    popupClose () {
      this.isOpen = false;
      window.getApp.$emit('POPUP_CLOSED');
    },
    /**
     * 팝업 창에서 부모 페이지로 정보 전달
     */
    popupConfirm () {
      if (this.getPopupDataFuncName && typeof this.$refs.popupBody[this.getPopupDataFuncName] === 'function') {
        this.popupData = this.$refs.popupBody[this.getPopupDataFuncName]();
      }
      window.getApp.$emit('POPUP_SEND_DATA', this.popupData);
      this.popupClose();
    }
    /** **/
   
    /** 기타 function **/
    /** /기타 function **/
  }
};
</script>