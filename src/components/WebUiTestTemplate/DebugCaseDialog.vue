<template>
  <div>
    <el-dialog
      title="调试用例"
      :visible.sync="dialogVisible"
      width="60%"
      class="debug-case-dialog"
      @close="close"
      id="debugCaseDialog"
    >
      <div>
        <el-card class="box-card">
          <el-form
            size="mini"
            :model="inputForm"
            :rules="rules"
            ref="formRef"
            :hide-required-asterisk="true"
          >
            <el-form-item>
              <el-button type="text" size="medium" @click="open">
                1、下载调试模式需要的脚本压缩包
              </el-button>
            </el-form-item>
            <el-form-item
              label="2、解压脚本,并执行startNode.sh或startNode.bat文件(sh -x
                    startNode.sh,bat文件双击即可)"
            >
            </el-form-item>
            <el-form-item label="3、输入node地址:" prop="seleniumNode">
              <el-row>
                <el-col :span="10">
                  <el-input
                    size="mini"
                    placeholder="node节点的url地址:http://ip地址:端口号/wd/hub"
                    v-model="inputForm.seleniumNode"
                    clearable
                  >
                  </el-input>
                </el-col>
                <el-col :span="2" style="margin-left: 5px">
                  <el-tooltip
                    placement="top"
                    content="node地址为自动获取,若不正确,仅修改输入框中的ip即可"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="4、点击执行按钮,运行用例"></el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click="debugCase"
          >执 行</el-button
        >
      </span>
    </el-dialog>
    <set-client-config-dialog
      v-if="clientConfigDialog"
      :visible="clientConfigDialog"
      @listenToChildEvent="callbackFunc"
    ></set-client-config-dialog>
  </div>
</template>

<script>
import SetClientConfigDialog from '../WebUiTestTemplate/SetClientConfigDialog';

export default {
  name: 'DebugCaseDialog',
  components: {
    setClientConfigDialog: SetClientConfigDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    caseId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      clientConfigDialog: false,
      isError: false,
      dialogVisible: true,
      inputForm: {
        seleniumNode: 'http://127.0.0.1:7890/wd/hub'
      },
      rules: {
        seleniumNode: [
          { required: true, message: '请输入node地址', trigger: 'blur' },
          {
            type: 'url',
            message: '请输入有效的node地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    };
  },
  methods: {
    // 获取客户端ip
    getClientIp() {
      let url = String.format('{0}/config/clientIp', this.GLOBAL.WEBUI_URL);
      this.axios
        .get(url)
        .then(response => {
          this.inputForm.seleniumNode = String.format(
            'http://{0}:7890/wd/hub',
            response.data.clientIp
          );
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    callbackFunc() {
      this.clientConfigDialog = false;
    },
    close() {
      this.$emit('listenToChildEvent', false);
    },
    open() {
      const ua = navigator.userAgent;
      if (ua.indexOf('Firefox') !== -1 || ua.indexOf('Chrome') !== -1) {
        this.clientConfigDialog = true;
      } else {
        this.$message.warning('请使用Chrome、Firefox浏览器进行调试!');
      }
    },
    // 调试用例
    debugCase() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          let config = {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          };
          let url = String.format(
            '{0}/debugCase/execCase',
            this.GLOBAL.WEBUI_URL
          );
          const param = {
            id: this.caseId,
            browserNode: this.inputForm.seleniumNode
          };
          this.axios
            .post(url, JSON.stringify(param), config)
            .then(response => {
              if (response.data.code === '1000') {
                this.Message.success(response.data.msg);
              } else {
                this.Message.error(response.data.msg);
              }
              return response;
            })
            .catch(response => {
              return response;
            });
        } else {
          this.$message({
            type: 'error',
            message: '请输入node地址!'
          });
          return false;
        }
      });
    }
  },
  created() {
    this.dialogVisible = this.visible;
    this.getClientIp();
  }
};
</script>
<style scoped></style>
