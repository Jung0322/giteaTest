<!--
  목적 : 목표 등록/수정 팝업
  작성자 : mjpark
  Detail : 목표 상세,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label label="L0000005053" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="editable&&confirmMode&&updateMode&&!tDisabled&&!popupParam.apprFlag&&(companyEditable||(plantEditable&&this.mgtTargetPlan.plantCd===this.$store.getters.plantCd)||(deptEditable&&this.mgtTargetPlan.deptCd===this.$store.getters.deptCd))"
                :action-url="editUrl"
                :param="mgtTargetPlan"
                :is-submit="isConfirm"
                title="L0000003418"
                color="black"
                action-type="PUT"
                beforeSubmit = "beforeConfirm"
                @beforeConfirm="beforeConfirm"
                @btnClicked="btnConfirmClickedCallback" 
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="editable&&confirmMode&&(popupParam.apprFlag||!tDisabled)&&(popupParam.apprFlag||companyEditable||(plantEditable&&this.mgtTargetPlan.plantCd===this.$store.getters.plantCd)||(deptEditable&&this.mgtTargetPlan.deptCd===this.$store.getters.deptCd))"
                :action-url="insertUrl"
                :param="mgtTargetPlan"
                :is-submit="isInsert"
                title="L0000004986"
                color="orange"
                action-type="POST"
                beforeSubmit = "beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback" 
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="editable&&confirmMode&&updateMode&&(mgtTargetPlan.tstepCd === 'BAPSG' || !tDisabled)&&!popupParam.apprFlag&&(companyEditable||(plantEditable&&this.mgtTargetPlan.plantCd===this.$store.getters.plantCd)||(deptEditable&&this.mgtTargetPlan.deptCd===this.$store.getters.deptCd))"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback" 
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup" 
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :editable="editable&&insertMode"
                type="year"
                label="L0000004449"
                name="year"
                v-model="mgtTargetPlan.year"
                :required="true"
                v-validate="'required'"
                :state="validateState('year')"
              >
              </y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant v-if="this.popupParam.areaType === 'plant' || this.popupParam.areaType === 'dept'" type="edit" name="plantCd" :editable="insertMode" v-model="mgtTargetPlan.plantCd" :required="true"/>              
            </b-col>           
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3 mb-3">
              <!-- 조사대상부서 , 부서 추가 -->
              <y-tag-structure
                v-if="this.popupParam.areaType === 'dept'"
                :width="8"
                itemText="deptNm"
                itemValue="deptCd"
                label="L0000001287"
                :newLabelText="$comm.getLangSpecInfoLabel('L0000001300')"
                :editable="editable&&insertMode&&plantEditable"
                :required="true"
                v-validate="'required'"
                :name="'mgtTargetDepts'"
                v-model="mgtTargetPlan.mgtTargetDepts"
                :state="validateState('mgtTargetDepts')"
                @customNewTag="customNewTag()"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-textarea
                :width="10"
                :editable="editable&&(popupParam.apprFlag||!tDisabled)"
                :maxlength="300"
                :disabled="!confirmMode"
                :required="true"
                ui="bootstrap"
                label="L0000003774"
                name="target"
                v-model="mgtTargetPlan.target"
                v-validate="'required'"
                :state="validateState('target')"
                :rows="2" />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-textarea
                :width="10"
                :editable="editable&&(popupParam.apprFlag||!tDisabled)"
                :maxlength="300"
                :disabled="!confirmMode"
                :required="true"
                ui="bootstrap"
                label="L0000005049"
                name="policy"
                v-model="mgtTargetPlan.policy"
                v-validate="'required'"
                :state="validateState('policy')"
                :rows="2" />
            </b-col>
            <!-- <b-col sm="8"></b-col>
            <b-col sm="3">
              <y-number
                :width="6"
                :editable="editable"
                :maxlength="6"
                :hasSeperator="true"
                :pointNumber="3"
                :showMaxLength="false"
                ui="bootstrap"
                label="L0000005097"
                name="allInputVal"
                v-model="allInputVal"
              />                
            </b-col>           
            <b-col sm="1">
              <div slot="buttonGroup" class="float-right mb-1">                  
                <y-btn
                  title="L0000002482"
                  color="orange"
                  @btnClicked="btnAllInputValClickedCallback" 
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
            </b-col>   -->
          </b-row>
        </b-card>
        
        <!-- 탭 -->
        <b-row class="mt-3"></b-row>
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ item.title }}
            </span>
            <keep-alive>
              <component 
                :is="component"
                v-if="component"
                :mgtTargetItemPlan.sync="mgtTargetPlan"
                :allInputVal.sync="setAllInputVal"
                :apprFlag.sync="popupParam.apprFlag"
              />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'mgt-target-plan',
  props: {
    popupParam: {
      type: Object,
      default: {
        mgtTargetGrpNo: 0,
        apprFlag: false,
        areaType: null,
      },
    },
  },
  data () {
    return {
      mgtTargetPlan: {
        mgtTargetNo: 0,
        mgtTargetGrpNo: 0,
        year: '',
        plantCd: null,
        deptCd: null,
        target: '',
        policy: '',
        tstepCd: '',
        tapprRqstNo: 0,
        rstateCd: '',
        createUserId: '',
        createUserNm: '',
        createDeptCd: '',
        createDeptNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDeptCd: '',
        updateDeptNm: '',
        updateDt: '',
        planDataList: [],
        mgtTargetDepts: [],        
      },   
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '35%',
        top: '10px',
        param: {},
        closeCallback: null,
      },   
      tabItems: [],
      bizTgtYear: '',
      deptCd: '',
      component: null,
      tabIndex: 0,
      editable: true,
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      searchUrl: '',
      checkUrl: '',
      isConfirm: false,
      isInsert: false,
      isEdit: false,
      confirmMode: true,
      insertMode: true,
      updateMode: false,
      tDisabled: false,
      depts: [],      
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한 
      allInputVal: 0,
      setAllInputVal: 0,
    }
  },
  watch: {
    tabIndex () {
      this.loadComponent();
    },    
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.tabItems.push({ title: this.$comm.getLangSpecInfoLabel('L0000003774'), url: './mgtTargetItemPlan' });
    this.init();
  },
  mounted () {
    this.loadComponent();
    this.getDetail();
  },
  beforeDestroy () {
  },
  //* methods */
  methods: {
    init () {
      this.editable = this.$route.meta.editable;
      
      this.searchUrl = selectConfig.mgt.mgtTarget.mgtTarget.get.url;
      this.insertUrl = transactionConfig.mgt.mgtTarget.mgtTarget.insert.url;
      this.editUrl = transactionConfig.mgt.mgtTarget.mgtTarget.edit.url;
      this.deleteUrl = transactionConfig.mgt.mgtTarget.mgtTarget.delete.url;
      this.checkUrl = selectConfig.mgt.mgtTarget.mgtTarget.check.url;
    
      this.mgtTargetPlan.year = this.$comm.getThisYear();
      this.insertMode = true;
      this.updateMode = false;

      if (this.popupParam.areaType === 'plant')
      {
        this.mgtTargetPlan.plantCd = this.$store.getters.plantCd;
      }
      if (this.popupParam.areaType === 'dept')
      {
        this.mgtTargetPlan.mgtTargetDepts = [];
        this.depts = [];      
        this.depts.push({ deptCd: this.$store.getters.deptCd, deptNm: this.$store.getters.deptNm });
        this.mgtTargetPlan.mgtTargetDepts = this.depts;
        this.mgtTargetPlan.deptCd = this.$store.getters.deptCd;
      }

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) // 전사권한
      {
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      }
      else if (this.$comm.isPlantGrp()) // 사업장권한
      {
        this.plantEditable = true;
        this.deptEditable = true;
      }
      else // 일반권한
      {
        this.deptEditable = true;
      }   
    },
    loadComponent () {
      var path = this.tabItems[this.tabIndex].url;
      
      if (path === 'fileUploadPage') this.component = () => import('@/pages/saf/imprAct/fileUploadPage');
      else this.component = () => import(`${path}`);
    },    
    getDetail () {      
      if (this.popupParam.mgtTargetGrpNo > 0)
      {
        this.mgtTargetPlan.mgtTargetGrpNo = this.popupParam.mgtTargetGrpNo;
      }  

      this.$http.url = this.$format(this.searchUrl, this.mgtTargetPlan.mgtTargetGrpNo);   
      this.$http.type = 'get';
      this.$http.request((_result) => {        
        if (_result.data.mgtTargetGrpNo > 0) {    
          this.mgtTargetPlan.mgtTargetDepts = [];
          this.depts = [];      
          this.mgtTargetPlan = _result.data;

          if (_result.data.deptCd !== null)
          {
            for (let i in _result.data.deptCd.split(','))
            {
              this.depts.push({ deptCd: _result.data.deptCd.split(',')[i], deptNm: _result.data.deptNm.split(',')[i] });
            }  
          }

          this.mgtTargetPlan.mgtTargetDepts = this.depts;
          this.insertMode = false;
          this.updateMode = true;
        }
        else
        {
          this.mgtTargetPlan.mgtTargetGrpNo = 0;
          this.mgtTargetPlan.target = '';
          this.mgtTargetPlan.policy = '';
          this.mgtTargetPlan.tstepCd = '';

          this.insertMode = true;
          this.updateMode = false;          
        }

        this.tDisabled = false;

        if (this.mgtTargetPlan.tstepCd === 'BAPSA' || this.mgtTargetPlan.tstepCd === 'BAPSG')
        {
          this.tDisabled = true;
        }
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.');
      });
    },
    validateState (ref) {
      if (this.veeBag[ref] && (this.veeBag[ref].dirty || this.veeBag[ref].validated)) {
        return !this.errors.has(ref);
      }
      return null;
    },

    /** button 관련 이벤트 **/
    beforeInsert () {
      console.log(this.mgtTargetPlan)
      this.$validator.validateAll().then((_result) => {
        if ((this.popupParam.areaType === 'plant' || this.popupParam.areaType === 'dept') && !this.mgtTargetPlan.plantCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', /* 안내 */
            message: 'M0000000863', // 사업장을 선택해주세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        }
        if (this.popupParam.areaType === 'dept' && this.mgtTargetPlan.mgtTargetDepts.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000001087', // 부서를 선택해주세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        }

        if (_result) {
          this.mgtTargetPlan.deptCd = null;
          for (let i in this.mgtTargetPlan.mgtTargetDepts)
          {
            this.mgtTargetPlan.deptCd += ',' + this.mgtTargetPlan.mgtTargetDepts[i].deptCd;
          }  
          
          if (this.mgtTargetPlan.deptCd !== null)
          {
            this.mgtTargetPlan.deptCd = this.mgtTargetPlan.deptCd.replace('null,', '');
          } 

          this.$http.url = this.checkUrl;
          this.$http.type = 'GET';
          this.$http.param = {
            year: this.mgtTargetPlan.year,
            plantCd: this.mgtTargetPlan.plantCd,
            deptCd: this.mgtTargetPlan.deptCd,
          };
          this.$http.request(
            _result => {
              if (_result.data.length > 0 && this.mgtTargetPlan.mgtTargetGrpNo === 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'L0000005052', // '이미 같은 목표가 있습니다.',
                  type: 'warning',
                });
                return;
              } else {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321',
                  message: 'M0000000011',
                  type: 'info',
                  confirmCallback: () => {  
                    this.mgtTargetPlan.deptCd = null;
                    for (let i in this.mgtTargetPlan.mgtTargetDepts)
                    {
                      this.mgtTargetPlan.deptCd += ',' + this.mgtTargetPlan.mgtTargetDepts[i].deptCd;
                    }  
                    
                    if (this.mgtTargetPlan.deptCd !== null)
                    {
                      this.mgtTargetPlan.deptCd = this.mgtTargetPlan.deptCd.replace('null,', '');
                    } 

                    this.mgtTargetPlan.createUserId = this.$store.getters.token;
                    this.mgtTargetPlan.createUserNm = this.$store.getters.name;
                    this.mgtTargetPlan.createDeptCd = this.$store.getters.deptCd;
                    this.mgtTargetPlan.createDeptNm = this.$store.getters.deptNm;
                    this.mgtTargetPlan.updateUserId = this.$store.getters.token;
                    this.mgtTargetPlan.updateUserNm = this.$store.getters.name;
                    this.mgtTargetPlan.updateDeptCd = this.$store.getters.deptCd;
                    this.mgtTargetPlan.updateDeptNm = this.$store.getters.deptNm;
                    this.isInsert = true;
                  },
                });
              }
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
        else {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
            type: 'warning',
          });
        }
      }).catch(() => {
        window.getApp.$emit('APP_VALID_ERROR', '유효성 검사도중 에러가 발생하였습니다.');
      });
    },    
    beforeConfirm() {
      this.$validator.validateAll().then((_result) => {
        if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321',
            message: 'M0000000718',
            // 결재요청 전 저장됩니다. 진행하시겠습니까?
            type: 'info', // success / info / warning / error

            confirmCallback: () => {
              this.mgtTargetPlan.createUserId = this.$store.getters.token;
              this.mgtTargetPlan.updateUserId = this.$store.getters.token;
              this.$http.url = this.insertUrl;
              this.$http.type = 'POST';
              this.$http.param = this.mgtTargetPlan;
              this.$http.request(
                (_result) => {
                  this.popupOptions.target = () =>
                    import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
                  this.popupOptions.title = 'L0000003418'; // 결재요청
                  this.popupOptions.visible = true;
                  this.popupOptions.closeCallback = this.closeApprPop;
                  this.popupOptions.width = '80%';
                  this.popupOptions.param = {
                    apprBizCd: 'MG-MI-06',
                    apprRqstNo: this.mgtTargetPlan.tapprRqstNo,
                    apprParams: {
                      mgtTargetGrpNo: this.mgtTargetPlan.mgtTargetGrpNo,
                    },
                  };
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            },
          });
        }
        else
        {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
            type: 'warning',
          });
        }
      }).catch(() => {
        window.getApp.$emit('APP_VALID_ERROR', '유효성 검사도중 에러가 발생하였습니다.');
      });
    },
    btnInsertClickedCallback (_result) {      
      this.mgtTargetPlan.mgtTargetGrpNo = _result.data;
      this.insertMode = false;
      this.updateMode = true;
      this.isInsert = false;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',  // success / info / warning / error
      });
      this.getDetail();
    },
    btnConfirmClickedCallback (_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000802',
        type: 'success',  // success / info / warning / error
      });
      this.confirmMode = false;
      this.isConfirm = false;
      this.getDetail();
    },    
    btnDeleteClickedCallback (_result) {
      if (this.mgtTargetPlan.rstateCd !== '' && this.mgtTargetPlan.rstateCd !== 'STATE1')
      {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005756',
          type: 'warning',  // success / info / warning / error
        });
      }
      else
      {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003395',
          message: 'M0000000012',
          type: 'info',  
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.$format(this.deleteUrl, this.mgtTargetPlan.mgtTargetGrpNo);
            this.$http.type = 'DELETE';
            this.$http.request((_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007',
                type: 'success',
              });
              this.closePopup();
            }, (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            });
          },
        });
      }
    },
    btnAllInputValClickedCallback (_result) {     
      this.setAllInputVal = this.allInputVal;
    }, 
    btnClickedErrorCallback (_result) {
      this.$emit('APP_REQUEST_ERROR', _result);
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
    },
    /** end button 관련 이벤트 **/
    closePopup (data) {
      this.$emit('closePopup', {});
    },
    customNewTag() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        multiple: true,
        isSubDeptSelection: true,
        plantCd: this.mgtTargetPlan.plantCd,
        plantEditable: false,
      };

      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      
      if (data.length !== undefined) {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.mgtTargetPlan.mgtTargetDepts, {
              deptCd: item.deptCd,
              deptNm: item.deptNm,
            }) === -1
          ) {
            this.mgtTargetPlan.mgtTargetDepts.push(item);
          }
        });
      }
    },
  }
};
</script>