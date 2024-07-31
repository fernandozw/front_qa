<template>
  <div>
    <div>
      <el-row style="margin-top: -10px;" :gutter="40">
        <el-col :span="2">
          <span>执行流水号</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="输入执行流水号"
            v-model="serialNumber"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <span>模块名称</span>
        </el-col>
        <el-col :span="4">
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
        </el-col>
        <el-col :span="2" :push="1">
          <span>步骤id</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="输入步骤id"
            v-model="stepId"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <span>步骤名称</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="输入步骤名称"
            v-model="stepName"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: -10px" :gutter="10">
        <el-col :span="3">
          <span>执行结果</span>
        </el-col>
        <el-col :span="2" :pull="1">
          <el-select
            v-model="status"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in statusList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>所属环境</span>
        </el-col>
        <el-col :span="2" :pull="1">
          <el-select
            v-model="env"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in envList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <span>执行日期</span>
        </el-col>
        <el-col :span="8" :pull="1">
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
        </el-col>
        <el-col :span="3" style="float: right">
          <el-button type="primary" round @click="search" size="mini"
            >查询
          </el-button>
          <el-button type="info" round @click="reset" size="mini"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <result-table
        :tabData="tableData"
        :tabHeader="tableHeader"
      ></result-table>
    </div>
    <el-pagination
      @current-change="getResultList"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
  </div>
</template>

<script>
import ResultTable from './ResultTable.vue';

export default {
  name: 'ResultList',
  components: { ResultTable },
  data() {
    return {
      serialNumber: '',
      module: '',
      stepId: '',
      stepName: '',
      status: '',
      env: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      moduleList: [],
      statusList: [],
      envList: [],
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
      this.getResultList();
    },
    // 初始化查询条件
    initConditions() {
      this.serialNumber = '';
      this.module = '';
      this.stepId = '';
      this.stepName = '';
      this.status = '';
      this.env = '';
      this.timeRange = [];
      this.pageSize = 10;
      this.currentPage = 1;
    },

    // 获取列表页查询条件下拉列表
    getConditions() {
      this.moduleList = [];
      this.envList = [];
      this.statusList = [];
      let moduleUrl = String.format(
        '{0}/condition/moduleList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let envUrl = String.format(
        '{0}/condition/envList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let statusUrl = String.format(
        '{0}/condition/statusList',
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
        .get(envUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.envList = response.data.env_list;
          return response;
        })
        .catch(response => {
          return response;
        });
      this.axios
        .get(statusUrl)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.statusList = response.data.status_list;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取结果列表
    getResultList() {
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
      let url = String.format(
        '{0}/result/resultList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let conditions = {
        serial_number: this.serialNumber,
        module: this.module,
        step_id: this.stepId,
        name: this.stepName,
        result: this.status,
        env: this.env,
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
          let resultInfo = response.data.resultInfo;
          this.tableHeader = resultInfo.tableHeader;
          this.tableData = resultInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    search() {
      this.currentPage = 1;
      this.getResultList();
    },
    init() {
      this.getConditions();
      this.getResultList();
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
