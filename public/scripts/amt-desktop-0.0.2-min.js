var CreateAmtRemoteDesktop=function(e,t){var S={};function g(e){return String.fromCharCode.apply(null,e)}function p(e,t,a,n,r,o,i){var s,c,h,d,l=e[t++],v={},u=0,m=0;if(0==l){if(2==S.bpp)for(d=0;d<i;d++)y(e[t++]+(e[t++]<<8),d);else for(d=0;d<i;d++)C(e[t++],d);w(S.spare,a,n)}else if(1==l){S.graymode?(c=e[t++],S.lowcolor&&(c<<=4),S.canvas.fillStyle="rgb("+c+","+c+","+c+")"):(c=e[t++]+(2==S.bpp?e[t++]<<8:0),S.canvas.fillStyle="rgb("+(1==S.bpp?(224&c)+","+((28&c)<<3)+","+T((3&c)<<6):(c>>8&248)+","+(c>>3&252)+","+((31&c)<<3))+")");var f=k(a);n=x(0,n),S.canvas.fillRect(a=f,n,r,o)}else if(1<l&&l<17){var g=4,p=15;if(2==S.bpp){for(d=0;d<l;d++)v[d]=e[t++]+(e[t++]<<8);for(2==l?p=g=1:l<=4&&(g=2,p=3);u<i&&t<e.byteLength;)for(c=e[t++],d=8-g;0<=d;d-=g)y(v[c>>d&p],u++)}else{for(d=0;d<l;d++)v[d]=e[t++];for(2==l?p=g=1:l<=4&&(g=2,p=3);u<i&&t<e.byteLength;)for(c=e[t++],d=8-g;0<=d;d-=g)C(v[c>>d&p],u++)}w(S.spare,a,n)}else if(128==l){if(2==S.bpp)for(;u<i&&t<e.byteLength;){for(c=e[t++]+(e[t++]<<8),m=1;m+=h=e[t++],255==h;);if(0==S.rotation)D(c,u,m),u+=m;else for(;0<=--m;)y(c,u++)}else for(;u<i&&t<e.byteLength;){for(c=e[t++],m=1;m+=h=e[t++],255==h;);if(0==S.rotation)b(c,u,m),u+=m;else for(;0<=--m;)C(c,u++)}w(S.spare,a,n)}else if(129<l){if(2==S.bpp)for(d=0;d<l-128;d++)v[d]=e[t++]+(e[t++]<<8);else for(d=0;d<l-128;d++)v[d]=e[t++];for(;u<i&&t<e.byteLength;){if(m=1,c=v[(s=e[t++])%128],127<s)for(;m+=h=e[t++],255==h;);if(0==S.rotation)(2==S.bpp?D:b)(c,u,m),u+=m;else if(2==S.bpp)for(;0<=--m;)y(c,u++);else for(;0<=--m;)C(c,u++)}w(S.spare,a,n)}}function w(e,t,a){var n,r,o;1!=S.holding&&(n=t,r=a,n=0==S.rotation?n:1==S.rotation?S.canvas.canvas.width-S.sparew2-r:2==S.rotation?S.canvas.canvas.width-S.sparew2-n:3==S.rotation?r:0,r=t,o=a,a=0==S.rotation?o:1==S.rotation?r:2==S.rotation?S.canvas.canvas.height-S.spareh2-o:3==S.rotation?S.canvas.canvas.height-S.spareh-r:0,S.canvas.putImageData(e,t=n,a))}function C(e,t){var a,n,r=t<<2;0<S.rotation&&(1==S.rotation?(a=t%S.sparew,n=Math.floor(t/S.sparew),r=(t=a*S.sparew2+(S.sparew2-1-n))<<2):2==S.rotation?r=S.sparew*S.spareh*4-4-r:3==S.rotation&&(a=t%S.sparew,n=Math.floor(t/S.sparew),r=(t=(S.sparew2-1-a)*S.sparew2+n)<<2)),S.graymode?(S.lowcolor&&(e<<=4),S.spare.data[r]=S.spare.data[r+1]=S.spare.data[r+2]=e):(S.spare.data[r]=224&e,S.spare.data[r+1]=(28&e)<<3,S.spare.data[r+2]=T((3&e)<<6))}function y(e,t){var a,n,r=t<<2;0<S.rotation&&(1==S.rotation?(a=t%S.sparew,n=Math.floor(t/S.sparew),r=(t=a*S.sparew2+(S.sparew2-1-n))<<2):2==S.rotation?r=S.sparew*S.spareh*4-4-r:3==S.rotation&&(a=t%S.sparew,n=Math.floor(t/S.sparew),r=(t=(S.sparew2-1-a)*S.sparew2+n)<<2)),S.spare.data[r]=e>>8&248,S.spare.data[r+1]=e>>3&252,S.spare.data[r+2]=(31&e)<<3}function b(e,t,a){if(S.graymode){var n=t<<2;for(S.lowcolor&&(e<<=4);0<=--a;)S.spare.data[n]=S.spare.data[n+1]=S.spare.data[n+2]=e,n+=4}else for(var n=t<<2,r=224&e,o=(28&e)<<3,i=T((3&e)<<6);0<=--a;)S.spare.data[n]=r,S.spare.data[n+1]=o,S.spare.data[n+2]=i,n+=4}function D(e,t,a){for(var n=t<<2,r=e>>8&248,o=e>>3&252,i=(31&e)<<3;0<=--a;)S.spare.data[n]=r,S.spare.data[n+1]=o,S.spare.data[n+2]=i,n+=4}function k(e){return 0==S.rotation||1==S.rotation?e:2==S.rotation?e-S.canvas.canvas.width:3==S.rotation?e-S.canvas.canvas.height:0}function x(e,t){return 0==S.rotation?t:1==S.rotation?t-S.canvas.canvas.width:2==S.rotation?t-S.canvas.canvas.height:3==S.rotation?t:0}function T(e){return 127<e?e+32:e}function K(){var e;1!=S.holding&&(0<S.focusmode?(e=2*S.focusmode,S.send(String.fromCharCode(3,1)+ShortToStr(Math.max(Math.min(S.ox,S.mx)-S.focusmode,0))+ShortToStr(Math.max(Math.min(S.oy,S.my)-S.focusmode,0))+ShortToStr(e+Math.abs(S.ox-S.mx))+ShortToStr(e+Math.abs(S.oy-S.my))),S.ox=S.mx,S.oy=S.my):S.send(String.fromCharCode(3,1,0,0,0,0)+ShortToStr(S.rwidth)+ShortToStr(S.rheight)))}S.canvasid=e,S.CanvasId=Q(e),S.scrolldiv=t,S.canvas=Q(e).getContext("2d"),S.protocol=2,S.state=0,S.acc=null,S.ScreenWidth=960,S.ScreenHeight=700,S.width=0,S.height=0,S.rwidth=0,S.rheight=0,S.bpp=2,S.useRLE=!0,S.showmouse=!0,S.buttonmask=0,S.localKeyMap=!0,S.spare=null,S.sparew=0,S.spareh=0,S.sparew2=0,S.spareh2=0,S.sparecache={},S.onScreenSizeChange=null,S.frameRateDelay=0,S.noMouseRotate=!1,S.rotation=0,S.kvmDataSupported=!1,S.onKvmData=null,S.onKvmDataPending=[],S.onKvmDataAck=-1,S.holding=!1,S.lastKeepAlive=Date.now(),S.kvmExt={},S.kvmExtChanged=null,S.useZLib=!1,S.decimationMode=0,S.graymode=!1,S.lowcolor=!1,S.mNagleTimer=null,S.mx=0,S.my=0,S.ox=-1,S.oy=-1,S.focusmode=0,S.inflate=ZLIB.inflateInit(-15),S.xxStateChange=function(e){0==e?(S.canvas.fillStyle="#000000",S.canvas.fillRect(0,0,S.width,S.height),S.canvas.canvas.width=S.rwidth=S.width=640,S.canvas.canvas.height=S.rheight=S.height=400,QS(S.canvasid).cursor="default"):QS(S.canvasid).cursor=S.showmouse?"default":"none"},S.ProcessBinaryData=function(e){var t;for(null!=S.recordedData&&!0!==S.recordedHolding&&S.recordedData.push(I(2,1,String.fromCharCode.apply(null,new Uint8Array(e)))),null==S.acc?S.acc=new Uint8Array(e):((t=new Uint8Array(S.acc.byteLength+e.byteLength)).set(S.acc,0),t.set(new Uint8Array(e),S.acc.byteLength),S.acc=t);null!=S.acc&&0<S.acc.byteLength;){var a=0,n=new DataView(S.acc.buffer);if(0==S.state&&12<=S.acc.byteLength)a=12,S.state=1,S.parent&&delete S.parent.connectTime,S.send("RFB 003.008\n");else if(1==S.state&&1<=S.acc.byteLength)a=S.acc[0]+1,S.send(String.fromCharCode(1)),S.state=2;else if(2==S.state&&4<=S.acc.byteLength){if(a=4,0!=n.getUint32(0))return S.Stop();S.send(String.fromCharCode(1)),S.state=3,S.parent&&(S.parent.disconnectCode=5e4)}else if(3==S.state&&24<=S.acc.byteLength){S.rotation=0;var r=n.getUint32(20);if(S.acc.byteLength<24+r)return;a=24+r,S.canvas.canvas.width=S.rwidth=S.width=S.ScreenWidth=n.getUint16(0),S.canvas.canvas.height=S.rheight=S.height=S.ScreenHeight=n.getUint16(2),S.DeskRecordServerInit=String.fromCharCode.apply(null,new Uint8Array(S.acc.buffer.slice(0,24+r)));r="";S.useRLE&&(r+=IntToStr(16)),r=(r+=IntToStr(0))+IntToStr(1092),S.send(String.fromCharCode(2,0)+ShortToStr(r.length/4+1)+r+IntToStr(-223)),0==S.graymode?1==S.bpp&&S.send(String.fromCharCode(0,0,0,0,8,8,0,1)+ShortToStr(7)+ShortToStr(7)+ShortToStr(3)+String.fromCharCode(5,2,0,0,0,0)):(2==S.bpp&&(S.bpp=1),0==S.lowcolor?S.send(String.fromCharCode(0,0,0,0,8,8,0,1)+ShortToStr(255)+ShortToStr(0)+ShortToStr(0)+String.fromCharCode(0,0,0,0,0,0)):S.send(String.fromCharCode(0,0,0,0,8,4,0,1)+ShortToStr(15)+ShortToStr(0)+ShortToStr(0)+String.fromCharCode(0,0,0,0,0,0))),S.state=4,S.parent&&(S.parent.connectTime=Date.now(),S.parent.disconnectCode=0,S.parent.xxStateChange(3)),S.ox=-1,null!=S.kvmExtChanged&&(0<S.decimationMode&&S.sendKvmExtCmd(2,S.decimationMode),S.sendKvmExtCmd(4,!0===S.useZLib?1:0)),K(),null!=S.onScreenSizeChange&&S.onScreenSizeChange(S,S.ScreenWidth,S.ScreenHeight),S.parent&&(S.parent.disconnectCode=50001,9216e3<S.bpp*S.width*S.height)&&(S.parent.disconnectCode=50002)}else if(4==S.state)switch(S.acc[0]){case 0:if(S.acc.byteLength<4)return;S.state=100+n.getUint16(2),a=4,!0===S.recordedHolding&&(delete S.recordedHolding,S.recordedData.push(I(2,1,String.fromCharCode.apply(null,S.acc))));break;case 2:a=1;break;case 3:if(S.acc.byteLength<8)return;var o=n.getUint32(4)+8;if(S.acc.byteLength<o)return;a=function(e,t){if(e.byteLength<8)return 0;t=t.getUint32(4)+8;if(e.byteLength<t)return 0;if(null!=S.onKvmData){e=g(new Uint8Array(e.buffer.slice(8,t)));if(16<=e.length&&"\0KvmDataChannel"==e.substring(0,15)){0==S.kvmDataSupported&&(S.kvmDataSupported=!0),(-1==S.onKvmDataAck&&16==e.length||0!=e.charCodeAt(15))&&(S.onKvmDataAck=!0);try{urlvars&&urlvars.kvmdatatrace&&console.log("KVM-DataChannel-Recv("+(e.length-16)+"): "+e.substring(16))}catch(e){}16<=e.length&&S.onKvmData(e.substring(16)),1==S.onKvmDataAck&&0<S.onKvmDataPending.length&&S.sendKvmData(S.onKvmDataPending.shift())}else if(13<=e.length&&"\0KvmExtCmd\0"==e.substring(0,11)){var a=e.charCodeAt(11),n=e.charCodeAt(12);1==a&&(S.kvmExt.decimationMode=n,13<e.length&&(S.kvmExt.decimationState=e.charCodeAt(13)),null!=S.kvmExtChanged)&&S.kvmExtChanged(1,S.kvmExt,S.kvmExt),2==a&&S.sendKvmExtCmd(1),3==a&&(S.kvmExt.compression=n,null!=S.kvmExtChanged)&&S.kvmExtChanged(3,S.kvmExt),4==a&&S.sendKvmExtCmd(3)}else{console.log("Got KVM clipboard data:",e);try{urlvars&&urlvars.kvmdatatrace&&console.log("KVM-ClipBoard-Recv("+e.length+"): "+rstr2hex(e)+", "+e)}catch(e){}}}return t}(S.acc,n)}else if(100<S.state&&12<=S.acc.byteLength){var r=n.getUint16(0),i=n.getUint16(2),s=n.getUint16(4),c=n.getUint16(6),h=s*c,d=n.getUint32(8);if(d<17){if(s<1||64<s||c<1||64<c)return console.log("Invalid tile size ("+s+","+c+"), disconnecting."),S.Stop();if(S.sparew!=s||S.spareh!=c){S.sparew=S.sparew2=s,S.spareh=S.spareh2=c,1!=S.rotation&&3!=S.rotation||(S.sparew2=c,S.spareh2=s);var l=S.sparew2+"x"+S.spareh2;if(S.spare=S.sparecache[l],!S.spare){S.sparecache[l]=S.spare=S.canvas.createImageData(S.sparew2,S.spareh2);for(var v=S.sparew2*S.spareh2<<2,u=3;u<v;u+=4)S.spare.data[u]=255}}}if(4294967073==d)S.canvas.canvas.width=S.rwidth=S.width=s,S.canvas.canvas.height=S.rheight=S.height=c,S.send(String.fromCharCode(3,0,0,0,0,0)+ShortToStr(S.width)+ShortToStr(S.height)),a=12,null!=S.onScreenSizeChange&&S.onScreenSizeChange(S,S.ScreenWidth,S.ScreenHeight),S.parent&&9216e3<S.bpp*S.width*S.height&&(S.parent.disconnectCode=50002);else if(0==d){var m=12,l=12+h*S.bpp;if(S.acc.byteLength<l)return;if(a=l,2==S.bpp)for(u=0;u<h;u++)y(n.getUint16(m,!0),u),m+=2;else for(u=0;u<h;u++)C(S.acc[m++],u);w(S.spare,r,i)}else{if(16!=d)return S.Stop();if(S.acc.byteLength<16)return;d=n.getUint32(12);if(S.acc.byteLength<16+d)return;var f,m=16;5<d&&0==S.acc[m]&&n.getUint16(m+1,!0)==d-5?p(S.acc,m+5,r,i,s,c,h):0<(f=S.inflate.inflate(g(new Uint8Array(S.acc.buffer.slice(m,+(m+d)))))).length?p(function(e){for(var t=new Uint8Array(e.length),a=0,n=e.length;a<n;++a)t[a]=e.charCodeAt(a);return t}(f),0,r,i,s,c,h):console.log("Invalid deflate data"),a=16+d}100==--S.state&&(S.state=4,0==S.frameRateDelay?K():setTimeout(K,S.frameRateDelay))}if(0==a)return;a!=S.acc.byteLength?S.acc=new Uint8Array(S.acc.buffer.slice(a)):S.acc=null}},S.hold=function(e){S.holding!=e&&(S.holding=e,S.canvas.fillStyle="#000000",S.canvas.fillRect(0,0,S.width,S.height),0==S.holding?(S.canvas.canvas.width==S.width&&S.canvas.canvas.height==S.height||(S.canvas.canvas.width=S.width,S.canvas.canvas.height=S.height,null!=S.onScreenSizeChange&&S.onScreenSizeChange(S,S.ScreenWidth,S.ScreenHeight)),S.send(String.fromCharCode(3,0,0,0,0,0)+ShortToStr(S.width)+ShortToStr(S.height))):(S.UnGrabMouseInput(),S.UnGrabKeyInput()))},S.tcanvas=null,S.setRotation=function(e){for(;e<0;)e+=4;var t,a,n,r=e%4;if(1!=S.holding)return r!=S.rotation&&(t=S.canvas.canvas.width,a=S.canvas.canvas.height,1!=S.rotation&&3!=S.rotation||(t=S.canvas.canvas.height,a=S.canvas.canvas.width),null==S.tcanvas&&(S.tcanvas=document.createElement("canvas")),(n=S.tcanvas.getContext("2d")).setTransform(1,0,0,1,0,0),n.canvas.width=t,n.canvas.height=a,n.rotate(-90*S.rotation*Math.PI/180),0==S.rotation&&n.drawImage(S.canvas.canvas,0,0),1==S.rotation&&n.drawImage(S.canvas.canvas,-S.canvas.canvas.width,0),2==S.rotation&&n.drawImage(S.canvas.canvas,-S.canvas.canvas.width,-S.canvas.canvas.height),3==S.rotation&&n.drawImage(S.canvas.canvas,0,-S.canvas.canvas.height),0!=S.rotation&&2!=S.rotation||(S.canvas.canvas.height=t,S.canvas.canvas.width=a),1!=S.rotation&&3!=S.rotation||(S.canvas.canvas.height=a,S.canvas.canvas.width=t),S.canvas.setTransform(1,0,0,1,0,0),S.canvas.rotate(90*r*Math.PI/180),S.rotation=r,S.canvas.drawImage(S.tcanvas,k(0),x(0,0)),S.width=S.canvas.canvas.width,S.height=S.canvas.canvas.height,null!=S.onScreenResize)&&S.onScreenResize(S,S.width,S.height,S.CanvasId),!0;S.rotation=r},S.Start=function(){for(var e in S.state=0,S.acc=null,S.inflate.inflateReset(),S.onKvmDataPending=[],S.onKvmDataAck=-1,S.kvmDataSupported=!1,S.kvmExt={},S.sparecache)delete S.sparecache[e]},S.Stop=function(){S.UnGrabMouseInput(),S.UnGrabKeyInput(),S.parent&&S.parent.Stop()},S.send=function(e){S.parent&&S.parent.send(e)};var r={Pause:19,CapsLock:20,Space:32,Quote:39,Minus:45,NumpadMultiply:42,NumpadAdd:43,PrintScreen:44,Comma:44,NumpadSubtract:45,NumpadDecimal:46,Period:46,Slash:47,NumpadDivide:47,Semicolon:59,Equal:61,OSLeft:91,BracketLeft:91,OSRight:91,Backslash:92,BracketRight:93,ContextMenu:93,Backquote:96,NumLock:144,ScrollLock:145,Backspace:65288,Tab:65289,Enter:65293,NumpadEnter:65293,Escape:65307,Delete:65535,Home:65360,PageUp:65365,PageDown:65366,ArrowLeft:65361,ArrowUp:65362,ArrowRight:65363,ArrowDown:65364,End:65367,Insert:65379,F1:65470,F2:65471,F3:65472,F4:65473,F5:65474,F6:65475,F7:65476,F8:65477,F9:65478,F10:65479,F11:65480,F12:65481,ShiftLeft:65505,ShiftRight:65506,ControlLeft:65507,ControlRight:65508,AltLeft:65513,AltRight:65514,MetaLeft:65511,MetaRight:65512};function a(e,t){var a,n;return(t=t||window.event).code&&0==S.localKeyMap?null!=(n=(n=t).code.startsWith("Key")&&4==n.code.length?n.code.charCodeAt(3)+(0==n.shiftKey?32:0):n.code.startsWith("Digit")&&6==n.code.length?n.code.charCodeAt(5):n.code.startsWith("Numpad")&&7==n.code.length?n.code.charCodeAt(6):r[n.code])&&S.sendkey(n,e):(a=222==(n=t.keyCode)?39:221==n?93:220==n?92:219==n?91:192==n?96:191==n?47:190==n?46:189==n?45:188==n?44:187==n?61:186==n?59:111==n?47:110==n?46:109==n?45:107==n?43:106==n?42:96<=n&&n<=105?n-48:46==n?65535:45==n?65379:40==n?65364:39==n?65363:38==n?65362:37==n?65361:36==n?65360:35==n?65367:34==n?65366:33==n?65365:27==n?65307:18==n?65513:17==n?65507:16==n?65505:13==n?65293:9==n?65289:8==n?65288:112<=n&&n<=124?n+65358:0==t.shiftKey&&65<=n&&n<=90?n+32:n,S.sendkey(a,e)),S.haltEvent(t)}S.sendkey=function(e,t){if("object"==typeof e){var a,n="";for(a in e)n+=String.fromCharCode(4,e[a][1],0,0)+IntToStr(e[a][0]);S.send(n)}else S.send(String.fromCharCode(4,t,0,0)+IntToStr(e))},S.sendKvmExtCmd=function(e,t){e="\0KvmExtCmd\0"+String.fromCharCode(e)+(null!=t?String.fromCharCode(t):"");S.send(String.fromCharCode(6,0,0,0)+IntToStr(e.length)+e)},S.sendKvmData=function(e){if(!0!==S.onKvmDataAck)S.onKvmDataPending.push(e);else{try{urlvars&&urlvars.kvmdatatrace&&console.log("KVM-DataChannel-Send("+e.length+"): "+e)}catch(e){}e="\0KvmDataChannel\0"+e,S.send(String.fromCharCode(6,0,0,0)+IntToStr(e.length)+e),S.onKvmDataAck=!1}},S.sendKeepAlive=function(){S.lastKeepAlive<Date.now()-5e3&&(S.lastKeepAlive=Date.now(),S.send(String.fromCharCode(6,0,0,0)+IntToStr(16)+"\0KvmDataChannel\0"))},S.sendClipboardData=function(e){try{urlvars&&urlvars.kvmdatatrace&&console.log("KVM-ClipBoard-Send("+e.length+"): "+rstr2hex(e)+", "+e)}catch(e){}S.send(String.fromCharCode(6,0,0,0)+IntToStr(e.length)+e)},S.SendCtrlAltDelMsg=function(){S.sendcad()};var n=!(S.sendcad=function(){S.sendkey([[65507,1],[65513,1],[65535,1],[65535,0],[65513,0],[65507,0]])}),o=!1;function I(e,t,a){var n=Date.now();return"number"==typeof a?(S.recordedSize+=a,ShortToStr(e)+ShortToStr(t)+IntToStr(a)+IntToStr(n>>32)+IntToStr(32&n)):(S.recordedSize+=a.length,ShortToStr(e)+ShortToStr(t)+IntToStr(a.length)+IntToStr(n>>32)+IntToStr(32&n)+a)}return S.GrabMouseInput=function(){var e;1!=n&&((e=S.canvas.canvas).onmouseup=S.mouseup,e.onmousedown=S.mousedown,e.onmousemove=S.mousemove,e.onwheel=S.mousewheel,n=!0)},S.UnGrabMouseInput=function(){var e;0!=n&&((e=S.canvas.canvas).onmousemove=null,e.onmouseup=null,e.onmousedown=null,e.onwheel=null,n=!1)},S.GrabKeyInput=function(){1!=o&&(document.onkeyup=S.handleKeyUp,document.onkeydown=S.handleKeyDown,document.onkeypress=S.handleKeys,o=!0)},S.UnGrabKeyInput=function(){0!=o&&(document.onkeyup=null,document.onkeypress=document.onkeydown=null,o=!1)},S.handleKeys=function(e){return S.haltEvent(e)},S.handleKeyUp=function(e){return a(0,e)},S.handleKeyDown=function(e){return a(1,e)},S.haltEvent=function(e){return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},S.mousedblclick=function(e){},S.mousewheel=function(e){var t,a=0;if("number"==typeof e.deltaY?a=-1*e.deltaY:"number"==typeof e.detail?a=-1*e.detail:"number"==typeof e.wheelDelta&&(a=e.wheelDelta),0!=a)return S.ReverseMouseWheel&&(a*=-1),t=S.buttonmask,S.buttonmask|=1<<(0<a?3:4),S.mousemove(e,1),S.buttonmask=t,S.mousemove(e,1)},S.mousedown=function(e){return S.buttonmask|=1<<e.button,S.mousemove(e,1)},S.mouseup=function(e){return S.buttonmask&=65535-(1<<e.button),S.mousemove(e,1)},S.mousemove=function(e,t){var a,n,r,o,i,s;return S.state<4||(r=S.canvas.canvas.height/Q(S.canvasid).offsetHeight,n=S.canvas.canvas.width/Q(S.canvasid).offsetWidth,a=S.getPositionOfControl(Q(S.canvasid)),S.mx=(event.pageX-a[0])*n,S.my=(event.pageY-a[1])*r,event.addx&&(S.mx+=event.addx),event.addy&&(S.my+=event.addy),1!=S.rotation&&3!=S.rotation||(S.mx=S.mx*S.rwidth/S.width,S.my=S.my*S.rheight/S.height),1!=S.noMouseRotate&&(n=S.mx,a=S.my,r=0==S.rotation?n:1==S.rotation?a:2==S.rotation?S.canvas.canvas.width-n:3==S.rotation?S.canvas.canvas.height-a:0,S.my=(n=S.mx,a=S.my,0==S.rotation?a:1==S.rotation?S.canvas.canvas.width-n:2==S.rotation?S.canvas.canvas.height-a:3==S.rotation?n:0),S.mx=r),1==t?(S.send(String.fromCharCode(5,S.buttonmask)+ShortToStr(S.mx)+ShortToStr(S.my)),null!=S.mNagleTimer&&(clearTimeout(S.mNagleTimer),S.mNagleTimer=null)):null==S.mNagleTimer&&(S.mNagleTimer=setTimeout(function(){S.send(String.fromCharCode(5,S.buttonmask)+ShortToStr(S.mx)+ShortToStr(S.my)),S.mNagleTimer=null},50)),QV("DeskFocus",S.focusmode),0!=S.focusmode&&(a=Math.min(S.mx,S.canvas.canvas.width-S.focusmode),n=Math.min(S.my,S.canvas.canvas.height-S.focusmode),r=2*S.focusmode,o=(t=Q(S.canvasid)).offsetHeight/S.canvas.canvas.height,t=t.offsetWidth/S.canvas.canvas.width,i=QS("DeskFocus"),s=S.getPositionOfControl(Q(S.canvasid).parentElement),i.left=Math.max((a-S.focusmode)*o,0)+(pos[0]-s[0])+"px",i.top=Math.max((n-S.focusmode)*t,0)+(pos[1]-s[1])+"px",i.width=r*o-6+"px",i.height=r*o-6+"px"),S.haltEvent(e))},S.getPositionOfControl=function(e){var t=Array(2);for(t[0]=t[1]=0;e;)t[0]+=e.offsetLeft,t[1]+=e.offsetTop,e=e.offsetParent;return t},S.StartRecording=function(){return(null==S.recordedData||null==S.DeskRecordServerInit)&&(S.recordedHolding=!0,S.recordedData=[],S.recordedStart=Date.now(),S.recordedSize=0,S.recordedData.push(I(1,0,JSON.stringify({magic:"MeshCentralRelaySession",ver:1,time:(new Date).toLocaleString(),protocol:200,bpp:S.bpp,graymode:S.graymode,lowcolor:S.lowcolor,screenSize:[S.width,S.height]}))),S.DeskRecordServerInit=String.fromCharCode(S.width>>8,255&S.width,S.height>>8,255&S.height)+S.DeskRecordServerInit.substring(4),S.recordedData.push(I(2,1,S.DeskRecordServerInit)),S.recordedData.push(I(3,0,atob(S.CanvasId.toDataURL("image/png").split(",")[1]))),!0)},S.StopRecording=function(){var e;if(null!=S.recordedData)return(e=S.recordedData).push(I(3,0,"MeshCentralMCREC")),delete S.recordedData,delete S.recordedStart,delete S.recordedSize,e},S}