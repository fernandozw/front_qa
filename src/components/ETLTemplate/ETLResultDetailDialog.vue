<template>
  <el-dialog
    :title="
      '结果详情(结果id:' + resultId + '<-->用例id:' + resultDetail.caseId + ')'
    "
    :visible.sync="dialogVisible"
    width="80%"
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
            <el-form-item label="用例名称" prop="caseName">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder=""
                  v-model="resultDetail.caseName"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="校验状态" prop="verifyStatus">
              <el-col :span="12">
                <el-select
                  v-model="resultDetail.verifyStatus"
                  filterable
                  placeholder=""
                  clearable
                  disabled
                >
                  <el-option
                    v-for="item in verifyStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="用例类型" prop="caseType">
              <el-col :span="12">
                <el-select
                  v-model="resultDetail.caseType"
                  filterable
                  placeholder=""
                  clearable
                  disabled
                >
                  <el-option
                    v-for="item in caseTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20">
            <el-form-item label="上报参数" prop="param" style="float: left">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder=""
                  v-model="resultDetail.param"
                  clearable
                >
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="入库参数" prop="result" style="float: left">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  placeholder=""
                  v-model="resultDetail.result"
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
  name: 'ETLResultDetailDialog',
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
      dialogVisible: false,
      resultDetail: {}
    };
  },
  methods: {
    // 关闭dialog弹框
    close() {
      this.$emit('listenToChildEvent', false);
    },
    // 用例结果详情
    detail() {
      let url = String.format(
        '{0}/etlResultDetail/detail?id={1}',
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
