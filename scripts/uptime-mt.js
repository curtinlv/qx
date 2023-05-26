/*
通过重写更改美团时间 by PKC

[mitm]
promotion.waimai.meituan.com

[rewrite_remote]
promotion.waimai.meituan.com/lottery/limitcouponcomponent/(getTime|info) url script-response-body https://raw.githubusercontent.com/curtinlv/qx/main/scripts/uptime-mt.js
*/

// 这里修改来抢的时间，再开启本重写。
const timeStr = '18:00:00';

const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');
const dateStr = `${year}-${month}-${day} ${timeStr}`;

// const dateStr = '2023-01-22 12:58:38';
const timestamp = new Date(dateStr).getTime();



var url = $request.url;
const path1 = "promotion.waimai.meituan.com/lottery/limitcouponcomponent/getTime";

if (url.indexOf(path1) != -1) {

    $notify("美团更改时间", dateStr, "成功抓取请求体后，记得关闭重写 或 更新下一次的抢券时间");
    console.log("美团更改时间", dateStr, "");
    if(typeof $response !== "undefined"){
        let obj = {
            "code" : 0,
            "subcode" : 0,
            "data" : timestamp,
            "msg" : "success"
        }

        var body = JSON.stringify(obj);
        console.log(`${JSON.stringify(obj, null, '\t')}`);
        $done({body});
    }
}

const path2 = "promotion.waimai.meituan.com/lottery/limitcouponcomponent/info";

if ($request.url.indexOf(path2) != -1) {

    if(typeof $response !== "undefined"){
        const params = new URLSearchParams(url.split('?')[1]);
        let couponReferIds = params.get('couponReferIds');
        console.log(`couponReferIds=${couponReferIds}`);
        $notify("强制触发抢券按钮", "couponReferIds", couponReferIds);
        let obj2 = JSON.parse($response.body);
        if(obj2.data.couponInfo[couponReferIds]){
            obj2.data.couponInfo[couponReferIds].status=0;
        }
        var body = JSON.stringify(obj2);
        console.log(`${JSON.stringify(obj2, null, '\t')}`);
        $done({body});
    }
}

