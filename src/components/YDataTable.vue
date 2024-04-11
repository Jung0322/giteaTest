<!--
목적 : v-data-table을 이용한 grid 확장 컴포넌트
Detail :
 * 
examples: 
 *  
-->
<template>
  <div>
    <div v-if="headers" id="setGridHeight">
      <!-- <slot name="labelGroup"></slot> -->
      <div v-if="label" class="float-left" ref="datatableTitle">
        <!-- <y-label
          v-if="iconVisible"
          :label="label"
          icon="list-alt"
          color-class="cutstom-title-color"
        /> -->
        <template v-if="popMode">
          <y-label
            v-if="iconVisible"
            :label="label"
            icon="list-alt"
            color-class="cutstom-title-color"
          />
          <y-label
            v-if="messageCheck && message"
            :label="'*' + $comm.getLangSpecInfoMessage(message) + ''"
            style="font-size: 15px; color: red"
          />
        </template>
        <template v-else>
          <y-label
            v-if="iconVisible"
            :label="label"
            icon="list-alt"
            color-class="cutstom-title-color"
          />
          <!-- 총 {s1}건 -->
          <y-label
            v-if="iconVisible"
            label="L0000003405"
            :labelFormatVal="dataCount"
            style="font-size: 15px"
            class="mr-2 ml-1"
          />
          <img
            v-if="excelIcon"
            src="@/assets/images/i_excel.png"
            alt="404"
            @click="gridExcel"
            style="cursor: pointer"
          />
          <img
            v-else-if="!excelIcon && useServerPaging"
            src="@/assets/images/i_excel.jpg"
            alt="excel"
            @click="gridExcelServer"
            style="cursor: pointer"
          />
          <y-label
            v-if="messageCheck && message"
            :label="'*' + $comm.getLangSpecInfoMessage(message) + ''"
            style="font-size: 15px; color: red"
          />
        </template>
      </div>
      <div class="float-right mr-2">
        <slot name="helpText"></slot>
      </div>
      <slot name="buttonGroup"></slot>
    </div>
    <slot name="header"></slot>
    <el-table
      ref="datatable"
      :key="spanKey"
      :data="datatableItems"
      :stripe="rowStripe"
      :border="true"
      :row-key="rowKey"
      highlight-current-row
      header-cell-class-name="default-th"
      :style="setStyle"
      :height="gridHeight"
      :row-class-name="rowClassName"
      :cell-class-name="cellClassName"
      :span-method="onSpanMethod"
      :default-expand-all="defaultExpandAll"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      @select="select"
      @selection-change="selectionChanged"
      @current-change="currentChanged"
      @row-click="selectedRow"
      @row-dblclick="rowDoubleClicked"
      @expand-change="expandChange"
      @sort-change="sortChange"
      @scroll="onScroll"
      @header-contextmenu="showControlPanel"
    >
      <!-- :highlight-current-row="true" 선택된 행 표시가 가능하나. 좀 더 명확하도록 변경함 -->
      <!-- check box 등 컨트롤이 추가되는 영역 -->
      <slot name="selection"></slot>
      <!-- <el-table-column type="index" label="No" width="55" align="center"></el-table-column> -->
      <el-table-column
        v-if="useRownum"
        label="No"
        width="55"
        align="center"
        :fixed="NoFixedFlag"
      >
        <template slot-scope="scope">
          <div>{{ datatableItems.indexOf(scope.row) + 1 }}</div>
        </template>
      </el-table-column>
      <slot name="expand"></slot>
      <!-- :label="changeLang(null, header.name) || header.text" -->
      <el-table-column
        v-for="(header, index) in headers"
        v-if="!header.hasOwnProperty('visible') || header.visible"
        :key="header.name + '_' + index"
        :prop="header.name"
        :label="$comm.getLangSpecInfoLabel(header.text)"
        :min-width="cloumnMinWidth(header)"
        :align="header.align"
        :sortable="!header.hasOwnProperty('sortable') || header.sortable"
        :fixed="header.fixed"
        :header-align="
          header.hasOwnProperty('headerAlign')
            ? header.headerAlign
            : headerAlign
        "
        class-name="default-td"
      >
        <template slot-scope="scope">
          <div v-if="header.url">
            <el-button
              v-if="
                typeof header.disabledFn === 'function'
                  ? header.disabledFn(header, scope.row, scope.$index)
                  : header.url
              "
              type="text"
              size="small"
              @click.stop="linkClicked(header, scope.row, scope.$index)"
            >
              <!-- {{scope.row[header.name]}} -->
              <div v-if="header.type" :title="scope.row[header.name]">
                <span v-if="header.type.toLowerCase() === 'cost'">
                  {{ scope.row[header.name] | toThousandFilter }}
                </span>
                <span v-else>{{ scope.row[header.name] }}</span>
              </div>
              <div v-else :title="scope.row[header.name]">
                {{ scope.row[header.name] }}
              </div>
            </el-button>
            <div v-else>
              <div v-if="header.type" :title="scope.row[header.name]">
                <span v-if="header.type.toLowerCase() === 'cost'">
                  {{ scope.row[header.name] | toThousandFilter }}
                </span>
                <span v-else>{{ scope.row[header.name] }}</span>
              </div>
              <div v-else :title="scope.row[header.name]">
                {{ scope.row[header.name] }}
              </div>
            </div>
          </div>
          <div v-else-if="header.type">
            <div
              class="cell"
              v-if="header.type.toLowerCase() === 'link'"
              type="text"
              size="small"
              @click.stop="linkClicked(header, scope.row, scope.$index)"
            >
              <a href="#" style="text-decoration: none; color: #007bff">
                {{ scope.row[header.name] }}
              </a>
            </div>
            <y-text
              v-else-if="header.type.toLowerCase() === 'text'"
              :editable="editable"
              :maxlength="header.maxlength"
              :showMaxLength="false"
              :placeholder="header.placeholder"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name]"
              @datachange="
                (val) => {
                  (scope.row[header.name] = val),
                    inputChange(header.name, scope);
                }
              "
              @change="
                (val) => {
                  (scope.row[header.name] = val), change(header.name, scope);
                }
              "
            />
            <y-text
              v-else-if="header.type.toLowerCase() === 'usersearch'"
              :editable="editable"
              :disabled="true"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name].userNm"
              :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
              @searchUser="btnSearchUserClicked(scope.row, header.name)"
            />
            <y-text
              v-else-if="header.type.toLowerCase() === 'deptsearch'"
              :editable="editable"
              :disabled="true"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name].deptNm"
              :appendIcon="[{ icon: 'search', callbackName: 'searchDept' }]"
              @searchDept="btnSearchDeptClicked(scope.row, header.name)"
            />
            <y-textarea
              v-else-if="header.type.toLowerCase() === 'textarea'"
              :editable="
                scope.row.replyEditMode
                  ? editable && scope.row.replyEditMode === 'save'
                  : editable
              "
              :maxlength="header.maxlength"
              :showMaxLength="false"
              :rows="header.rows ? header.rows : 2"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name]"
            />
            <y-number
              v-else-if="header.type.toLowerCase() === 'number'"
              :editable="editable"
              :disabled="header.disabled"
              :pointNumber="header.pointNumber ? header.pointNumber : 0"
              :hasSeperator="header.hasSeperator ? header.hasSeperator : false"
              :maxlength="header.maxlength"
              :showMaxLength="false"
              :maxValue="header.maxValue"
              :placeholder="header.placeholder"
              :isPositive="header.isPositive"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name]"
              @datachange="
                (val) => {
                  (scope.row[header.name] = val),
                    inputChange(header.name, scope);
                }
              "
              @change="
                (val) => {
                  (scope.row[header.name] = val), change(header.name, scope);
                }
              "
            />
            <y-datepicker
              v-else-if="header.type.toLowerCase() === 'datepicker'"
              :editable="editable"
              :disabled="
                header.disabled
                  ? header.disabledFunc(scope.row, header.name)
                  : false
              "
              :range="header.range ? header.range : false"
              :default="
                header.default
                  ? header.default === 'input'
                    ? ''
                    : header.default
                  : 'today'
              "
              :minuteStep="header.minuteStep ? header.minuteStep : 0"
              :type="header.dateType ? header.dateType : 'date'"
              label
              rowClass
              ui="bootstrap"
              :start="header.start ? header.start : ''"
              :end="header.end ? header.end : ''"
              v-model="scope.row[header.name]"
            />
            <!-- :datepickerWidth="header.width - 20" -->
            <y-select
              v-else-if="header.type.toLowerCase() === 'select'"
              :editable="editable"
              :disabled="
                header.hasOwnProperty('disabledFn') &&
                typeof header.disabledFn === 'function'
                  ? header.disabledFn(header.name, scope)
                  : false
              "
              :comboItems="header.items ? header.items : []"
              :itemText="header.itemText ? header.itemText : ''"
              :itemValue="header.itemValue ? header.itemValue : ''"
              :hasBottomMargin="false"
              rowClass
              size="sm"
              ui="bootstrap"
              v-model="scope.row[header.name]"
              @datachange="
                (val) => {
                  (scope.row[header.name] = val),
                    inputChange(header.name, scope);
                }
              "
              @text="
                (val) => {
                  inputText(header.name, scope, val);
                }
              "
            />
            <y-multi-select
              v-else-if="header.type.toLowerCase() === 'multiselect'"
              :editable="editable"
              :comboItems="header.items ? header.items : []"
              :itemText="header.itemText ? header.itemText : ''"
              :itemValue="header.itemValue ? header.itemValue : ''"
              :hasBottomMargin="false"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name]"
            />
            <y-checkbox
              v-else-if="header.type.toLowerCase() === 'checkboxmulti'"
              :editable="editable"
              :comboItems="
                header.items
                  ? header.items[datatableItems.indexOf(scope.row)]
                    ? header.items[datatableItems.indexOf(scope.row)]
                    : []
                  : []
              "
              :itemText="header.itemText ? header.itemText : ''"
              :itemValue="header.itemValue ? header.itemValue : ''"
              :hasBottomMargin="false"
              :needDefaultView="true"
              :use-default="header.useDefault ? header.useDefault : false"
              rowClass
              size
              :fixwithclass="fixwithclass"
              marginClass="margin-zero"
              ui="bootstrap"
              v-model="scope.row[header.name]"
            />
            <y-radio
              v-else-if="header.type.toLowerCase() === 'radio'"
              :editable="editable"
              :comboItems="header.items ? header.items : []"
              :itemText="header.itemText ? header.itemText : ''"
              :itemValue="header.itemValue ? header.itemValue : ''"
              :hasBottomMargin="false"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name]"
            />
            <y-checkbox
              v-else-if="header.type.toLowerCase() === 'checkbox'"
              :editable="editable"
              :comboItems="header.items ? header.items : []"
              :itemText="header.itemText ? header.itemText : ''"
              :itemValue="header.itemValue ? header.itemValue : ''"
              :hasBottomMargin="false"
              :use-default="header.useDefault ? header.useDefault : false"
              :stacked="header.stacked ? header.stacked : false"
              :fixwithclass="header.fixwithclass ? header.fixwithclass : ''"
              rowClass
              ui="bootstrap"
              v-model="scope.row[header.name]"
            />
            <!-- 사용/미사용 -->
            <y-switch
              v-else-if="header.type.toLowerCase() === 'switch'"
              :editable="editable"
              :true-value="header.trueValue ? header.trueValue : 'Y'"
              :false-value="header.falseValue ? header.falseValue : 'N'"
              ui="bootstrap"
              :selectText="
                header.selectText
                  ? header.selectText
                  : $comm.getLangSpecInfoLabel('L0000001440')
              "
              :unselectText="
                header.unselectText
                  ? header.unselectText
                  : $comm.getLangSpecInfoLabel('L0000001063')
              "
              rowClass
              v-model="scope.row[header.name]"
            />
            <b-form-checkbox
              v-else-if="header.type.toLowerCase() === 'singlecheckbox'"
              :disabled="!editable || header.disabled"
              style="margin: 0px; padding-left: 30px"
              value="Y"
              unchecked-value="N"
              v-model="scope.row[header.name]"
              @change="singlecheckedRow(scope)"
            />
            <y-attach-column
              v-else-if="header.type.toLowerCase() === 'attach'"
              :editable="
                editable ||
                (scope.row.editable ? scope.row.editable : editable) ||
                header.hasOwnProperty('editable')
                  ? header.editable
                  : false
              "
              :scope="scope"
              :saveData="saveData"
              :keyText="header.keyText"
              :disabled="header.disabled"
              :accept="header.accept"
            />
            <span
              v-else-if="
                header.type.toLowerCase() === 'cost' && scope.row[header.name]
              "
              >{{ scope.row[header.name] | toThousandFilter }}</span
            >
            <span v-else>{{ scope.row[header.name] }}</span>
          </div>
          <div v-else class="cell" :title="scope.row[header.name]">
            <span
              v-if="header.textCalculate"
              v-html="header.textCalculate(scope.row, header.name)"
            ></span>
            <span
              v-else
              :style="
                !header.isStyle
                  ? 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'
                  : ''
              "
              >{{ scope.row[header.name] }}</span
            >
          </div>
        </template>
        <el-table-column
          v-for="_header in header.child"
          :key="_header.name"
          :prop="_header.name"
          :label="$comm.getLangSpecInfoLabel(_header.text)"
          :min-width="_header.width"
          :align="_header.align"
          :fixed="header.fixed"
          :sortable="!_header.hasOwnProperty('sortable') || _header.sortable"
          show-overflow-tooltip
          :header-align="
            _header.hasOwnProperty('headerAlign')
              ? _header.headerAlign
              : headerAlign
          "
          class-name="default-td"
        >
          <template slot-scope="scope">
            <div v-if="_header.url">
              <el-button
                v-if="
                  typeof _header.disabledFn === 'function'
                    ? _header.disabledFn(_header, scope.row, scope.$index)
                    : _header.url
                "
                type="text"
                size="small"
                @click.stop="linkClicked(_header, scope.row, scope.$index)"
                v-html="scope.row[_header.name]"
              ></el-button>
              <div v-else :title="scope.row[_header.name]">
                {{ scope.row[_header.name] }}
              </div>
            </div>
            <div
              class="cell"
              v-else-if="_header.type && _header.type.toLowerCase() === 'link'"
              type="text"
              size="small"
              @click.stop="linkClicked(_header, scope.row, scope.$index)"
            >
              <a
                href="#"
                style="text-decoration: none"
                v-html="scope.row[_header.name]"
              ></a>
            </div>
            <y-text
              v-else-if="_header.type && _header.type.toLowerCase() === 'text'"
              :editable="editable"
              :maxlength="_header.maxlength"
              :showMaxLength="false"
              rowClass
              ui="bootstrap"
              v-model="scope.row[_header.name]"
            />
            <y-number
              v-else-if="
                _header.type && _header.type.toLowerCase() === 'number'
              "
              :editable="editable"
              :disabled="header.disabled"
              :pointNumber="_header.pointNumber ? _header.pointNumber : 0"
              :hasSeperator="
                _header.hasSeperator ? _header.hasSeperator : false
              "
              :maxlength="_header.maxlength"
              :showMaxLength="false"
              :maxValue="header.maxValue"
              :isPositive="header.isPositive"
              rowClass
              ui="bootstrap"
              v-model="scope.row[_header.name]"
            />
            <y-datepicker
              v-else-if="
                _header.type && _header.type.toLowerCase() === 'datepicker'
              "
              :editable="editable"
              :range="_header.range ? _header.range : false"
              :default="_header.default ? _header.default : 'today'"
              :minuteStep="_header.minuteStep ? _header.minuteStep : 0"
              :type="header.dateType ? header.dateType : 'date'"
              label
              ui="bootstrap"
              v-model="scope.row[_header.name]"
            />
            <y-select
              v-else-if="
                _header.type && _header.type.toLowerCase() === 'select'
              "
              :editable="editable"
              :comboItems="_header.items ? _header.items : []"
              :itemText="_header.itemText ? _header.itemText : ''"
              :itemValue="_header.itemValue ? _header.itemValue : ''"
              rowClass
              ui="bootstrap"
              v-model="scope.row[_header.name]"
              @datachange="
                (val) => {
                  (scope.row[_header.name] = val),
                    inputChange(_header.name, scope);
                }
              "
            />
            <y-radio
              v-else-if="_header.type && _header.type.toLowerCase() === 'radio'"
              :editable="editable"
              :comboItems="_header.items ? _header.items : []"
              :itemText="_header.itemText ? _header.itemText : ''"
              :itemValue="_header.itemValue ? _header.itemValue : ''"
              ui="bootstrap"
              v-model="scope.row[_header.name]"
            />
            <y-checkbox
              v-else-if="
                _header.type && _header.type.toLowerCase() === 'checkbox'
              "
              :editable="editable"
              :items="_header.items ? _header.items : []"
              :itemText="_header.itemText ? _header.itemText : ''"
              :itemValue="_header.itemValue ? _header.itemValue : ''"
              :use-default="_header.useDefault ? _header.useDefault : false"
              ui="bootstrap"
              v-model="scope.row[_header.name]"
            />
            <!-- 사용/미사용 -->
            <y-switch
              v-else-if="
                _header.type && _header.type.toLowerCase() === 'switch'
              "
              :editable="editable"
              :true-value="_header.trueValue ? _header.trueValue : 'Y'"
              :false-value="_header.falseValue ? _header.falseValue : 'N'"
              ui="bootstrap"
              :selectText="
                _header.selectText
                  ? _header.selectText
                  : $comm.getLangSpecInfoLabel('L0000001440')
              "
              :unselectText="
                _header.unselectText
                  ? _header.unselectText
                  : $comm.getLangSpecInfoLabel('L0000001063')
              "
              v-model="scope.row[_header.name]"
            />
            <el-tag
              v-else-if="_header.type && _header.type.toLowerCase() === 'tag'"
              :type="
                scope.row[_header.prop] === _header.compareVal
                  ? _header.trueVal
                  : _header.falseVal
              "
              disable-transitions
              >{{ scope.row[_header.name] }}</el-tag
            >
            <b-form-checkbox
              v-else-if="
                _header.type && _header.type.toLowerCase() === 'singlecheckbox'
              "
              :disabled="!editable || header.disabled"
              style="margin: 0px; padding-left: 30px"
              value="Y"
              unchecked-value="N"
              v-model="scope.row[_header.name]"
              @change="singlecheckedRow(scope)"
            />
            <span
              v-else-if="_header.type && _header.type.toLowerCase() === 'cost'"
              >{{ scope.row[_header.name] | toThousandFilter }}</span
            >
            <div v-else class="cell">
              <span>{{ scope.row[_header.name] }}</span>
            </div>
          </template>
          <el-table-column
            v-for="__header in _header.child"
            :key="__header.name"
            :prop="__header.name"
            :label="$comm.getLangSpecInfoLabel(__header.text)"
            :min-width="__header.width"
            :align="__header.align"
            :fixed="header.fixed"
            :sortable="
              !__header.hasOwnProperty('sortable') || __header.sortable
            "
            show-overflow-tooltip
            :header-align="
              header.hasOwnProperty('headerAlign')
                ? header.headerAlign
                : headerAlign
            "
            class-name="default-td"
          >
            <template slot-scope="scope">
              <div v-if="__header.url">
                <el-button
                  v-if="
                    typeof __header.disabledFn === 'function'
                      ? __header.disabledFn(__header, scope.row, scope.$index)
                      : __header.url
                  "
                  type="text"
                  size="small"
                  @click.stop="linkClicked(__header, scope.row, scope.$index)"
                  >{{ scope.row[__header.name] }}</el-button
                >
                <div v-else :title="scope.row[_header.name]">
                  {{ scope.row[_header.name] }}
                </div>
              </div>
              <div
                class="cell"
                v-else-if="__header.type && __header.type === 'link'"
                type="text"
                size="small"
                @click.stop="linkClicked(__header, scope.row, scope.$index)"
              >
                <a href="#" style="text-decoration: none">
                  {{ scope.row[__header.name] }}
                </a>
              </div>
              <y-text
                v-else-if="__header.type && __header.type === 'text'"
                :maxlength="__header.maxlength"
                :showMaxLength="false"
                :editable="editable"
                rowClass
                ui="bootstrap"
                v-model="scope.row[__header.name]"
              />
              <y-number
                v-else-if="__header.type && __header.type === 'number'"
                :editable="editable"
                :disabled="header.disabled"
                :pointNumber="__header.pointNumber ? __header.pointNumber : 0"
                :hasSeperator="
                  __header.hasSeperator ? __header.hasSeperator : false
                "
                :maxlength="__header.maxlength"
                :showMaxLength="false"
                :maxValue="header.maxValue"
                :isPositive="header.isPositive"
                rowClass
                ui="bootstrap"
                v-model="scope.row[__header.name]"
              />
              <y-datepicker
                v-else-if="__header.type && __header.type === 'datepicker'"
                :editable="editable"
                :range="__header.range ? __header.range : false"
                :default="__header.default ? __header.default : 'today'"
                :minuteStep="__header.minuteStep ? __header.minuteStep : 0"
                :type="header.dateType ? header.dateType : 'date'"
                label
                ui="bootstrap"
                v-model="scope.row[__header.name]"
              />
              <y-select
                v-else-if="__header.type && __header.type === 'select'"
                :editable="editable"
                :comboItems="__header.items ? __header.items : []"
                :itemText="__header.itemText ? __header.itemText : ''"
                :itemValue="__header.itemValue ? __header.itemValue : ''"
                ui="bootstrap"
                v-model="scope.row[__header.name]"
                @datachange="
                  (val) => {
                    (scope.row[__header.name] = val),
                      inputChange(__header.name, scope);
                  }
                "
              />
              <y-radio
                v-else-if="__header.type && __header.type === 'radio'"
                :editable="editable"
                :comboItems="__header.items ? __header.items : []"
                :itemText="__header.itemText ? __header.itemText : ''"
                :itemValue="__header.itemValue ? __header.itemValue : ''"
                ui="bootstrap"
                v-model="scope.row[__header.name]"
              />
              <y-checkbox
                v-else-if="__header.type && __header.type === 'checkbox'"
                :editable="editable"
                :items="__header.items ? __header.items : []"
                :itemText="__header.itemText ? __header.itemText : ''"
                :itemValue="__header.itemValue ? __header.itemValue : ''"
                :use-default="__header.useDefault ? __header.useDefault : false"
                ui="bootstrap"
                v-model="scope.row[__header.name]"
              />
              <!-- 사용/미사용 -->
              <y-switch
                v-else-if="__header.type && __header.type === 'switch'"
                :editable="editable"
                :true-value="__header.trueValue ? __header.trueValue : 'Y'"
                :false-value="__header.falseValue ? __header.falseValue : 'N'"
                ui="bootstrap"
                :selectText="
                  __header.selectText
                    ? __header.selectText
                    : $comm.getLangSpecInfoLabel('L0000001440')
                "
                :unselectText="
                  __header.unselectText
                    ? __header.unselectText
                    : $comm.getLangSpecInfoLabel('L0000001063')
                "
                v-model="scope.row[__header.name]"
              />
              <el-tag
                v-else-if="__header.type && __header.type === 'tag'"
                :type="
                  scope.row[__header.prop] === __header.compareVal
                    ? __header.trueVal
                    : __header.falseVal
                "
                disable-transitions
                >{{ scope.row[__header.name] }}</el-tag
              >
              <b-form-checkbox
                v-else-if="__header.type && __header.type === 'singlecheckbox'"
                style="margin: 0px; padding-left: 30px"
                value="Y"
                unchecked-value="N"
                v-model="scope.row[__header.name]"
                @change="singlecheckedRow(scope)"
              />
              <span v-else-if="__header.type === 'cost'">
                {{ scope.row[__header.name] | toThousandFilter }}
              </span>
              <div v-else class="cell">{{ scope.row[__header.name] }}</div>
            </template>
            <el-table-column
              v-for="___header in __header.child"
              :key="___header.name"
              :prop="___header.name"
              :label="$comm.getLangSpecInfoLabel(___header.text)"
              :min-width="___header.width"
              :align="___header.align"
              :fixed="header.fixed"
              :sortable="
                !___header.hasOwnProperty('sortable') || ___header.sortable
              "
              show-overflow-tooltip
              :header-align="
                header.hasOwnProperty('headerAlign')
                  ? header.headerAlign
                  : headerAlign
              "
              class-name="default-td"
            ></el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <slot name="tag"></slot>
    </el-table>
    <y-pagination
      v-if="usePaging"
      ref="pagination"
      :page-size="rows"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
      :layout="layout"
      :total="total"
    ></y-pagination>
    <!-- <div>datatable: {{itemsString}}</div> -->
    <y-dialog :param="popupOptions"></y-dialog>
    <div
      v-show="controlOption.display"
      class="control-panel control-panel-group"
      ref="controlPanel"
      :style="{ top: controlOption.top, left: controlOption.left }"
    >
      <h4 class="control-panel-group">
        {{ controlOption.title }} <span class="control-panel-group">옵션</span>
      </h4>
      <div class="control-panel-group options">
        <input
          class="control-panel-group"
          type="checkbox"
          v-model="controlOption.fix"
          id="control-fix"
          @click="handleOption('fix')"
        />
        <label class="control-panel-group" for="control-fix">컬럼고정</label>
      </div>
      <div class="control-panel-group options">
        <input
          class="control-panel-group"
          type="checkbox"
          v-model="controlOption.fixClear"
          id="control-fixClear"
          @click="handleOption('fixClear')"
        />
        <label class="control-panel-group" for="control-fixClear"
          >고정취소</label
        >
      </div>
      <div class="control-panel-group options">
        <input
          class="control-panel-group"
          type="checkbox"
          v-model="controlOption.visible"
          id="control-visible"
          @click="handleOption('visible')"
        />
        <label class="control-panel-group" for="control-visible">숨기기</label>
      </div>
      <div class="control-panel-group options">
        <input
          class="control-panel-group"
          type="checkbox"
          v-model="controlOption.visibleClear"
          id="control-visibleClear"
          @click="handleOption('visibleClear')"
        />
        <label class="control-panel-group" for="control-visibleClear"
          >보이기</label
        >
      </div>
    </div>
  </div>
</template>

<script>
import { changeLang } from '@/utils/i18n';
import YPagination from '@/components/YPagination'; // Secondary package based on el-pagination
import { spanRow } from 'element-ui-table-span-method';
import * as XLSX from 'xlsx';

export default {
  /* attributes: name, components, props, data, computed */
  name: 'y-data-table',
  components: { YPagination },
  props: {
    title: {
      type: String,
      default: 'Grid',
    },
    // grid 헤더
    headers: {
      type: Array,
    },
    // grid item
    items: {
      type: Array,
    },
    excelItems: {
      type: Array,
    },
    // grid 수정 여부
    editable: {
      type: Boolean,
      default: true,
    },
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    pagingSize: {
      type: Number,
      default: 5,
    },
    createUrl: {
      type: String,
      default: '',
    },
    popupCallback: {
      type: String,
      default: '',
    },
    // 그리드 타입(radio, checkbox)
    gridType: {
      type: String,
      default: '',
    },
    itemKey: {
      type: String,
      default: '',
    },
    flat: {
      type: Boolean,
      default: false,
    },
    excelDown: {
      // type: Boolean,
      default: false,
    },
    print: {
      type: Boolean,
      default: false,
    },
    // TODO : 신규 속성
    // 행 색상 구분 여부
    rowStripe: {
      type: Boolean,
      default: false,
    },
    // header text align 속성
    headerAlign: {
      type: String,
      default: 'center',
    },
    // 테이블 라벨
    label: {
      type: String,
    },
    isShowBtn: {
      type: Boolean,
      default: false,
    },
    // border: {
    //   type: Boolean,
    //   default: true
    // },
    // 그리드 높이
    height: {
      type: [String, Number],
      default: '300',
    },
    // 표시 되는 행 개수
    rows: {
      type: Number,
      default: 20,
    },
    // 페이징 표시 여부
    usePaging: {
      type: Boolean,
      default: false,
    },
    useServerPaging: {
      type: Boolean,
      default: false,
    },
    useRownum: {
      type: Boolean,
      default: true,
    },
    // el-table-column selection 관련 데이터 체크
    checkItemData: {
      type: Array,
    },
    checkKey: {
      type: String,
      default: '',
    },
    checkSetTime: {
      type: Number,
      default: 100,
    },
    spanOptions: {
      type: Array,
    },
    // 테이블 라벨 이후 추가 메세지 여부
    messageCheck: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    // displaySelectRow: {
    //   type: Boolean,
    //   default: true
    // },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    iconVisible: {
      type: Boolean,
      default: true,
    },
    minHeight: {
      type: String,
      default: '250px', // 기존값 : 300px -> 250px로 수정 : tab 있는 화면 그리드 조절을 위함.
    },
    rowClassName: {
      type: Function,
      default: function ({ row, rowIndex }) {
        var returnText = '';
        if (rowIndex % 2 === 1) {
          returnText = 'odd-row';
        } else if (rowIndex % 2 === 0) {
          returnText = 'even-row';
        }
        return returnText;
      },
    },
    cellClassName: {
      type: Function,
      default: function ({ row, column, rowIndex, colIndex }) {
        var returnText = '';

        return returnText;
      },
    },
    fixwithclass: {
      // checkbouxgroup인 경우 넓이를 일정하게 하고 싶을때.
      type: String,
      default: '',
    },
    pageTotal: {
      type: Number,
      default: 0,
    },
    rowKey: {
      type: String,
      default: null,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true,
    },
    showSummary: {
      type: Boolean,
      default: false,
      height: '50px',
    },
    getSummaries: {
      type: Function,
      default: function (param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = this.$comm.getLangSpecInfoLabel('L0000003180');
            return;
          }
          if (!data) return;
          const values = data.map((item) => Number(item[column.property]));
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
    },
    popMode: {
      type: Boolean,
      default: false,
    },
    // 라벨에 엑셀 다운로드 버튼이 필요 없을 경우 false
    excelIcon: {
      type: Boolean,
      default: true,
    },
    tabApply: {
      type: Boolean,
      default: false,
    },
    // 서버 페이징 엑셀다운로드 url
    searchExcelTotalUrl: {
      type: String,
      default: '',
    },
    // 서버 페이징 엑셀다운로드 param
    searchExcelTotalParam: {
      type: Object,
      default: null,
    },
    excelDownUrl: {
      type: String,
      default: '',
    },
    searchParam: {
      type: Object,
    },
    // 페이징 구성요소
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },

    // 유소견자 사후관리 사이즈5로 설정
    smPageSizes: {
      type: Boolean,
      default: false,
    },
    // TODO : 페이징 사이즈를 설정할 필요가 있을지 몰라서 일단 주석처리
    // pageSizes: {
    //   type: Array,
    //   default: () => [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    // }
    // el-table 커스텀 spanOption
    // 현재 사용중인 rowspan 외에
    // colspan 등의 그리드 spanOption을 커스텀 할 수 있도록 추가
    // 참조 소스 - @/pages/mgt/budgetManagement/budgetStatus 의 customSpanOption 메소드 참조
    customSpanOption: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      controlOption: {
        display: false,
        title: '',
        fix: false,
        fixChangeVal: false,
        fixChangeFlag: true,
        top: `50px`,
        left: `50px`,
        headerKey: '',
        visible: true,
        visibleChangeVal: true,
        visibleChangeFlag: true,
        visibleClear: false,
        fixClear: false,
      },
      search: '',
      selected: [],
      loading: true,
      pagination: {
        // rowsPerPage: this.rowsPerPage
        sortBy: 'name',
        page: 1,
      },
      listQuery: {
        page: 1,
        limit: 20,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        // sort: '+id'
      },
      // check: true,
      // radioGroup: 1,
      // itemData: [],
      multipleSelection: [],
      singleSelection: null,
      // page: 1,
      datatableItems: null,
      row: null,
      headerName: '',
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridHeight: 200,
      OriginalGridHeight: '',
      tmpHeight: 0,
      saveData: {
        files: [],
        tempId: [],
      },
      setData: {
        target: [],
        sort: [],
      },
      spanKey: null, // 렌더링 키
      hideColumns: [],
      fixColumns: [],
      NoFixedFlag: false,
    };
  },
  computed: {
    // setGridHeight() {
    //   return this.getGridHeight();
    // },
    setStyle() {
      return (
        'width: 100%; min-height: ' + this.gridHeight + ';' // border-color:blue;
      );
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0;
      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    },
    isMetroUi() {
      return this.ui === 'metroUi';
    },
    labelWidth() {
      var width = 12 - this.width;
      return width <= 0 ? 12 : width;
    },
    // height () {
    //   var headerHeight = 55;
    //   var rowHeight = 44;
    //   var border = 1;
    //   return headerHeight + (rowHeight * this.rows) + border;
    // },
    itemsString() {
      return JSON.stringify(this.items);
    },
    // 전체 데이터 수
    total() {
      if (this.useServerPaging) {
        return this.pageTotal;
      } else {
        return this.items ? this.items.length : 0;
      }
    },
    dataCount() {
      return {
        s1: this.$comm.setNumberSeperator(this.total),
      };
    },
    // isComponents () {
    //   this.$_.forEach(this.headers, (header) => {
    //     if (header.type) {
    //       return false;
    //     }
    //   });
    //   return true;
    // }
  },
  watch: {
    items(val, oldval) {
      // TODO : totalItems가 업데이트 되지 않는데 bug인지 이유는 잘 모르겠음
      // [bug fix] : 페이지가 처음 로딩시 그리드 데이터가 바인딩되었는데도, pagination이 표현 안되는 현상 발생했으나
      //                  우연히 totalItems를 강제로 할당해주니 표시가 됨(이유는 모름)
      // TODO : vuetify 소스
      // this.pagination.totalItems = this.items.length;
      // this.itemData = [this.items.length];
      // this.hideLoading();
      this.getList();
    },
    height() {
      this.getGridHeight();
    },
    checkItemData() {
      if (this.checkItemData && this.items) {
        this.items.forEach((row) => {
          this.checkItemData.forEach((selectRow) => {
            if (row[this.checkKey] === selectRow[this.checkKey]) {
              if (row[this.checkKey] !== '0') {
                if (this.checkSetTime) {
                  setTimeout(() => {
                    this.$refs.datatable.toggleRowSelection(row);
                  }, this.checkSetTime);
                } else {
                  this.$refs.datatable.toggleRowSelection(row);
                }
              }
            }
          });
        });
      }
    },
  },
  /* Vue lifecycle: created, mounted, destroyed, etc */
  beforeMount() {
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.OriginalGridHeight = this.height;
    this.getList();
  },
  mounted() {
    this.getGridHeight();
    document.addEventListener('click', this.hidePanel);
    // Selection - 초기 데이터가 셋팅 되어 있는 상황에서 화면 띄워줄시 체크 박스 셋팅
    if (this.checkItemData && this.items) {
      this.items.forEach((row) => {
        this.checkItemData.forEach((selectRow) => {
          if (row[this.checkKey] === selectRow[this.checkKey]) {
            if (row[this.checkKey] !== '0') {
              if (this.checkSetTime) {
                setTimeout(() => {
                  this.$refs.datatable.toggleRowSelection(row);
                }, this.checkSetTime);
              } else {
                this.$refs.datatable.toggleRowSelection(row);
              }
            }
          }
        });
      });
    }
  },
  beforeDestroy() {},
  /* methods */
  methods: {
    changeLang,
    cloumnMinWidth(header) {
      if (header.type !== 'attach') {
        return header.width;
      } else {
        let width = String(header.width);
        if (width.indexOf('px') > -1) {
          width = this.$_.trim(width, 'px');
          if (!isNaN(width)) {
            let numWidth = this.$_.parseInt(width);
            if (numWidth <= 250) {
              numWidth = 250;
            }
            width = String(numWidth) + 'px';
          } else {
            width = '250px';
          }
        } else {
          width = '250px';
        }
        return width;
      }
    },
    hidePanel(e) {
      if (
        this.controlOption.display &&
        !e.srcElement.className.includes('control-panel-group')
      ) {
        this.controlOption.display = false;
      }
    },
    handleOption(type) {
      const header = this.headers.find(
        (h) => h.name === this.controlOption.headerKey
      );

      // type: fix는 칼럼고정, type:visible는 칼럼 숨기기 기능 - SHE고도화(wukjin.j : 22.06.20)

      if (type === 'fix') {
        if (!this.controlOption.fix) {
          this.canclefix();
        }

        let index = this.headers.findIndex((h) => h.name === header.name);
        for (var i = 0; i <= index; i++) {
          if (this.headers[i].child) {
            this.$_.forEach(this.headers[i].child, (child) => {
              child.fixed = !child.fixed;
            });
          }
          // header.fixed = !header.fixed;
          this.headers[i].fixed = !this.headers[i].fixed;

          this.fixColumns.push(this.headers[i].name);
        }
        this.NoFixedFlag = !this.NoFixedFlag;
      } else if (type === 'visible') {
        header.visible = header.hasOwnProperty('visible')
          ? !header.visible
          : false;

        if (!header.visible) {
          this.hideColumns.push(header.name);
        } else {
          this.hideColumns = this.$_.reject(
            this.hideColumns,
            (property) => property === header.name
          );
        }
      } else if (type === 'visibleClear') {
        this.cancleHide();
      } else if (type === 'fixClear') {
        this.canclefix();
      }
      this.$nextTick(() => {
        this.$refs.datatable.doLayout();
      });
    },
    showControlPanel(header, event) {
      if (header.level !== 1 || header.children || header.label === 'No')
        return;
      event.preventDefault();
      const panel = this.$refs.controlPanel;
      const largestHeight = window.innerHeight - panel.offsetHeight - 25;
      const largestWidth = window.innerWidth - panel.offsetWidth - 25;

      let top = event.y;
      let left = event.x;

      if (top > largestHeight) top = largestHeight;
      if (left > largestWidth) left = largestWidth;

      this.controlOption.top = `${top}px`;
      this.controlOption.left = `${left}px`;
      this.controlOption.title = header.label;
      this.controlOption.display = true;
      this.controlOption.headerKey = header.property;

      let Flag = false;
      let head;

      this.$_.forEach(this.headers, (_item) => {
        if (_item.fixed) {
          head = _item;
        }
      });

      if (head) {
        Flag = head.name == header.property ? true : false;
      }

      const targetHeader = this.headers.find((h) => h.name === header.property);

      this.controlOption.fix = Flag;
      this.controlOption.visible = targetHeader.hasOwnProperty('visible')
        ? !targetHeader.visible
        : false;
      this.controlOption.visibleClear = false;
      this.controlOption.fixClear = false;
    },
    // 칼럼숨기기 전체취소 기능 - SHE고도화(wukjin.j : 22.06.20)
    cancleHide() {
      this.hideColumns.forEach((column) => {
        const header = this.headers.find((h) => h.name === column);

        if (header) {
          header.visible = true;
        }
      });

      this.$forceUpdate();
      this.$nextTick(() => {
        this.$refs.datatable.doLayout();
      });

      this.hideColumns = [];
      this.controlOption.visible = false;
    },
    // 칼럼고정 전체취소 기능 - SHE고도화(wukjin.j : 22.06.20)
    canclefix() {
      if (this.NoFixedFlag) this.NoFixedFlag = !this.NoFixedFlag;
      this.fixColumns.forEach((column) => {
        const header = this.headers.find((h) => h.name === column);

        if (header) {
          header.fixed = false;
        }
      });

      this.$forceUpdate();
      this.$nextTick(() => {
        this.$refs.datatable.doLayout();
      });

      this.fixColumns = [];
    },
    editItem(_prop) {
      this.$emit('editItem', _prop.item);
      _prop.selected = !_prop.selected;
      setTimeout(() => {
        _prop.selected = false;
      }, 1000);
    },
    deleteItem(_prop) {
      // this.$emit('APP_ON_READY');
    },
    moveCreatePage() {
      if (this.createUrl)
        this.$comm.movePageReplace(this.$router, this.createUrl);
      else {
        if (this.popupCallback) this.$emit(this.popupCallback);
      }
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    /**
     * datatable에서 선택된 정보를 eventBus로 부모로 넘긴다.
     *  - datatable.vue > list.vue > popup.vue > create.vue
     */
    selectedData(_item) {
      // var $obj = $(_obj)
      // if ($obj.is(':checked')) this.$emit('selectedData', _item)
      this.$emit('selectedData', _item);
    },
    /**
     * datatable에서 선택된 정보를 부모에 넘긴다.
     */
    getCheckedData() {
      return this.selected.slice();
    },
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.items.slice();
    },
    clearSelected() {
      this.selected = [];
    },
    selectedRow(row, event, column) {
      // ** 2.8 버전으로 upgrade 결과 자체적으로 현재 row에 색을 입힘으로 인해 아래 소스 반영 X

      // 클릭 이벤트시  div/td 일 경우만 할 수 있도록 하였는데... 그 이유를 모르겠음...
      // 그리드 내에 span, input, select 등 여러가지가 있는 상태에서 표시가 되어야 하므로 변경함
      // var clickTarget = event.target;
      // var table = clickTarget;
      // var tr = clickTarget;
      // var elements = [];

      // if (this.displaySelectRow) {
      //   while (table.tagName !== 'TABLE') {
      //     table = table.parentElement;
      //   }
      //   while (tr.tagName !== 'TR') {
      //     tr = tr.parentElement;
      //   }

      //   elements = table.getElementsByClassName("selected-row");
      //   this.$_.forEach(elements, (element) => {
      //     element.classList.remove("selected-row");
      //   });
      //   tr.classList.add("selected-row");
      // }

      // 원본소스
      // var clickTarget = event.target;
      // var table = null;
      // var tr = null;
      // var elements = [];
      // if (clickTarget.tagName === 'DIV')
      // {
      //   table = clickTarget.parentElement.parentElement.parentElement.parentElement;
      //   tr = clickTarget.parentElement.parentElement.parentElement;
      //   if (tr.nodeName !== 'TR') return;

      //   if (this.displaySelectRow) {
      //     elements = table.getElementsByClassName("selected-row");
      //     this.$_.forEach(elements, (element) => {
      //       element.classList.remove("selected-row");
      //     });
      //     tr.classList.add("selected-row");
      //   }
      // }
      // else if (clickTarget.tagName === 'TD') // 간혹 td로 잡히는 경우가 발생
      // {
      //   table = clickTarget.parentElement.parentElement;
      //   tr = clickTarget.parentElement;
      //   if (tr.nodeName !== 'TR') return;

      //   if (this.displaySelectRow) {
      //     elements = table.getElementsByClassName("selected-row");
      //     this.$_.forEach(elements, (element) => {
      //       element.classList.remove("selected-row");
      //     });
      //     tr.classList.add("selected-row");
      //   }
      // }
      // 원본소스
      this.$emit('selectedRow', this.singleSelection);
    },
    rowDoubleClicked() {
      this.$emit('rowDoubleClicked', this.singleSelection);
    },
    expandChange(row, expandedRows) {
      this.$emit('expandChange', row, expandedRows);
    },
    tableRowClassName({ row, rowIndex }) {
      var returnText = '';
      if (rowIndex % 2 === 1) {
        returnText = 'odd-row';
      } else if (rowIndex % 2 === 0) {
        returnText = 'even-row';
      }
      return returnText;
    },
    select(selection, row) {
      this.$emit('select', { selection: selection, row: row });
    },
    selectionChanged(val) {
      this.multipleSelection = val;
      this.$emit('input', this.multipleSelection);
      this.$emit('selectionChanged', this.multipleSelection);
    },
    currentChanged(val) {
      this.singleSelection = val;
      this.$emit('currentChanged', this.singleSelection);
    },
    getDatatableItems() {
      return this.items;
    },
    /**
     * 링크 정보를 클릭했을 때
     */
    linkClicked(_header, _row, _index) {
      this.$emit('tableLinkClicked', _header, _row, _index);
      // TODO : 페이지 이동은 준비중
    },
    /**
     * 페이징 크기 변경
     */
    handleSizeChange(val) {},
    /**
     * 현재 페이지 변경
     */
    handleCurrentChange(val) {},
    getList() {
      if (this.spanOptions || this.customSpanOption) {
        // rowSpan 옵션이 있을 경우 key를 갱신하여 다시 렌더링 하도록 처리
        let nowDate = new Date();
        this.spanKey = nowDate.getMilliseconds();
      }

      if (this.usePaging) {
        if (this.useServerPaging) {
          setTimeout(() => {
            this.datatableItems = this.items;
          }, 100);

          // 서버의 API를 페이징정보를 넘겨 처리합니다.
          this.$emit('onPageChange', {
            page: this.listQuery.page || 1,
            limit: this.listQuery.limit,
          });
        } else {
          let datas = [];
          if (this.setData) {
            datas = this.$_.orderBy(
              this.items,
              this.setData.target,
              this.setData.sort
            );
          } else {
            datas = this.$_.cloneDeep(this.items);
          }
          // :use-paging를 true로 줬을때 컴포넌트들이 표시 안되는 경우 발생하여 setTimeout() 주석처리
          var page = this.listQuery.page || 1;
          var perPage = this.listQuery.limit;
          var offset = (page - 1) * perPage;
          this.datatableItems = this.$_.drop(datas, offset).slice(0, perPage);
        }

        // 5사이즈로 디폴트
        if (this.smPageSizes) {
          this.listQuery.limit = 5;
        }
        //
      } else {
        this.datatableItems = this.items;
      }
    },
    onSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.spanOptions && !this.customSpanOption) return;
      var options = { row, column, rowIndex, columnIndex };
      // return spanRow({ row, column, rowIndex, columnIndex }, this.datatableItems, this.spanOptions)
      if (this.customSpanOption) {
        return this.customSpanOption(options, this.datatableItems);
      }

      return spanRow(options, this.datatableItems, this.spanOptions);
    },
    async gridExcel() {
      var Excel = require('exceljs/dist/exceljs');
      // const Excel = require('exceljs/dist/es5');
      var FileSaver = require('file-saver');
      const wb = new Excel.Workbook();
      let ws = wb.addWorksheet('Sheet 1');

      // var tables = this.$refs.datatable.$el.getElementsByTagName('table');
      // var exportTable = document.createElement('table');
      // 헤더를 이용하여 위치 데이터 설정(input, textarea 등 컨트롤이 있다면 값이 안나옴)
      var headerName = [];
      if (this.useRownum) {
        headerName.push({
          key: '_rowNum',
          type: 'rowNum',
          // header: 'No',
        });
      }

      var getHeaderName = function (_child, thiss) {
        for (var i = 0; i < _child.length; i++) {
          if (_child[i].child) {
            getHeaderName(_child[i].child, thiss);
          } else {
            headerName.push({
              key: _child[i].name,
              type: _child[i].type,
            });
          }
        }
      };

      let headers = this.customHeaders ? this.customHeaders : this.headers;

      for (var i = 0; i < headers.length; i++) {
        if (headers[i].child) {
          getHeaderName(headers[i].child, this);
        } else {
          headerName.push({
            key: headers[i].name,
            type: headers[i].type,
            // header: headers[i].text,
          });
        }
      }

      // depth 조회
      var getDepth = (_child, depth) => {
        // default depth
        if (!depth) {
          depth = 1;
        }
        let maxDept = depth;
        for (var i = 0; i < _child.length; i++) {
          if (_child[i].child) {
            let newDepth = getDepth(_child[i].child, depth + 1);
            maxDept = newDepth > maxDept ? newDepth : maxDept;
          }
        }
        return maxDept;
      };

      // rowspan 조회
      var getRowspan = (_child) => {
        let length = 0;
        for (var i = 0; i < _child.length; i++) {
          if (_child[i].child) {
            length += getRowspan(_child[i].child);
          } else {
            length++;
          }
        }
        return length;
      };

      var makeColumns = (_ws, _header, _columnIdx, _depth) => {
        if (!_columnIdx) _columnIdx = 0;
        if (!_depth) _depth = 1;
        let mergeDepth = getDepth(_header);
        this.$_.forEach(_header, (h, idx) => {
          let prevLetter = '';
          let prevVal = 0;
          let letterVal = idx + _columnIdx;
          for (; letterVal >= 26; ) {
            letterVal = letterVal - 26;
            prevVal++;
          }
          if (prevVal > 0) {
            prevLetter = (prevVal + 9).toString(36).toUpperCase();
          }
          let columnLetter =
            prevLetter + (letterVal + 10).toString(36).toUpperCase();
          if (h.child) {
            let rowspanCnt = getRowspan(h.child);
            if (rowspanCnt > 1) {
              let lastPrevLetter = '';
              let lastPrevVal = 0;
              let LastLetterVal = idx + _columnIdx + rowspanCnt - 1;
              for (; LastLetterVal >= 26; ) {
                LastLetterVal = LastLetterVal - 26;
                lastPrevVal++;
              }
              if (lastPrevVal > 0) {
                lastPrevLetter = (lastPrevVal + 9).toString(36).toUpperCase();
              }
              let lastLetter =
                lastPrevLetter +
                (LastLetterVal + 10).toString(36).toUpperCase();
              _ws.mergeCells(columnLetter + _depth + ':' + lastLetter + _depth);
              _ws.getCell(columnLetter + _depth).value =
                this.$comm.getLangSpecInfoLabel(h.text);
              makeColumns(_ws, h.child, idx + _columnIdx, _depth + 1);
              _columnIdx += rowspanCnt - 1;
            } else {
              _ws.getCell(columnLetter + _depth).value =
                this.$comm.getLangSpecInfoLabel(h.text);
            }
          } else {
            if (mergeDepth > 1) {
              _ws.mergeCells(
                columnLetter + _depth + ':' + columnLetter + mergeDepth
              );
            }
            _ws.getCell(columnLetter + _depth).value =
              this.$comm.getLangSpecInfoLabel(h.text);
          }
        });
      };

      let rowData = [];
      if (this.useServerPaging) {
        let data = this.excelItems ? this.excelItems : this.items;
        if (this.useRownum) {
          data = data.map((item, index) => {
            item._rowNum = index + 1;
            return item;
          });
        }
        rowData = data;
      } else {
        rowData = this.$_.map(this.items, (row, idx) => {
          row._rowNum = idx + 1;

          return row;
        });
      }

      if (rowData && rowData.length > 0) {
        // header
        let headerDepth = getDepth(headers);
        if (this.useRownum) {
          ws.mergeCells('A1:A' + headerDepth);
          ws.getCell('A1').value = 'No';
        }
        makeColumns(ws, headers, this.useRownum ? 1 : 0);

        ws.columns = this.$_.cloneDeep(headerName);
        if (rowData.length > 0) {
          this.$_.forEach(rowData, (item) => {
            ws.addRow(item);
          });
        }
        let maxColumnWidth = this.gridExcelMaxColWidth;
        ws.columns.forEach(function (column, i) {
          let maxLength = 0;
          column['eachCell']({ includeEmpty: true }, function (cell) {
            let columnLength = cell.value
              ? cell.value.toString().length + 5
              : 10;
            if (columnLength > maxLength) {
              maxLength = columnLength;
            }
          });
          // excel max column width

          column.width =
            maxLength < 10
              ? 10
              : maxLength > maxColumnWidth
              ? maxColumnWidth
              : maxLength;
        });

        // cost type 3자리 콤마
        let costComma = this.gridExcelCostComma;
        // border all
        let setAllBorder = this.gridExcelSetAllBorder;
        ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
          row.eachCell(function (cell, colNumber) {
            const addAlignOption =
              cell._column.width >= maxColumnWidth
                ? { wrapText: true, horizontal: 'left' }
                : {};

            cell.font = {
              name: 'Arial',
              family: 2,
              bold: false,
              size: 8,
              height: 20,
            };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
              ...addAlignOption,
            };

            if (rowNumber <= headerDepth) {
              for (let i = 1; i <= cell._row._cells.length; i++) {
                row.getCell(i).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'C7C7C7' },
                };

                row.getCell(i).border = {
                  top: { style: 'thin', color: { argb: '999999' } },
                  left: { style: 'thin', color: { argb: '999999' } },
                  bottom: { style: 'thin', color: { argb: '999999' } },
                  right: { style: 'thin', color: { argb: '999999' } },
                };
              }
            }
            // border all
            if (setAllBorder) {
              for (let i = 1; i <= cell._row._cells.length; i++) {
                row.getCell(i).border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' },
                };
              }
            }
            // cost type 3자리 콤마
            if (costComma && headerName[colNumber - 1].type === 'cost') {
              cell.value = cell.value
                .toString()
                .replace(/^-?\d+/g, (m) =>
                  m.replace(/(?=(?!\b)(\d{3})+$)/g, ',')
                );
            }
          });
        });

        var tmp = this.label.replace(/\//g, '_');
        const fileName =
          this.$comm.getLangSpecInfoLabel(tmp) +
          '_' +
          this.$comm.moment().format('YYYYMMDDHHmmSS') +
          '.xlsx';
        // wb.xlsx.writeFile('a.xlsx');
        wb.xlsx
          .writeBuffer()
          .then((buffer) => FileSaver.saveAs(new Blob([buffer]), fileName))
          .catch((err) => console.log('Error writing excel export', err));
      }

      // 기존의 엑셀다운로드 (wukjin 2023-03-15)
      // if (!this.usePaging && this.useServerPaging) {
      //   if (!this.searchExcelTotalUrl || !this.searchExcelTotalParam) {
      //     window.getApp.$emit('ALERT', {
      //       title: '안내',
      //       message:
      //         '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.',
      //       type: 'warning',
      //     });
      //   } else {
      //     let searchExcelTotalParam = this.$_.clone(this.searchExcelTotalParam);
      //     searchExcelTotalParam.pageSize = -1;
      //     this.$http.url = this.searchExcelTotalUrl;
      //     this.$http.type = 'GET';
      //     this.$http.param = searchExcelTotalParam;
      //     this.$http.request(
      //       (_result) => {
      //         this.createExcel(_result.data.items);
      //       },
      //       (_error) => {
      //         window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //       }
      //     );
      //   }
      // } else {
      //   this.createExcel(this.items);
      // }
    },
    gridExcelServer() {
      if (!this.excelDownUrl) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '[에러] 관리자에게 문의하세요',
          type: 'warning', // success / info / warning / error
        });
      } else {
        let thisVue = this;
        this.$http.url = this.excelDownUrl;
        this.$http.type = 'POST';
        this.$http.param = {
          tableHeaders: this.headers,
          searchParam: this.searchParam,
        };
        this.$http.request(
          (_result) => {
            let fileOrgNm = this.label + '.xls';
            var blob = thisVue.$comm.base64ToBlob(_result.data);
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
            } else {
              let link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = fileOrgNm;
              link.click();
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    createExcel(rowData) {
      var tables = this.$refs.datatable.$el.getElementsByTagName('table');
      var exportTable = document.createElement('table');
      // 헤더를 이용하여 위치 데이터 설정(input, textarea 등 컨트롤이 있다면 값이 안나옴)
      var headerName = [];
      if (this.useRownum) {
        headerName.push({ name: '_rowNum', text: 'No' });
      }
      var getHeaderName = function (_child) {
        for (var i = 0; i < _child.length; i++) {
          if (_child[i].child) {
            getHeaderName(_child[i].child);
          } else {
            headerName.push({ name: _child[i].name, text: _child[i].text });
          }
        }
      };
      for (var i = 0; i < this.headers.length; i++) {
        if (!this.headers[i].hidden) {
          if (this.headers[i].child) {
            getHeaderName(this.headers[i].child);
          } else {
            headerName.push({
              name: this.headers[i].name,
              text: this.headers[i].text,
            });
          }
        }
      }

      if (tables.length > 0) {
        // 테이블 그대로 export excel 테이블 내에 input 등의 컨트롤이 있다면... 안의 내용아 안나옴.
        // 헤더만 그림
        // for (var i = 0; i < 1; i++) {
        //   // tables.length
        //   for (var j = 0; j < tables[i].rows.length; j++) {
        //     let exportRow = document.createElement('tr');
        //     for (var k = 0; k < headerName.length; k++) {
        //       var val = headerName[k].text;
        //       let exportCell = document.createElement('th');
        //       $(exportCell).html(
        //         '<div class="cell"><div class="cell"><span>' +
        //           val +
        //           '</span></div></div>'
        //       );
        //       $(exportRow).append(exportCell);
        //     }
        //     $(exportTable).append(exportRow);
        //   }
        // }

        // 테이블 그대로 export excel 테이블 내에 input 등의 컨트롤이 있다면... 안의 내용아 안나옴.
        for (var j = 0; j < tables[0].rows.length; j++) {
          var $row = $(tables[0].rows[j]).clone();
          let exportRow;

          if ($row.find('.el-checkbox__inner').length > 0) {
            $row.find('th')[0].remove();
            exportRow = $row;
          } else if ($row.find('.el-table__expand-column').length > 0) {
            $row.find('.el-table__expand-column')[0].remove();
            exportRow = $row;
          } else {
            exportRow = $row;
          }
          $(exportTable).append(exportRow);
        }

        // let rowData = [];
        // if (this.useServerPaging) {
        //   rowData = this.excelItems;
        // } else {
        //   rowData = this.items;
        // }
        if (rowData.length > 0) {
          let i = 1;
          this.$_.forEach(rowData, (item) => {
            // row 생성
            let exportRow = document.createElement('tr');
            this.$_.forEach(headerName, (header) => {
              let exportCell = document.createElement('td');
              let val = item[header.name];
              if (header.name === '_rowNum') {
                val = String(i);
                i++;
              } else if (!val) {
                if (val === 0) {
                  val = '0';
                } else {
                  val = '';
                }
              }
              $(exportCell).html(
                '<div class="cell"><div class="cell"><span>' +
                  String(val) +
                  '</span></div></div>'
              );
              $(exportRow).append(exportCell);
            });
            $(exportTable).append(exportRow);
          });
        }

        var tmp = this.label.replace(/\//g, '_');
        const fileName =
          this.$comm.getLangSpecInfoLabel(tmp) +
          '_' +
          this.$comm.moment().format('YYYYMMDDHHmmSS') +
          '.xlsx';
        const wsName = this.$comm.getLangSpecInfoLabel(tmp);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(exportTable, {
          raw: true, // 그리드의 data를 raw string으로 export 하는 설정, true일 경우 dateNF 설정 미적용됨
          dateNF: 'yyyy-mm-dd',
        });
        // ws.F2.t = 's';

        // var range = { s: {r:1, c:1}, e: {r:2, c:3} };
        // for(var R = range.s.r; R <= range.e.r; ++R) {
        //   for(var C = range.s.c; C <= range.e.c; ++C) {
        //     var cell_address = {c:C, r:R};
        //     /* if an A1-style address is needed, encode the address */
        //     var cell_ref = ws[XLSX.utils.encode_cell(cell_address)];
        //     cell_ref.t = 's';
        //   }
        // }

        // var range = { s: {r:1, c:1}, e: {r:2, c:3} };
        // for(var R = range.s.r; R <= range.e.r; ++R) {
        //   for(var C = range.s.c; C <= range.e.c; ++C) {

        //     var cell = ws[XLSX.utils.encode_cell({r:R,c:C})];
        //     if(!cell) continue; // only format numeric cells
        //     cell.t = 's';
        //   }
        // }

        XLSX.utils.book_append_sheet(wb, ws, wsName);
        XLSX.writeFile(wb, fileName);
      }
    },
    gridPrint() {
      alert('그리드 프린트 기능 개발 중...');
    },
    btnSearchDeptClicked(row, headerName) {
      if (!this.editable) return;
      // 선택한 row와 헤더의 명칭을 저장한다.
      this.row = row;
      this.headerName = headerName;

      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
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
        this.row[this.headerName].deptCd = data.dept.deptCd;
        this.row[this.headerName].deptNm = data.dept.deptNm;

        this.$forceUpdate();
      }
    },
    btnSearchUserClicked(row, headerName) {
      if (!this.editable) return;
      // 선택한 row와 헤더의 명칭을 저장한다.
      this.row = row;
      this.headerName = headerName;
      let deptCd = '';
      if (
        typeof this.row.createDept !== 'undefined' &&
        this.row.createDept.deptCd !== ''
      ) {
        deptCd = this.row.createDept.deptCd;
      } else if (
        typeof this.row.pDeptCd !== 'undefined' &&
        this.row.pDeptCd !== ''
      ) {
        deptCd = this.row.pDeptCd;
      } else {
        deptCd = this.$store.getters.deptCd;
      }
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
        deptCd: deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.row[this.headerName].userNm = data.user.userNm;
        this.row[this.headerName].userId = data.user.userId;
        if (this.row.createDept) {
          this.row.createDept = {
            deptNm: data.user.deptNm,
            deptCd: data.user.deptCd,
          };
        }
        if (typeof this.row.pDeptNm !== 'undefined') {
          this.row.pDeptNm = data.user.deptNm;
          this.row.pDeptCd = data.user.deptCd;
        }

        this.$forceUpdate();
        this.$emit('userChange', this.headerName, this.row);
      }
    },
    singlecheckedRow(data) {
      this.$emit('singlecheckedRow', data);
    },
    sortChange(data) {
      let sort = data.order === 'ascending' ? 'asc' : 'desc';
      this.setData = {
        target: sort ? [data.prop] : [],
        sort: sort ? [sort] : [],
      };
      this.getList();
      this.$emit('onSortChange', data);
    },
    inputChange(name, scope) {
      this.$emit('inputChange', {
        name: name,
        row: scope.row,
        index: scope.$index,
      });
    },
    inputText(name, scope, value) {
      this.$emit('inputText', {
        name: name,
        row: scope.row,
        index: scope.$index,
        text: value,
      });
    },
    change(name, scope) {
      this.$emit('change', {
        name: name,
        row: scope.row,
        index: scope.$index,
      });
    },
    toggleSelection(rows) {
      if (rows) {
        this.$_.forEach(rows, (row) => {
          this.$refs.datatable.toggleRowSelection(row);
        });
      } else {
        this.$refs.datatable.clearSelection();
      }
    },
    onScroll() {},
    getGridHeight() {
      this.$nextTick(() => {
        if (this.OriginalGridHeight === 'auto') {
          if (!this.$refs.datatable) return;
          // body 영역 높이
          let bodyHeight = document.body.clientHeight;
          // datatable 제목 높이
          let datatableTitleHeight = this.$refs.datatableTitle
            ? this.$refs.datatableTitle.clientHeight
            : 0;
          // datatable의 영역(좌표값)
          let datatableRect = this.$refs.datatable.$el.getBoundingClientRect();
          // footer 높이
          let footerHeight = $('#footer').height();
          let pagingHeight = 44;
          let cardContentMarginBottom = 15;
          // TODO: body높이 - datatable 좌표 - 타이틀 높이 - footer 높이 - 페이징 높이
          this.gridHeight =
            bodyHeight -
            datatableRect.top -
            footerHeight -
            pagingHeight -
            cardContentMarginBottom;
          if (this.gridHeight <= 0)
            this.gridHeight =
              this.height +
              (footerHeight - pagingHeight - cardContentMarginBottom);
          // this.tmpHeight = this.height === 'auto' ? this.gridHeight : this.height;

          // this.gridHeight =
          //   this.tmpHeight +
          //   (this.usePaging ? 0 : 40) -
          //   (this.tabApply ? 50 : 0) - // 탭으로 구현되었으면 탭 높이만큼 빼준다.(수정 보완이 필요할듯.)
          //   (this.spanOptions ? 25 : 0); // 그리드 해더가 merge된 경우 옵션처리
        } else {
          this.gridHeight = this.height;
        }
        return 'height: ' + this.gridHeight + ';'; // border-color:red;
      });
    },
    getSaveFiles() {
      let returnData = {
        tempId: [],
        files: [],
      };
      let ready = this.$_.filter(this.$_.clone(this.saveData.files), {
        status: 'ready',
      });
      let tempIds = [];
      let files = [];
      if (ready && ready.length > 0) {
        this.$_.forEach(ready, (item) => {
          tempIds = this.$_.concat(tempIds, this.$_.map(item.raw, 'tempId'));
          files = this.$_.concat(files, item.raw);
        });
      }
      tempIds = this.$_.uniq(tempIds);

      returnData.tempId = tempIds;
      returnData.files = files;
      return returnData;
    },
    setCurrentRow(row) {
      /**
       * 22.01.03 lhj
       * 선택된 row highlight 처리
       * single row selection에서 사용
       */
      if (row) {
        this.$refs.datatable.setCurrentRow(row);
      } else {
        this.$refs.datatable.setCurrentRow(-1);
      }
    },
  },
};
</script>

<style>
.shortened {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.control-panel {
  min-width: 150px;
  background: #fafafa;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  display: block;
  padding: 1rem;
  position: fixed;
  z-index: 999999;
}
.control-panel h4 {
  font-size: 14px;
  font-weight: bold;
}
.control-panel h4 > span {
  color: #bbb;
}
.control-panel .options {
  display: flex;
  align-items: center;
}
.control-panel .options label {
  font-weight: normal !important;
  margin-left: 10px;
  font-size: 15px;
}
</style>
