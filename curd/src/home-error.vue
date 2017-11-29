<template>
  <div>
    <el-container>
      <el-header>
        <h1>Vue + Node CURD项目</h1>
      </el-header>
      <el-main>
        <!--表头-->
        <el-row>
          <el-col :offset="1" :span="23" style="text-align: right">
            <div style="margin-top: 40px">
              <el-button @click="addDialog = true" size="small" type="primary" icon="el-icon-plus">添加</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
            </div>
          </el-col>
        </el-row>
        <!--添加用户-->
        <el-row>
          <el-col :span="24">
            <el-table :data="userList" tooltip-effect="dark" style="width:100%" :default-sort="{prop:'create_time',order:'descending'}">
              <el-table-column type="selection" width="55" sortable>

              </el-table-column>
              <el-table-column prop="username" width="100" label="用户名" >

              </el-table-column>
              <el-table-column prop="name" width="80" label="姓名" sortable>

              </el-table-column>
              <el-table-column prop="phone" label="手机">

              </el-table-column>
              <el-table-column prop="email" label="邮箱">

              </el-table-column>
              <el-table-column prop="create_time" label="注册日期" sortable>

              </el-table-column>
              <el-table-column prop="is_active" label="状态" width="75">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.is_active==true?'success':'danger'">{{scope.row.is_active|formatter}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                  <el-button @click="setUser(scope.row)" type="success" size="small">编辑</el-button>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!--分页的显示-->
        <el-row>
          <el-col :span="24">
            <div class="block">
              <el-pagination layout="prev,pager,next" :total="total" :page-size="5" @current-change="pageChange">

              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>

      </el-footer>
    </el-container>
    <!--添加用户-->
    <el-dialog @close="resetForm('addForm')" title="添加新用户" :visible.sync="addDialog">
      <el-form :model="addForm" :rules="addRules" labelWidth="100px" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeat_password">
          <el-input type="text" v-model="addForm.repeat_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input type="text" v-model.number="addForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="addForm.is_active"></el-switch>
        </el-form-item>
      </el-form>
      <el-form>
        <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
        <el-button @click="resetForm('addForm')">取消</el-button>
      </el-form>
    </el-dialog>
    <!--编辑用户信息-->
    <el-dialog @close="resetForm('editForm')" title="修改用户" :visible.sync="editDialog">
      <el-form :model="editForm" :rules="addRules" labelWidth="100px" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input type="text" v-model.number="editForm.phone" \ auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="is_active">
          <el-switch v-model="editForm.is_active"></el-switch>
        </el-form-item>
      </el-form>
      <el-form>
        <el-button type="primary" @click="updateUser('editForm')">修改</el-button>
        <el-button @click="resetForm('editForm')">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import ElSwitch from "../../node_modules/element-ui/packages/switch/src/component";
  export default{
    components: {ElSwitch},
    name: 'home',
//    组件渲染完毕后调用getUsers，来获取所有的用户列表
    mounted: function () {
      this.getUsers()
    },
    data() {
//        自定义验证规则
      var checkPass = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('确认密码不为空'))
        } else if (value !== this.addForm.password) {
          callback(new Error('密码不一致'))
        } else {
          callback()
        }
      }
      return {
//          用于收集新增用户的对象
        addForm: {
          "username": '',
          "name": '',
          "password": '',
          "repeat_psd": '',
          "phone": '',
          "email": '',
          "is_active": false
        },
        //用户修改用户的对象
        editForm: {
          "name": '',
          "phone": '',
          "email": '',
          "is_active": null
        },
//          添加的对话框
        addDialog: false,
//        编辑的对话框
        editDialog: false,
        userList: [],
        addRules: {
          username: [
            {required: true, message: '请输入用户名', tigger: 'blur'},
            {min: 3, max: 16, message: '请输入合法用户名', tigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入姓名', tigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', tigger: 'blur'},
            {min: 6, max: 12, message: '密码长度不合法', tigger: 'blur'}
          ],
          repeat_password: [
            {required: true, validator: checkPass, tigger: 'blur'}
          ],
          phone: [
            {type: 'number', message: '手机号为数字类型', required: true}
          ],
          email: [
            {type: 'email', required: true, message: '必须为合法邮箱', tagger: 'blur'}
          ]
        },
        /*editRules:{
          name: [
            {required: true, message: '请输入姓名', tigger: 'blur'}
          ],
          phone:[
            { message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
          ],
          email: [
            {type: 'email', required: true, message: '必须为合法邮箱', tagger: 'blur'}
          ]
        },*/
        //分页
        total:0
      }
    },
    methods: {
//        表单提交
      submitForm: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/users/create', this.addForm)
              .then(response => {
                var res = response.data
                if (res.status == '0') {
//                       显示成功的消息提示
                  this.$message.success('新增用户成功')
                  this.resetForm('addForm')
//                  重新获取最新数据
                  this.getUsers()
                } else {
//                    返回错误
                  this.$message.error(res.message)
                }
              }).catch(err => {
              console.log(err)
            })
          } else {
            return false
          }
        })
      },
      resetForm: function (formName) {
          if(formName == 'addForm'){
            //          将弹出框关闭
            this.addDialog = false
//          将内容清空
            this.$refs[formName].resetFields()
          }else if(formName == 'editForm'){
              //编辑的弹出框关掉
            this.editDialog = false
          }

      },
      getUsers: function (page) {
        axios.get('/users/getUsers',{
          params:{
            page: page || 1,
            pageSize:5
          }
        }).then(response => {
          let res = response.data
          this.userList = res.userList
          this.total = res.count;
          console.log(this.total)
        }).catch(err => {
          console.log(err)
        })
      },
      pageChange:function(value){
        console.log(value)
        this.getUsers(value);
      },
      setUser:function(row){
          //编辑的弹出框开启
        this.editDialog = true;
        //可以使用row里面的数据，将整行的用户信息输出
//        console.log(row)
        this.editForm._id = row._id;
        this.editForm.name = row.name;
        this.editForm.phone = row.phone;
        this.editForm.email = row.email;
        this.editForm.is_active = row.is_active;

      },
      updateUser:function(){
          axios.post('/users/updateUser',this.editForm)
            .then(response=>{
                console.log(response)
            }).catch(err=>{
                console.log(err)
          })
      }
    }
  }
</script>
<style>
  * {
    box-sizing: border-box;
  }

  h1 {
    text-align: center;
  }
  .block {
    margin-top: 20px;
    float: right;
    margin-right: 70px;
  }
</style>
