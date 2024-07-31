<template>
  <div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命执行中,请稍等,若一直无响应,30秒后自动关闭～～～"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tabData"
      style="width: 100%;margin-top: -10px"
      border
      size="mini"
      :row-class-name="tableRowClassName"
      width="100%"
    >
      <!--使用默认的唯一索引index,作为key的唯一值-->
      <template v-for="(col, index) in tabHeader">
        <!--key是必须的且写在真实的html元素上,否则es6检查会报错-->
        <!--操作选项-->
        <el-table-column
          v-if="col.prop === 'action'"
          :label="col.label"
          :key="index.id"
          align="center"
          show-overflow-tooltip
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="clickExec(tabData[scope.$index])"
              >执行
            </el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="当前只做详情展示功能！"
              placement="top"
            >
              <el-button
                type="text"
                size="mini"
                @click="detailClick(tabData[scope.$index].id)"
                >编辑
              </el-button>
            </el-tooltip>
            <el-button
              type="text"
              size="mini"
              :disabled="true"
              @click="deleteCase(tabData[scope.$index].id)"
              >删除
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="copyCase(tabData[scope.$index].id)"
              :disabled="true"
              >复制
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'step_id'"
          :label="col.label"
          :key="index.id"
          align="center"
          show-overflow-tooltip
          fixed="right"
        >
          <template slot-scope="scope">
            <a :href="initRef(tabData[scope.$index].step_id)" target="_blank">{{
              tabData[scope.$index].step_id
            }}</a>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'id'"
          :prop="col.prop"
          :label="col.label"
          :key="index.id"
          align="center"
          show-overflow-tooltip
          fixed="left"
        >
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.prop"
          :label="col.label"
          :key="index"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
      </template>
    </el-table>
    <test-case-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :case-id="caseId"
      :type="caseDialogType"
      @listenToChildEvent="callbackFunc"
    ></test-case-dialog>
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
import TestCaseDialog from '../HttpRunnerTemplate/TestCaseDialog.vue';
import ExecCaseDialog from '../HttpRunnerTemplate/ExecCaseDialog.vue';

export default {
  // 模板名称
  name: 'TestCaseTable',
  components: { TestCaseDialog, ExecCaseDialog },

  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tabData: null,
    tabHeader: null
  },
  data() {
    return {
      execType: 1,
      dialogVisible: false,
      execDialogVisible: false,
      caseId: null,
      caseDialogType: 2,
      loading: false,
      caseInfo: {}
    };
  },
  methods: {
    initRef(stepId) {
      let url = String.format(
        '/httpRunnerTest/httpRunner?activeName=stepModule&id={0}',
        stepId
      );
      return url;
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 点击执行按钮
    clickExec(caseObject) {
      this.execDialogVisible = true;
      this.caseInfo = caseObject;
    },

    // 请求详情
    detailClick(id) {
      this.caseId = id;
      this.caseDialogType = 2;
      this.dialogVisible = true;
    },
    // // 复制详情
    // copyRequest(id) {
    //   this.editCaseId = id;
    //   this.caseDialogType = 3;
    //   this.dialogVisible = true;
    // },
    // deleteRequest(id) {
    //   this.$confirm('此操作将永久删除该请求, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       let caseInfo = { id: id };
    //       let url = String.format(
    //         '{0}/caseInterface/removeCase',
    //         this.GLOBAL.MONITOR_URL
    //       );
    //       // 指定参数格式
    //       let config = {
    //         headers: {
    //           'Content-Type': 'application/json;charset=UTF-8'
    //         }
    //       };
    //       this.axios
    //         .post(url, JSON.stringify(caseInfo), config)
    //         .then(response => {
    //           let responseCode = response.data.code;
    //           if (responseCode === '200') {
    //             this.Message.success('删除成功！');
    //           } else {
    //             this.Message.error(response.data.msg);
    //           }
    //           // 调用父组件的查询方法
    //           this.$emit('getCaseList');
    //           return response;
    //         })
    //         .catch(response => {
    //           // 调用父组件的查询方法
    //           this.$emit('getCaseList');
    //           return response;
    //         });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });
    //     });
    // },
    callbackFunc(fresh) {
      this.dialogVisible = false;
      if (fresh) {
        this.$emit('getCaseList');
      }
    },
    callbackFuncExec() {
      this.execDialogVisible = false;
    }
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
