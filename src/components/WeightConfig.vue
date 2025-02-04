<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    width="500px"
    @close="$emit('update:visible', false)"
    class="c-WeightConfig"
  >
    <div class="c-WeightConfigtitle" slot="title">
      <span :style="{ fontSize: '16px', marginRight: '20px' }">
        號碼權重配置
      </span>
      <div
        style="margin-top: 10px; display: flex; justify-content: space-between;"
      >
        <el-select
          v-model="selectPrizeValue"
          placeholder="選擇獎項"
          style="width: 240px"
        >
          <el-option
            v-for="item in getPrizeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div style="display: flex; justify-content: flex-end;">
          <el-button size="mini" @click="$emit('update:visible', false)"
            >取消</el-button
          >
          <el-button size="mini" type="primary" @click="onSubmit"
            >保存配置</el-button
          >
        </div>
      </div>
    </div>
    <div v-if="form[selectPrizeValue]" class="container">
      <el-form ref="formRef" :model="form[selectPrizeValue]" size="mini">
        <el-form-item
          v-for="num in totalNumbers"
          :key="num"
          :label="`號碼 ${num} 權重`"
        >
          <el-input-number
            :label="`號碼 ${num} 權重`"
            v-model="form[selectPrizeValue][num]"
            :min="0"
            :max="1000"
            :step="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { setData, weightConfigField } from '@/helper/index';

export default {
  name: 'WeightConfig',
  props: {
    visible: Boolean,
    totalNumbers: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      form: {},
      selectPrizeValue: 'firstPrize'
    };
  },
  computed: {
    getPrizeOptions() {
      let options = this.$store.state.newLottery.map(item => {
        return {
          value: item.key,
          label: item.name
        };
      });
      options.unshift({
        value: 'firstPrize',
        label: this.$store.state.config.name
      });
      return options;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.selectPrizeValue = 'firstPrize';
        this.form = this.initForm();
      }
    }
  },
  created() {
    this.form = this.initForm();
  },
  methods: {
    initForm() {
      const stateWeight = JSON.parse(
        JSON.stringify(this.$store.state.weightConfig)
      );
      const newPrizeKey = this.$store.state.newLottery.map(item => item.key);
      const allPrizeKey = ['firstPrize', ...newPrizeKey];
      let form = {};
      allPrizeKey.forEach(key => {
        if (stateWeight[key] !== undefined) {
          form[key] = stateWeight[key];
        } else {
          form[key] = {};
        }
        for (let i = 1; i <= this.totalNumbers; i++) {
          if (stateWeight[key]) {
            if (stateWeight[key][i]) {
              form[key][i] = stateWeight[key][i];
              continue;
            }
          }
          form[key][i] = 1;
        }
      });
      console.log(form);
      return form;
    },
    onSubmit() {
      setData(weightConfigField, this.form);
      this.$store.commit('setWeightConfig', this.form);
      this.$emit('update:visible', false);
      this.$message({
        message: '保存成功',
        type: 'success'
      });
    }
  }
};
</script>

<style lang="scss">
.c-WeightConfig {
  .el-dialog__body {
    height: 600px;
    .container {
      height: 100%;
      overflow-y: auto;
      padding: 0 10px;
    }
  }
}
</style>
