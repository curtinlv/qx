/*
美团抢券-夏天来了
功能：qx自动重写抓取请求体 ，重放请求（定时任务），默认重放60次，第22行自行修改。

Author: Curtin
date 2025.5.10

V2P/圈叉：
# 重写
[rewrite_remote]
https://raw.githubusercontent.com/curtinlv/qx/main/rewrite/pkc.conf, tag=pkc, update-interval=172800, opt-parser=false, enabled=true

[rewrite_local]
# 更改时间（uptime-mt.js文件保存到qx目录文件scripts下面，抓包时候就改下时间。）
rights-apigw.meituan.com/api/rights/activity/secKill/info url script-response-body uptime-mt-v1.js

[task_local]
# 定时抢券
58 59 9,11,13 * * * https://raw.githubusercontent.com/curtinlv/qx/main/scripts/pkc-mt-xtll.js, tag=美团抢卷-夏天来了, enabled=true
*/
const $ = Env("美团抢卷-夏天来了");
$.msg(
    $.name,
    '提示：⚠️脚本已废弃，请使用pkc-mt0807.js\n'
);
return;
const pkc_qjnum = 60;  // 重放60次
// 如果想查看当前是否已经抓取Body ， 把下面改2;
pkc_select = 1; // 1:抢券 2：仅打印当前环境变量 body header url参数

// $.idx = ($.idx = ($.getval('HuaHuiSuffix') || '1') - 1) > 0 ? ($.idx + 1 + '') : ''; // 账号扩展字符
const notify = $.isNode() ? require("./sendNotify") : ``;
const logs = 0; // 0为关闭日志，1为开启
const notifyInterval = 1; // 0为关闭通知，1为所有通知，
const notifyttt = 1 // 0为关闭外部推送，1为所有通知
$.message = '', COOKIES_SPLIT = '';


let mt_Cookie = ``;

let mt_headers =  ``;
let pkc_mt_method  = ``;
let pkc_mt_url = ``;
let pkc_mt_body = ``;

let mt_headers_sx =  ``;
let pkc_mt_method_sx  = ``;
let pkc_mt_url_sx = ``;
let pkc_mt_body_sx = ``;


if ($.isNode() && process.env.mt_headers) {
    mt_headers = process.env.mt_headers
}
else{
    mt_headers = $.getval('mt_headers')
}

if ($.isNode() && process.env.pkc_mt_method) {

    pkc_mt_method = process.env.pkc_mt_method
}
else{
    pkc_mt_method = $.getval('pkc_mt_method')
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
// Length = mt_headers.length;

if ($.isNode() && process.env.mt_headers_sx) {
    mt_headers_sx = process.env.mt_headers_sx
}
else{
    mt_headers_sx = $.getval('mt_headers_sx')
}

if ($.isNode() && process.env.pkc_mt_method_sx) {

    pkc_mt_method_sx = process.env.pkc_mt_method_sx
}
else{
    pkc_mt_method_sx = $.getval('pkc_mt_method_sx')
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


if ($.isNode() && process.env.mt_Cookie) {
    mt_Cookie = process.env.mt_Cookie
}
else{
    mt_Cookie = $.getval('mt_Cookie')
}

if ($.isNode() && process.env.mt_Cookie) {
    mt_Cookie = process.env.mt_Cookie
}
else{
    mt_Cookie = $.getval('mt_Cookie')
}


function GetCookie() {
    if ($request && $request.url.indexOf("rights-apigw.meituan.com/api/rights/activity/secKill/grab") >= 0) {
         mt_headers = JSON.stringify($request.headers);
        mt_Cookie = $request.headers.Cookie;
        pkc_mt_body = $request.body;
        mt_body = JSON.parse($request.body);
        pkc_mt_method = $request.method;
        pkc_mt_url = $request.url;
        $.setdata("{}", "pkc_mt_headers");
        if (mt_headers) $.setdata(mt_headers, "mt_headers");
        if (mt_Cookie) $.setdata(mt_headers, "mt_Cookie");
        if (pkc_mt_url) $.setdata(pkc_mt_url, "pkc_mt_url");
        if (pkc_mt_body) $.setdata(pkc_mt_body, "pkc_mt_body");

        $.log(
            `[${$.name}] 获取美团抢券请求体✅: 成功,pkc_mt_url: ${pkc_mt_url}`
        );
        $.msg($.name, `获取美团mt_Cookieg: 成功🎉`, `mt_Cookie：${mt_Cookie}`);
        $done();
    }
    if ($request && ($request.url.indexOf("rights-apigw.meituan.com/api/rights/activity/secKill/info") >= 0)) {
        mt_headers_sx = JSON.stringify($request.headers);
        pkc_mt_method_sx = $request.method;
        pkc_mt_url_sx = $request.url;
        pkc_mt_body_sx = $request.body;
        $.setdata("{}", "pkc_mt_headers_sx");
        if (mt_headers_sx) $.setdata(mt_headers_sx, "mt_headers_sx");
        if (pkc_mt_method_sx) $.setdata(pkc_mt_method_sx, "pkc_mt_method_sx");
        if (pkc_mt_url_sx) $.setdata(pkc_mt_url_sx, "pkc_mt_url_sx");
        if (pkc_mt_body_sx) $.setdata(pkc_mt_body_sx, "pkc_mt_body_sx");
        $.log(
            `[${$.name}] 获取美团抢券请求体SX✅: 成功,pkc_mt_url_sx: ${pkc_mt_url_sx}`
        );
        $.msg($.name, `获取美团刷新Url: 成功🎉`, `pkc_mt_url_sx：${pkc_mt_url_sx}`);
        $done();
    }

}
console.log(
    `================== 脚本执行 - 北京时间(UTC+8)：${new Date(
        new Date().getTime() +
        new Date().getTimezoneOffset() * 60 * 1000 +
        8 * 60 * 60 * 1000
    ).toLocaleString()} =====================\n`
);
// console.log(
//     `============ 共 ${Length} 个${$.name}账号=============\n`
// );


let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
    GetCookie()
    $.done();
} else {

    !(async () => {
//        await signget();
//         await geteventID() // 获取最新抽奖id
        await all();
        await msgShow();



    })()
        .catch((e) => {
            $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
        })
        .finally(() => {
            $.done();
        })
}


async function all() {
    if (!pkc_mt_url) {
        $.msg(
            $.name,
            '提示：⚠️请先开启修改时间重写-再开启本重写-获取抢券的请求体\n'
        );
        return;
    }
    if(pkc_select === 1){
        for (let i = 0; i < pkc_qjnum; i++) {
            pkc_flag = false;
            await pkc_mtqj_rights_sx()
            await pkc_mtqj() //
            if (pkc_flag){
                break;
            }
        }
    }else{
        $.msg($.name, `美团抢券-当前请求pkc_mt_url`, `${pkc_mt_url}`);
        $.msg($.name, `美团抢券-当前请求mt_Cookie`, `${mt_Cookie}`);
        $.msg($.name, `美团抢券-当前请求pkc_mt_body`, `${pkc_mt_body}`);
    }

}
async function pkc_mtqj_rights_sx(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = {
                url: pkc_mt_url_sx,
                headers: JSON.parse(mt_headers_sx),
                body: ``,
            };

            // console.log(JSON.stringify(url));
            $.get(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`开始抢券刷新ID(rights)🚩: ${data}`);
                    $.signget = JSON.parse(data);
                    console.log(JSON.stringify($.signget));
//
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}


//美团抢券-夏天来了
async function pkc_mtqj(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = {
                url: pkc_mt_url,
                headers: JSON.parse(mt_headers),
                body: pkc_mt_body,
            };
//             console.log(JSON.stringify(url));
            $.post(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`开始抢券🚩: ${data}`);
                    $.signget = JSON.parse(data);
                    // console.log(JSON.stringify($.signget));
                    if ($.signget.code === 0 && $.signget.subCode === 0){
//                         console.log(`[${new Date().toISOString().replace('T', ' ').replace('Z', '')}]【成功抢券】：${data}\n`);
                        console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【成功抢券】：${$.signget.msg}\n`);
                        $.message += `【成功抢券】：${$.signget.msg}\n`;
                        pkc_flag = true;
                    }else if ($.signget.code === 1 && $.signget.subCode ===  9017){
                        console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【继续尝试】：${$.signget.msg}\n`);
                        $.message += `【来晚了】：${$.signget.msg}\n`;
                       pkc_flag = true;
                    }
                    else if ($.signget.code === 1){
                        console.log(`【继续尝试】：${JSON.stringify($.signget)}\n`);
                    }else{
                        console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【抢券失败】：${$.signget.msg}\n`);
                        $.message += `【抢券失败】：${$.signget.msg}\n`;
                        pkc_flag = true;
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

function msgShow() {
    return new Promise(async resolve => {
        if (notifyInterval != 1) {
            console.log($.name + '\n' + $.message);
        }
        if (notifyInterval == 1) {
            $.msg($.name, ``, $.message);
        }


        if (notifyttt == 1 && $.isNode()){
            await notify.sendNotify($.name, $.message);
        }

        resolve()
    })
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
