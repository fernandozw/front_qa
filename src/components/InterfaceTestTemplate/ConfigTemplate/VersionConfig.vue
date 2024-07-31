<template>
  <div>
    <el-form :model="conditionDict" :inline="true" class="demo-form-inline">
      <el-form-item label="id:">
        <el-input
          v-model="conditionDict.id"
          size="mini"
          placeholder="请输入版本id"
          clearable
        />
      </el-form-item>
      <el-form-item label="版本名称:">
        <el-input
          v-model="conditionDict.version_name"
          size="mini"
          placeholder="请输入版本名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="所属项目:">
        <el-select size="mini" v-model="conditionDict.project_id" clearable>
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          round
          @click="getListByCondition('search')"
          >查询
        </el-button>
        <el-button type="success" round size="mini" @click="clickAddBtn"
          >新增
        </el-button>
        <el-button type="info" round size="mini" @click="reset"
          >重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      :header-cell-style="getHeaderClass"
      border
      style="width: 100%;margin-top: 10px"
      size="mini"
    >
      <el-table-column
        fixed
        prop="id"
        label="id"
        align="center"
        show-overflow-tooltip
        width="100px"
      />
      <el-table-column
        fixed
        prop="version_name"
        label="版本名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        fixed
        prop="project"
        label="所属项目"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="add_time"
        label="创建时间"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="update_time"
        label="更新时间"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="versionDetail(tableData[scope.$index].id, 'copy')"
            >复制
          </el-button>

          <el-button
            type="text"
            size="small"
            @click="versionDetail(tableData[scope.$index].id, 'edit')"
            >编辑
          </el-button>

          <el-button
            type="text"
            size="small"
            @click="deleteVersion(tableData[scope.$index].id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <version-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :version-id="versionId"
      :type="dialogVisibleType"
      @listenToChildEvent="callbackFunc"
    ></version-dialog>
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      layout="total,slot, prev, pager, next, jumper"
      style="margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="getListByCondition"
    >
      <span>{{ pageSize }}条/页</span>
    </el-pagination>
  </div>
</template>

<script>
import VersionDialog from './VersionDialog';

export default {
  name: 'VersionConfig',
  components: {
    versionDialog: VersionDialog
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisibleType: 1,
      versionId: null,
      conditionDict: { id: '', version_name: '', project_id: '' },
      projectList: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [5, 10, 20]
    };
  },
  methods: {
    // 点击新增按钮
    clickAddBtn() {
      this.dialogVisible = true;
      this.dialogVisibleType = 1;
    },
    // 重置搜索
    reset() {
      this.conditionDict = { id: '', version_name: '', project_id: '' };
      this.pageSize = 10;
      this.pageSizes = [5, 10, 20];
      this.currentPage = 1;
      this.getListByCondition('search');
    },
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.getListByCondition('normal');
      }
    },
    // 删除版本
    deleteVersion(id) {
      this.$confirm(
        String.format('此操作将永久删除该版本(id:{0}), 是否继续?', id),
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
        let url = String.format(
          '{0}/versionInterface/removeVersion',
          this.GLOBAL.MONITOR_URL
        );
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '200') {
              this.Message.success(response.data.msg);
              this.getListByCondition('normal');
            } else {
              this.Message.error(response.data.msg);
              this.getListByCondition('normal');
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },
    // 版本详情
    versionDetail(id, model) {
      if (model === 'edit') {
        this.dialogVisibleType = 2;
      } else if (model === 'copy') {
        this.dialogVisibleType = 3;
      }
      this.versionId = id;
      this.dialogVisible = true;
    },
    // 获取版本列表
    getListByCondition(type) {
      if (type === 'search') {
        this.currentPage = 1;
      }
      let url = String.format(
        '{0}/versionInterface/versionList',
        this.GLOBAL.MONITOR_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.conditionDict['pageSize'] = this.pageSize;
      this.conditionDict['page_index'] = this.currentPage;
      this.axios
        .post(url, JSON.stringify(this.conditionDict), config)
        .then(response => {
          if (response.data.code === '200') {
            this.tableData = response.data.versionInfo.tableData;
            this.total = response.data.total;
          } else {
            this.tableData = response.data.versionInfo.tableData;
            this.total = response.data.total;
            this.Message.error(response.data.msg);
          }

          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 当每页的条数改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getListByCondition();
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 控制表格头部颜色
    getHeaderClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:deepskyblue';
      } else {
        return '';
      }
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/projectInterface/projectListConditions',
        this.GLOBAL.MONITOR_URL
      );
      this.axios
        .get(url)
        .then(response => {
          if (response.data.code === '200') {
            this.projectList = response.data.project_list;
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
  }
};
</script>

<style scoped>
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}

.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}

td:not(.is-hidden):last-child {
  right: -1px;
}

.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 40px;
}

.el-row {
  line-height: 40px;
  margin-top: 10px;
}
</style>
