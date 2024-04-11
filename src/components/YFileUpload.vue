<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  * 속성
  multiple : 여러 파일 업로드가 허용되는지 여부
  limit: 허용되는 최대 업로드 수    
  </template>
  examples:
  *
  -->
<template>
  <span>
    <b-card
      ref="card"
      :class="{ 'text-center': textAlign === 'center' ? true : false }"
      v-show="attachSetting.useYn == 'Y'"
    >
      <b-row>
        <b-col sm="12" class="text-left">
          <!-- 첨부파일 확장자
          <y-label v-if="editable" :label="information" />
          <y-label v-else :label="label" />
          -->
          <y-label :label="showLabel" />
        </b-col>
        <!-- 업로드 컴포넌트 영역 -->
        <b-col :sm="dragUploaderWidth" class="text-left">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeader"
            :data="attachFileGrp"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="onSuccess"
            :on-change="change"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :drag="drag"
            :disabled="disabled"
            ref="upload"
            :name="name"
            :list-type="listType"
            :multiple="attachSetting.multiple"
            :limit="attachSetting.limitCnt"
            :accept="attachSetting.viewAcceptExt"
          >
            <i class="el-icon-upload" v-if="drag"></i>
            <div class="el-upload__text" v-if="drag">
              <!-- 파일을 끌어 놓거나 -->
              {{ $comm.getLangSpecInfoLabel('L0000003031') }}
              <em>
                <!-- 클릭하여 업로드 -->
                {{ $comm.getLangSpecInfoLabel('L0000003625') }}
              </em>
            </div>
            <el-button
              v-if="
                editable &&
                !drag &&
                !disabled &&
                ((!attachSetting.multiple &&
                  uploadedList.length <= attachSetting.limitCnt) ||
                  (attachSetting.multiple &&
                    uploadedList.length < attachSetting.limitCnt))
              "
              slot="trigger"
              size="small"
              type="primary"
            >
              <!-- 파일선택 -->
              {{ $comm.getLangSpecInfoLabel('L0000003028') }}
            </el-button>

            <div class="el-upload__tip" slot="tip">
              <el-button
                v-if="haveImage && imageFiles && imageFiles.length > 0"
                slot="trigger"
                size="small"
                type="primary"
                @click="allImagePreview"
              >
                <!-- 전체 이미지 미리보기 -->
                {{ $comm.getLangSpecInfoLabel('L0000002523') }}
              </el-button>

              <el-button
                v-if="showUploadBtn && !onlyDownload"
                size="small"
                type="success"
                @click="submitUpload"
              >
                <!-- 저장 -->
                {{ $comm.getLangSpecInfoLabel('L0000002474') }}
              </el-button>
              <!-- <span>jpg/png files with a size less than 500kb</span> -->
            </div>
          </el-upload>
        </b-col>
        <!-- /업로드 컴포넌트 영역 -->

        <!-- 외부 파일 표시 영역 -->
        <b-col :sm="uplodatedAreaWidth">
          <!-- 이미지 미리 보기 영역의 스크롤 때문에 padding 처리 -->
          <b-row style="padding-right: 5px">
            <b-col
              v-if="uploadedOtherList && uploadedOtherList.length > 0"
              sm="12"
            >
              <div
                v-for="(item, i) in uploadedOtherList"
                :key="String(i)"
                class="ui-bordered text-left el-upload-list__item"
              >
                <ul class="el-upload-list el-upload-list--text">
                  <li :tabindex="i" class="el-upload-list__item is-success">
                    <a class="el-upload-list__item-name">
                      <i class="el-icon-paperclip"></i>
                      {{ item.fileOrgNm }} ({{
                        getFileSizeTextByRound(item.fileSize)
                      }})
                    </a>
                    <label
                      class="el-upload-list__item-status-label_xxxx"
                      style="
                        position: absolute !important;
                        right: 5px !important;
                        top: 0 !important;
                        line-height: inherit !important;
                        display: block !important;
                      "
                    >
                      <el-button
                        type="success"
                        plain
                        @click.prevent="onDocumentDownload(item)"
                        icon="el-icon-download"
                        size="mini"
                        circle
                      ></el-button>
                      <el-button
                        v-if="editable && !onlyDownload"
                        type="danger"
                        plain
                        @click.prevent="onDeleteOtherFileList(item)"
                        icon="el-icon-delete-solid"
                        size="mini"
                        circle
                      ></el-button>
                    </label>
                  </li>
                </ul>
              </div>
            </b-col>
            <!-- /외부 파일 표시 영역 -->

            <b-card-body
              v-if="
                isCoverImage &&
                haveImage &&
                imageFiles &&
                imageFiles.length > 0 &&
                coverImageUrl !== ''
              "
            >
              <b-img-lazy
                :src="coverImageUrl"
                style="height: 150px"
              ></b-img-lazy>
            </b-card-body>

            <!-- 첨부 파일 표시 영역 -->
            <b-col
              v-if="uploadedList && uploadedList.length > 0"
              sm="12"
              style="max-height: 180px; overflow-y: auto; padding-right: 5px"
            >
              <!-- <div
                v-for="(item, i) in uploadedList"
                :key="i"
                class="ui-bordered text-left el-upload-list__item"
              >-->
              <b-row
                v-for="(item, i) in uploadedList"
                :key="i"
                align-v="center"
                class="text-left border"
                style="padding: 5px 0px 0px 0px; margin: 5px 0px 5px 0px"
              >
                <b-col v-if="attachFileGrp.preview" sm="2" class="text-center">
                  <el-image
                    v-if="item.imgUrl"
                    :src="item.imgUrl ? item.imgUrl : item.filePath"
                    style="width: 70px; height: 70px; cursor: pointer"
                    fit="scale-down"
                    @click="showImageViewer(i)"
                  />
                </b-col>
                <b-col :sm="fileAreaWidth">
                  <b-row style="margin-bottom: 5px">
                    <b-col sm="8">
                      <a
                        @click="handlePreview(item)"
                        class="el-upload-list__item-name"
                      >
                        <i class="el-icon-document"></i>
                        {{ item.fileOrgNm }} ({{
                          getFileSizeTextByRound(item.fileSize)
                        }})
                      </a>
                    </b-col>
                    <b-col sm="4" class="text-right">
                      <el-button
                        type="success"
                        plain
                        @click.prevent="onDocumentDownload(item)"
                        icon="el-icon-download"
                        size="mini"
                        circle
                      ></el-button>
                      <el-button
                        v-if="editable && !onlyDownload"
                        type="danger"
                        plain
                        @click.prevent="onDeleteFile(item)"
                        icon="el-icon-delete-solid"
                        size="mini"
                        circle
                      ></el-button>
                    </b-col>
                  </b-row>
                  <b-row v-if="attachFileGrp.isPictureExplan">
                    <b-col sm="12">
                      <!-- 설명 -->
                      <y-text
                        label="L0000001578"
                        v-model="item.pictureExplan"
                        :editable="editable"
                        :disabled="disabled"
                        :width="11"
                        @change="updatePictureExplain"
                      ></y-text>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <!-- <el-image
                  v-if="attachFileGrp.preview"
                  :src="item.imgUrl"
                  style="display:block; width: 50px; height: 50px"
                  fit="scale-down"
                />

                <ul class="el-upload-list el-upload-list--text">
                  <li :tabindex="i" class="el-upload-list__item is-success">
                    <a @click="handlePreview(item)" class="el-upload-list__item-name">
                      <i class="el-icon-document"></i>
                      {{ item.fileOrgNm }} ({{
                      getFileSizeTextByRound(item.fileSize)
                      }})
                    </a>
                    <label
                      class="el-upload-list__item-status-label_xxxx"
                      style="position: absolute !important;right: 5px !important;top: 0 !important;line-height: inherit !important;display: block !important;"
                    >
                      <el-button
                        type="success"
                        plain
                        @click.prevent="onDocumentDownload(item)"
                        icon="el-icon-download"
                        size="mini"
                        circle
                      ></el-button>
                      <el-button
                        v-if="editable && !onlyDownload"
                        type="danger"
                        plain
                        @click.prevent="onDeleteFile(item)"
                        icon="el-icon-delete-solid"
                        size="mini"
                        circle
                      ></el-button>
                    </label>
                  </li>
                  <li>
                    <y-text label="설명" v-model="item.pictureExplan" :width="10"></y-text>
                  </li>
              </ul>-->
              <!-- </div> -->
            </b-col>
          </b-row>
        </b-col>
        <!-- /첨부 파일 표시 영역 -->
        <!-- <b-col sm="12">
          <y-textarea
            v-if="attachFileGrp.isPictureExplan"
            :width="10"
            :editable="!attachFileGrp.disabled && attachFileGrp.editable"
            :maxlength="150"
            ui="bootstrap"
            label="설명"
            v-model="attachFileGrp.pictureExplan"
          ></y-textarea>
        </b-col>-->
      </b-row>
      <!-- 사용안함 -->
      <div
        v-if="1 === 2 && attachSetting.multiple && uploadedList.length > 0"
        class="text-right mt-1"
      >
        <!-- 전체 다운로드 -->
        <y-btn
          title="L0000003626"
          size="small"
          @btnClicked="zipDownload"
          @btnClickedErrorCallback="btnClickedErrorCallback"
        />
        <!-- 전체 삭제 -->
        <y-btn
          v-if="editable"
          title="L0000003627"
          color="orange"
          size="small"
          @btnClicked="removeAllFiles"
        />
      </div>
    </b-card>
    <b-card v-show="attachSetting.useYn != 'Y'">
      <b-row>
        <b-col>
          <!-- ※ 첨부파일 기능을 사용하지 않도록 설정되어있습니다. 관리자에게 문의하세요. -->
          {{ $comm.getLangSpecInfoLabel('L0000003628') }}
          <span style="color: red; font-weight: bold">{{
            attachSetting.taskClassDesc
          }}</span>
        </b-col>
      </b-row>
    </b-card>

    <!-- 파일 뷰어 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="isFullScreen"
      :append-to-body="true"
      :show-close="false"
      top="10px"
    >
      <span slot="title" class="custom-dialog-title"
        >{{ $comm.getLangSpecInfoLabel('L0000003629')
        }}<!-- 첨부파일 확인 -->
        <div>
          <el-button
            icon="el-icon-close"
            circle
            size="mini"
            @click="closeDialog(false)"
          />
        </div>
        <div>
          <el-button
            icon="el-icon-full-screen"
            circle
            size="large"
            style="font-size: 20px !important; color: white; margin-right: 10px"
            @click="resize"
          />
        </div>
      </span>
      <b-img-lazy :src="dialogImageUrl" v-bind="mainProps"></b-img-lazy>
    </el-dialog>
    <el-dialog
      ref="allImage"
      top="10px"
      :visible.sync="allImageDialogVisible"
      :fullscreen="isFullScreen"
      :append-to-body="true"
      :show-close="false"
    >
      <span slot="title" class="custom-dialog-title"
        >{{ $comm.getLangSpecInfoLabel('L0000003629')
        }}<!-- 첨부파일 확인 -->
        <div>
          <el-button
            icon="el-icon-close"
            circle
            size="mini"
            @click="closeDialog(true)"
          />
        </div>
        <div>
          <el-button
            icon="el-icon-full-screen"
            circle
            size="large"
            style="font-size: 20px !important; color: white; margin-right: 10px"
            @click="resize"
          />
        </div>
      </span>
      <y-image-viewer
        :files="imageFiles"
        image-url-attribute-name="imgUrl"
        :image-max-height="500"
        :attachFileGrp="attachFileGrp"
      ></y-image-viewer>
    </el-dialog>
    <!-- /파일 뷰어 -->
  </span>
</template>

<script>
import axios from 'axios';
import backendConfig from '@/js/backendConfig.js';
import selectConfig from '@/js/selectConfig.js';
import transactionConfig from '@/js/transactionConfig.js';
import { getAccessToken } from '@/utils/auth';

let appMainWidth = 0;
const uploadImageWidth = 360;

export default {
  /** attributes: name, components, props, data **/
  name: 'y-file-upload',
  props: {
    name: {
      type: String,
      default: 'files',
    },
    label: {
      // 부모로 부터 받아온 라벨 정보
      type: String,
      default: 'L0000003030', // 파일업로드
    },
    // 쓰기 권한 여부
    editable: {
      type: Boolean,
      default: true,
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12,
    },
    size: {
      type: String,
      default: 'sm',
    },
    // 첨부파일 그룹 정보
    attachFileGrp: {
      type: Object,
      required: true,
    },

    // 설정정보를 수동으로 할지 여부
    manualSetting: {
      type: Boolean,
      default: false,
    },
    // 업로드 파일 제한
    limit: {
      type: Number,
      default: 999,
    },
    // 업로드 용량 제한(단위: MB)
    uploadLimitSize: {
      type: Number,
      default: 20,
    },
    // drag: {
    //   type: Boolean,
    //   default: true,
    // },
    showUploadBtn: {
      type: Boolean,
      default: true,
    },
    // 업로드파일 다중선택 가능여부
    multiple: {
      type: Boolean,
      default: true,
    },
    // 허용 확장자
    accept: {
      type: String,
      default: 'txt,xls,xlsx,ppt,pptx,doc,docx,pdf,png,gif,jpg,jpeg,PNG',
    },
    // 미리보기
    preview: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: 'M0000000040', // 파일업로드가 정상적으로 처리되었습니다.
    },
    tempDelete: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onlyDownload: {
      type: Boolean,
      default: false,
    },
    uploadTempFiles: {
      type: Object,
    },
    listType: {
      type: String,
      default: 'picture',
    },
    showFileSearch: {
      type: Boolean,
      default: false,
    },
    textAlign: {
      type: String,
      default: 'center',
    },
    loadOtherFileGrps: {
      type: Array,
    },
    refresh: {
      type: Boolean,
      default: false,
    },
    // 설명작성가능여부
    isPictureExplan: {
      type: Boolean,
      default: false,
    },
    // 설명내용
    pictureExplan: {
      type: String,
      default: '',
    },
    isUpdatePictureExplain: {
      type: Boolean,
      default: false,
    },
    // cover 이미지 여부
    isCoverImage: {
      type: Boolean,
      default: false,
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // 첨부파일 설정정보
      attachSetting: {
        taskClassNm: null,
        taskClassDesc: null,
        viewAcceptExt: '',
        acceptExt: 'txt,xls,xlsx,ppt,pptx,doc,docx,pdf,png,gif,jpg,jpeg,PNG',
        limitCnt: 1,
        limitSize: 10,
        multiple: true,
        dragDropYn: 'N',
        multipleSelYn: 'Y',
        multipleSelYnNm: '',
        previewYn: 'N',
        previewYnNm: '',
        pictureExplainYn: 'N',
        pictureExplainYnNm: '',
        encryptYn: 'N',
        encryptYnNm: '',
        useYn: 'Y',
        useYnNm: '',
      },
      // TODO: 기존 업로드 파일 목록
      uploadedList: [
        // 예시
        // { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
      ],
      // 자재에 첨부된 파일을 MSDS에서 자재선택시 불러오기를 하고 싶은 경우 사용
      // 즉, 가져오기 기능에서 해당 파일도 가져오고 싶을때 쓴다.
      // 이 파일을 보여주고, 다운로드가 가능한 상태이어야 하고, 삭제는 할 수 없어야 한다.
      // 사용되는 화면에서 저장시 이 파일을 저장하는 로직을 각각 추가 해야 한다.
      uploadedOtherList: null,
      // TODO: 이미지 미리보기 경로
      dialogImageUrl: '',
      coverImageUrl: '',
      // TODO: 이미지 미리보기 표시 여부
      dialogVisible: false,
      // TODO: 전체 이미지 미리보기 표시 여부
      allImageDialogVisible: false,
      uploadFiles: [],
      isUpload: false,
      uploadHeader: {},
      dragUploaderWidth: 4,
      mainProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: '#bbb',
        width: '100%',
        height: 500,
      },
      imageFiles: [],
      uploading: false,
      tempUploadFiles: [],
      showLabel: '',
      isFullScreen: false,
    };
  },
  computed: {
    uploadUrl() {
      return backendConfig.getUrl(transactionConfig.attachFile.insert.url);
    },
    drag() {
      return (
        this.attachSetting.dragDropYn === 'Y' &&
        !this.attachFileGrp.disabled &&
        this.attachFileGrp.editable
      );
    },
    haveImage() {
      let result = false;
      let imageAccepts = ['png', 'gif', 'jpg', 'jpeg', 'PNG', 'image/*'];
      this.$_.forEach(imageAccepts, (item) => {
        if (this.attachSetting.acceptExt) {
          if (this.attachSetting.acceptExt.indexOf(item) > -1) {
            result = true;
            return false;
          }
        }
      });

      return result;
    },
    // 첨부파일 확장자
    // information() {
    //   return (
    //     this.label +
    //     ' (최대 ' +
    //     this.attachSetting.limitCnt +
    //     '개, 개당 ' +
    //     this.attachSetting.limitSize +
    //     'MB 제한, 허용 확장자: ' +
    //     this.attachSetting.viewAcceptExt +
    //     ')'
    //   );
    // },
    // /첨부파일 확장자
    fileAreaWidth() {
      return this.attachFileGrp.preview ? 10 : 12;
    },
    uplodatedAreaWidth() {
      if (this.dragUploaderWidth >= 12 || this.editable === false) return 12;
      return 12 - this.dragUploaderWidth;
    },
  },
  watch: {
    refresh: {
      handler: function (val, oldVal) {
        this.getUploadedFileList();
      },
    },
    attachFileGrp: {
      handler: function (val, oldVal) {
        // 값이 변경 되지 않는 경우 재조회하지 않는다.
        if (this.$_.isEqual(val, oldVal)) return;
        if (this.attachFileGrp) {
          this.getAttachSetting();
          setTimeout(() => {
            this.getUploadedFileList();
          }, 300);
        }
      },
      deep: true,
    },
    loadOtherFileGrps() {
      if (!this.loadOtherFileGrps) {
        this.uploadedOtherList = null;
      }
      if (this.loadOtherFileGrps) this.getUploadedOtherFileList();
    },
    'attachFileGrp.taskClassNm': function (val, oldVal) {
      this.getAttachSetting();
    },
    isUpdatePictureExplain() {
      if (!this.isUpdatePictureExplain) return;
      this.updatePictureExplain();
    },
    uploadedList: {
      handler: function (val, oldVal) {
        if (this.uploadedList && this.uploadedList.length > 0) {
          let tempImageFiles = this.$_.clone(this.uploadedList);
          let index = 0;
          this.$_.forEach(this.uploadedList, (item) => {
            let check = this.isImageFile(item);
            if (!check) {
              tempImageFiles = this.$_.reject(tempImageFiles, item);
            }
            index++;
          });
          this.imageFiles = tempImageFiles;
        } else {
          this.imageFiles = [];
        }
      },
      deep: true,
    },
    uploading() {
      if (!this.uploading) {
        if (
          !this.$refs.upload.uploadFiles ||
          this.$refs.upload.uploadFiles.length === 0
        ) {
          this.$refs.upload.uploadFiles = [];
          this.$_.forEach(this.tempUploadFiles, (item) => {
            this.$refs.upload.uploadFiles.push(this.$_.clone(item));
          });
        }
        this.tempUploadFiles = [];
        this.change();
      }
    },
    imageFiles: {
      handler: function (val, oldVal) {
        if (this.isCoverImage && this.imageFiles.length > 0) {
          this.showImageViewer(this.imageFiles[0], true);
        }
      },
    },
    label(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.showLabel =
          this.$comm.getLangSpecInfoLabel(newVal) +
          ' (Limit : ' +
          this.attachSetting.limitSize +
          ' MB)';
      }
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.resizeDragUploaderWidth();
    });
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/

    init() {
      this.showLabel =
        this.$comm.getLangSpecInfoLabel(this.label) +
        ' (Limit : ' +
        this.attachSetting.limitSize +
        ' MB)';
      this.upload = this.$refs.upload;
      if (this.attachFileGrp) {
        this.getAttachSetting();
        setTimeout(() => {
          this.getUploadedFileList();
        }, 300);
      }

      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };
    },
    /**
     * 첨부파일 관련 설정 조회
     */
    getAttachSetting() {
      this.attachFileGrp.manualSetting = this.manualSetting;
      this.attachFileGrp.attachFileId = '';

      if (this.manualSetting) {
        this.setManualAttachSetting();
      } else {
        this.$http.url = this.$format(
          selectConfig.manage.attachSetting.get.url,
          this.attachFileGrp.taskClassNm
        );
        this.$http.type = 'GET';
        this.$http.param = null;
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.attachSetting = this.$_.clone(_result.data);
              this.attachSetting.multiple =
                this.attachSetting.multipleSelYn === 'Y';

              this.attachSetting.acceptExt = this.attachSetting.acceptExt
                .replace(/\ /g, '')
                .replace(/\./g, '');

              this.attachSetting.acceptExt += ',PNG';
              // TODO: drag & drop에서 첨부파일 확장자가 대문자일 경우에도 허용하도록 처리
              if (this.attachSetting.acceptExt) {
                this.$_.forEach(
                  this.attachSetting.acceptExt.split(','),
                  (_item) => {
                    if (
                      this.attachSetting.acceptExt.indexOf(
                        _item.toUpperCase()
                      ) < 0
                    )
                      this.attachSetting.acceptExt += ',' + _item.toUpperCase();
                  }
                );
              }

              this.attachSetting.viewAcceptExt =
                '.' + this.attachSetting.acceptExt.split(',').join(', .');

              this.attachFileGrp.acceptExt = this.attachSetting.acceptExt;
              this.attachFileGrp.encryptYn = this.attachSetting.encryptYn;
              this.attachFileGrp.preview = this.attachSetting.previewYn === 'Y';

              this.attachFileGrp.isPictureExplan =
                this.attachSetting.pictureExplainYn === 'Y';
            } else {
              this.setManualAttachSetting();
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },

    setManualAttachSetting() {
      this.attachSetting.acceptExt = this.accept;
      this.attachSetting.limitCnt = this.limit;
      this.attachSetting.limitSize = this.uploadLimitSize;
      this.attachSetting.multiple = this.multiple;
      this.attachSetting.previewYn = this.preview ? 'Y' : 'N';
      this.attachSetting.pictureExplainYn = this.isPictureExplan ? 'Y' : 'N';

      this.attachSetting.acceptExt = this.attachSetting.acceptExt
        .replace(/\ /g, '')
        .replace(/\./g, '');
      this.attachSetting.viewAcceptExt =
        '.' + this.attachSetting.acceptExt.split(',').join(', .');

      this.attachFileGrp.acceptExt = this.attachSetting.acceptExt;
      this.attachFileGrp.encryptYn = this.attachSetting.encryptYn;
      this.attachFileGrp.preview = this.preview;
      this.attachFileGrp.isPictureExplan = this.isPictureExplan;
    },
    beforeUpload(_file) {
      return true;
    },
    change(_file, _fileList) {
      // 전체 업로드 가능수를 초과한 경우 메시지를 띄움.
      if (this.$refs.upload) {
        if (
          this.$refs.upload.uploadFiles.length +
            (this.uploadedList.length + (this.uploadedOtherList ? 1 : 0)) >
          this.attachSetting.limitCnt
        ) {
          this.$refs.upload.uploadFiles.splice(
            this.$refs.upload.uploadFiles.length - 1,
            1
          );
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000041', // 업로드 가능한 파일갯수를 초과하였습니다. 파일갯수를 확인하세요.
            type: 'info', // success / info / warning / error
          });
          return;
        } else {
          if (this.$refs.upload.uploadFiles.length > 0) {
            // if (_fileList.length > 1) {
            //   this.$refs.upload.uploadFiles.splice(0, 1);
            // }

            if (
              this.attachSetting.acceptExt &&
              this.$refs.upload.uploadFiles &&
              this.$refs.upload.uploadFiles.length > 0
            ) {
              let accepts = this.attachSetting.acceptExt
                .toLowerCase()
                .split(',');
              if (!this.checkAccept(accepts)) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000042', // 업로드 불가능한 확장자입니다. 허용 확장자를 확인하세요.
                  type: 'info', // success / info / warning / error
                });
                return;
              }
              if (!this.checkSize(this.attachSetting.limitSize * 1000 * 1000)) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000043', // 업로드 가능한 용량을 초과하였습니다. 제한 용량을 확인하세요.
                  type: 'info', // success / info / warning / error
                });
                return;
              }
            }

            this.uploadFiles = this.$refs.upload.uploadFiles;
            if (this.uploadFiles.length > 0) {
              this.$emit(
                'uploadFiles',
                this.uploadFiles,
                this.attachFileGrp.taskClassNm,
                this.attachFileGrp
              );
            }

            window.getApp.$emit('LOADING_SHOW');
            if (!this.uploading) {
              this.uploading = true;
              this.$refs.upload.submit();
            } else {
              if (!this.tempUploadFiles) {
                this.tempUploadFiles = [];
              }
              this.$_.forEach(this.$refs.upload.uploadFiles, (item) => {
                if (
                  this.$_.findIndex(this.tempUploadFiles, { uid: item.uid }) ===
                  -1
                ) {
                  this.tempUploadFiles.push(item);
                }
              });
            }
            // if (!this.attachFileGrp.attachFileId) {
            //   if (!this.uploading) {
            //     this.uploading = true;
            //     this.$refs.upload.submit();
            //   } else {
            //     if (!this.tempUploadFiles) {
            //       this.tempUploadFiles = [];
            //     }
            //     this.$_.forEach(this.$refs.upload.uploadFiles, item => {
            //       if (this.$_.findIndex(this.tempUploadFiles, { uid: item.uid }) === -1) {
            //         this.tempUploadFiles.push(item);
            //       }
            //     })
            //   }
            // } else {
            //   this.$refs.upload.submit();
            // }
          }
        }
      }
    },
    checkAccept(_accepts) {
      let index = 0;
      let returnVal = true;
      this.$_.forEach(this.$refs.upload.uploadFiles, (uploadFile) => {
        let _fileName = this.$refs.upload.uploadFiles[index].name;
        let _ext = _fileName.split('.')[_fileName.split('.').length - 1];
        let haveAccept = _accepts.indexOf(_ext.toLowerCase()) > -1;
        if (!haveAccept) {
          // 올라 온 파일 중에 확장자가 내가 지정한 확장자에 맞지 않는 경우 uploadFiles에서 없애고
          // 알람창을 띄울 수 있도록 returnVal은 false로 던져준다.
          // 파일이 한꺼번에 여러개 올라 올 수 있음으로 재귀 호출 해 확장자가 맞지 않은 파일은 uploadFiles에서 없앤다.
          this.$refs.upload.uploadFiles.splice(index, 1);
          returnVal = false;
          return false;
        }
        index++;
      });
      if (!returnVal) {
        this.checkAccept(_accepts);
      }
      return returnVal;
    },
    checkSize(_size) {
      let index = 0;
      let returnVal = true;
      this.$_.forEach(this.$refs.upload.uploadFiles, (uploadFile) => {
        let _fileSize = this.$refs.upload.uploadFiles[index].size;
        if (_fileSize > _size) {
          this.$refs.upload.uploadFiles.splice(index, 1);
          returnVal = false;
          return false;
        }
        index++;
      });
      if (!returnVal) {
        this.checkSize(_size);
      }
      return returnVal;
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
    handleRemove(file, fileList) {},
    onExceed(file, fileList) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000041', // 업로드 가능한 파일갯수를 초과하였습니다. 파일갯수를 확인하세요.
        type: 'warning',
      });
    },
    handlePreview(file) {
      var type = '';
      if (file.contentType) type = file.contentType;
      else if (file.raw) {
        if (file.raw.type) type = file.raw.type;
        else type = '';
      }

      if (file.hasOwnProperty('fileDownPath')) this.isUpload = true;
      else this.isUpload = false;

      if (this.$_.includes(type, 'image')) {
        if (file.fileNo) {
          this.$http.url = selectConfig.attachFile.image64.url;
          this.$http.type = 'GET';
          this.$http.param = {
            fileNo: file.fileNo,
            taskFlag: this.attachFileGrp.taskFlag
              ? this.attachFileGrp.taskFlag
              : '',
          };
          this.$http.request(
            (_result) => {
              this.dialogImageUrl =
                'data:' + file.contentType + ';base64,' + _result.data;
              if (this.dialogImageUrl) this.dialogVisible = true;
            },
            (_error) => {
              if (_error.data === 'nofile')
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        } else {
          this.dialogImageUrl = file.url;
          if (this.dialogImageUrl) this.dialogVisible = true;
        }
      } else {
        this.dialogImageUrl = file.url;
        if (this.dialogImageUrl) this.download();
      }
    },
    submitUpload() {
      if (
        this.showUploadBtn &&
        !this.onlyDownload &&
        // this.$refs.upload.uploadFiles.length === 0
        this.uploadFiles.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000044', // 파일을 등록해 주세요.
          type: 'warning',
        });
        return;
      }

      // if (this.attachFileGrp.taskFlag === undefined)
      //   this.attachFileGrp.taskFlag = '';
      // var _this3 = this.$refs.upload;
      // if (this.$refs.upload.uploadFiles.status === 'success') return;
      this.$emit('setUploadFileLength', this.$refs.upload.uploadFiles.length);

      // if (this.uploadTempFiles && !this.$refs.upload.uploadFiles) {
      //   this.$refs.upload.uploadFiles = this.uploadTempFiles.data;
      // }
      // 업로드된 데이터 적용
      this.$http.url = transactionConfig.attachFile.apply.url;
      this.$http.type = 'POST';
      this.$http.param = this.attachFileGrp;
      this.$http.request(
        (_result) => {
          // onSuccess 내용
          if (this.close) {
            if (this.$refs.upload) this.$refs.upload.clearFiles();
            this.$emit('closePopup', this.attachFileGrp);
          } else {
            if (this.showUploadBtn && !this.onlyDownload) {
              window.getApp.$emit('APP_REQUEST_SUCCESS', this.message);
            }
          }
          this.getUploadedFileList();
        },
        (_error) => {
          if (_error.data === 'nofile')
            window.getApp.$emit(
              'APP_REQUEST_ERROR',
              'M0000000907' // 파일 적용 중 오류가 발생했습니다. 관리자에게 문의하세요.
            );
        }
      );

      // window.getApp.$emit('LOADING_SHOW');
      // this.$refs.upload.submit();
    },
    onSuccess(_result, _file, _fileList) {
      this.attachFileGrp.attachFileId = _result;
      this.uploading = false;
      window.getApp.$emit('LOADING_HIDE');

      if (this.$refs.upload) this.$refs.upload.clearFiles();
      this.getUploadedFileList();

      // 즉시 업로드됨에 따라 아래 로직은 submitUpload 로 이동
      // if (this.close) {
      //   if (this.$refs.upload) this.$refs.upload.clearFiles();
      //   this.$emit('closePopup', this.attachFileGrp);
      // } else {
      //   if (this.showUploadBtn && !this.onlyDownload)
      //     window.getApp.$emit('APP_REQUEST_SUCCESS', this.message);
      // }
      // this.getUploadedFileList();
    },
    onError(_error, _file, _fileList) {
      window.getApp.$emit('LOADING_HIDE');
      window.getApp.emit('APP_REQUEST_ERROR', _error);
    },
    // 그냥 return 시키는 경우
    //  - 보여지는 리스트는 사라지지만 실제로 데이터는 존재
    beforeRemove(_file, _fileList) {
      if (!_file.fileNo) return;

      if (this.onlyDownload) {
        this.$emit('setDeleteTempFileData', _file);
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000038', // 파일을 삭제 하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          let deleteUrl = '';
          if (
            this.attachFileGrp.taskFlag === '' ||
            this.attachFileGrp.taskFlag === undefined
          )
            this.$http.url = this.$format(
              transactionConfig.attachFile.delete.url,
              _file.fileNo
            );
          else
            this.$http.url = this.$format(
              transactionConfig.safAttachFile.delete.url,
              _file.fileNo
            ); // , _file.taskClassNm

          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              this.getUploadedFileList();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    removeAllFiles() {
      if (this.onlyDownload) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000045', // 현재 업로드된 모든 파일을 임시로 삭제 하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.uploadedList = [];
            this.$emit('setDeleteTempFileAll');
            this.$emit('uploadedList', this.uploadedList);
          },
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000046', // 현재 업로드된 모든 파일을 삭제 하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.$http.url = transactionConfig.attachFile.deleteAll.url;
            this.$http.type = 'POST';
            this.$http.param = this.attachFileGrp;
            this.$http.request((_result) => {
              this.uploadedList = [];
              this.$emit('uploadedList', this.uploadedList);
            });
          },
        });
      }
    },
    download() {
      const link = document.createElement('a');
      link.href = this.dialogImageUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
    },
    zipDownload() {
      this.$http.url = selectConfig.attachFile.zip.url;
      this.$http.type = 'GET';
      this.$http.param = this.attachFileGrp;
      this.$http.request(
        (_result) => {
          const link = document.createElement('a');
          link.href = _result.data;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
        },
        (_error) => {
          if (_error.data === 'nofile')
            window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000908'); // 압축할 파일이 없습니다.
        }
      );
    },
    getUploadedFileList() {
      const { uploadTempFiles, ...attachFileGrp } = this.attachFileGrp;

      this.$http.url = selectConfig.attachFile.list.url;
      this.$http.type = 'GET';
      this.$http.param = attachFileGrp;
      this.$http.request((_result) => {
        this.$set(this.$data, 'uploadedList', this.$_.clone(_result.data));

        this.uploadedList.forEach((item, index) => {
          if (item.previewImage) {
            var encstr = item.previewImage;
            var url = window.URL || window.webkitURL;
            var blob = this.$comm.base64ToBlob(encstr, 'image/jpeg');
            let imgUrl = url.createObjectURL(blob);
            item.imgUrl = imgUrl;
          }
        });
        if (this.uploadedList && this.uploadedList.length > 0) {
          this.attachFileGrp.attachFileId = this.uploadedList[0].attachFileId;
        }

        this.$emit(
          'uploadedList',
          this.uploadedList,
          this.attachFileGrp.taskClassNm
        );
      });
    },
    getUploadedOtherFileList() {
      this.uploadedOtherList = this.loadOtherFileGrps;
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** /기타 function **/
    getFileSizeTextByRound(_fileByteSize) {
      return this.$comm.bytesToSize(_fileByteSize);
    },
    getFileExt(_fileExt) {
      return this.$comm.getFileExtIcon(_fileExt);
    },
    onDeleteFile(_file) {
      // *** 업로드된 파일 삭제
      // 파일삭제여부 확인
      if (!_file.fileNo) return;

      if (this.onlyDownload) {
        this.$emit('setDeleteTempFileData', _file);
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000038', // 파일을 삭제 하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          let deleteUrl = '';
          if (
            this.attachFileGrp.taskFlag === '' ||
            this.attachFileGrp.taskFlag === undefined
          )
            this.$http.url = this.$format(
              transactionConfig.attachFile.delete.url,
              _file.fileNo
            );
          else
            this.$http.url = this.$format(
              transactionConfig.safAttachFile.delete.url,
              _file.fileNo
            ); // , _file.taskClassNm

          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              this.$emit('setDeleteTempFileData', _file);
              this.getUploadedFileList();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    onDeleteOtherFileList(_item) {
      // 다른파일 불러오기 파일에서 제거
      let _idx = 0;
      let _delIndx = -1;
      this.$_.forEach(this.loadOtherFileGrps, (item) => {
        if (item.fileNo === _item.fileNo) {
          _delIndx = _idx;
        }
        _idx += 1;
      });
      if (_delIndx > -1) this.loadOtherFileGrps.splice(_delIndx, 1);
      // this.loadOtherFileGrps = null;
      this.$emit('setDeleteOtherFileList', {
        taskClassNm: this.attachFileGrp.taskClassNm,
        data: this.loadOtherFileGrps,
      });
    },
    onClearOtherFileList() {
      // 다른파일 불러오기시 해당 파일을 초기화 한다.
      this.uploadedOtherList = null;
      // this.loadOtherFileGrps = null;
      this.$emit('setClearOtherFileList', {
        taskClassNm: this.attachFileGrp.taskClassNm,
      });
    },
    onDeleteFileItem() {
      // 파일삭제
      // this.$parent.$axios.delete(fileUtil.fileDelService + this.selFilePk, null)
      //   .then((response) => {
      //     this.getFileList()
      //   })
      //   .catch((error) => {
      //     this.pageAlert = {alertType: 'error', alertMsg: error.response.data.errorMessage}
      //   })
    },
    onDocumentDownload: function (_item) {
      let thisVue = this;
      let accept = this.$comm.getAccept(_item.fileExt);
      let _comm = this.$comm;
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {
        fileNo: _item.fileNo,
        taskFlag: this.attachFileGrp.taskFlag
          ? this.attachFileGrp.taskFlag
          : '',
      };
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, _item.fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = _item.fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getUploadFile() {
      return this.$refs.upload.uploadFiles;
    },
    updatePictureExplain() {
      let hasError = false;
      let self = this;
      this.$_.forEach(this.uploadedList, (_item) => {
        this.$http.url = transactionConfig.attachFile.editExplain.url;
        this.$http.param = _item;
        this.$http.type = 'POST';
        this.$http.request(
          (_result) => {
            self.$emit('updatedPictureExplain');
            self.$emit(
              'uploadedList',
              this.uploadedList,
              this.attachFileGrp.taskClassNm
            );
          },
          (_error) => {
            hasError = true;
            // window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    showImageViewer(item, isCoverImage) {
      if (item.fileNo) {
        this.$http.url = selectConfig.attachFile.image64.url;
        this.$http.type = 'GET';
        this.$http.param = {
          fileNo: item.fileNo,
          taskFlag: this.attachFileGrp.taskFlag
            ? this.attachFileGrp.taskFlag
            : '',
        };
        this.$http.request(
          (_result) => {
            this.dialogImageUrl =
              'data:' + item.contentType + ';base64,' + _result.data;
            if (isCoverImage) {
              this.coverImageUrl =
                'data:' + item.contentType + ';base64,' + _result.data;
            } else {
              if (this.dialogImageUrl) this.dialogVisible = true;
            }
          },
          (_error) => {
            if (_error.data === 'nofile')
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    resizeDragUploaderWidth() {
      if (!this.$refs.card) return;
      let columnWidth = Math.ceil(this.$refs.card.clientWidth / 12);
      if (columnWidth * 4 < uploadImageWidth) this.dragUploaderWidth = 12;
    },
    allImagePreview() {
      this.allImageDialogVisible = true;
    },
    isImageFile(_item) {
      let isImage = false;
      if (_item.contentType) isImage = _item.contentType.indexOf('image') >= 0;
      else if (_item.raw && _item.raw.type)
        isImage = _item.raw.type.indexOf('image') >= 0;
      return isImage;
    },
    deleteFiles(taskClassNm, taskKey) {
      this.$http.url = this.$format(
        transactionConfig.attachFile.deleteAllDocu.url,
        taskClassNm,
        taskKey
      );
      this.$http.type = 'DELETE';
      this.$http.request(
        (_result) => {
          this.getUploadedFileList();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closeDialog(flag) {
      if (flag) {
        this.allImageDialogVisible = false;
      } else {
        this.dialogVisible = false;
      }
    },
    resize() {
      if (this.isFullScreen) {
        this.isFullScreen = false;
      } else {
        this.isFullScreen = true;
      }
    },
  },
};
</script>

<style scoped>
.upload {
  text-align: left;
}
.border {
  border: 1px solid #0000ff;
}
</style>
