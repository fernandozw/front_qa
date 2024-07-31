<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      @close="close"
    >
      <div>
        <el-card class="box-card">
          <el-form :inline="true" :model="elementDetail" size="mini">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="定位方式:">
                  <el-select
                    v-model="elementDetail.locateType"
                    filterable
                    placeholder="选择定位方式"
                    clearable
                  >
                    <el-option
                      v-for="item in locateList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关键字:">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    placeholder="必填项:请输入内容"
                    v-model="elementDetail.keyword"
                    clearable
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="info" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveElement">
          保 存
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ShowBackupElementDialog',
  props: {
    mainId: {
      type: Number,
      default: null
    },
    backupElementId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: 1 // 1 新增 2 编辑
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      locateList: [],
      elementDetail: { id: '', elementId: '', locateType: '', keyword: '' }
    };
  },
  methods: {
    // 元素详情
    detail() {
      let url = String.format(
        '{0}/elementBackup/detail?id={1}',
        this.GLOBAL.WEBUI_URL,
        this.backupElementId
      );
      this.axios
        .get(url)
        .then(response => {
          this.elementDetail = response.data.elementBackup;
          this.getConditions();
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    // 新增、编辑元素
    saveElement() {
      let url = String.format(
        this.type === 2 ? '{0}/elementBackup/update' : '{0}/elementBackup/add',
        this.GLOBAL.WEBUI_URL
      );
      // 指定参数格式
      let config = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      };
      this.axios
        .post(url, JSON.stringify(this.elementDetail), config)
        .then(response => {
          let responseCode = response.data.code;
          if (responseCode === '1000') {
            this.Message.success(response.data.msg);
            // 调用父组件的查询方法
            this.$emit('listenToChildEventForDetail', true);
          } else {
            this.Message.error(response.data.msg);
          }
          return response;
        })
        .catch(response => {
          // 调用父组件的查询方法
          // this.$emit('listenToChildEvent', true);
          return response;
        });
    },
    // 关闭dialog弹框

    close() {
      this.$emit('listenToChildEventForDetail', false);
    },
    // 获取查询条件
    getConditions() {
      let url = String.format(
        '{0}/element/getSearchCondition',
        this.GLOBAL.WEBUI_URL
      );
      this.axios
        .get(url)
        .then(response => {
          this.locateList = response.data.data.locateList;
          return response;
        })
        .catch(response => {
          return response;
        });
    }
  },

  computed: {
    dialogTitle() {
      if (this.type === 2) {
        return '编辑' + '（ID:' + this.backupElementId + '）';
      }
      return '新增';
    },

    typeText() {
      if (this.type === 2) {
        return '编辑';
      }

      return '新增';
    }
  },
  created() {
    this.dialogVisible = this.visible;
    if (this.type === 1) {
      this.elementDetail.elementId = this.mainId;
      this.getConditions();
    } else if (this.type === 2) {
      this.detail();
    }
  }
};
</script>

<style scoped></style>
