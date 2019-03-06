import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const jobList = r => require.ensure([], () => r(require('@/page/jobList')), 'jobList');
const logList = r => require.ensure([], () => r(require('@/page/logList')), 'logList');

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/jobList',
			component: jobList,
			meta: ['任务管理', '任务列表'],
		},{
			path: '/logList',
			component: logList,
			meta: ['任务管理', '调度日志'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
