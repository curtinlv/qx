/*
美团抢券
功能：qx自动重写抓取请求体 ，重放请求（定时任务），默认重放50次，第23行自行修改。

Author: Curtin
date 2023.5.25

V2P/圈叉：
########################### 开始
[rewrite_remote]
# 只需要添加这个远程重写即可（以前的可以删掉）。uptime-mt.js文件保存到qx目录文件scripts下面，抓包时候就改下时间。
https://raw.githubusercontent.com/curtinlv/qx/main/rewrite/pkc.conf, tag=pkc-美团, update-interval=172800, opt-parser=false, inserted-resource=true, enabled=true

[task_local]
# 定时抢券，根据活动时间调整，一般改整点即可，如15点抢的，就改14点
58 59 14 * * * https://raw.githubusercontent.com/curtinlv/qx/main/scripts/pkc-mt0807.js, tag=美团抢卷, enabled=true
########################### 结束
*/
const $ = Env("美团抢卷");
let couponReferIds = '';  // 如果qx重写已抓取会优先使用重写的，这里可以不填
let gdPageId = '513694'; // 如果qx重写已抓取会优先使用重写的，这里可以不填

const pkc_qjnum = 50;  // 重放50次
const timeoutMs = 6;  // 最多执行5秒即停止重放
const timeoutMs2 = 1;  // 整点后，大于N秒即停止重放,如3秒
const sleepNum = 100;  // 休眠时间，单位毫秒
// 如果想查看当前是否已经抓取Body ， 把下面改2;
pkc_select = 1; // 1:抢券 2：仅打印当前环境变量 body header url参数

// $.idx = ($.idx = ($.getval('HuaHuiSuffix') || '1') - 1) > 0 ? ($.idx + 1 + '') : ''; // 账号扩展字符
const notify = $.isNode() ? require("./sendNotify") : ``;
const logs = 0; // 0为关闭日志，1为开启
const notifyInterval = 1; // 0为关闭通知，1为所有通知，
const notifyttt = 1 // 0为关闭外部推送，1为所有通知
$.message = '', COOKIES_SPLIT = '';
let isXtll = false;

let mtgsig  = ``;
let mtFingerprint = ``;
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


if ($.isNode() && process.env.mtgsig) {
    mtgsig = process.env.mtgsig
}
else{
    mtgsig = $.getval('mtgsig')
}
if ($.isNode() && process.env.mtFingerprint) {
    mtFingerprint = process.env.mtFingerprint
}
else{
    mtFingerprint = $.getval('mtFingerprint')
}

if ($.isNode() && process.env.mt_Cookie) {
    mt_Cookie = process.env.mt_Cookie
}
else{
    mt_Cookie = $.getval('mt_Cookie')
}

if ($.isNode() && process.env.couponReferIds) {
    couponReferIds = process.env.couponReferIds
}
else{
    couponReferIds = $.getval('couponReferIds')
}
if ($.isNode() && process.env.gdPageId) {
    gdPageId = process.env.gdPageId
}
else{
    gdPageId = $.getval('gdPageId')
}
if (pkc_mt_url && pkc_mt_url.indexOf("rights-apigw.meituan.com") >= 0) {
    // console.log("夏天来了")
    isXtll = true;
}

function GetCookie() {
    if ($request && ($request.url.indexOf("promotion.waimai.meituan.com/lottery/limitcouponcomponent/fetchcoupon") >= 0 || $request.url.indexOf("promotion.waimai.meituan.com/lottery/rights/limitcouponcomponent/fetchcoupon") >= 0)) {
         mt_headers = JSON.stringify($request.headers);

        mtgsig = $request.headers.mtgsig;
        mt_Cookie = $request.headers.Cookie;
        pkc_mt_body = $request.body;
        mt_body = JSON.parse($request.body);
        mtFingerprint = mt_body.mtFingerprint;

        pkc_mt_method = $request.method;
        pkc_mt_url = $request.url;
        if (mt_headers) $.setdata(mt_headers, "mt_headers");
        if (mt_Cookie) $.setdata(mt_headers, "mt_Cookie");
        if (pkc_mt_url) $.setdata(pkc_mt_url, "pkc_mt_url");
        if (pkc_mt_body) $.setdata(pkc_mt_body, "pkc_mt_body");
        if (mtgsig) $.setdata(mtgsig, "mtgsig");
        if (mtFingerprint) $.setdata(mtFingerprint, "mtFingerprint");
        $.log(
            `[${$.name}] 获取美团抢券请求体✅: 成功,pkc_mt_url: ${pkc_mt_url}`
        );
        let userId = getUserId(mt_Cookie);
        $.msg($.name, `获取美团mt_Cookieg: 成功🎉`, `用户ID：${userId}`);
        $done();
    }
    if ($request && $request.url.indexOf("rights-apigw.meituan.com/api/rights/activity/secKill/grab") >= 0) {
         mt_headers = JSON.stringify($request.headers);
         mt_Cookie = $request.headers.Cookie;
        pkc_mt_body = $request.body;
        pkc_mt_method = $request.method;
        pkc_mt_url = $request.url;
        // $.setdata("{}", "pkc_mt_headers");
        if (mt_headers) $.setdata(mt_headers, "mt_headers");
        if (mt_Cookie) $.setdata(mt_headers, "mt_Cookie");
        if (pkc_mt_url) $.setdata(pkc_mt_url, "pkc_mt_url");
        if (pkc_mt_body) $.setdata(pkc_mt_body, "pkc_mt_body");
        let userId = getUserId(mt_Cookie);
        $.msg($.name, `获取美团mt_Cookieg: 成功🎉`, `用户ID：${userId}`);
        $done();
    }

    if ($request && ($request.url.indexOf("rights-apigw.meituan.com/api/rights/activity/secKill/info") >= 0 || $request.url.indexOf("promotion.waimai.meituan.com/lottery/limitcouponcomponent/info") >= 0 || $request.url.indexOf("promotion.waimai.meituan.com/lottery/rights/limitcouponcomponent/info") >= 0)) {
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

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
    GetCookie()
    $.done();
} else {

    !(async () => {
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

function pkcSleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        // if (isXtll){
        // }
        await pkc_mtqj_rights_sx()
        // else{
        //     await pkc_mtqj_sx() //
        // }
        const startTime = Date.now();
        if (pkc_qjnum > 1){
            let sss = 0;
            while (true){
                sss++;
                if (await isMinuteZero()){
                    break;
                }else{
                    await pkcSleep(10);
                    if (sss === 1){
                       console.log(`未到时间，等待...`);
                    }
                }
                if (Date.now() - startTime > (timeoutMs * 1000)){
                    break;
                }
            }
        }

        for (let i = 0; i < pkc_qjnum; i++) {
            pkc_flag = false;
            if (isXtll){
                pkc_mtqj_xtll() //
                await pkcSleep(sleepNum);
            }else{
                pkc_mtqj() //
                await pkcSleep(sleepNum);
            }
            if (pkc_flag || isOutTime(0, timeoutMs2) || isOutTime(30, timeoutMs2)){
                break;
            }
            if (Date.now() - startTime > (timeoutMs * 1000)){
                break;
            }
        }
    }else{
        // $.msg($.name, `美团抢券-当前请求mtgsig`, `${mtgsig}`);
        // $.msg($.name, `美团抢券-当前请求mtFingerprint`, `${mtFingerprint}`);
        // $.msg($.name, `美团抢券-当前请求couponReferIds`, `${couponReferIds}`);
        // $.msg($.name, `美团抢券-当前请求pkc_mt_url`, `${pkc_mt_url}`);
        // $.msg($.name, `美团抢券-当前请求mt_Cookie`, `${mt_Cookie}`);
        // $.msg($.name, `美团抢券-当前请求pkc_mt_body`, `${pkc_mt_body}`);
        $.log(`美团抢券-当前mt_headers=${mt_headers}`);
        $.log(`美团抢券-当前请求pkc_mt_url=${pkc_mt_url}`);
        $.log(`美团抢券-当前请求pkc_mt_body=${pkc_mt_body}`);

        $.log(`美团抢券-当前mt_headers_sx=${mt_headers_sx}`);
        $.log(`美团抢券-当前pkc_mt_url_sx=${pkc_mt_url_sx}`);
        $.log(`美团抢券-当前pkc_mt_body_sx=${pkc_mt_body_sx}`);

    }

}

function getUserId(cookieString) {
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

//美团抢券sx
// async function pkc_mtqj_sx(timeout = 0) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             let url = {
//                 url: `https://promotion.waimai.meituan.com/lottery/limitcouponcomponent/info?couponReferIds=${couponReferIds}`,
//                 headers: {
//                     'Host': 'promotion.waimai.meituan.com',
//                     'Origin': 'https://market.waimai.meituan.com',
//                     'Connection': 'keep-alive',
//                     'Accept': 'application/json, text/plain, */*',
//                     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.32(0x18002038) NetType/4G Language/zh_CN',
//                     'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
//                     'Referer': 'https://market.waimai.meituan.com/',
//                     'Cookie': mt_Cookie,
//                 },
//                 body: ``,
//             };
//
//             // console.log(JSON.stringify(url));
//             $.get(url, async (err, resp, data) => {
//                 try {
//                     if (logs) $.log(`开始抢券刷新ID🚩: ${data}`);
//                     $.signget = JSON.parse(data);
//                     // console.log(JSON.stringify($.signget));
//                     if ($.signget.code === 0 && $.signget.subcode === 0){
//                          console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【刷新】：${$.signget.msg}\n`);
//                     }else{
//                         console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【刷新】：失败\n`);
//                     }
// //
//                 } catch (e) {
//                     $.logErr(e, resp);
//                 } finally {
//                     resolve()
//                 }
//             })
//         }, timeout)
//     })
// }

//美团抢券sx rights
async function pkc_mtqj_rights_sx(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = {
                url: pkc_mt_url_sx,
                headers: JSON.parse(mt_headers_sx)
            };

            // console.log(JSON.stringify(url));
            $.get(url, async (err, resp, data) => {
                try {
                    if (logs) $.log(`开始抢券刷新ID(rights)🚩: ${data}`);
                    $.signget = JSON.parse(data);
                    console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【刷新】：${$.signget.msg}\n`);
                    if ($.signget.msg.indexOf("未登录") >= 0){
                        $.done();
                    }
                    // console.log(JSON.stringify($.signget));
                    // if ($.signget.code === 0 && $.signget.subcode === 0){
                    // }else{
                    //     console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【刷新】：失败\n`);
                    // }
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

//美团抢券
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
                    if (data.indexOf("403 Forbidden") >= 0){
                        console.log(`403 暂停抢券`);
                        pkc_flag = true;
                    }else{
                        $.signget = JSON.parse(data);
                        // console.log(JSON.stringify($.signget));
                        if ($.signget.code === 0 && $.signget.subcode === 0){
//                         console.log(`[${new Date().toISOString().replace('T', ' ').replace('Z', '')}]【成功抢券】：${data}\n`);
                            console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【成功抢券】：${JSON.stringify($.signget)}\n`);
                            $.message += `【成功抢券】：${JSON.stringify($.signget)}\n`;
                            pkc_flag = true;
                        }
                        else if ($.signget.code === 1 && $.signget.subcode === 2){
                            console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【继续尝试】：${JSON.stringify($.signget)}\n`);
                            // $.message += `【继续尝试】：${JSON.stringify($.signget)}\n`;
                            // pkc_flag = true;
                        }
//                     else if (($.signget.code === 1) && ($.signget.subcode === 1 || $.signget.subcode === 11)){
//                         console.log(`【抢券失败】：${data}\n`);
//                         $.message += `【抢券失败】：${data}\n`;
//                         pkc_flag = true;
//                     }
                        else if ($.signget.code === 1 && $.signget.subcode === 3){
                            console.log(`【继续尝试】：${JSON.stringify($.signget)}\n`);
//                         $.message += `【继续尝试】：${data}\n`;
                        }else{
                            console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【抢券失败】：${JSON.stringify($.signget)}\n`);
                            $.message += `【抢券失败】：${JSON.stringify($.signget)}\n`;
                            // pkc_flag = true;
                        }
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


//美团抢券-夏天来了
async function pkc_mtqj_xtll(timeout = 0) {
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
                    if (data.indexOf("403 Forbidden") >= 0){
                        console.log(`403 暂停抢券`);
                        pkc_flag = true;
                    }else{
                        $.signget = JSON.parse(data);
                        if ($.signget['data']['coupon']['status'] === 3 && $.signget['data']['coupon']['toastMsg'] && $.signget['data']['coupon']['toastMsg'].indexOf("成功") >= 0){
                            console.log(`[${new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }).replace(',', '').replace(/\//g, '-')}]【成功抢券】：${$.signget['data']['coupon']['toastMsg']}\n`);
                            $.message += `【成功抢券】：${$.signget['data']['coupon']['toastMsg']}\n`;
                            pkc_flag = true;
                        }else if ($.signget['data']['coupon']['toastMsg'].indexOf("抢完了") >= 0){
                            $.message += `【抢券失败】：${$.signget['data']['coupon']['toastMsg']}\n`;
                            pkc_flag = true;
                        }else if ($.signget['data']['subCode'] === 9020){
                            $.message += `【抢券失败】：${$.signget['data']['coupon']['toastMsg']}\n`;
                            pkc_flag = true;
                        }else{
                            console.log(`【继续尝试】：${$.signget['data']['coupon']['toastMsg']}\n`);
                            // $.message += `【继续尝试】：${$.signget['data']['coupon']['toastMsg']}\n`;
                        }
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
        if (notifyInterval == 1 && pkc_select === 1) {
            if ($.message.indexOf("成功抢券") >= 0){
                // $.msg($.name, ``, $.message);
                $.msg($.name, `拿下`, ``);
            }else{
                $.msg($.name, `没拿下`, ``);
            }
        }


        if (notifyttt == 1 && $.isNode()){
            await notify.sendNotify($.name, $.message);
        }

        resolve()
    })
}
// 判断是否为分钟是否为0
async function isMinuteZero() {
    const now = new Date();
    const minutes = now.getMinutes();
    return minutes % 30 === 0;
}
function isOutTime(m, s) {
    const now = new Date();
    const minutes = now.getMinutes(); // 获取当前分钟（0-59）
    const seconds = now.getSeconds(); // 获取当前秒数（0-59）
    // 判断是否为整点（分钟为0）
    if (minutes === m) {
        // 如果是整点，再判断秒数是否大于3
        return seconds > s;
    }
    // 如果不是整点，直接返回 false
    return false;
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
