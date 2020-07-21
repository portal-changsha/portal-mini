import { getItem } from '@/utils/localStore.js'
export function dotted(value, start, end) {
	start = start || 3;
	end = end || 7;
	if (!value) {
		return ''
	} else if (value.length === 2){
		return '*' + value.substring(1, start) + value.substring(end, value.length)
	} else if (value.length === 3){
		return '**' + value.substring(2, start) + value.substring(end, value.length)
	}else if (value.length === 4){
		return '***' + value.substring(3, start) + value.substring(end, value.length)
	}else if (value.length === 11) {
		//手机号只显示前二后二
		start = 2;
		end = 9;
		return value.substring(0, start) + '********' + value.substring(end, value.length)
	}else if (value.length === 15) {
		//15位身份证只显示前四后四
		start = 4;
		end = 11;
		return value.substring(0, start) + '********' + value.substring(end, value.length)
	} else if (value.length === 18) {
		//18位身份证只显示前四后四
		start = 4;
		end = 14;
		return value.substring(0, start) + '***********' + value.substring(end, value.length)
	}else{
		return value.substring(0, start) + '****' + value.substring(end, value.length)
	}
}

export function formateDistance(distance){
	if (distance <= 0) {
		return ''
	}
	// 1000 ->  1
	if (distance > 1000 && distance/1000 > 1) {
		return (distance / 1000).toFixed(2) + ' km';
	}
	return distance + ' m'
}

export function formatFee (fee, needSpace) {
    if (typeof(fee) === 'undefined') {
		return ''
	}
	if (needSpace === false) {
		return (fee / 100).toFixed(2) + '元';
	}
	return (fee / 100).toFixed(2) + ' 元';
}

export function formatDate(dateString,flag = true){
	if(!dateString) return
	let formatDate = "";
	dateString = dateString.replace(/\-/g, '/')
	let date = new Date(dateString)
	let weekDay = getWeekDay(date);
	const month = date.getMonth()+1
	const day = date.getDate()
	let hours = date.getHours()
	let min = date.getMinutes()

	if(dateString.length === 10){
		if(flag === 'myRegister'){
			return  month + '月' + day + '日' + ' ' + weekDay
		}
		let res = flag ? (month + '月' + day +'日') + ' ' + weekDay : (month + '月' + day +'日')
		return res
	}
	hours = hours < 10 ? '0'+hours : hours;
	min = min < 10 ? '0'+min : min;
	formatDate = month + '月' + day + '日' + ' ' + weekDay + ' '  + hours + ':' + min;
	return formatDate
}
const getWeekDay = function(date) {
	const Week = ['日', '一', '二', '三', '四', '五', '六'];
	return '周' + Week[date.getDay()];
}

export function formatDeptName(deptName, hosId) {
	if (!deptName) {
		return '暂无科室名称'
	}
	String.prototype.endWith = (endStr) => {
		let d = this.length - endStr.length
		return (d >= 0 && this.lastIndexOf(endStr) === d);
	}
	const hosInfo = getItem('selectedHospital')
	if (((hosId && hosId === '430121002') || (hosInfo && hosInfo.id === '430121002')) && deptName && (deptName.endWith("(本)") || deptName.endWith("(东)") || deptName.endWith("(南)"))) {
		return deptName.substring(0, deptName.length-3)
	}
	return deptName
}
// 格式化空数据
export function formatEmptyData(obj) {
	if (typeof(obj) === 'undefined' || obj === '' || obj === 'null') {
		return '-'
	}
	return obj
}
export function // 每隔三位以逗号分开金钱
    formatMoney(num, type) {
		/*处理超过99999元金额自动换成成万元单位情况*/
		if (num > 99999) {
			num = (num / 10000).toFixed(2)
		}
		var s
		if (type == 3) {
			s = this.formatMoneyWan(num)
		} else {
			s = num
		}
		if (/[^0-9\.]/.test(s))
			return "-";
		if (s == null || s == "")
			return "-";
		s = s.toString().replace(/^(\d*)$/, "$1.");
		s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
		s = s.replace(".", ",");
		var re = /(\d)(\d{3},)/;
		while (re.test(s))
			s = s.replace(re, "$1,$2");
		s = s.replace(/,(\d\d)$/, ".$1");
		// 不带小数位(默认是有小数位)
		if (type == 0) {
			var a = s.split(".");
			if (a[1] == "00") {
				s = a[0];
			}
		}
		return s;
	}