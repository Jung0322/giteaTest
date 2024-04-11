<!--
  목적 : 화학물질관리 > 시약관리 > 시약실험실 
  작성자 : kdh
  Detail : 시약실험실 정보 상세 등록/수정/조회 
  *
  examples:
  *
  -->
  <template>
  <b-container fluid>
    <!-- 시약실험실 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 시약실험실 상세 -->
            <y-label label="L0000001775" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="chmReagentLab"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!updateMode&&editable"
                :action-url="insertUrl"
                :param="chmReagentLab"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                filter="chm"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="chmReagentLab.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 실험실명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000001824"
                name="labNm"
                v-model="chmReagentLab.labNm"
                v-validate="'required'"
                :state="validateState('labNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리부서 -->
              <y-tree-dept
                :editable="editable"
                :disabled="false"
                label="L0000000591"
                name="deptCd"
                v-model="chmReagentLab.deptCd"
                :plantCd="chmReagentLab.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="chmReagentLab.useYn"
              />
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'reagent-laboratory-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        labNo: 0,
      },
    },
  },
  data() {
    return {
      chmReagentLab: {
        labNo: 0,
        labNm: '',
        labCd: '',
        deptNo: 0,
        deptCd: '',
        deptNm: '',
        plantCd: null,
        plantNm: '',
        useYn: 'Y',
        useYnNm: '사용',
        createUserId: '',
        updateUserId: '',
      },

      editable: false,
      updateMode: false,

      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.detailUrl = selectConfig.chm.chemicalReagentLab.get.url;
      this.checkUrl = selectConfig.chm.chemicalReagentLab.check.url;
      this.insertUrl = transactionConfig.chm.chemicalReagentLab.insert.url;
      this.editUrl = transactionConfig.chm.chemicalReagentLab.edit.url;

      if (this.popupParam.labNo) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.labNo);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.chmReagentLab = this.$_.clone(_result.data);
          this.labNo = this.chmReagentLab.labNo;
          this.updateMode = true;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeEdit() {
      this.checkValidator('edit');
    },
    beforeInsert() {
      this.checkValidator('insert');
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              labNm: this.chmReagentLab.labNm,
              labNo: flag === 'edit' ? this.labNo : '',
              plantCd: this.chmReagentLab.plantCd,
            };
            this.$http.request(
              _result => {
                var returnVal = this.showMessage(_result.data, flag);

                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.chmReagentLab.createUserId = this.$store.getters.token;
                      this.chmReagentLab.updateUserId = this.$store.getters.token;
                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'edit') this.isEdit = false;
                      else this.isInsert = false;
                    },
                  });
                }
              },
              _error => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check('reagentLaboratoryDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004', // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.updateMode = true;
      this.chmReagentLab.labNo = _result.data;
      this.labNo = this.chmReagentLab.labNo;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText = 'M0000000195'; // '이미 존재하는 실험실입니다.';
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>