<template>
  <el-dialog
    :title="'总览详情(总览id:' + resultId + ')'"
    :visible.sync="dialogVisible"
    width="75%"
    class="case-dialog"
    @close="close"
  >
    <div>
      <el-card class="box-card">
        <el-form :inline="true" :model="resultDetail" size="mini">
          <el-row :gutter="20">
            <el-form-item label="批次号" prop="batchNo">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder=""
                  v-model="resultDetail.batchNo"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="用例id集" prop="caseIdList">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder=""
                  v-model="resultDetail.caseIdList"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="上报数量" prop="reportNum">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder=""
                  v-model="resultDetail.reportNum"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="入库数量" prop="realityNum">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder=""
                  v-model="resultDetail.realityNum"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="上报地址" prop="url" style="float: left">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder=""
                  v-model="resultDetail.url"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              label="失败原因"
              prop="failReason"
              style="float: left"
            >
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder=""
                  v-model="resultDetail.failReason"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="主版本" prop="version" style="float: left">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder=""
                  v-model="resultDetail.version"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="子版本" prop="subVersion" style="float: left">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder=""
                  v-model="resultDetail.subVersion"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="校验状态" prop="status">
              <el-col :span="12">
                <el-select
                  v-model="resultDetail.status"
                  filterable
                  placeholder=""
                  clearable
                  disabled
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close" size="mini">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ETLResultDialog',
  props: {
    resultId: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      statusOptions: [
        { label: '成功', value: 1 },
        { label: '失败', value: 2 },
        { label: '未校验', value: 3 }
      ],
      dialogVisible: false,
      resultDetail: {}
    };
  },
  methods: {
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 总览结果详情
    detail() {
      let url = String.format(
        '{0}/etlResult/detail?id={1}',
        this.GLOBAL.ETL_URL,
        this.resultId
      );
      this.axios
        .get(url)
        .then(response => {
          this.resultDetail = response.data.data;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },
  created() {
    this.dialogVisible = this.visible;

    this.detail();
  }
};
</script>

<style scoped>
/deep/ .el-textarea {
  width: 400px !important;
}

/deep/ .el-select {
  width: 300px !important;
}
</style>
