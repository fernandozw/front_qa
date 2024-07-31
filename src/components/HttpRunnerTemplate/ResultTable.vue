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
          width="300px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="detailClick(tabData[scope.$index].id)"
              >详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'step_id'"
          :label="col.label"
          :key="index.id"
          align="center"
          show-overflow-tooltip
          width="250px"
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
          width="120px"
        >
        </el-table-column>
        <el-table-column
          v-else-if="col.prop === 'result'"
          :prop="col.prop"
          :label="col.label"
          :key="index.id"
          align="center"
          show-overflow-tooltip
          fixed="left"
          width="120px"
        >
          <template slot-scope="scope">
            <span v-if="tabData[scope.$index].result === 'True'"
              ><font color="green">成功</font></span
            >
            <span v-else><font color="red">失败</font></span>
          </template>
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
    <result-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :result-id="resultId"
      @listenToChildEvent="callbackFunc"
    ></result-dialog>
  </div>
</template>

<script>
import ResultDialog from '../HttpRunnerTemplate/ResultDialog.vue';

export default {
  // 模板名称
  name: 'ResultTable',
  components: { ResultDialog },

  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tabData: null,
    tabHeader: null
  },
  data() {
    return {
      dialogVisible: false,
      resultId: null,
      resultDialogType: 2,
      loading: false
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
    // 结果详情
    detailClick(id) {
      this.resultId = id;
      this.dialogVisible = true;
    },
    callbackFunc() {
      this.dialogVisible = false;
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
