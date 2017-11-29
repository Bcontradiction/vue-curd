<template>
  <div>
    <el-container>
      <el-header>
        <h1>Vue + Node CURD增删改查项目</h1>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="20" :offset="1">
            <div class="fr margin40">
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="addDialog = true">添加</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deletesButton">删除</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="userList" tooltip-effect="dark" style="width:100%" :default-sort="{prop:'create_time',order:'descending'}" @selection-change="selectionButton">
              <el-table-column type="selection" width="55">

              </el-table-column>
              <el-table-column prop="username" width="100" label="用户名">

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
                  <el-tag :type="scope.row.is_active==true?'success':'danger'">
                    {{scope.row.is_active|formatter}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                  <el-button type="success" size="small" @click="setUser(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteUser(scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="block">
              <el-pagination layout="prev,pager,next" :total="total" :page-size="5" @current-change="pageChange">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog title="添加新用户" :visible.sync="addDialog" @close="resetForm('addForm')">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="addForm.username" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="addForm.name" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="addForm.password" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeat_password">
          <el-input type="text" v-model="addForm.repeat_password" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input type="text" v-model.number="addForm.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="addForm.email" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="addForm.is_active"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
          <el-button @click="resetForm('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editDialog" @close="resetForm('editForm')">
      <el-form :model="editForm" :rules="addRules" ref="editForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input type="text" v-model.number="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="is_active">
          <el-switch v-model="editForm.is_active"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUser">修改</el-button>
          <el-button @click="resetForm('editForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name:"Home",
    //组件渲染完毕后调用getUsers,来获取所有的用户列表
    mounted:function(){
      this.getUsers()
    },
    data(){
      //自定义的验证规则
      var checkPass = (rule,value,callback)=>{
        if(value == ''){
          callback(new Error('确认密码不能为空'));
        }else if(value !== this.addForm.password){
          callback(new Error('两次密码不一致'));
        }else{
          callback();
        }
      };
      return {
        //用于收集新增用户的对象
        addForm:{
          username:'', //用户名
          name:'', //姓名
          password:'', //密码
          repeat_password:'', //确认密码
          phone:'', //电话
          email:'', //邮箱
          is_active:false //状态
        },
        //用于修改用户的对象
        editForm:{
          "_id":'',
          "name":'',
          "phone":'',
          "email":'',
          "is_active":null
        },
        //添加的对话框
        addDialog:false,
        //编辑的对话框
        editDialog:false,
        userList:[],
        addRules:{
          username:[
            {required:true,message:'请输入用户名',tigger:'blur'},
            {min:3,max:16,message:'请输入合法的用户名',tigger:'blur'}
          ],
          name:[
            {required:true,message:'请输入姓名',tigger:'blur'}
          ],
          password:[
            {required:true,message:'请输入密码',tigger:'blur'},
            {min:6,max:12,message:'密码长度不合法',tigger:'blur'}
          ],
          repeat_password:[
            {validator:checkPass,tigger:'blur'}
          ],
          phone:[
            {type:'number',required:true,message:'必须是数字类型',tigger:
              'blur'}
          ],
          email:[
            {type:'email',required:true,message:'必须是合法邮箱格式',tigger:'blur'}
          ]
        },
        total:0,
        multipleSelection:[]
      }
    },
    methods:{
      //表单提交
      submitForm:function(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            //提交
            axios.post('/users/create',this.addForm)
              .then(response=>{
                var res = response.data;
                if(res.status == '0'){
                  //显示成功的消息提示
                  this.$message.success('新增用户成功');
                  this.resetForm('addForm');
                  //重新获取下最新数据
                  this.getUsers();
                }else{
                  //返回了错误的提示消息的时候
                  this.$message.error(res.message);
                }
              }).catch(err=>{
              console.log(err);
            })
          }else{
            return false
          }
        })
      },
      resetForm:function(formName){
        if(formName == 'addForm'){
          //将新增的弹出框关闭
          this.addDialog = false;
        }else if(formName == 'editForm'){
          //编辑的弹出框关掉
          this.editDialog = false;
        }
        //将弹出框里面的内容清空
        this.$refs[formName].resetFields();
      },
      getUsers:function(page){
        axios.get('/users/getUsers',{
          params:{
            page:page || 1,
            pageSize:5
          }
        })
          .then(response=>{
            var res = response.data;
            this.userList = res.userList;
            this.total = res.count;
          }).catch(err=>{
          console.log(err);
        })
      },
      pageChange:function(value){
        this.getUsers(value);
      },
      setUser:function(row){
        //编辑的弹出框开启
        this.editDialog = true;
        //可以使用row里面的数据，将整行的用户信息输出
        this.editForm._id = row._id;
        this.editForm.name = row.name;
        this.editForm.phone = row.phone;
        this.editForm.email = row.email;
        this.editForm.is_active = row.is_active;
      },
      updateUser:function(){
        axios.post('/users/updateUser',this.editForm)
          .then(response=>{
            var res = response.data;
            if(res.status == '0'){
              this.resetForm('editForm');
              this.$message.success('修改成功');
              this.getUsers();
            }
          }).catch(err=>{
          console.log(err);
        })
      },
      deleteUser:function(row){
        this.$confirm('此操作将永久删除用户'+ row.username +', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center:true
        }).then(() => {
          axios.post('/users/remove',row).then(data=>{
            this.$message.success('删除成功!')
            this.getUsers();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      selectionButton:function (val) {
        this.multipleSelection= val
      },
      deletesButton:function(){
        this.$confirm('此操作将永久删除选中的文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('/users/deletes', this.multipleSelection).then(data=>{
            if (data.data.status == '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getUsers()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      }
    }
  }
</script>
<style>
  h1 {
    text-align:center;
  }
  .clearfix {
    clear:both;
  }
  .fr {
    float:right;
  }
  .fl {
    float:left;
  }
  .margin40 {
    margin-top:40px;
  }
  .block {
    margin-top:20px;
    float:right;
  }
</style>
