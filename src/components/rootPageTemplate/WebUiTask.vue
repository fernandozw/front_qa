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
      <el-form-item label="任务名称">
        <el-input
          v-model="searchForm.cronName"
          placeholder="输入任务名称"
          clearable
        ></el-input>
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
      <el-form-item style="float: right;margin-right: 60px">
        <el-button type="primary" @click="getCronList">查 询 </el-button>
        <el-button type="success" @click="clickAddBtn">新 增</el-button>
        <el-button type="info" @click="getCronList('reset')">重 置</el-button>
      </el-form-item>
    </el-form>

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
        prop="cronName"
        label="任务名称"
        width="250"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="execTime"
        label="调度时间"
        width="280"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="args"
        label="调度参数"
        width="180"
        show-overflow-tooltip
      >
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
          <el-button
            type="text"
            size="mini"
            @click="execCases(tableData[scope.$index].args)"
            >执行
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="cronDetail(tableData[scope.$index].id, 'edit')"
            >编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="deleteCron(tableData[scope.$index].id)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="cronDetail(tableData[scope.$index].id, 'copy')"
            >复制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getCronList('search')"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total,slot, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 10px"
      size="mini"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
    <cron-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :cron-id="cronId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></cron-dialog>
  </div>
</template>

<script>
import CronDialog from '../WebUiTestTemplate/CronDialog';

export default {
  name: 'WebUiTask',
  components: {
    cronDialog: CronDialog
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisibleType: 1,
      cronId: null,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      statusList: [],
      statusMap: {},
      searchForm: {
        id: '',
        cronName: '',
        status: '',
        startTime: [],
        updateTime: []
      }
    };
  },
  methods: {
    execCases(caseIds) {
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      let url = String.format('{0}/case/execCaseList', this.GLOBAL.WEBUI_URL);
      let param = { caseIds: caseIds };
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
    // 获取查询条件
    getCondition() {
      let url = String.format('{0}/cron/getCondition', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
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
        cronName: '',
        status: '',
        startTime: [],
        updateTime: []
      };
    },
    // 获取元素列表
    getCronList(model) {
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
      let url = String.format('{0}/cron/cronList', this.GLOBAL.WEBUI_URL);
      this.searchForm['pageNum'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.searchForm), config)
        .then(response => {
          this.tableData = response.data.data.cronList;
          this.total = response.data.data.total;
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
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getCronList('normal');
      }
    },
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisibleType = 1;
      this.dialogVisible = true;
    },
    // 任务详情
    cronDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.cronId = id;
      this.dialogVisible = true;
    },
    // 删除任务
    deleteCron(id) {
      this.$confirm(
        String.format('此操作将永久删除该任务(id:{0}), 是否继续?', id),
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
        let url = String.format('{0}/cron/deleteCron', this.GLOBAL.WEBUI_URL);
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getCronList('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getCronList('normal');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    }
  },
  beforeMount() {
    this.getCondition();
    this.getCronList();
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
</style>
