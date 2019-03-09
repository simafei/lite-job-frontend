<template>
    <div class="fillcontain">
        <el-row :gutter="20" class="table_container">
            <el-col :span="6">服务名: <el-input placeholder="服务名" v-model="queryParams.appName" style="width: 60%"></el-input></el-col>
            <el-col :span="12">创建时间:
                <el-date-picker
                    v-model="datePeriod"
                    type="datetimerange"
                    :picker-options="pickerOptions2"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker></el-col>
            <el-col :span="2"><el-button type="primary" round @click="search()">搜索</el-button></el-col>
            <el-col :span="2"><el-button type="success" round @click="createDialogVisible = true">新建任务</el-button></el-col>
        </el-row>
        <div class="table_container">
            <el-table
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="ID">
                                <span>{{ props.row.id }}</span>
                            </el-form-item>
                            <el-form-item label="任务描述">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="超时时间">
                                <span>{{ props.row.timeout }}</span>
                            </el-form-item>
                            <el-form-item label="重试次数">
                                <span>{{ props.row.failRetryCount }}</span>
                            </el-form-item>
                            <el-form-item label="任务参数">
                                <span>{{ props.row.jobArgs }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{ props.row.createTime }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="任务ID"
                    prop="jobHandler">
                </el-table-column>
                <el-table-column
                    label="任务组"
                    prop="appName">
                </el-table-column>
                <el-table-column
                    label="任务名称"
                    prop="jobName">
                </el-table-column>
                <el-table-column
                    label="Cron表达式"
                    prop="cronExpression">
                </el-table-column>
                <el-table-column
                    label="任务状态"
                    prop="status">
                </el-table-column>
                <el-table-column label="操作" width="360">
                    <template slot-scope="scope">
                        <el-button
                            type="success"
                            size="small"
                            @click="openStartDialog(scope.row)">启动
                        </el-button>
                        <el-button
                            type="warning"
                            size="small"
                            v-if="scope.row.status=='NORMAL'"
                            @click="pauseJob(scope.row)">
                            暂停
                        </el-button>
                        <el-button
                            type="warning"
                            size="small"
                            v-if="scope.row.status=='PAUSED'"
                            @click="resumeJob(scope.row)">
                            恢复
                        </el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="deleteJob(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="新建任务" :visible.sync="createDialogVisible">
            <el-form>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="任务名称">
                            <el-input placeholder="任务名称" v-model="addJobParams.jobName"></el-input>
                        </el-form-item></el-col>
                    <el-col :span="12">
                        <el-form-item label="服务名称">
                            <el-input placeholder="appName" v-model="addJobParams.appName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="任务处理器">
                            <el-input placeholder="jobHandler" v-model="addJobParams.jobHandler"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="调度表达式">
                            <el-input placeholder="Cron表达式" v-model="addJobParams.cronExpression"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="任务重新次数">
                            <el-input placeholder="任务重新次数" v-model="addJobParams.failRetryCount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务超时时间">
                            <el-input placeholder="任务超时时间" v-model="addJobParams.timeout"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="任务描述">
                    <el-input type="textarea" :rows="2" placeholder="任务描述" v-model="addJobParams.description"></el-input>
                </el-form-item>
                <el-form-item label="任务运行参数">
                    <el-input type="textarea" :rows="2" placeholder="任务运行参数" v-model="addJobParams.jobArgs"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createJob()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="运行任务" :visible.sync="startDialogVisible">
            <el-form>
                <el-form-item label="任务参数:">
                    <el-input type="textarea" :rows=3 placeholder="任务参数" v-model="jobArgs"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="triggerJob()">运行一次</el-button>
                <el-button type="primary" v-if="chooseRow.status=='NONE'" @click="startJob()">启动任务</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                createDialogVisible: false,
                startDialogVisible: false,
                count: 0,
                totalPage: 0,
                datePeriod: [],
                queryParams: {},
                tableData: [],
                jobArgs: "",
                currentPage: 1,
                chooseRow: {},
                addJobParams: {
                    cronExpression: "0 0/5 * * * ?"
                }
            }
        },
        mounted() {
            this.initData();
        },
        computed: {},
        components: {},
        methods: {
            initData() {
                try {
                    this.getJobList();
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            getJobList() {
                this.$http.get('/jobs', {params: this.queryParams}).then(function (response) {
                    this.tableData = response.body.items;
                    this.queryParams.currentPage = response.body.currentPage;
                    this.currentPage = response.body.currentPage;
                    this.totalPage = response.body.totalPage;
                    this.count = response.body.totalCount;
                }, function (error) {
                    console.log(error);
                });
            },
            search() {
                if (this.datePeriod.length > 0) {
                    this.queryParams.startTime = this.datePeriod[0].getTime();
                    this.queryParams.endTime = this.datePeriod[1].getTime();
                }
                this.getJobList();
            },
            createJob() {
                console.log(this.addJobParams);
                this.createDialogVisible=false;
                this.$http.post('/jobs', this.addJobParams).then(function (response) {
                    this.$message('任务创建成功');
                    this.getJobList();
                }, function (error) {
                    console.log(error);
                });
            },
            openStartDialog(row){
                console.log(row);
                this.chooseRow = row;
                this.startDialogVisible=true;
            },
            startJob() {
                this.startDialogVisible=false;
                this.$http.post('/jobs/start', this.createJobParams(this.jobArgs)).then(function (response) {
                    this.chooseRow.status="NORMAL";
                    this.$message('任务启动成功');
                }, function (error) {
                    console.log(error);
                });
            },
            // createJobParams(jobHandler, appName, args) {
            //     return {"key": {"jobHandler": jobHandler, "appName": appName}, "args": args};
            // },
            createJobParams(args) {
                return {"key": {"jobHandler": this.chooseRow.jobHandler, "appName": this.chooseRow.appName}, "args": args};
            },
            pauseJob(row) {
                this.$http.post('/jobs/pause', {"jobHandler": row.jobHandler, "appName": row.appName}).then(function (response) {
                    row.status="PAUSED";
                    this.$message('任务已暂停');
                }, function (error) {
                    console.log(error);
                });
            },
            resumeJob(row) {
                this.$http.post('/jobs/resume', {"jobHandler": row.jobHandler, "appName": row.appName}).then(function (response) {
                    row.status="NORMAL";
                    this.$message('任务恢复成功');
                }, function (error) {
                    console.log(error);
                });
            },
            triggerJob() {
                this.startDialogVisible=false;
                this.$http.post('/jobs/triggers', this.createJobParams(this.jobArgs)).then(function (response) {
                    this.$message('任务触发成功');
                }, function (error) {
                    console.log(error);
                });
            },
            deleteJob(index, row) {
                this.$http.delete('/jobs', {params: {"jobHandler":row.jobHandler, "appName": row.appName}}).then(function (response) {
                    this.tableData.splice(index, 1)
                }, function (error) {
                    console.log(error);
                });
            },
        },
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .table_container {
        padding: 20px;
    }

    .Pagination {
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }

    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
