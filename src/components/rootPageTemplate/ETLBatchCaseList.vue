<template>
  <div>
    <el-card
      shadow="always"
      style="margin-top: 10px"
      v-loading="loading"
      element-loading-text="执行中,上报后会等待10秒,请稍等～～～～～"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-form :inline="true" :model="searchForm" size="mini">
        <el-form-item label="批量场景id">
          <el-input
            v-model="searchForm.id"
            placeholder="输入批量场景id"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="批量场景名称">
          <el-input
            v-model="searchForm.batchCaseName"
            placeholder="输入批量场景名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            v-model="searchForm.creator"
            placeholder="输入创建人"
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
        <el-form-item style="float: right;margin-right: 60px">
          <el-button type="primary" @click="getBatchCaseList('search')"
            >查 询
          </el-button>
          <el-button type="success" @click="clickAddBtn">新 增</el-button>
          <el-button type="info" @click="reSet">重 置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        align="center"
      >
        <el-table-column
          show-overflow-tooltip
          prop="id"
          label="批量场景id"
          width="100"
          align="center"
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="batchCaseName"
          label="批量场景名称"
          width="250"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="sceneIdList"
          label="场景集"
          align="center"
          width="250"
        >
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="createProject"
          label="是否创建项目"
          width="100"
        >
          <template slot-scope="scope">
            <span v-if="tableData[scope.$index].createProject === 1">是</span>
            <span v-else-if="tableData[scope.$index].createProject === 2"
              >否</span
            >
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="creator"
          label="创建人"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="addTime"
          label="创建时间"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="addTime"
          label="更新时间"
          width="250"
        ></el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          label="操作"
          width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="executeBatchCase(tableData[scope.$index].id)"
              >执行
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="batchCaseDetail(tableData[scope.$index].id, 'copy')"
              >复制
            </el-button>

            <el-button
              type="text"
              size="mini"
              @click="batchCaseDetail(tableData[scope.$index].id, 'edit')"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="deleteBatchCase(tableData[scope.$index].id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="getBatchCaseList()"
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
    <etl-batch-case-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :batch-case-id="batchCaseId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></etl-batch-case-dialog>
  </div>
</template>

<script>
import ETLBatchCaseDialog from '../ETLTemplate/ETLBatchCaseDialog';

export default {
  name: 'ETLBatchCaseList',
  components: { etlBatchCaseDialog: ETLBatchCaseDialog },

  data() {
    return {
      loading: false,
      pageSize: 10,
      total: 0,
      batchCaseId: null,
      pageNum: 1,
      caseId: null,
      dialogVisibleType: 1,
      dialogVisible: false,
      searchForm: {
        id: '',
        batchCaseName: '',
        creator: null,
        addTime: '',
        updateTime: ''
      },
      tableData: []
    };
  },
  methods: {
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getBatchCaseList('search');
      }
    },
    reSet() {
      this.pageNum = 1;
      this.searchForm = {
        id: '',
        batchCaseName: '',
        creator: null,
        addTime: '',
        updateTime: ''
      };
      this.getBatchCaseList('search');
    },

    // 批量场景详情
    batchCaseDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.batchCaseId = id;
      this.dialogVisible = true;
    },
    // 获取用例列表
    getBatchCaseList(type) {
      if (type === 'search') {
        this.pageNum = 1;
      }
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/etlBatchCase/list', this.GLOBAL.ETL_URL);
      this.searchForm['pageNum'] = this.pageNum;

      this.axios
        .post(url, this.searchForm, config)
        .then(response => {
          this.total = response.data.data.total;
          this.tableData = response.data.data.apiEtlBatchCaseList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 删除批量场景
    deleteBatchCase(id) {
      this.$confirm(
        String.format('此操作将永久删除该批量场景(id:{0}), 是否继续?', id),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let config = {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        };
        let url = String.format('{0}/etlBatchCase/delete', this.GLOBAL.ETL_URL);
        let param = { id: id };
        this.axios
          .post(url, param, config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.message);
              this.getBatchCaseList('search');
            } else {
              this.Message.error(response.data.message);
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },

    // 执行批量场景
    executeBatchCase(id) {
      this.loading = true;

      let url = String.format(
        '{0}/etlBatchCase/execute?id={1}&executor={2}',
        this.GLOBAL.ETL_URL,
        id,
        localStorage.getItem('executor')
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.code === '1000') {
            this.Message.success(response.data.message);
            this.loading = false;
          } else {
            this.Message.error(response.data.message);
            this.loading = false;
          }
          return response;
        })
        .catch(response => {
          return response;
        });
    },

    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    }
  },
  beforeMount() {
    this.getBatchCaseList();
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 400px !important;
}

/deep/ .el-input {
  width: 150px !important;
}
</style>
