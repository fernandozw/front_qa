<template>
  <div>
    <el-card shadow="always" style="margin-top: 10px">
      <el-form :inline="true" :model="searchForm" size="mini">
        <el-form-item label="结果id">
          <el-input
            v-model="searchForm.id"
            placeholder="输入结果id"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用例id">
          <el-input
            v-model="searchForm.caseId"
            placeholder="输入用例id"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用例名称">
          <el-input
            v-model="searchForm.caseName"
            placeholder="输入用例名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input
            v-model="searchForm.batchNo"
            placeholder="输入批次号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="用例类型">
          <el-select
            v-model="searchForm.caseType"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in caseTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报地址">
          <el-input
            v-model="searchForm.url"
            placeholder="输入上报地址"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="校验状态">
          <el-select
            v-model="searchForm.verifyStatus"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in verifyStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行人">
          <el-input
            v-model="searchForm.executor"
            placeholder="输入执行人"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.addTime"
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
        <el-form-item style="float: right;margin-right: 60px">
          <el-button type="primary" @click="getDetailList('search')"
            >查 询
          </el-button>
          <el-button type="info" @click="reSet">重 置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        :row-class-name="tableRowClassName"
        align="center"
      >
        <el-table-column
          show-overflow-tooltip
          prop="batchNo"
          label="批次号"
          width="180"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="resultId"
          label="结果id"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="caseId"
          label="用例id"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="caseName"
          label="用例名称"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="param"
          label="校验状态"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="tableData[scope.$index].verifyStatus === 1">成功</span>
            <span v-else-if="tableData[scope.$index].verifyStatus === 2"
              >未找到数据</span
            >
            <span v-else-if="tableData[scope.$index].verifyStatus === 3"
              >未校验</span
            >
            <span v-else-if="tableData[scope.$index].verifyStatus === 4"
              >失败</span
            >

            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="failReason"
          label="失败原因"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="caseType"
          label="用例类型"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="tableData[scope.$index].caseType === 1">事件</span>
            <span v-else-if="tableData[scope.$index].caseType === 2"
              >用户属性</span
            >
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="param"
          label="上报参数"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="result"
          label="入库参数"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="url"
          label="上报地址"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="version"
          label="主版本"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="subVersion"
          label="子版本"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="executor"
          label="执行人"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="addTime"
          label="创建时间"
          width="200"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          label="操作"
          width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="resultDetail(tableData[scope.$index].resultId)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="getDetailList()"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        layout="total,slot, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 10px"
        size="mini"
      >
        <span>{{ pageSize }}条/页</span>
      </el-pagination>
    </el-card>
    <etl-result-detail-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :result-id="resultId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></etl-result-detail-dialog>
  </div>
</template>

<script>
import ETLResultDetailDialog from '../ETLTemplate/ETLResultDetailDialog';

export default {
  name: 'ETLResultDetailList',
  components: { etlResultDetailDialog: ETLResultDetailDialog },

  data() {
    return {
      caseTypeOptions: [
        { label: '事件', value: 1 },
        { label: '用户属性', value: 2 }
      ],
      verifyStatusOptions: [
        { label: '成功', value: 1 },
        { label: '未找到数据', value: 2 },
        { label: '未校验', value: 3 },
        { label: '失败', value: 4 }
      ],
      pageSize: 10,
      total: 0,
      pageNum: 1,
      resultId: null,
      dialogVisibleType: 1,
      dialogVisible: false,
      searchForm: {
        id: '',
        caseId: '',
        batchNo: '',
        caseName: '',
        url: '',
        verifyStatus: null,
        version: '',
        subVersion: '',
        sceneName: '',
        addTime: '',
        pageNum: 1,
        executor: ''
      },
      tableData: []
    };
  },
  methods: {
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getDetailList('search');
      }
    },
    reSet() {
      this.pageNum = 1;
      this.searchForm = {
        id: '',
        caseId: '',
        batchNo: '',
        caseName: '',
        url: '',
        verifyStatus: null,
        version: '',
        subVersion: '',
        sceneName: '',
        addTime: '',
        pageNum: 1,
        executor: ''
      };
      this.getDetailList('search');
    },

    // 结果详情
    resultDetail(id) {
      this.resultId = id;
      this.dialogVisible = true;
    },
    // 获取用例列表
    getDetailList(type) {
      if (type === 'search') {
        this.pageNum = 1;
      }
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/etlResultDetail/list', this.GLOBAL.ETL_URL);
      this.searchForm['pageNum'] = this.pageNum;

      this.axios
        .post(url, this.searchForm, config)
        .then(response => {
          this.total = response.data.data.total;
          this.tableData = response.data.data.apiEtlResultDetailList;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },
  beforeMount() {
    this.getDetailList();
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

.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
