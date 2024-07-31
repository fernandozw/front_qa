<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="stepId">
          <el-input
            placeholder="输入步骤id"
            v-model="stepId"
            clearable
            size="mini"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="模块名称">
          <el-select
            v-model="module"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in moduleList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用例级别">
          <el-select
            v-model="level"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in levelList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义标签">
          <el-input
            placeholder="输入自定义标签"
            v-model="label"
            clearable
            size="mini"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="timeRange"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="search" size="mini"
            >查询
          </el-button>
          <el-button type="success " round :disabled="true" size="mini"
            >新增
          </el-button>
          <el-button type="info" round @click="reset" size="mini"
            >重置
          </el-button>
          <el-button type="danger" round @click="clickExec" size="mini"
            >批量执行
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 20px">
      <test-case-table
        :tabData="tableData"
        :tabHeader="tableHeader"
      ></test-case-table>
    </div>
    <el-pagination
      @current-change="getCaseList"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
    <exec-case-dialog
      v-if="execDialogVisible"
      :visible="execDialogVisible"
      :case-info="caseInfo"
      :exec-type="execType"
      @listenToChildEvent="callbackFuncExec"
    ></exec-case-dialog>
  </div>
</template>

<script>
import TestCaseTable from './TestCaseTable.vue';
import ExecCaseDialog from '../HttpRunnerTemplate/ExecCaseDialog.vue';

export default {
  name: 'TestCaseList',
  components: { TestCaseTable, ExecCaseDialog },
  data() {
    return {
      execDialogVisible: false,
      caseInfo: {},
      execType: 2,
      module: '',
      stepId: '',
      level: '',
      label: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      moduleList: [],
      levelList: [],
      tableData: [],
      tableHeader: [],
      timeRange: []
    };
  },
  methods: {
    // 校验输入、选项框是否为空
    isEmpty(obj) {
      if (obj === undefined || obj === '') {
        return true;
      } else {
        return false;
      }
    },
    // 重置查询条件
    reset() {
      this.initConditions();
      this.getConditions();
      this.getCaseList();
    },
    // 初始化查询条件
    initConditions() {
      this.stepId = '';
      this.level = '';
      this.label = '';
      this.module = '';
      this.timeRange = [];
      this.pageSize = 10;
      this.currentPage = 1;
    },

    // 获取查询条件列表
    getConditions() {
      this.moduleList = [];
      this.levelList = [];
      let moduleUrl = String.format(
        '{0}/condition/moduleList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let levelUrl = String.format(
        '{0}/condition/levelList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      this.axios
        .get(moduleUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.moduleList = response.data.module_list;
          return response;
        })
        .catch(response => {
          return response;
        });
      this.axios
        .get(levelUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.levelList = response.data.level_list;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取用例列表
    getCaseList() {
      let startTime = '';
      let endTime = '';
      if (this.timeRange != null && this.timeRange.length > 0) {
        startTime = this.timeRange[0];
        endTime = this.timeRange[1];
      }
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/case/caseList', this.GLOBAL.HTTPRUNNER_URL);
      let conditions = {
        step_id: this.stepId,
        level: this.level,
        module: this.module,
        label: this.label,
        start_time: startTime,
        end_time: endTime,
        page_index: this.currentPage
      };
      this.axios
        .post(url, JSON.stringify(conditions), config)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.total = response.data.total;
          let caseInfo = response.data.caseInfo;
          this.tableHeader = caseInfo.tableHeader;
          this.tableData = caseInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    search() {
      this.currentPage = 1;
      this.getCaseList();
    },
    init() {
      this.getConditions();
      this.getCaseList();
    },
    callbackFuncExec() {
      this.execDialogVisible = false;
    },
    // 点击批量执行按钮
    clickExec() {
      this.execDialogVisible = true;
      this.caseInfo = {
        module: '',
        step_id: '',
        env: 'tests',
        level: 'p0',
        label: '',
        workers: '1',
        inp: '',
        repeat: '1'
      };
    }
  },
  beforeMount() {
    this.init();
  }
};
</script>

<style scoped>
.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
