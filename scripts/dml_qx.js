/*
2025.1.20 fix:修复异常
小程序:达美乐披萨
域名：game.dominos.com.cn 请求头的openid
export dmlps='openid'
多号@或换行
corn 0 30 10 * * *
*/

const $ = new Env('达美乐披萨');
const axios = require('axios');
let request = require("request");
var qs = require('qs');
request = request.defaults({
	jar: true
});
const { log } = console;
const Notify = 1; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0
const gameName = ($.isNode() ? process.env.gameName : $.getdata("gameName")) || 'abalone'; //达美乐游戏id
let dmlps = ($.isNode() ? process.env.dmlps : $.getdata("dmlps")) || ""
let dmlpsArr = [];
let data = '';
let msg = '';
var hours = new Date().getMonth();
var timestamp = Math.round(new Date().getTime()).toString();
!(async () => {
	if (typeof $request !== "undefined") {
		await GetRewrite();
	} else {
		if (!(await Envs()))
			return;
		else {

			log(`\n\n=============================================    \n脚本执行 - 北京时间(UTC+8)：${new Date(
				new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 +
				8 * 60 * 60 * 1000).toLocaleString()} \n=============================================\n`);
			log(`\n=================== 共找到 ${dmlpsArr.length} 个账号 ===================`)
			if (debug) {
				log(`【debug】 这是你的全部账号数组:\n ${dmlpsArr}`);
			}
			for (let index = 0; index < dmlpsArr.length; index++) {
				num = index + 1
				log(`\n==== 开始【第 ${num} 个账号】====`)
				dmlps = dmlpsArr[index].split('&')

				fxerrorMessage = ''
				while (true) {
					await sharingDone()
					if (fxerrorMessage == '今日分享已用完，请明日再来') {
						break
					}

				}

				sferrorMessage=''
				while (true) {
					await gameDone()
					if(sferrorMessage=='游戏机会不足，分享给好友获取更多机会'){
						break
					}
				}


				await myPrize()
			}
			await SendMsg(msg);
		}
	}
})()
	.catch((e) => log(e))
	.finally(() => $.done())



async function sharingDone() {
	var data = qs.stringify({
		'openid': dmlps[0],
		'from': '1',
		'target': '0'
	});
	return new Promise((resolve) => {
		var options = {
			method: 'POST',
			url: `https://game.dominos.com.cn/${gameName}/game/sharingDone`,
			headers: {
				'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		};
		if (debug) {
			log(`\n【debug】=============== 这是  请求 url ===============`);
			log(JSON.stringify(options));
		}
		axios.request(options).then(async function (response) {
			try {
				let data = response.data;
				if (debug) {
					log(`\n\n【debug】===============这是 返回data==============`);
					log(JSON.stringify(response.data));
				}
				if (data.errorMessage == "今日分享已用完，请明日再来") {
					fxerrorMessage = data.errorMessage
					log(`${data.errorMessage}`)
				}
			} catch (e) {
				log(`异常：${JSON.stringify(response.data)}，原因：${data.message}`)
			}
		}).catch(function (error) {
			console.error(error);
		}).then(res => {
			//这里处理正确返回
			resolve();
		});
	})
}

async function gameDone() {
	// var data = qs.stringify({
	// 	'openid': dmlps[0],
	// 	// 'score': 'OVwsw+wqeJqODjRpUyxoxOlDen85i5Ce3kdwv5pNCehoGRMojxPWdITi+HezcMtt7VJ/4SkCbqMYSx6Y6zwyWcmIsXMw9cX6ksXY1V+2AtpUrMs9WBJwvmLj9E1BIYV1P0IbR+awxHKJcEOAFKxJ52j8PaPLGgugV/G3y5+vljygajO5SqGTB+kFJOepHJWs7NNbxUTALAckiGvym+rMGDv762w4CyriRInPkauLnSVCOGAFuad4MsDXp3dokLgifJmmCGzXxMiRJo4QAm0E1gDB+hk1uSwWIUWP+X87jaZlgPr+yL8Wi99Rpmw9+dlecYkP7sxQc7DojY2VyfF06g==',
	// 	'score': 'cKnlOQZaiV2dGfNXnHIyVTrloqc0gsfGTVhXIpSYA17x4Gfjff17sYbcaqMYzX70yvFw5m6rJIMF%2B5o2GtCkUZbJWA5zNKjOfxhxV4bnE3EP9p%2BTJm5SSgHjKr9Bdt9E7THGruvyN%2B3l2fuI3WOYcuLCm14bX2IvC996I4L1WeD7hecQsYh1oy%2BBNO%2BRB%2FCwZMVghJ0VG7NnRmYhQ9T%2Fkj1uJWzRVal9IroO9mamWpAjZZnX7w9luCSLuPklLpjUqhNMxF6zBY9%2BMqV7VgQynezwTRdI3YxKItEzJ7TmaxGXHYPpLx5YCgH3dcO3zTNPV8%2FZMpow3qGovd6tHtfUFA%3D%3D',
	// 	'tempId': null
	// });
	return new Promise((resolve) => {
		var options = {
			method: 'POST',
			url: `https://game.dominos.com.cn/${gameName}/game/gameDone`,
			headers: {
				'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: `openid=${dmlps[0]}&score=cKnlOQZaiV2dGfNXnHIyVTrloqc0gsfGTVhXIpSYA17x4Gfjff17sYbcaqMYzX70yvFw5m6rJIMF%2B5o2GtCkUZbJWA5zNKjOfxhxV4bnE3EP9p%2BTJm5SSgHjKr9Bdt9E7THGruvyN%2B3l2fuI3WOYcuLCm14bX2IvC996I4L1WeD7hecQsYh1oy%2BBNO%2BRB%2FCwZMVghJ0VG7NnRmYhQ9T%2Fkj1uJWzRVal9IroO9mamWpAjZZnX7w9luCSLuPklLpjUqhNMxF6zBY9%2BMqV7VgQynezwTRdI3YxKItEzJ7TmaxGXHYPpLx5YCgH3dcO3zTNPV8%2FZMpow3qGovd6tHtfUFA%3D%3D&tempId=null`
		};
		if (debug) {
			log(`\n【debug】=============== 这是  请求 url ===============`);
			log(JSON.stringify(options));
		}
		axios.request(options).then(async function (response) {
			try {
				let data = response.data;
				if (debug) {
					log(`\n\n【debug】===============这是 返回data==============`);
					log(JSON.stringify(response.data));
				}
				if (data.statusCode == 0) {
					log(data.content.name)
				}
				if(data.statusCode != 0) {
					sferrorMessage = data.errorMessage
					log(`${data.errorMessage}`)
				}

			} catch (e) {
				log(`异常：${JSON.stringify(response.data)}，原因：${data.message}`)
			}
		}).catch(function (error) {
			console.error(error);
		}).then(res => {
			//这里处理正确返回
			resolve();
		});
	})
}

async function myPrize() {
	return new Promise((resolve) => {
		var options = {
			method: 'GET',
			url: `https://game.dominos.com.cn/${gameName}//game/myPrize?openid=${dmlps[0]}`,

			headers: {
				'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: data
		};
		if (debug) {
			log(`\n【debug】=============== 这是  请求 url ===============`);
			log(JSON.stringify(options));
		}
		axios.request(options).then(async function (response) {
			try {
				let data = response.data;
				if (debug) {
					log(`\n\n【debug】===============这是 返回data==============`);
					log(JSON.stringify(response.data));
				}
				const seenIds = new Set();
				const phoneIds = new Map(); // 用于存储每个 Phone 对应的所有 id
				let Phone = data.extra.slice(0, 3) + '****' + data.extra.slice(7);

				for (let i = 0; i < data.content.length; i++) {
					let id = data.content[i].id;

					// 将 id 映射到对应的符号
					if (id == '001') {
						id = '❶';
					} else if (id == '002') {
						id = '❷';
					} else if (id == '003') {
						id = '❸';
					} else if (id == '004') {
						id = '❹';
					} else {
						id = '❺';
					}

					if (!seenIds.has(id)) {
						seenIds.add(id);

						// 如果这个 Phone 已经存在于映射中，追加 id
						if (phoneIds.has(Phone)) {
							phoneIds.get(Phone).push(id); // 使用数组来存储 id
						} else {
							// 如果是第一次出现这个 Phone，初始化为数组
							phoneIds.set(Phone, [id]);
						}
					}
				}

				// 日志和消息字符串更新
				for (const [phone, ids] of phoneIds) {
					// 对 id 进行排序
					ids.sort((a, b) => {
						return a.charCodeAt(0) - b.charCodeAt(0); // 按符号的字符编码排序
					});

					log(`[${phone}]: ${ids.join(' ')}`); // 使用 join('') 将 id 连接成一个字符串
					msg += `[${phone}]: ${ids.join(' ')}\n`; // 同样更新消息字符串
				}


			} catch (e) {
				log(`异常：${JSON.stringify(response.data)}，原因：${data.message}`)
			}
		}).catch(function (error) {
			console.error(error);
		}).then(res => {
			//这里处理正确返回
			resolve();
		});
	})
}


async function Envs() {
	if (dmlps) {
		if (dmlps.indexOf("@") != -1) {
			dmlps.split("@").forEach((item) => {

				dmlpsArr.push(item);
			});
		} else if (dmlps.indexOf("\n") != -1) {
			dmlps.split("\n").forEach((item) => {
				dmlpsArr.push(item);
			});
		} else {
			dmlpsArr.push(dmlps);
		}
	} else {
		log(`\n 【${$.name}】：未填写变量 dmlps`)
		return;
	}

	return true;
}
function addNotifyStr(str, is_log = true) {
	if (is_log) {
		log(`${str}\n`)
	}
	msg += `${str}\n`
}

// ============================================发送消息============================================ \\
async function SendMsg(message) {
	if (!message)
		return;

	if (Notify > 0) {
		if ($.isNode()) {
			var notify = require('./sendNotify');
			await notify.sendNotify($.name, message);
		} else {
			$.msg(message);
		}
	} else {
		log(message);
	}
}

function DoubleLog(data) {
	if ($.isNode()) {
		if (data) {
			console.log(`    ${data}`);
			msg += `\n    ${data}`;
		}
	} else {
		console.log(`    ${data}`);
		msg += `\n    ${data}`;
	}

}
/**
 * 随机整数生成
 */
function randomInt(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}


/**
 * 时间戳 13位
 */
function ts13() {
	return Math.round(new Date().getTime()).toString();
}


// prettier-ignore
function Env(t, e) {
	class s {
		constructor(t) {
			this.env = t
		}
		send(t, e = "GET") {
			t = "string" == typeof t ? {
				url: t
			} : t;
			let s = this.get;
			return "POST" === e && (s = this.post), new Promise((e, i) => {
				s.call(this, t, (t, s, r) => {
					t ? i(t) : e(s)
				})
			})
		}
		get(t) {
			return this.send.call(this.env, t)
		}
		post(t) {
			return this.send.call(this.env, t, "POST")
		}
	}
	return new class {
		constructor(t, e) {
			this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log(``, `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
		}
		isNode() {
			return "undefined" != typeof module && !!module.exports
		}
		isQuanX() {
			return "undefined" != typeof $task
		}
		isSurge() {
			return "undefined" != typeof $httpClient && "undefined" == typeof $loon
		}
		isLoon() {
			return "undefined" != typeof $loon
		}
		toObj(t, e = null) {
			try {
				return JSON.parse(t)
			} catch {
				return e
			}
		}
		toStr(t, e = null) {
			try {
				return JSON.stringify(t)
			} catch {
				return e
			}
		}
		getjson(t, e) {
			let s = e;
			const i = this.getdata(t);
			if (i) try {
				s = JSON.parse(this.getdata(t))
			} catch {}
			return s
		}
		setjson(t, e) {
			try {
				return this.setdata(JSON.stringify(t), e)
			} catch {
				return !1
			}
		}
		getScript(t) {
			return new Promise(e => {
				this.get({
					url: t
				}, (t, s, i) => e(i))
			})
		}
		runScript(t, e) {
			return new Promise(s => {
				let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
				i = i ? i.replace(/\n/g, ``).trim() : i;
				let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
				r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
				const [o, h] = i.split("@"), a = {
					url: `http://${h}/v1/scripting/evaluate`,
					body: {
						script_text: t,
						mock_type: "cron",
						timeout: r
					},
					headers: {
						"X-Key": o,
						Accept: "*/*"
					}
				};
				this.post(a, (t, e, i) => s(i))
			}).catch(t => this.logErr(t))
		}
		loaddata() {
			if (!this.isNode()) return {}; {
				this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e);
				if (!s && !i) return {}; {
					const i = s ? t : e;
					try {
						return JSON.parse(this.fs.readFileSync(i))
					} catch (t) {
						return {}
					}
				}
			}
		}
		writedata() {
			if (this.isNode()) {
				this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
				const t = this.path.resolve(this.dataFile),
					e = this.path.resolve(process.cwd(), this.dataFile),
					s = this.fs.existsSync(t),
					i = !s && this.fs.existsSync(e),
					r = JSON.stringify(this.data);
				s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
			}
		}
		lodash_get(t, e, s) {
			const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
			let r = t;
			for (const t of i)
				if (r = Object(r)[t], void 0 === r) return s;
			return r
		}
		lodash_set(t, e, s) {
			return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
		}
		getdata(t) {
			let e = this.getval(t);
			if (/^@/.test(t)) {
				const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ``;
				if (r) try {
					const t = JSON.parse(r);
					e = t ? this.lodash_get(t, i, ``) : e
				} catch (t) {
					e = ``
				}
			}
			return e
		}
		setdata(t, e) {
			let s = !1;
			if (/^@/.test(e)) {
				const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
				try {
					const e = JSON.parse(h);
					this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
				} catch (e) {
					const o = {};
					this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
				}
			} else s = this.setval(t, e);
			return s
		}
		getval(t) {
			return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
		}
		setval(t, e) {
			return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
		}
		initGotEnv(t) {
			this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
		}
		get(t, e = (() => {})) {
			t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
				"X-Surge-Skip-Scripting": !1
			})), $httpClient.get(t, (t, s, i) => {
				!t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
			})) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
				hints: !1
			})), $task.fetch(t).then(t => {
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
				try {
					if (t.headers["set-cookie"]) {
						const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
						this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
					}
				} catch (t) {
					this.logErr(t)
				}
			}).then(t => {
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => {
				const {
					message: s,
					response: i
				} = t;
				e(s, i, i && i.body)
			}))
		}
		post(t, e = (() => {})) {
			if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
				"X-Surge-Skip-Scripting": !1
			})), $httpClient.post(t, (t, s, i) => {
				!t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
			});
			else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
				hints: !1
			})), $task.fetch(t).then(t => {
				const {
					statusCode: s,
					statusCode: i,
					headers: r,
					body: o
				} = t;
				e(null, {
					status: s,
					statusCode: i,
					headers: r,
					body: o
				}, o)
			}, t => e(t));
			else if (this.isNode()) {
				this.initGotEnv(t);
				const {
					url: s,
					...i
				} = t;
				this.got.post(s, i).then(t => {
					const {
						statusCode: s,
						statusCode: i,
						headers: r,
						body: o
					} = t;
					e(null, {
						status: s,
						statusCode: i,
						headers: r,
						body: o
					}, o)
				}, t => {
					const {
						message: s,
						response: i
					} = t;
					e(s, i, i && i.body)
				})
			}
		}
		time(t) {
			let e = {
				"M+": (new Date).getMonth() + 1,
				"d+": (new Date).getDate(),
				"H+": (new Date).getHours(),
				"m+": (new Date).getMinutes(),
				"s+": (new Date).getSeconds(),
				"q+": Math.floor(((new Date).getMonth() + 3) / 3),
				S: (new Date).getMilliseconds()
			};
			/(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + ``).substr(4 - RegExp.$1.length)));
			for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr((`` + e[s]).length)));
			return t
		}
		msg(e = t, s = ``, i = ``, r) {
			const o = t => {
				if (!t) return t;
				if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
					"open-url": t
				} : this.isSurge() ? {
					url: t
				} : void 0;
				if ("object" == typeof t) {
					if (this.isLoon()) {
						let e = t.openUrl || t.url || t["open-url"],
							s = t.mediaUrl || t["media-url"];
						return {
							openUrl: e,
							mediaUrl: s
						}
					}
					if (this.isQuanX()) {
						let e = t["open-url"] || t.url || t.openUrl,
							s = t["media-url"] || t.mediaUrl;
						return {
							"open-url": e,
							"media-url": s
						}
					}
					if (this.isSurge()) {
						let e = t.url || t.openUrl || t["open-url"];
						return {
							url: e
						}
					}
				}
			};
			this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
			let h = [``, "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
			h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
		}
		log(...t) {
			t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
		}
		logErr(t, e) {
			const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
			s ? this.log(``, `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log(``, `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
		}
		wait(t) {
			return new Promise(e => setTimeout(e, t))
		}
		done(t = {}) {
			const e = (new Date).getTime(),
				s = (e - this.startTime) / 1e3;
			this.log(``, `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
		}
	}(t, e)
}
