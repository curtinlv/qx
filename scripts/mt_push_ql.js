/*
2025.6.21
手动执行，上传美团ck至青龙环境变量
【圈X】
[task_local]
0 0 1 1 * mt_push_ql.js, tag=美团CK上传青龙, enabled=false

*/
const $ = new Env("推送美团ck至青龙");

// 填写青龙地址 （必填）
let qlUrl = "";
// 填写青龙应用密钥
let clientSecret = "";
// 填写青龙应用id
let clientId = "";

// ######################################
if ($.isNode() && process.env.qlUrl) {
    qlUrl = process.env.qlUrl
}
if ($.isNode() && process.env.clientSecret) {
    clientSecret = process.env.clientSecret
}
if ($.isNode() && process.env.clientId) {
    clientId = process.env.clientId
}
let mt_Cookie =  ``;
let mt_headers =  ``;
let pkc_mt_url = ``;
let pkc_mt_body = ``;

let mt_headers_sx =  ``;
let pkc_mt_url_sx = ``;
let pkc_mt_body_sx = ``;


if ($.isNode() && process.env.mt_Cookie) {
    mt_Cookie = process.env.mt_Cookie
}
else{
    mt_Cookie = $.getval('mt_Cookie')
}

if ($.isNode() && process.env.mt_headers) {
    mt_headers = process.env.mt_headers
}
else{
    mt_headers = $.getval('mt_headers')
}


if ($.isNode() && process.env.pkc_mt_url) {

    pkc_mt_url = process.env.pkc_mt_url
}
else{
    pkc_mt_url = $.getval('pkc_mt_url')
}

if ($.isNode() && process.env.pkc_mt_body) {
    pkc_mt_body = process.env.pkc_mt_body
}
else{
    pkc_mt_body = $.getval('pkc_mt_body')
}

if ($.isNode() && process.env.mt_headers_sx) {
    mt_headers_sx = process.env.mt_headers_sx
}
else{
    mt_headers_sx = $.getval('mt_headers_sx')
}


if ($.isNode() && process.env.pkc_mt_url_sx) {

    pkc_mt_url_sx = process.env.pkc_mt_url_sx
}
else{
    pkc_mt_url_sx = $.getval('pkc_mt_url_sx')
}

if ($.isNode() && process.env.pkc_mt_body_sx) {
    pkc_mt_body_sx = process.env.pkc_mt_body_sx
}
else{
    pkc_mt_body_sx = $.getval('pkc_mt_body_sx')
}

let userId = ``;

 if (mt_headers && mt_headers.length > 0 && pkc_mt_url.length > 0 && pkc_mt_body.length > 0){

 }else{
    $.msg($.name,'请先抓取CK再执行上传','');
    $.done();
 }

// 以下不用填写
let qlToken= "";
let userIDValue='';
let addData = [];
// let isGetCookie = typeof $request !== 'undefined'
if (true) {
	GetRewrite();
}

async function GetRewrite() {
    if (qlUrl.length > 0 && clientSecret.length > 0 && clientId.length >0){
		await pkc_getUserName();
		if (!userId){
			userId = await getUserId(mt_Cookie);
		}
		// console.log(`美团ID:${userId}`);
        await getQlToekn();
        await getAllEnvs();
        // console.log($.envsList)
        let oldEnvId = [];
        for (let i = 0; i< $.envsList.length; i++){
            if ($.envsList[i]["name"] === 'pkc_mt_url' ||
                $.envsList[i]["name"] === 'pkc_mt_body' ||
                $.envsList[i]["name"] === 'mt_headers' ||
                $.envsList[i]["name"] === 'pkc_mt_url_sx' ||
                $.envsList[i]["name"] === 'pkc_mt_body_sx' ||
                $.envsList[i]["name"] === 'mt_headers_sx'
            ){
                if (typeof $.envsList[i]['_id'] !== 'undefined'){
                    $.isOld = 1;
                    $.qlEnvId = $.envsList[i]['_id'];
                }else{
                    $.qlEnvId = $.envsList[i]['id'];
                     $.isOld = 0;
                }
                oldEnvId.push($.qlEnvId)
                // console.log(`id【${$.qlEnvId}】 `);
            }
        }
        if (oldEnvId.length > 0){
            // 删除旧变量
            await deleteEnv(oldEnvId);
        }
        if (pkc_mt_url) addData.push({ name: 'pkc_mt_url', value: pkc_mt_url, remarks: `美团ID:${userId}`});
        if (pkc_mt_body) addData.push({ name: 'pkc_mt_body', value: pkc_mt_body, remarks: `美团ID:${userId}`});
        if (mt_headers) addData.push({ name: 'mt_headers', value: mt_headers, remarks: `美团ID:${userId}`});
        if (pkc_mt_url_sx) addData.push({ name: 'pkc_mt_url_sx', value: pkc_mt_url_sx, remarks: `美团ID:${userId}`});
        if (pkc_mt_body_sx) addData.push({ name: 'pkc_mt_body_sx', value: pkc_mt_body_sx, remarks: `美团ID:${userId}`});
        if (mt_headers_sx) addData.push({ name: 'mt_headers_sx', value: mt_headers_sx, remarks: `美团ID:${userId}`});
		if (addData.length > 0){
        	await addEnv(addData);
		}
        $.done();

    }else{
        $.msg($.name,`请配置青龙应用密钥，再执行`,``);
        $.done();
    }
}
async function pkc_getUserName(timeout = 0) {
	return new Promise((resolve) => {
		setTimeout(() => {
			let orig_hd = $.toObj(mt_headers, `header转换失败`);
			let tk =  getUserToekn(orig_hd['Cookie']);
			let url = {
				url: `https://open.meituan.com/user/v1/info/auditting?fields=auditUsername&joinKey=&channelEnc=`,
				headers : {
					'Origin' : `https://mtaccount.meituan.com`,
					'Accept-Encoding' : `gzip, deflate, br`,
					'Connection' : `keep-alive`,
					'X-Titans-User' : ``,
					'Accept' : `*/*`,
					'Host' : `open.meituan.com`,
					'User-Agent' : orig_hd['User-Agent'],
					'Referer' : `https://mtaccount.meituan.com/`,
					'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
					'token' : tk
				}
			};
			// console.log(JSON.stringify(url));
			$.get(url, async (err, resp, data) => {
				try {
					// if (logs) $.log(`获取用户昵称(rights)🚩: ${data}`);
					if (resp && resp.statusCode === 200){
						try {
							$.signget = JSON.parse(data);
							console.log(`[${$.time("MM-dd HH:mm:ss.S")}]【当前用户】：${$.signget['user']['username']}(${$.signget['user']['id']})\n`);
							userId = `${$.signget['user']['username']}(${$.signget['user']['id']})`;
						}catch (e) {
							$.log(`[${$.time("MM-dd HH:mm:ss.S")}]获取用户昵称失败2：${data}`);
						}
					}else{
						$.log(`[${$.time("MM-dd HH:mm:ss.S")}]获取用户昵称失败：${data}`);
					}

				} catch (e) {
					$.logErr(e, resp);
				} finally {
					resolve()
				}
			})
		}, timeout)
	})
}
async function getUserId(cookieString) {
    // 步骤1：将字符串按分号拆分成键值对数组
    const pairs = cookieString.split(';');

    // 步骤2：遍历每个键值对
    for (const pair of pairs) {
        // 步骤3：分割键和值，并清除首尾空格
        const [key, value] = pair.trim().split('=');

        // 步骤4：匹配目标键名
        if (key === 'userId' && value) {
            return value;
        }
    }
	for (const pair of pairs) {
        // 步骤3：分割键和值，并清除首尾空格
        const [key, value] = pair.trim().split('=');

        // 步骤4：匹配目标键名
        if (key === 'iuuid' && value) {
            return value;
        }
    }

    // 未找到时返回空值
    return null;
}
function getUserToekn(cookieString) {
	// 步骤1：将字符串按分号拆分成键值对数组
	const pairs = cookieString.split(';');

	// 步骤2：遍历每个键值对
	for (const pair of pairs) {
		// 步骤3：分割键和值，并清除首尾空格
		const [key, value] = pair.trim().split('=');

		// 步骤4：匹配目标键名
		if (key === 'token' && value) {
			return value;
		}
	}
	for (const pair of pairs) {
		// 步骤3：分割键和值，并清除首尾空格
		const [key, value] = pair.trim().split('=');

		// 步骤4：匹配目标键名
		if (key === 'dper' && value) {
			return value;
		}
	}
	// 未找到时返回空值
	return null;
}

function decodeUnicode(str) {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
}




// 获取所有变量
async function getAllEnvs(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = {
                url: qlUrl + `/open/envs`,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": "Bearer " + qlToken
                }
            };
            $.get(url,  (err, resp, data) => {
                try {
                    // $.log(`所有变量🚩: ${data}`);
                    $.envsData = JSON.parse(data);
                    if ($.envsData.code === 200){
                        $.envsList = $.envsData.data;
                        // return $.envsData.data;
                    } else {
                        $.msg(`获取变量失败~`, ``, `${$.envsData.msg}`);
						$.done();
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}


// 获取所有变量
async function getQlToekn(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(()	 => {
            let url = {
                url: qlUrl + `/open/auth/token?client_id=${clientId}&client_secret=${clientSecret}`,
                headers: {"Content-Type": "application/json;charset=UTF-8"}
            };
            $.get(url, (err, resp, data) => {
				try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`)
                        console.log(`${$.name} API请求失败，请检查网路重试`)
                        $.done();
                    }else{
                        qlToken = JSON.parse(data).data.token;
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}
async function addEnv(envData) {
    return new Promise(resolve => {
        const options = {
            url: qlUrl + `/open/envs`,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": "Bearer " + qlToken
            },
            body: JSON.stringify(envData),
        }
        $.post(options, (err, resp, data) => {
            try {

                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (JSON.parse(data).code === 200) {
                        $.msg('美团ck上传青龙成功', `美团ID: ${userId}`, '');
                    }else{
                        $.msg('美团ck上传青龙失败', `${data}`, '');
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
                $.done();
            }
        })
    })
}
function updateEnv(updateEnvBody) {
    return new Promise(resolve => {

        const url = qlUrl + `/open/envs`
        const method = "PUT";
        const headers = {
            "Content-Type": "application/json",
            "accept": "application/json",
            "Authorization": "Bearer " + qlToken
        };
        const myRequest = {
            url: url,
            method: method, // Optional, default GET.
            headers: headers, // Optional.
            body: JSON.stringify(updateEnvBody) // Optional.
        };

        $task.fetch(myRequest).then(response => {
            if (JSON.parse(response.body).code === 200) {
                $.msg('【更新】饿了么ck上传青龙成功', `用户${updateEnvBody["remarks"]}[id:${userIDValue}]`, '');
            }else{
                $.msg('【更新】饿了么ck上传青龙失败', `${response.body}`, '');
            }
            $.done();
        }, reason => {
            console.log(`${reason.error}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
            $done();
        });
    })
}
async function deleteEnv(list) {
    return new Promise((resolve) => {
        setTimeout(() => {
			const url = qlUrl + `/open/envs`
			const headers = {
				"Content-Type": "application/json",
				"accept": "application/json",
				"Authorization": "Bearer " + qlToken
			};
			const myRequest = {
				url: url,
				headers: headers, // Optional.
				body: JSON.stringify(list) // Optional.
			};
            $.delete(myRequest, (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`)
                        console.log(`删除美团旧ck-失败`);
						$.done();
                    }else{
						console.log(`删除美团旧ck-成功`);
                    }
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, 0)
    })
}
// prettier-ignore
function Env(t, e) {
	"undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
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
			this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
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
				i = i ? i.replace(/\n/g, "").trim() : i;
				let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
				r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
				const [o, h] = i.split("@"), n = {
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
				this.post(n, (t, e, i) => s(i))
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
				const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
				if (r) try {
					const t = JSON.parse(r);
					e = t ? this.lodash_get(t, i, "") : e
				} catch (t) {
					e = ""
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
						s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
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
		delete(t, e = (() => {})) {
			if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
				"X-Surge-Skip-Scripting": !1
			})), $httpClient.post(t, (t, s, i) => {
				!t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
			});
			else if (this.isQuanX()) t.method = "DELETE", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
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
				this.got.delete(s, i).then(t => {
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
		time(t, e = null) {
			const s = e ? new Date(e) : new Date;
			let i = {
				"M+": s.getMonth() + 1,
				"d+": s.getDate(),
				"H+": s.getHours(),
				"m+": s.getMinutes(),
				"s+": s.getSeconds(),
				"q+": Math.floor((s.getMonth() + 3) / 3),
				S: s.getMilliseconds()
			};
			/(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
			for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
			return t
		}
		msg(e = t, s = "", i = "", r) {
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
			if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
				let t = ["", "==============📣系统通知📣=============="];
				t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
			}
		}
		log(...t) {
			t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
		}
		logErr(t, e) {
			const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
			s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
		}
		wait(t) {
			return new Promise(e => setTimeout(e, t))
		}
		done(t = {}) {
			const e = (new Date).getTime(),
				s = (e - this.startTime) / 1e3;
			this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
		}
	}(t, e)
}
