<template>
  <div>
    <el-dialog
      :title="'备用元素(ID:' + elementId + ')'"
      :visible.sync="dialogVisible"
      width="80%"
      @close="close"
    >
      <div>
        <el-card class="box-card">
          <el-table
            :data="backupElementList"
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
              prop="locateType"
              label="定位方式"
              width="180"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="keyword"
              label="关键字"
              width="250"
              show-overflow-tooltip
            >
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
                  @click="openDetail(2, backupElementList[scope.$index].id)"
                  >编 辑</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  @click="deleteElement(backupElementList[scope.$index].id)"
                  >删 除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="openDetail(1, null)"
          >新 增</el-button
        >
        <el-button size="mini" type="info" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
    <show-backup-element-dialog
      v-if="detailDialogVisible"
      :visible="detailDialogVisible"
      :main-id="elementId"
      :backup-element-id="backupId"
      :type="detailDialogVisibleType"
      @listenToChildEventForDetail="callbackFunc"
    ></show-backup-element-dialog>
  </div>
</template>

<script>
import ShowBackupElementDialog from '../WebUiTestTemplate/ShowBackupElementDialog';

export default {
  name: 'BackupElementDialog',
  components: {
    showBackupElementDialog: ShowBackupElementDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    elementId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      detailDialogVisibleType: 1,
      backupId: null,
      detailDialogVisible: false,
      backupElementList: [],
      dialogVisible: false
    };
  },
  methods: {
    // 删除元素
    deleteElement(id) {
      this.$confirm(
        String.format('此操作将永久删除该备份元素(id:{0}), 是否继续?', id),
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
          '{0}/elementBackup/delete',
          this.GLOBAL.WEBUI_URL
        );
        const param = { id: id };
        this.axios
          .post(url, JSON.stringify(param), config)
          .then(response => {
            if (response.data.code === '1000') {
              this.Message.success(response.data.msg);
              this.getList();
            } else {
              this.Message.error(response.data.msg);
            }
            return response;
          })
          .catch(response => {
            return response;
          });
      });
    },
    openDetail(type, id) {
      if (type === 2) {
        this.backupId = id;
      }
      this.detailDialogVisible = true;
      this.detailDialogVisibleType = type;
    },
    // 用于子组件的回调函数
    callbackFunc(fresh) {
      this.detailDialogVisible = false;
      if (fresh) {
        this.getList('normal');
      }
    },
    getList() {
      let url = String.format(
        '{0}/elementBackup/elements?elementId={1}',
        this.GLOBAL.WEBUI_URL,
        this.elementId
      );
      this.axios
        .get(url)
        .then(response => {
          this.backupElementList = response.data.elementBackupList;
          return response;
        })
        .catch(response => {
          return response;
        });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
    },
    close() {
      this.$emit('listenToChildEventForBackup', false);
    }
  },
  created() {
    this.getList();
    this.dialogVisible = this.visible;
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
