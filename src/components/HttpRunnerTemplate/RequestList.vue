<template>
  <div>
    <div>
      <el-row style="margin-top: -10px;" :gutter="40">
        <el-col :span="2">
          <span>请求id</span>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="输入请求id"
            v-model="requestId"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="2">
          <span>名&nbsp;&nbsp;&nbsp;称</span>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="输入请求名称"
            v-model="name"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
        <el-col :span="3" :push="1">
          <span>请求地址</span>
        </el-col>
        <el-col :span="6">
          <el-input
            placeholder="输入请求地址"
            v-model="url"
            clearable
            size="mini"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: -10px" :gutter="10">
        <el-col :span="3">
          <span>请求方式</span>
        </el-col>
        <el-col :span="4" :pull="1">
          <el-select
            v-model="method"
            filterable
            placeholder="请选择"
            clearable
            size="mini"
          >
            <el-option
              v-for="item in methodList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
      <request-table
        :tabData="tableData"
        :tabHeader="tableHeader"
      ></request-table>
    </div>
    <el-pagination
      @current-change="getRequestList"
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
import RequestTable from './RequestTable.vue';

export default {
  name: 'RequestList',
  components: { RequestTable },
  props: {
    requestIdFromList: ''
  },
  data() {
    return {
      requestId: '',
      name: '',
      url: '',
      method: '',
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      methodList: [],
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
      this.getRequestList();
    },
    // 初始化查询条件
    initConditions() {
      this.requestId = '';
      this.name = '';
      this.url = '';
      this.method = '';
      this.timeRange = [];
      this.pageSize = 10;
      this.currentPage = 1;
    },

    // 获取列表页查询条件下拉列表
    getConditions() {
      this.methodList = [];
      let url = String.format(
        '{0}/condition/requestTypeList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.code !== '200') {
            this.$message.error(response.data.msg);
          }
          this.methodList = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 获取请求列表
    getRequestList() {
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
        '{0}/request/requestList',
        this.GLOBAL.HTTPRUNNER_URL
      );
      let conditions = {
        id: this.requestId,
        name: this.name,
        url: this.url,
        method: this.method,
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
          let requestInfo = response.data.requestInfo;
          this.tableHeader = requestInfo.tableHeader;
          this.tableData = requestInfo.tableData;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    search() {
      this.currentPage = 1;
      this.getRequestList();
    },
    init() {
      this.requestId = this.requestIdFromList;
      this.getConditions();
      this.getRequestList();
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
