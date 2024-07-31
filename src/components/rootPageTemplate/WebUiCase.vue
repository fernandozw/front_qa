<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="mini">
      <el-form-item label="id">
        <el-input
          v-model="searchForm.id"
          placeholder="输入id"
          clearable
          style="width: 100px"
        ></el-input>
      </el-form-item>
      <el-form-item label="用例名称">
        <el-input
          v-model="searchForm.caseName"
          placeholder="输入用例名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="所属业务:">
        <el-select
          v-model="searchForm.pageId"
          placeholder="必填项:请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in pageList"
            :key="item.id"
            :label="'「' + item.id + '」' + item.pageName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面类型">
        <el-select
          v-model="searchForm.pageType"
          filterable
          placeholder="选择页面类型"
          clearable
        >
          <el-option
            v-for="item in pageTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机类型">
        <el-select
          v-model="searchForm.phoneType"
          filterable
          placeholder="选择手机类型"
          clearable
        >
          <el-option
            v-for="item in phoneTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="浏览器类型">
        <el-select
          v-model="searchForm.browserType"
          filterable
          placeholder="选择浏览器类型"
          clearable
        >
          <el-option
            v-for="item in browserTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否可用">
        <el-select
          v-model="searchForm.canUse"
          filterable
          placeholder="选择是否可用"
          clearable
        >
          <el-option
            v-for="item in canUseList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运行状态">
        <el-select
          v-model="searchForm.status"
          filterable
          placeholder="选择运行状态"
          clearable
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchForm.startTime"
          type="datetimerange"
          align="right"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 360px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-date-picker
          v-model="searchForm.updateTime"
          type="datetimerange"
          align="right"
          start-placeholder="起始时间"
          end-placeholder="截止时间"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 360px;"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          :on-change="handleChange"
          :show-file-list="false"
          :auto-upload="false"
          action=""
        >
          <el-tooltip
            effect="dark"
            content="用例将会与所属业务选定的业务关联,如果未选定,将会新建一个业务"
            placement="top"
          >
            <el-button size="mini" type="warning" style="margin-bottom:15px;"
              >导入
            </el-button>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="danger"
          @click="openCaseListDialog"
          style="margin-bottom:15px;"
          >执行用例集
        </el-button>
      </el-form-item>
      <el-form-item style="float: right;margin-right: 60px">
        <el-button type="primary" @click="getCaseList('search')"
          >查询
        </el-button>
        <el-button type="success" @click="clickAddBtn">新增</el-button>
        <el-button type="info" @click="getCaseList('reset')">重置</el-button>
      </el-form-item>
    </el-form>
    <web-ui-case-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :case-id="caseId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></web-ui-case-dialog>

    <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      border
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        fixed="left"
        prop="id"
        label="id"
        width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="caseName"
        label="用例名称"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="pageId"
        label="所属业务"
        width="180"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            「{{ tableData[scope.$index].pageId }}」{{
              tableData[scope.$index].pageName
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pageType"
        label="页面类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="phoneType"
        label="手机类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="browserType"
        label="浏览器类型"
        width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="是否可用" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ canUseMap[tableData[scope.$index].canUse] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ statusMap[tableData[scope.$index].status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="addTime"
        label="创建时间"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            :content="
              !debugStatus
                ? '若使用调试功能,请开启调试模式!'
                : '调试模式下,请确保本地driverNode启动成功!'
            "
            placement="top"
          >
            <el-button
              type="text"
              size="mini"
              @click="openDebugDialog(tableData[scope.$index].id)"
              :disabled="!debugStatus"
              >调试
            </el-button>
          </el-tooltip>
          <el-button
            type="text"
            size="mini"
            @click="execCase(tableData[scope.$index].id)"
            >执行
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="caseDetail(tableData[scope.$index].id, 'edit')"
            >编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="deleteCase(tableData[scope.$index].id)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="caseDetail(tableData[scope.$index].id, 'copy')"
            >复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getCaseList('search')"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
    <el-dialog
      title="执行用例集"
      :visible.sync="caseListDialog"
      :before-close="closeCaseListDialog"
      width="40%"
    >
      <div>
        <el-select
          size="mini"
          v-model="execCaseList"
          placeholder="请选择用例"
          multiple
          filterable
          style="width: 500px"
        >
          <el-option-group
            v-for="group in pageAndCaseOptions"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="'「' + item.value + '」' + item.label"
              :value="item.value"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCaseListDialog" size="mini">取 消</el-button>
        <el-button
          type="primary"
          @click="execCases"
          size="mini"
          :disabled="execCaseList.length < 1"
          >执 行</el-button
        >
      </span>
    </el-dialog>
    <debug-case-dialog
      v-if="openDebugCaseDialog"
      :visible="openDebugCaseDialog"
      :case-id="caseId"
      @listenToChildEvent="callbackFuncForDebug"
    ></debug-case-dialog>
  </div>
</template>

<script>
import WebUiCaseDialog from '../WebUiTestTemplate/WebUiCaseDialog';
import DebugCaseDialog from '../WebUiTestTemplate/DebugCaseDialog';

export default {
  name: 'WebUiCase',
  components: {
    webUiCaseDialog: WebUiCaseDialog,
    debugCaseDialog: DebugCaseDialog
  },
  data() {
    return {
      debugStatus: true,
      execCaseList: [],
      caseListDialog: false,
      pageAndCaseOptions: [],
      dialogVisibleType: 1,
      caseId: null,
      dialogVisible: false,
      downloadDialogVisible: false,
      openDebugCaseDialog: false,
      searchForm: {
        id: '',
        caseName: '',
        pageId: '',
        pageType: '',
        phoneType: '',
        browserType: '',
        canUse: '',
        status: '',
        startTime: [],
        updateTime: []
      },
      pageList: [],
      pageTypeList: [],
      phoneTypeList: [],
      browserTypeList: [],
      canUseList: [],
      canUseMap: {},
      statusList: [],
      statusMap: {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    // 打开debug弹窗
    openDebugDialog(id) {
      this.caseId = id;
      this.openDebugCaseDialog = true;
    },
    execCases() {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/case/execCaseList', this.GLOBAL.WEBUI_URL);
      let param = { caseIds: this.execCaseList.join(',') };
      this.axios
        .post(url, JSON.stringify(param), config)
        .then(response => {
          this.Message.success(response.data.msg);

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    closeCaseListDialog() {
      this.caseListDialog = false;
      this.execCaseList = [];
      this.pageAndCaseOptions = [];
    },
    openCaseListDialog() {
      this.caseListDialog = true;
      let url = String.format('{0}/case/getPageAndCase', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.pageAndCaseOptions = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    handleChange(file) {
      this.fileContent = file;
      const fileName = file.name;
      const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (this.fileContent) {
        if (fileType === 'side') {
          let reader = new FileReader();
          reader.readAsText(file.raw, 'UTF-8');
          let that = this;
          reader.onload = function(e) {
            that.insertCaseByIde(e.target.result);
          };
        } else {
          this.$message({
            type: 'warning',
            message: '文件格式错误，请重新上传！'
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请上传附件！'
        });
      }
    },
    // 导入selenium ide的脚本
    insertCaseByIde(param) {
      let paramJson = JSON.parse(param);
      paramJson['pageId'] = this.searchForm.pageId;
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format(
        '{0}/case/insertCaseByIde',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .post(url, paramJson, config)
        .then(response => {
          if (response.data.code === '1000') {
            this.Message.success(
              '导入成功,用例id列表:' + response.data.data.caseIdList
            );
            this.getCaseList('normal');
          } else {
            this.Message.error('导入失败:' + response.data.data.msg);
            this.getCaseList('normal');
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    getDebugValue() {
      let url = String.format('{0}/debugCase/getStatus', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.debugStatus = response.data.data.status;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取元素列表
    getCaseList(model) {
      this.getDebugValue();
      // 重置
      if (model === 'reset') {
        this.currentPage = 1;
        this.resetSearchForm();
        // 新增、编辑、删除
      } else if (model === 'normal') {
        this.currentPage = 1;
      }
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/case/cases', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.tableData = response.data.data.cases;
          this.total = response.data.data.total;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    callbackFuncForDebug() {
      this.openDebugCaseDialog = false;
    },
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getCaseList('normal');
      }
    },
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    },

    // 用例详情
    caseDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.caseId = id;
      this.dialogVisible = true;
    },
    // 删除用例
    deleteCase(id) {
      this.$confirm(
        String.format('此操作将永久删除该用例(id:{0}), 是否继续?', id),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 指定参数格式
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let url = String.format('{0}/case/delete', this.GLOBAL.WEBUI_URL);
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getCaseList('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getCaseList('normal');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/case/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.pageList = response.data.data.pageList;
          this.pageTypeList = response.data.data.pageTypeList;
          this.phoneTypeList = response.data.data.phoneTypeList;
          this.browserTypeList = response.data.data.browserTypeList;
          this.canUseList = response.data.data.canUseList;
          this.canUseMap = response.data.data.canUseMap;
          this.statusList = response.data.data.statusList;
          this.statusMap = response.data.data.statusMap;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 重置查询条件表单
    resetSearchForm() {
      this.searchForm = {
        id: '',
        caseName: '',
        pageId: '',
        pageType: '',
        phoneType: '',
        browserType: '',
        status: '',
        canUse: '',
        startTime: [],
        updateTime: []
      };
    },
    // 执行用例
    execCase(id) {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/case/execCase', this.GLOBAL.WEBUI_URL);
      const param = { id: id };
      this.axios
        .post(url, JSON.stringify(param), config)
        .then(response => {
          if (response.data.code === '1000') {
            this.Message.success(response.data.msg);
          } else {
            this.Message.error(response.data.msg);
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },

  beforeMount() {
    this.getConditions();
    this.getCaseList();
    this.getDebugValue();
  }
};
</script>

<style scoped>
.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}

.el-message-box__wrapper >>> .el-message-box {
  width: 450px !important;
}
</style>
