<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    width="500px"
    @close="$emit('update:visible', false)"
    class="c-LotteryConfig"
  >
    <div class="c-LotteryConfigtitle" slot="title">
      <span :style="{ fontSize: '16px', marginRight: '20px' }">
        獎項配置
      </span>
      <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
        <el-button size="mini" @click="addLottery">增加獎項</el-button>
        <el-button size="mini" @click="$emit('update:visible', false)"
          >取消</el-button
        >
        <el-button size="mini" type="primary" @click="onSubmit"
          >保存配置</el-button
        >
      </div>
      <!-- <small>目前这里的改动会立即生效</small> -->
    </div>
    <div class="container">
      <el-form ref="form" :model="form" size="mini">
        <el-form-item label="抽獎標題">
          <el-input v-model="form.subject"></el-input>
        </el-form-item>
        <el-form-item label="抽獎總人數">
          <el-input
            type="number"
            v-model="form.number"
            :min="1"
            :step="1"
          ></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item :label="`${form.name}(人數)`">
          <el-input
            type="number"
            v-model="form.firstPrize"
            :min="0"
            :step="1"
          ></el-input>
          <el-button type="text" @click="editLottery(form, true)">
            编辑
          </el-button>
        </el-form-item>
        <el-divider></el-divider>
        <draggable v-model="storeNewLottery" draggable=".lottery-item">
          <el-form-item
            v-for="newitem in storeNewLottery"
            :key="newitem.key"
            :label="`${newitem.name}（人數）`"
            class="lottery-item"
          >
            <el-input
              type="number"
              :min="0"
              :step="1"
              v-model="form[newitem.key]"
              @change="
                val => {
                  form[newitem.key] = Number(val);
                }
              "
            ></el-input>
            <el-switch
              v-model="newitem.needFilter"
              active-text="仅全职"
              inactive-text="全部"
              inactive-color="#dadfe4"
            ></el-switch>
            <div>
              <el-button type="text" @click="deleteLottery(newitem.key)">
                刪除
              </el-button>
              <el-button type="text" @click="editLottery(newitem, false)">
                编辑
              </el-button>
              <small v-if="!form[newitem.key] || form[newitem.key] <= 0">
                &nbsp;未設置或抽獎人數為 0 的獎項將不會在抽獎頁顯示
              </small>
            </div>
            <el-divider></el-divider>
          </el-form-item>
        </draggable>
      </el-form>
    </div>

    <el-dialog
      :visible.sync="showAddLottery"
      :append-to-body="true"
      custom-class="lottery_dialog"
      width="480px"
    >
      <div class="add-title" slot="title">
        {{ newLottery.key ? '編輯獎項' : '增加獎項' }}
      </div>
      <el-form ref="newLottery" :model="newLottery" size="mini">
        <el-form-item label="獎項名稱">
          <el-input v-model="newLottery.name"></el-input>
        </el-form-item>
        <el-form-item label="獎品描述">
          <el-input v-model="newLottery.desc"></el-input>
        </el-form-item>
        <el-form-item label="可抽此獎項">
          <el-switch
            v-model="newLottery.needFilter"
            active-text="僅全职"
            inactive-text="全部"
            inactive-color="#dadfe4"
          ></el-switch>
        </el-form-item>
        <el-form-item label="獎品圖片" style="margin-top: 15px">
          <div class="image_upload_wrap">
            <div v-if="newLottery.image" class="image_wrap">
              <el-image :src="newLottery.image" />
              <i class="el-icon-delete" @click="removeImage" />
            </div>
            <el-upload
              ref="uploadNewLotteryRef"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <small style="margin-top: 10px;">
            如需更換獎品圖片，請先刪除原圖片
          </small>
        </el-form-item>
      </el-form>
      <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
        <el-button size="mini" @click="closeNewLotteryDialog">取消</el-button>
        <el-button size="mini" type="primary" @click="addHandler">
          {{ newLottery.key ? '確定' : '增加獎項' }}
        </el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable';
import { setData, configField } from '@/helper/index';
import { randomNum } from '@/helper/algorithm';
import { database, DB_STORE_NAME } from '@/helper/db';

export default {
  name: 'LotteryConfig',
  components: {
    draggable
  },
  props: {
    visible: Boolean
  },
  computed: {
    form: {
      get() {
        return this.$store.state.config;
      },
      set(val) {
        // this.$store.commit('setConfig', val);
        return val;
      }
    },
    storeNewLottery: {
      get() {
        return this.$store.state.newLottery;
      },
      set(val) {
        this.$store.commit('updateAllLottery', val);
        return val;
      }
    }
  },
  data() {
    return {
      showAddLottery: false,
      isEditFirstPrize: false,
      newLottery: {
        name: '',
        desc: '',
        needFilter: false,
        key: '',
        image: ''
      }
    };
  },
  methods: {
    onSubmit() {
      setData(configField, this.form);
      this.$store.commit('setConfig', this.form);
      this.$store.commit('setLottery', this.storeNewLottery);
      this.$emit('update:visible', false);
      this.$message({
        message: '保存成功',
        type: 'success'
      });

      this.$nextTick(() => {
        this.$emit('resetconfig');
      });
    },
    addLottery() {
      this.showAddLottery = true;
      this.newLottery = {
        name: '',
        desc: '',
        needFilter: false,
        key: '',
        image: ''
      };
    },
    deleteLottery(key) {
      this.$confirm('確認刪除此獎項嗎？刪除後不可恢複', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('deleteLottery', key);
        })
        .catch(res => {
          console.log('deleteLottery>>>res>>>>>', res);
        });
    },
    async editLottery(item, isFirstPrize) {
      this.newLottery.name = item.name;
      this.newLottery.desc = item.desc;
      this.newLottery.needFilter = item.needFilter;
      this.newLottery.key = item.key;
      const data = await database.get(DB_STORE_NAME, item.key);
      if (data) {
        this.newLottery.image = data.value;
      }
      this.isEditFirstPrize = isFirstPrize;
      this.showAddLottery = true;
    },
    removeImage() {
      this.newLottery.image = '';
      const { key } = this.newLottery;
      this.$store.commit('updatePhotos', {
        id: key,
        value: '',
        createdTime: '',
        updateTime: ''
      });
      database.edit(DB_STORE_NAME, key, { id: key, value: '' });
    },
    randomField() {
      const str = 'abcdefghijklmnopqrstuvwxyz';
      let fieldStr = '';
      for (let index = 0; index < 10; index++) {
        fieldStr += str.split('')[randomNum(1, 26) - 1];
      }
      return `${fieldStr}${Date.now()}`;
    },
    addHandler() {
      if (!this.newLottery.name) {
        return;
      }

      const { key } = this.newLottery;
      const field = key ? key : this.randomField();
      const data = {
        key: field,
        name: this.newLottery.name,
        desc: this.newLottery.desc,
        needFilter: this.newLottery.needFilter
      };
      this.uploadImages(field);
      if (key) {
        if (this.isEditFirstPrize) {
          this.$store.commit('setConfig', { ...this.form, ...data });
        } else {
          this.$store.commit('updateLottery', data);
        }
      } else {
        this.$store.commit('setNewLottery', [data, -1]);
      }
      this.closeNewLotteryDialog();
    },
    closeNewLotteryDialog() {
      this.newLottery.desc = '';
      this.newLottery.name = '';
      this.newLottery.needFilter = false;
      this.$refs.uploadNewLotteryRef.clearFiles();
      this.showAddLottery = false;
    },
    uploadImages(id) {
      const files = this.$refs.uploadNewLotteryRef.uploadFiles;
      if (files[0]) {
        this.handleUnitImage(id, files[0]);
      }
    },
    handleUnitImage(id, file) {
      const formData = new FormData();
      formData.append('uploadImg', file);
      const reader = new FileReader();
      if (file) {
        this.filename = file.name;
        reader.readAsDataURL(file.raw);
        reader.onload = () => {
          this.saveHandler(id, reader.result);
        };
      }
    },
    async saveHandler(id, value) {
      if (!value) {
        return this.$message.error('請選擇照片');
      }
      const Data = await database.get(DB_STORE_NAME, id);
      const param = {
        id,
        value
      };
      database[Data ? 'edit' : 'add'](
        DB_STORE_NAME,
        Data ? id : param,
        Data ? param : null
      )
        .then(res => {
          if (res) {
            this.$emit('getPhoto');
          } else {
            this.$message.error(`${this.filename}上傳失敗`);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>
<style lang="scss">
.c-LotteryConfig {
  .el-dialog__body {
    height: 600px;
    .container {
      height: 100%;
      overflow-y: auto;
      padding: 0 10px;
      .lottery-item {
        cursor: move;
      }
    }
  }
}

.lottery_dialog {
  .image_upload_wrap {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    .image_wrap {
      width: 148px;
      height: 148px;
      position: relative;
      &:hover {
        .el-icon-delete {
          font-weight: bold;
        }
      }
      .el-image {
        width: 148px;
        height: 148px;
      }
      .el-icon-delete {
        z-index: 99;
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
        font-size: 16px;
        &:hover {
          color: #f00;
        }
      }
    }
  }
}
</style>
