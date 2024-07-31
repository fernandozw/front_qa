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
              :disabled="true"
              @click="executeCase(tabData[scope.$index].id)"
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
          v-else-if="col.prop === 'steps'"
          :label="col.label"
          :key="index.id"
          align="center"
          show-overflow-tooltip
          width="350px"
          fixed="right"
        >
          <template slot-scope="scope">
            <span v-if="extractNumbers(tabData[scope.$index].steps).type === 2"
              ><a
                :href="initStepRef(tabData[scope.$index].steps)"
                target="_blank"
                >步骤</a
              ></span
            >
            <span
              v-else-if="extractNumbers(tabData[scope.$index].steps).type === 1"
              ><a
                :href="initRequestRef(tabData[scope.$index].steps)"
                target="_blank"
                >请求</a
              ></span
            >
            <span v-else
              ><a
                :href="
                  initRequestRef(
                    extractNumbers(tabData[scope.$index].steps).request
                  )
                "
                target="_blank"
                >请求</a
              >
              <a
                :href="
                  initStepRef(extractNumbers(tabData[scope.$index].steps).step)
                "
                target="_blank"
                >步骤</a
              >
            </span>
            <span> {{ tabData[scope.$index].steps }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="col.prop"
          :label="col.label"
          :key="index.id"
          align="center"
          show-overflow-tooltip
          width="200px"
        >
        </el-table-column>
      </template>
    </el-table>
    <step-dialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :step-id="stepId"
      :type="stepDialogType"
      @listenToChildEvent="callbackFunc"
    ></step-dialog>
  </div>
</template>

<script>
import StepDialog from '../HttpRunnerTemplate/StepDialog.vue';

export default {
  // 模板名称
  name: 'StepTable',
  components: { StepDialog },

  // 模板动态参数(tabData:表格的列数据;tabHeader:表头;tabHeight:表格的固定高度,值由引用组件传入)
  props: {
    tabData: null,
    tabHeader: null
  },
  data() {
    return {
      dialogVisible: false,
      stepId: null,
      stepDialogType: 2,
      loading: false
    };
  },

  methods: {
    initStepRef(stepId) {
      let url = String.format(
        '/httpRunnerTest/httpRunner?activeName=stepModule&id={0}',
        stepId
      );
      return url;
    },
    initRequestRef(RequestId) {
      let url = String.format(
        '/httpRunnerTest/httpRunner?activeName=requestModule&id={0}',
        RequestId
      );
      return url;
    },
    extractNumbers(sourceStr) {
      let elementMap = {};
      let numbers = [];
      let str = [];
      let sourceList = sourceStr.split(',');
      for (let i = 0; i < sourceList.length; i++) {
        if (!isNaN(Number(sourceList[i]))) {
          numbers.push(sourceList[i]);
        } else {
          str.push(sourceList[i]);
        }
      }
      if (numbers.length === sourceList.length) {
        elementMap['type'] = 1;
        elementMap['request'] = sourceStr;
        elementMap['step'] = '';
      } else if (str.length === sourceList.length) {
        elementMap['type'] = 2;
        elementMap['step'] = sourceStr;
        elementMap['request'] = '';
      } else {
        elementMap['type'] = 3;
        elementMap['step'] = str.join(',');
        elementMap['request'] = numbers.join(',');
      }
      return elementMap;
    },
    // 设置行的颜色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    // 执行用例
    // executeCase(id) {
    //   this.loading = true;
    //   // 指定参数格式
    //   let config = {
    //     headers: {
    //       'Content-Type': 'application/json;charset=UTF-8'
    //     }
    //   };
    //   let url = String.format(
    //     '{0}/executeInterface/executeCase',
    //     this.GLOBAL.MONITOR_URL
    //   );
    //   let caseEntity = {
    //     id: id
    //   };
    //   this.axios
    //     .post(url, JSON.stringify(caseEntity), config)
    //     .then(response => {
    //       let responseCode = response.data.code;
    //       this.loading = false;
    //       if (responseCode === '200') {
    //         this.Message.success('执行成功！');
    //       } else {
    //         this.Message.error(response.data.msg);
    //       }
    //       return response;
    //     })
    //     .catch(response => {
    //       return response;
    //     });
    //   setTimeout(() => {
    //     if (this.loading) {
    //       this.loading = false;
    //       this.$message.error(
    //         '接口返回超时了,你可以继续等待或者重新请求～～～'
    //       );
    //     }
    //   }, 30000);
    // },
    // 请求详情
    detailClick(id) {
      this.stepId = id;
      this.stepDialogType = 2;
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
        this.$emit('getStepList');
      }
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
