<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    width="500px"
    @close="$emit('update:visible', false)"
  >
    <div class="c-LotteryConfigtitle" slot="title">
      <span :style="{ fontSize: '16px', marginRight: '20px' }">
        系統配置
      </span>
      <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
        <el-button size="mini" @click="exportConfig">匯出設定</el-button>
        <el-button size="mini" @click="importConfig">匯入設定</el-button>
        <el-button size="mini" @click="close">取消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit"
          >保存配置</el-button
        >
      </div>
    </div>
    <div class="container">
      <el-form ref="formRef" :model="form" size="mini">
        <el-form-item prop="allowRepeatJoin" label="允許重複參與復抽獎">
          <el-switch v-model="form.allowRepeatJoin"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      accept=".json"
      @change="handleFileUpload"
    />
  </el-dialog>
</template>
<script>
export default {
  name: 'SystemConfig',
  props: {
    visible: Boolean
  },
  computed: {
    form: {
      get() {
        return this.$store.state.systemConfig;
      },
      set(val) {
        return val;
      }
    }
  },
  methods: {
    onSubmit() {
      this.$store.commit('setSysConfig', this.form);
      this.$emit('update:visible', false);
      this.$message({
        message: '保存成功',
        type: 'success'
      });

      this.$nextTick(() => {
        this.$emit('resetconfig');
      });
    },
    close() {
      this.$refs.formRef.resetFields();
      this.$emit('update:visible', false);
    },
    exportConfig() {
      const config = {
        config: this.$store.state.config,
        systemConfig: this.$store.state.systemConfig,
        weightConfig: this.$store.state.weightConfig,
        lottery: this.$store.state.lottery,
        newLottery: this.$store.state.newLottery,
        list: this.$store.state.list,
        photos: this.$store.state.photos
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lottery-config.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      this.$message({
        message: '設定檔匯出成功',
        type: 'success'
      });
    },
    importConfig() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const config = JSON.parse(e.target.result);

          if (config.config) {
            this.$store.commit('setConfig', config.config);
          }
          if (config.systemConfig) {
            this.$store.commit('setSysConfig', config.systemConfig);
          }
          if (config.weightConfig) {
            this.$store.commit('setWeightConfig', config.weightConfig);
          }
          if (config.newLottery) {
            this.$store.commit('setNewLottery', config.newLottery);
          }
          if (config.list) {
            this.$store.commit('setList', config.list);
          }
          if (config.photos) {
            this.$store.commit('setPhotos', config.photos);
          }

          this.$message({
            message: '設定檔匯入成功',
            type: 'success'
          });

          event.target.value = '';
        } catch (error) {
          this.$message({
            message: '設定檔格式錯誤',
            type: 'error'
          });
        }
      };
      reader.readAsText(file);
    }
  }
};
</script>
