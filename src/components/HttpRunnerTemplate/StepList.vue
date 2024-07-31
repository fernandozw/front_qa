<template>
  <div>
    <div>
      <el-row style="margin-top: -10px;" :gutter="40">
        <el-col :span="2">
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
        <el-col :span="3" :push="1">
          <span>步骤名称</span>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="输入步骤名称"
            v-model="name"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <span>模块名称</span>
        </el-col>
        <el-col :span="6">
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
      </el-row>
      <el-row style="margin-top: -10px" :gutter="10">
        <el-col :span="3">
          <span>描述信息</span>
        </el-col>
        <el-col :span="4" :pull="1">
          <el-input
            placeholder="输入描述信息"
            v-model="desc"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="3" :pull="1">
          <span>创建日期</span>
        </el-col>
        <el-col :span="8" :pull="2">
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
        <el-col :span="6" style="float: right">
          <el-button type="primary" round @click="search" size="mini"
            >查询
          </el-button>
          <el-button type="success " round :disabled="true" size="mini"
            >新增
          </el-button>
          <el-button type="info" round @click="reset" size="mini"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px">
      <step-table :tabData="tableData" :tabHeader="tableHeader"></step-table>
    </div>
    <el-pagination
      @current-change="getStepList"
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
import StepTable from './StepTable.vue';

export default {
  name: 'StepList',
  components: { StepTable },
  props: {
    stepIdFromList: ''
  },
  data() {
    return {
      module: '',
      stepId: '',
      name: '',
      desc: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      moduleList: [],
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
      this.getStepList();
    },
    // 初始化查询条件
    initConditions() {
      this.stepId = '';
      this.name = '';
      this.desc = '';
      this.module = '';
      this.timeRange = [];
      this.pageSize = 10;
      this.currentPage = 1;
    },

    // 获取列表页查询条件下拉列表
    getConditions() {
      this.methodList = [];
      let url = String.format(
        '{0}/condition/moduleList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      this.axios
        .get(url)
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
    },
    // 获取步骤列表
    getStepList() {
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
      let url = String.format('{0}/step/stepList', this.GLOBAL.HTTPRUNNER_URL);
      let conditions = {
        step_id: this.stepId,
        name: this.name,
        module: this.module,
        desc: this.desc,
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
          let stepInfo = response.data.stepInfo;
          this.tableHeader = stepInfo.tableHeader;
          this.tableData = stepInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    search() {
      this.currentPage = 1;
      this.getStepList();
    },
    init() {
      this.stepId = this.stepIdFromList;
      this.getConditions();
      this.getStepList();
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
