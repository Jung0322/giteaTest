<!--
  목적 : 트리 부서
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <div>
    <y-text
      :label="label"
      ui="bootstrap"
      :name="name"
      :required="required"
      :placeholder="placeholder"
      v-model="deptNm"
      :width="width"
      :editable="false"
      :treeCheck="searchEditable ? !editable || disabled : false"
      v-validate="'required'"
      :rowClass="rowClass"
      :state="state"
    >
      <el-popover
        v-if="editable"
        slot="customAppendIcon"
        placement="right"
        width="400"
        trigger="manual"
        v-model="popoverVisible"
      >
        <y-tree
          node-key="deptCd"
          label="deptNm"
          title="L0000001293"
          item-value="deptCd"
          item-text="deptNm"
          :value="value"
          :editable="false"
          :activated="popoverVisible"
          :treeData="deptTree"
          @nodeClick="searchNodeClick"
        />
        <el-button
          v-if="!disabled"
          icon="el-icon-search"
          circle
          slot="reference"
          size="mini"
          @click="searchDept"
        />
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="popoverVisible = false">{{
            $comm.getLangSpecInfoLabel('L0000000881')
          }}</el-button>
        </div>
      </el-popover>
      <el-button
        v-if="deptNm && !disabled && editable"
        icon="el-icon-close"
        circle
        slot="customAppendIcon"
        size="mini"
        @click.stop="removeSearchNode"
      />
      <span
        v-if="vDeptSubYn !== ''"
        slot="customAppendIcon"
        class="fontSize"
        style="padding-left: 5px; margin-left: 5px"
        >{{ deptSubYnText }}</span
      >
      <el-switch
        v-if="vDeptSubYn !== ''"
        v-model="vDeptSubYn"
        theme="bootstrap"
        slot="customAppendIcon"
        active-value="Y"
        inactive-value="N"
        @change="deptSubYnChange"
      ></el-switch>
    </y-text>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import YTree from '@/components/YTree';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-tree-dept',
  components: {
    'y-tree': YTree,
  },
  props: {
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'edit',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    // 라벨 텍스트
    label: {
      type: String,
      default: 'L0000001287', // 부서
    },
    // 사용 여부
    disabled: {
      type: Boolean,
      default: false,
    },
    // 사용 여부
    width: {
      type: Number,
      default: 8,
    },
    // veeValidate 유효성 검사
    state: {
      type: Boolean,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    plantCd: {
      type: String,
      default: '',
    },
    // 부서 권한에 상관없이 전체 부서 조회 가능하도록 하는 설정
    showAllDept: {
      type: Boolean,
      default: false,
    },
    deptSubYn: {
      // 하위부서포함 전달값
      type: String,
      default: null,
    },
    // b-row에 추가할 클래스
    rowClass: {
      type: String,
      default: 'mb-2',
    },
    // 상세 팝업에서 부서를 빈값으로 설정 (기본 상세팝업에서는 부서를 본인 부서로 지정)
    dtlNull: {
      type: Boolean,
      default: false,
    },
    // 조회시 treeCheck Editable
    searchEditable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      defaultData: [],
      deptTree: [],
      deptCd: '',
      deptNm: '',
      detptLvl: '',
      placeholder: '선택하세요',
      popoverVisible: false,
      beforePlantCd: '',
      roleAccess: false,
      vDeptSubYn: '', // 하위부서포함 내부값
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
    };
  },
  computed: {
    // 하위부서포함 값 변경시 타이틀 변경
    deptSubYnText() {
      if (this.vDeptSubYn === 'Y') {
        return this.$comm.getLangSpecInfoLabel('L0000003165') + ' ';
      }
      // 하위부서포함
      else return this.$comm.getLangSpecInfoLabel('L0000003414') + ' '; // 해당부서만
    },
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value() {
      /**
       * 200-02-09
       * 부서 권한 해제
       */
      if (
        this.deptCd !== this.$store.getters.deptCd &&
        this.value === this.$store.getters.deptCd
      ) {
        this.deptNm = this.$store.getters.deptNm;
      }

      this.deptCd = this.value;
      if (!this.deptCd) this.deptNm = null;
      // this.checkDefault();

      if (this.value !== this.$store.getters.deptCd) {
        this.getListBases(false);
      }
    },
    editable() {
      this.placeholder =
        this.type === 'edit'
          ? this.$comm.getLangSpecInfoLabel('L0000003394')
          : this.$comm.getLangSpecInfoLabel('L0000002519');
      if (!this.editable && this.type === 'edit') this.placeholder = '';
    },
    plantCd(_current, _prev) {
      this.getListBases(false);
      // this.checkDefault();
    },
    deptSubYn() {
      // 부모화면에서 설정된 값을 내부값에 할당
      this.vDeptSubYn = this.deptSubYn;
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());

    // 부모화면에서 설정된 값이 있을 경우 부모창의 값에 전달해 놓는다.(동기화)
    this.vDeptSubYn = this.deptSubYn === null ? '' : this.deptSubYn;
    this.$emit('setDeptSubYn', this.vDeptSubYn);

    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      this.placeholder =
        this.type === 'edit'
          ? this.$comm.getLangSpecInfoLabel('L0000003394')
          : this.$comm.getLangSpecInfoLabel('L0000002519');
      if (!this.editable && this.type === 'edit') this.placeholder = '';
      if (this.type === 'outlet') {
        this.placeholder = this.$comm.getLangSpecInfoLabel('L0000003413'); // '배출구를 선택하세요
      }

      if (this.value) {
        this.roleAccess = !(
          (this.$store.getters.deptAuthGrp &&
            this.$store.getters.deptAuthGrp.deptAccessYn === 'Y') ||
          this.showAllDept
        );
        // if ((this.$store.getters.deptAuthGrp && this.$store.getters.deptAuthGrp.deptAccessYn === 'Y') || this.showAllDept) {
        //   this.roleAccess = false; // false
        // } else {
        //   this.roleAccess = true;
        // }
      } else {
        // if (
        //   (!this.$store.getters.deptAuthGrp || this.$store.getters.deptAuthGrp.deptAccessYn === 'N') && !this.showAllDept ) {
        //   this.roleAccess = true;
        // } else if ((this.$store.getters.deptAuthGrp && this.$store.getters.deptAuthGrp.deptAccessYn === 'Y') || this.showAllDept) {
        //   this.roleAccess = false; // false
        // }
        this.roleAccess = !(
          (this.$store.getters.deptAuthGrp &&
            this.$store.getters.deptAuthGrp.deptAccessYn === 'Y') ||
          this.showAllDept
        );

        if (
          (this.$store.getters.deptAuthGrp &&
            this.$store.getters.deptAuthGrp.deptAccessYn === 'Y') ||
          this.showAllDept
        ) {
          if (this.type === 'edit') {
            this.$emit('input', this.$store.getters.deptCd);
            this.$emit('setDeptNm', this.$store.getters.deptNm);
          } else {
            this.$emit('input', null);
            this.$emit('setDeptNm', '');
          }
        } else if (
          (this.$store.getters.deptAuthGrp &&
            this.$store.getters.deptAuthGrp.deptAccessYn === 'N') ||
          !this.$store.getters.deptAuthGrp
        ) {
          this.$emit('input', this.$store.getters.deptCd);
          this.$emit('setDeptNm', this.$store.getters.deptNm);
        }
      }

      /**
       * 2022.03.11 LHJ
       * 상세 팝업에서 부서 컴포넌트의 기본 부서코드를 빈값으로 지정
       */
      if (this.dtlNull) {
        this.$emit('input', null);
        this.$emit('setDeptNm', '');
      }

      this.getListBases(false);
      // this.checkDefault();
    },
    searchDept(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.plantCd ? this.plantCd : this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.deptCd = data.dept.deptCd;
        this.deptNm = data.dept.deptNm;
        this.deptLvl = data.dept.deptLvl;
      }
      this.$emit('input', this.deptCd);
      this.$emit('setDeptNm', this.deptNm);
      this.$emit('setDeptLvl', this.deptLvl);
    },
    deptSubYnChange() {
      // 하위부서포함 switch 값이 변경될 경우 설정
      return this.$emit('setDeptSubYn', this.vDeptSubYn);
    },
    /**
     * 메뉴 tree 기초 정보 조회
     */
    getListBases(visible) {
      this.$http.url = selectConfig.manage.dept.treelist.url;
      this.$http.type = 'GET';
      if (this.$route.meta.plantAccess === 'APA02') {
        this.$http.param = {
          plantCd: this.$store.getters.plantCd,
        };
      } else if (!this.$comm.isStringEmpty(this.plantCd)) {
        this.$http.param = {
          plantCd: this.plantCd,
        };
      }

      this.$http.request(
        (_result) => {
          let tempComboITems = [];
          // 쓰기권환이 있으며 활성화 상태인 경우
          if (this.editable && !this.disabled) {
            // 사용여부가 Y인 것만 리스트에 표현한다.
            // default : 사용여부 상관없이 전체
            tempComboITems = this.$_.reject(_result.data, { useYn: 'N' });
          } else {
            tempComboITems = _result.data;
          }
          this.deptTree = this.convertTree(tempComboITems);
          this.defaultData = this.$_.clone(tempComboITems);
          if (this.value) {
            this.checkDefault();
          }
          this.popoverVisible = visible;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkDefault() {
      if (!this.defaultData || this.defaultData.length === 0) {
        // this.getListBases(false);
        return;
      }
      if (this.plantCd) {
        let checkData = this.$_.findIndex(this.defaultData, {
          plantCd: this.plantCd,
        });
        if (checkData === -1) {
          // this.getListBases(false);
          return;
        }
      }
      var data = null;
      if (this.value) {
        if (this.plantCd) {
          data = this.$_.find(this.defaultData, {
            plantCd: this.plantCd,
            deptCd: this.value,
          });
        } else {
          data = this.$_.find(this.defaultData, { deptCd: this.value });
        }
        if (!data) {
          this.deptCd = null;
          this.deptNm = null;
        } else {
          this.deptCd = data.deptCd;
          this.deptNm = data.deptNm;
        }
      }
      // else {
      //   this.deptCd = null;
      //   this.deptNm = null;
      // }
      this.$emit('input', this.deptCd);
      this.$emit('setDeptNm', this.deptNm);
    },
    /**
     * 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });
      return tree;
    },
    searchNodeClick(_node) {
      this.deptCd = _node.deptCd;
      this.deptNm = _node.deptNm;
      this.popoverVisible = false;
      this.$emit('input', this.deptCd);
      this.$emit('setDeptNm', this.deptNm);
    },
    removeSearchNode() {
      this.deptCd = null;
      this.deptNm = null;
      this.$emit('input', this.deptCd);
      this.$emit('setDeptNm', this.deptNm);
    },
    openDeptView() {
      if (this.beforePlantCd !== this.plantCd) {
        this.beforePlantCd = this.$_.clone(this.plantCd);
        this.getListBases(true);
      } else {
        this.popoverVisible = true;
      }
    },
  },
};
</script>
