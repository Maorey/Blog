/*! flowchart.js, v1.15.0 http://adrai.github.io/flowchart.js
* Copyright (c)2020 Adriano Raiano (adrai). Distributed under MIT license */
import { raphael } from './raphael'

export default (t=>(t=>{var e={},i=s=>{if(e[s])return e[s].exports;var n=e[s]={exports:{},id:s,loaded:!1};return t[s].call(n.exports,n,n.exports,i),n.loaded=!0,n.exports};return i.m=t,i.c=e,i.p="",i(0)})([function(t,i,e){e(9);var s=e(4);e(15);var n={parse:s};"undefined"!=typeof window&&(window.flowchart=n),t.exports=n},function(t,i){function e(t,i){if(!t||"function"==typeof t)return i;var s={};for(var n in i)s[n]=i[n];for(n in t)t[n]&&("object"==typeof s[n]?s[n]=e(s[n],t[n]):s[n]=t[n]);return s}function s(t,i){if("function"==typeof Object.create)t.super_=i,t.prototype=Object.create(i.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}});else{t.super_=i;var e=function(){};e.prototype=i.prototype,t.prototype=new e,t.prototype.constructor=t}}t.exports={defaults:e,inherits:s}},function(t,i,e){function s(t,i,e){this.chart=t,this.group=this.chart.paper.set(),this.symbol=e,this.connectedTo=[],this.symbolType=i.symbolType,this.flowstate=i.flowstate||"future",this.lineStyle=i.lineStyle||{},this.key=i.key||"",this.leftLines=[],this.rightLines=[],this.topLines=[],this.bottomLines=[],this.next_direction=i.next&&i.direction_next?i.direction_next:void 0,this.text=this.chart.paper.text(0,0,i.text),i.key&&(this.text.node.id=i.key+"t"),this.text.node.setAttribute("class",this.getAttr("class")+"t"),this.text.attr({"text-anchor":"start",x:this.getAttr("text-margin"),fill:this.getAttr("font-color"),"font-size":this.getAttr("font-size")});var s=this.getAttr("font"),n=this.getAttr("font-family"),h=this.getAttr("font-weight");s&&this.text.attr({font:s}),n&&this.text.attr({"font-family":n}),h&&this.text.attr({"font-weight":h}),i.link&&this.text.attr("href",i.link),i.function&&(this.text.attr({cursor:"pointer"}),this.text.node.addEventListener("click",function(t){window[i.function](t,i)},!1)),i.target&&this.text.attr("target",i.target);var o=this.getAttr("maxWidth");if(o){for(var r=i.text.split(" "),a="",l=0,p=r.length;l<p;l++){var y=r[l];this.text.attr("text",a+" "+y),a+=this.text.getBBox().width>o?"\n"+y:" "+y}this.text.attr("text",a.substring(1))}if(this.group.push(this.text),e){var x=this.getAttr("text-margin");e.attr({fill:this.getAttr("fill"),stroke:this.getAttr("element-color"),"stroke-width":this.getAttr("line-width"),width:this.text.getBBox().width+2*x,height:this.text.getBBox().height+2*x}),e.node.setAttribute("class",this.getAttr("class")),i.link&&e.attr("href",i.link),i.target&&e.attr("target",i.target),i.function&&(e.node.addEventListener("click",function(t){window[i.function](t,i)},!1),e.attr({cursor:"pointer"})),i.key&&(e.node.id=i.key),this.group.push(e),e.insertBefore(this.text),this.text.attr({y:e.getBBox().height/2}),this.initialize()}}var n=e(3),h=n.drawLine,o=n.checkLineIntersection;s.prototype.getAttr=function(t){if(this.chart){var i,e=this.chart.options?this.chart.options[t]:void 0,s=this.chart.options.symbols?this.chart.options.symbols[this.symbolType][t]:void 0;return this.chart.options.flowstate&&this.chart.options.flowstate[this.flowstate]&&(i=this.chart.options.flowstate[this.flowstate][t]),i||s||e}},s.prototype.initialize=function(){this.group.transform("t"+this.getAttr("line-width")+","+this.getAttr("line-width")),this.width=this.group.getBBox().width,this.height=this.group.getBBox().height},s.prototype.getCenter=function(){return{x:this.getX()+this.width/2,y:this.getY()+this.height/2}},s.prototype.getX=function(){return this.group.getBBox().x},s.prototype.getY=function(){return this.group.getBBox().y},s.prototype.shiftX=function(t){this.group.transform("t"+(this.getX()+t)+","+this.getY())},s.prototype.setX=function(t){this.group.transform("t"+t+","+this.getY())},s.prototype.shiftY=function(t){this.group.transform("t"+this.getX()+","+(this.getY()+t))},s.prototype.setY=function(t){this.group.transform("t"+this.getX()+","+t)},s.prototype.getTop=function(){var t=this.getY(),i=this.getX()+this.width/2;return{x:i,y:t}},s.prototype.getBottom=function(){var t=this.getY()+this.height,i=this.getX()+this.width/2;return{x:i,y:t}},s.prototype.getLeft=function(){var t=this.getY()+this.group.getBBox().height/2,i=this.getX();return{x:i,y:t}},s.prototype.getRight=function(){var t=this.getY()+this.group.getBBox().height/2,i=this.getX()+this.group.getBBox().width;return{x:i,y:t}},s.prototype.render=function(){if(this.next){var t=this,i=this.getAttr("line-length");if("right"===this.next_direction){var e=this.getRight();this.next.isPositioned||(this.next.setY(e.y-this.next.height/2),this.next.shiftX(this.group.getBBox().x+this.width+i),function e(){for(var s,n=!1,h=0,o=t.chart.symbols.length;h<o;h++){s=t.chart.symbols[h];var r=Math.abs(s.getCenter().x-t.next.getCenter().x);if(s.getCenter().y>t.next.getCenter().y&&r<=t.next.width/2){n=!0;break}}if(n){if("end"===t.next.symbolType)return;t.next.setX(s.getX()+s.width+i),e()}}(),this.next.isPositioned=!0,this.next.render())}else if("left"===this.next_direction){var s=this.getLeft();this.next.isPositioned||(this.next.setY(s.y-this.next.height/2),this.next.shiftX(-(this.group.getBBox().x+this.width+i)),function e(){for(var s,n=!1,h=0,o=t.chart.symbols.length;h<o;h++){s=t.chart.symbols[h];var r=Math.abs(s.getCenter().x-t.next.getCenter().x);if(s.getCenter().y>t.next.getCenter().y&&r<=t.next.width/2){n=!0;break}}if(n){if("end"===t.next.symbolType)return;t.next.setX(s.getX()+s.width+i),e()}}(),this.next.isPositioned=!0,this.next.render())}else{var n=this.getBottom();this.next.isPositioned||(this.next.shiftY(this.getY()+this.height+i),this.next.setX(n.x-this.next.width/2),this.next.isPositioned=!0,this.next.render())}}},s.prototype.renderLines=function(){this.next&&(this.next_direction?this.drawLineTo(this.next,this.getAttr("arrow-text")||"",this.next_direction):this.drawLineTo(this.next,this.getAttr("arrow-text")||""))},s.prototype.drawLineTo=function(t,i,e){this.connectedTo.indexOf(t)<0&&this.connectedTo.push(t);var s,n,r=this.getCenter().x,a=this.getCenter().y,l=this.getRight(),p=this.getBottom(),y=this.getTop(),x=this.getLeft(),g=t.getCenter().x,f=t.getCenter().y,c=t.getTop(),d=t.getRight(),m=t.getLeft(),u=r===g,b=a===f,_=a<f,v=a>f||this===t,w=r>g,L=r<g,k=0,B=this.getAttr("line-length"),A=this.getAttr("line-width");if(e&&"bottom"!==e||!u||!_)if(e&&"right"!==e||!b||!L)if(e&&"left"!==e||!b||!w)if(e&&"right"!==e||!u||!v)if(e&&"right"!==e||!u||!_)if(e&&"bottom"!==e||!w)if(e&&"bottom"!==e||!L||!_)if(e&&"bottom"!==e||!L)if(e&&"right"===e&&w)n=10*Math.max(t.topLines.length,this.rightLines.length),s=h(this.chart,l,[{x:l.x+B/2,y:l.y},{x:l.x+B/2,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.rightLines.push(s),t.topLines.push(s),this.rightStart=!0,t.topEnd=!0,k=l.x+B/2;else if(e&&"right"===e&&L)n=10*Math.max(t.topLines.length,this.rightLines.length),s=h(this.chart,l,[{x:c.x,y:l.y-n},{x:c.x,y:c.y-n}],i),this.rightLines.push(s),t.topLines.push(s),this.rightStart=!0,t.topEnd=!0,k=l.x+B/2;else if(e&&"bottom"===e&&u&&v)n=10*Math.max(t.topLines.length,this.bottomLines.length),s=h(this.chart,p,[{x:p.x,y:p.y+B/2-n},{x:l.x+B/2,y:p.y+B/2-n},{x:l.x+B/2,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.bottomLines.push(s),t.topLines.push(s),this.bottomStart=!0,t.topEnd=!0,k=p.x+B/2;else if("left"===e&&u&&v){var M=x.x-B/2;m.x<x.x&&(M=m.x-B/2),n=10*Math.max(t.topLines.length,this.leftLines.length),s=h(this.chart,x,[{x:M,y:x.y-n},{x:M,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.leftLines.push(s),t.topLines.push(s),this.leftStart=!0,t.topEnd=!0,k=x.x}else"left"===e?(n=10*Math.max(t.topLines.length,this.leftLines.length),s=h(this.chart,x,[{x:c.x+(x.x-c.x)/2,y:x.y},{x:c.x+(x.x-c.x)/2,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.leftLines.push(s),t.topLines.push(s),this.leftStart=!0,t.topEnd=!0,k=x.x):"top"===e&&(n=10*Math.max(t.topLines.length,this.topLines.length),s=h(this.chart,y,[{x:y.x,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.topLines.push(s),t.topLines.push(s),this.topStart=!0,t.topEnd=!0,k=y.x);else n=10*Math.max(t.topLines.length,this.bottomLines.length),s=h(this.chart,p,[{x:p.x,y:p.y+B/2-n},{x:p.x+(p.x-c.x)/2,y:p.y+B/2-n},{x:p.x+(p.x-c.x)/2,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.bottomLines.push(s),t.topLines.push(s),this.bottomStart=!0,t.topEnd=!0,k=p.x+(p.x-c.x)/2;else n=10*Math.max(t.topLines.length,this.bottomLines.length),s=h(this.chart,p,[{x:p.x,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.bottomLines.push(s),t.topLines.push(s),this.bottomStart=!0,t.topEnd=!0,k=p.x,c.x>k&&(k=c.x);else n=10*Math.max(t.topLines.length,this.bottomLines.length),s=this.leftEnd&&v?h(this.chart,p,[{x:p.x,y:p.y+B/2-n},{x:p.x+(p.x-c.x)/2,y:p.y+B/2-n},{x:p.x+(p.x-c.x)/2,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i):h(this.chart,p,[{x:p.x,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.bottomLines.push(s),t.topLines.push(s),this.bottomStart=!0,t.topEnd=!0,k=p.x+(p.x-c.x)/2;else n=10*Math.max(t.topLines.length,this.rightLines.length),s=h(this.chart,l,[{x:l.x+B/2,y:l.y-n},{x:l.x+B/2,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.rightLines.push(s),t.topLines.push(s),this.rightStart=!0,t.topEnd=!0,k=l.x+B/2;else n=10*Math.max(t.topLines.length,this.rightLines.length),s=h(this.chart,l,[{x:l.x+B/2,y:l.y-n},{x:l.x+B/2,y:c.y-B/2-n},{x:c.x,y:c.y-B/2-n},{x:c.x,y:c.y}],i),this.rightLines.push(s),t.topLines.push(s),this.rightStart=!0,t.topEnd=!0,k=l.x+B/2;else 0===t.rightLines.length&&0===this.leftLines.length?s=h(this.chart,x,d,i):(n=10*Math.max(t.rightLines.length,this.leftLines.length),s=h(this.chart,l,[{x:l.x,y:l.y-n},{x:l.x,y:d.y-n},{x:d.x,y:d.y-n},{x:d.x,y:d.y}],i)),this.leftLines.push(s),t.rightLines.push(s),this.leftStart=!0,t.rightEnd=!0,k=d.x;else 0===t.leftLines.length&&0===this.rightLines.length?s=h(this.chart,l,m,i):(n=10*Math.max(t.leftLines.length,this.rightLines.length),s=h(this.chart,l,[{x:l.x,y:l.y-n},{x:l.x,y:m.y-n},{x:m.x,y:m.y-n},{x:m.x,y:m.y}],i)),this.rightLines.push(s),t.leftLines.push(s),this.rightStart=!0,t.leftEnd=!0,k=m.x;else 0===t.topLines.length&&0===this.bottomLines.length?s=h(this.chart,p,c,i):(n=10*Math.max(t.topLines.length,this.bottomLines.length),s=h(this.chart,p,[{x:c.x,y:c.y-n},{x:c.x,y:c.y}],i)),this.bottomLines.push(s),t.topLines.push(s),this.bottomStart=!0,t.topEnd=!0,k=p.x;if(this.lineStyle[t.key]&&s&&s.attr(this.lineStyle[t.key]),s){for(var O=0,X=this.chart.lines.length;O<X;O++)for(var T=this.chart.lines[O],S=T.attr("path"),C=s.attr("path"),Y=0,P=S.length-1;Y<P;Y++){var j=[];j.push(["M",S[Y][1],S[Y][2]]),j.push(["L",S[Y+1][1],S[Y+1][2]]);for(var E=j[0][1],z=j[0][2],F=j[1][1],R=j[1][2],$=0,N=C.length-1;$<N;$++){var V=[];V.push(["M",C[$][1],C[$][2]]),V.push(["L",C[$+1][1],C[$+1][2]]);var G=V[0][1],I=V[0][2],W=V[1][1],Q=V[1][2],q=o(E,z,F,R,G,I,W,Q);if(q.onLine1&&q.onLine2){var J;I===Q?G>W?(J=["L",q.x+2*A,I],C.splice($+1,0,J),J=["C",q.x+2*A,I,q.x,I-4*A,q.x-2*A,I],C.splice($+2,0,J),s.attr("path",C)):(J=["L",q.x-2*A,I],C.splice($+1,0,J),J=["C",q.x-2*A,I,q.x,I-4*A,q.x+2*A,I],C.splice($+2,0,J),s.attr("path",C)):I>Q?(J=["L",G,q.y+2*A],C.splice($+1,0,J),J=["C",G,q.y+2*A,G+4*A,q.y,G,q.y-2*A],C.splice($+2,0,J),s.attr("path",C)):(J=["L",G,q.y-2*A],C.splice($+1,0,J),J=["C",G,q.y-2*A,G+4*A,q.y,G,q.y+2*A],C.splice($+2,0,J),s.attr("path",C)),$+=2}}}this.chart.lines.push(s),(void 0===this.chart.minXFromSymbols||this.chart.minXFromSymbols>x.x)&&(this.chart.minXFromSymbols=x.x)}(!this.chart.maxXFromLine||this.chart.maxXFromLine&&k>this.chart.maxXFromLine)&&(this.chart.maxXFromLine=k)},t.exports=s},function(t,i){function e(t,i,e){var s,n,h="M{0},{1}";for(s=2,n=2*e.length+2;s<n;s+=2)h+=" L{"+s+"},{"+(s+1)+"}";var o=[i.x,i.y];for(s=0,n=e.length;s<n;s++)o.push(e[s].x),o.push(e[s].y);var r=t.paper.path(h,o);r.attr("stroke",t.options["element-color"]),r.attr("stroke-width",t.options["line-width"]);var a=t.options.font,l=t.options["font-family"],p=t.options["font-weight"];return a&&r.attr({font:a}),l&&r.attr({"font-family":l}),p&&r.attr({"font-weight":p}),r}function s(t,i,e,s){var n,h;"[object Array]"!==Object.prototype.toString.call(e)&&(e=[e]);var o="M{0},{1}";for(n=2,h=2*e.length+2;n<h;n+=2)o+=" L{"+n+"},{"+(n+1)+"}";var r=[i.x,i.y];for(n=0,h=e.length;n<h;n++)r.push(e[n].x),r.push(e[n].y);var a=t.paper.path(o,r);a.attr({stroke:t.options["line-color"],"stroke-width":t.options["line-width"],"arrow-end":t.options["arrow-end"]});var l=t.options.font,p=t.options["font-family"],y=t.options["font-weight"];if(l&&a.attr({font:l}),p&&a.attr({"font-family":p}),y&&a.attr({"font-weight":y}),s){var x=!1,g=t.paper.text(0,0,s),f="start",c=!1,d=e[0];i.y===d.y&&(c=!0);var m=0,u=0;x?(m=i.x>d.x?i.x-(i.x-d.x)/2:d.x-(d.x-i.x)/2,u=i.y>d.y?i.y-(i.y-d.y)/2:d.y-(d.y-i.y)/2,c?(m-=g.getBBox().width/2,u-=t.options["text-margin"]):(m+=t.options["text-margin"],u-=g.getBBox().height/2)):(m=i.x,u=i.y,c?(i.x>d.x?(m-=t.options["text-margin"]/2,f="end"):m+=t.options["text-margin"]/2,u-=t.options["text-margin"]):(m+=t.options["text-margin"]/2,u+=t.options["text-margin"],i.y>d.y&&(u-=2*t.options["text-margin"]))),g.attr({"text-anchor":f,"font-size":t.options["font-size"],fill:t.options["font-color"],x:m,y:u}),l&&g.attr({font:l}),p&&g.attr({"font-family":p}),y&&g.attr({"font-weight":y})}return a}function n(t,i,e,s,n,h,o,r){var a,l,p,y,x,g={x:null,y:null,onLine1:!1,onLine2:!1};return a=(r-h)*(e-t)-(o-n)*(s-i),0===a?g:(l=i-h,p=t-n,y=(o-n)*l-(r-h)*p,x=(e-t)*l-(s-i)*p,l=y/a,p=x/a,g.x=t+l*(e-t),g.y=i+l*(s-i),l>0&&l<1&&(g.onLine1=!0),p>0&&p<1&&(g.onLine2=!0),g)}t.exports={drawPath:e,drawLine:s,checkLineIntersection:n}},function(t,i,e){function s(t){function i(t){var i=t.indexOf("(")+1,e=t.indexOf(")");return i>=0&&e>=0?t.substring(i,e):"{}"}function e(t){var i=t.indexOf("(")+1,e=t.indexOf(")");return i>=0&&e>=0?t.substring(i,e):""}function s(t){var i=t.indexOf("(")+1,e=t.indexOf(")");return i>=0&&e>=0?f.symbols[t.substring(0,i-1)]:f.symbols[t]}function x(t){var i="next",e=t.indexOf("(")+1,s=t.indexOf(")");return e>=0&&s>=0&&(i=F.substring(e,s),i.indexOf(",")<0&&"yes"!==i&&"no"!==i&&(i="next, "+i)),i}function g(t){var i=t.indexOf("(")+1,e=t.indexOf(")"),s=t.substring(i,e);s.indexOf(",")>0&&(s=s.substring(0,s.indexOf(",")));var n=s.split("@");if(n.length>1)return i>=0&&e>=0?n[1]:""}t=t||"",t=t.trim();for(var f={symbols:{},start:null,drawSVG:function(t,i){function e(t){if(g[t.key])return g[t.key];switch(t.symbolType){case"start":g[t.key]=new h(x,t);break;case"end":g[t.key]=new o(x,t);break;case"operation":g[t.key]=new r(x,t);break;case"inputoutput":g[t.key]=new a(x,t);break;case"subroutine":g[t.key]=new l(x,t);break;case"condition":g[t.key]=new p(x,t);break;case"parallel":g[t.key]=new y(x,t);break;default:return new Error("Wrong symbol type!")}return g[t.key]}var s=this;this.diagram&&this.diagram.clean();var x=new n(t,i);this.diagram=x;var g={};!function t(i,n,h){var o=e(i);return s.start===i?x.startWith(o):n&&h&&!n.pathOk&&(n instanceof p?(h.yes===i&&n.yes(o),h.no===i&&n.no(o)):n instanceof y?(h.path1===i&&n.path1(o),h.path2===i&&n.path2(o),h.path3===i&&n.path3(o)):n.then(o)),o.pathOk?o:(o instanceof p?(i.yes&&t(i.yes,o,i),i.no&&t(i.no,o,i)):o instanceof y?(i.path1&&t(i.path1,o,i),i.path2&&t(i.path2,o,i),i.path3&&t(i.path3,o,i)):i.next&&t(i.next,o,i),o)}(this.start),x.render()},clean:function(){this.diagram.clean()},options:function(){return this.diagram.options}},c=[],d=0,m=1,u=t.length;m<u;m++)if("\n"===t[m]&&"\\"!==t[m-1]){var b=t.substring(d,m);d=m+1,c.push(b.replace(/\\\n/g,"\n"))}d<t.length&&c.push(t.substr(d));for(var _=1,v=c.length;_<v;){var w=c[_];w.indexOf("->")<0&&w.indexOf("=>")<0&&w.indexOf("@>")<0?(c[_-1]+="\n"+w,c.splice(_,1),v--):_++}for(;c.length>0;){var L=c.splice(0,1)[0].trim();if(L.indexOf("=>")>=0){var k=L.split("=>"),B={key:k[0].replace(/\(.*\)/,""),symbolType:k[1],text:null,link:null,target:null,flowstate:null,function:null,lineStyle:{},params:{}},A=k[0].match(/\((.*)\)/);if(A&&A.length>1)for(var M=A[1].split(","),O=0;O<M.length;O++){var X=M[O].split("=");2==X.length&&(B.params[X[0]]=X[1])}var T;if(B.symbolType.indexOf(": ")>=0&&(T=B.symbolType.split(": "),B.symbolType=T.shift(),B.text=T.join(": ")),B.text&&B.text.indexOf(":$")>=0?(T=B.text.split(":$"),B.text=T.shift(),B.function=T.join(":$")):B.symbolType.indexOf(":$")>=0?(T=B.symbolType.split(":$"),B.symbolType=T.shift(),B.function=T.join(":$")):B.text&&B.text.indexOf(":>")>=0?(T=B.text.split(":>"),B.text=T.shift(),B.link=T.join(":>")):B.symbolType.indexOf(":>")>=0&&(T=B.symbolType.split(":>"),B.symbolType=T.shift(),B.link=T.join(":>")),B.symbolType.indexOf("\n")>=0&&(B.symbolType=B.symbolType.split("\n")[0]),B.link){var S=B.link.indexOf("[")+1,C=B.link.indexOf("]");S>=0&&C>=0&&(B.target=B.link.substring(S,C),B.link=B.link.substring(0,S-1))}if(B.text&&B.text.indexOf("|")>=0){var Y=B.text.split("|");B.flowstate=Y.pop().trim(),B.text=Y.join("|")}f.symbols[B.key]=B}else if(L.indexOf("->")>=0){var P=g(L);P&&(L=L.replace("@"+P,""));for(var j=L.split("->"),E=0,z=j.length;E<z;E++){var F=j[E],R=e(F);"true"!==R&&"false"!==R||(F=F.replace("true","yes"),F=F.replace("false","no"));var $=x(F),N=s(F),V=null;if($.indexOf(",")>=0){var G=$.split(",");$=G[0],V=G[1].trim()}if(P&&("yes"==$||"true"==$?N.yes_annotation=P:N.no_annotation=P,P=null),f.start||(f.start=N),E+1<z){var I=j[E+1];N[$]=s(I),N["direction_"+$]=V,V=null}}}else if(L.indexOf("@>")>=0)for(var W=L.split("@>"),Q=0,q=W.length;Q<q;Q++)if(Q+1!==q){var J=s(W[Q]),D=s(W[Q+1]);J.lineStyle[D.key]=JSON.parse(i(W[Q+1]))}}return f}var n=e(7),h=e(13),o=e(10),r=e(12),a=e(11),l=e(14),p=e(5),y=e(6);t.exports=s},function(t,i,e){function s(t,i){i=i||{},n.call(this,t,i),this.yes_annotation=i.yes_annotation,this.no_annotation=i.no_annotation,this.textMargin=this.getAttr("text-margin"),this.yes_direction=i.direction_yes,this.no_direction=i.direction_no,this.params=i.params,this.no_direction||"right"!==this.yes_direction?this.yes_direction||"bottom"!==this.no_direction||(this.yes_direction="right"):this.no_direction="bottom",this.yes_direction=this.yes_direction||"bottom",this.no_direction=this.no_direction||"right",this.text.attr({x:2*this.textMargin});var e=this.text.getBBox().width+3*this.textMargin;e+=e/2;var s=this.text.getBBox().height+2*this.textMargin;s+=s/2,s=Math.max(.5*e,s);var h=e/4,o=s/4;this.text.attr({x:h+this.textMargin/2});var a={x:h,y:o},l=[{x:h-e/4,y:o+s/4},{x:h-e/4+e/2,y:o+s/4+s/2},{x:h-e/4+e,y:o+s/4},{x:h-e/4+e/2,y:o+s/4-s/2},{x:h-e/4,y:o+s/4}],p=r(t,a,l);p.attr({stroke:this.getAttr("element-color"),"stroke-width":this.getAttr("line-width"),fill:this.getAttr("fill")}),i.link&&p.attr("href",i.link),i.target&&p.attr("target",i.target),i.key&&(p.node.id=i.key),p.node.setAttribute("class",this.getAttr("class")),this.text.attr({y:p.getBBox().height/2}),this.group.push(p),p.insertBefore(this.text),this.initialize()}var n=e(2),h=e(1).inherits,o=e(3),r=o.drawPath;h(s,n),s.prototype.render=function(){this.yes_direction&&(this[this.yes_direction+"_symbol"]=this.yes_symbol),this.no_direction&&(this[this.no_direction+"_symbol"]=this.no_symbol);var t=this.getAttr("line-length");if(this.bottom_symbol){var i=this.getBottom();this.bottom_symbol.isPositioned||(this.bottom_symbol.shiftY(this.getY()+this.height+t),this.bottom_symbol.setX(i.x-this.bottom_symbol.width/2),this.bottom_symbol.isPositioned=!0,this.bottom_symbol.render())}if(this.right_symbol){var e=this.getRight();if(!this.right_symbol.isPositioned){this.right_symbol.setY(e.y-this.right_symbol.height/2),this.right_symbol.shiftX(this.group.getBBox().x+this.width+t);var s=this;!function i(){for(var e,n=!1,h=0,o=s.chart.symbols.length;h<o;h++)if(e=s.chart.symbols[h],!s.params["align-next"]||"no"!==s.params["align-next"]){var r=Math.abs(e.getCenter().x-s.right_symbol.getCenter().x);if(e.getCenter().y>s.right_symbol.getCenter().y&&r<=s.right_symbol.width/2){n=!0;break}}if(n){if("end"===s.right_symbol.symbolType)return;s.right_symbol.setX(e.getX()+e.width+t),i()}}(),this.right_symbol.isPositioned=!0,this.right_symbol.render()}}if(this.left_symbol){var n=this.getLeft();if(!this.left_symbol.isPositioned){this.left_symbol.setY(n.y-this.left_symbol.height/2),this.left_symbol.shiftX(-(this.group.getBBox().x+this.width+t));var s=this;!function i(){for(var e,n=!1,h=0,o=s.chart.symbols.length;h<o;h++)if(e=s.chart.symbols[h],!s.params["align-next"]||"no"!==s.params["align-next"]){var r=Math.abs(e.getCenter().x-s.left_symbol.getCenter().x);if(e.getCenter().y>s.left_symbol.getCenter().y&&r<=s.left_symbol.width/2){n=!0;break}}if(n){if("end"===s.left_symbol.symbolType)return;s.left_symbol.setX(e.getX()+e.width+t),i()}}(),this.left_symbol.isPositioned=!0,this.left_symbol.render()}}},s.prototype.renderLines=function(){this.yes_symbol&&this.drawLineTo(this.yes_symbol,this.yes_annotation?this.yes_annotation:this.getAttr("yes-text"),this.yes_direction),this.no_symbol&&this.drawLineTo(this.no_symbol,this.no_annotation?this.no_annotation:this.getAttr("no-text"),this.no_direction)},t.exports=s},function(t,i,e){function s(t,i){var e=t.paper.rect(0,0,0,0);i=i||{},n.call(this,t,i,e),this.textMargin=this.getAttr("text-margin"),this.path1_direction="bottom",this.path2_direction="right",this.path3_direction="top",this.params=i.params,"path1"===i.direction_next&&!i[i.direction_next]&&i.next&&(i[i.direction_next]=i.next),"path2"===i.direction_next&&!i[i.direction_next]&&i.next&&(i[i.direction_next]=i.next),"path3"===i.direction_next&&!i[i.direction_next]&&i.next&&(i[i.direction_next]=i.next),i.path1&&i.direction_path1&&i.path2&&!i.direction_path2&&i.path3&&!i.direction_path3?"right"===i.direction_path1?(this.path2_direction="bottom",this.path1_direction="right",this.path3_direction="top"):"top"===i.direction_path1?(this.path2_direction="right",this.path1_direction="top",this.path3_direction="bottom"):"left"===i.direction_path1?(this.path2_direction="right",this.path1_direction="left",this.path3_direction="bottom"):(this.path2_direction="right",this.path1_direction="bottom",this.path3_direction="top"):i.path1&&!i.direction_path1&&i.path2&&i.direction_path2&&i.path3&&!i.direction_path3?"right"===i.direction_path2?(this.path1_direction="bottom",this.path2_direction="right",this.path3_direction="top"):"left"===i.direction_path2?(this.path1_direction="bottom",this.path2_direction="left",this.path3_direction="right"):(this.path1_direction="right",this.path2_direction="bottom",this.path3_direction="top"):i.path1&&!i.direction_path1&&i.path2&&!i.direction_path2&&i.path3&&i.direction_path3?"right"===i.direction_path2?(this.path1_direction="bottom",this.path2_direction="top",this.path3_direction="right"):"left"===i.direction_path2?(this.path1_direction="bottom",this.path2_direction="right",this.path3_direction="left"):(this.path1_direction="right",this.path2_direction="bottom",this.path3_direction="top"):(this.path1_direction=i.direction_path1,this.path2_direction=i.direction_path2,this.path3_direction=i.direction_path3),this.path1_direction=this.path1_direction||"bottom",this.path2_direction=this.path2_direction||"right",this.path3_direction=this.path3_direction||"top",this.initialize()}var n=e(2),h=e(1).inherits;h(s,n),s.prototype.render=function(){this.path1_direction&&(this[this.path1_direction+"_symbol"]=this.path1_symbol),this.path2_direction&&(this[this.path2_direction+"_symbol"]=this.path2_symbol),this.path3_direction&&(this[this.path3_direction+"_symbol"]=this.path3_symbol);var t=this.getAttr("line-length");if(this.bottom_symbol){var i=this.getBottom();this.bottom_symbol.isPositioned||(this.bottom_symbol.shiftY(this.getY()+this.height+t),this.bottom_symbol.setX(i.x-this.bottom_symbol.width/2),this.bottom_symbol.isPositioned=!0,this.bottom_symbol.render())}if(this.top_symbol){var e=this.getTop();this.top_symbol.isPositioned||(this.top_symbol.shiftY(this.getY()-this.top_symbol.height-t),this.top_symbol.setX(e.x+this.top_symbol.width),this.top_symbol.isPositioned=!0,this.top_symbol.render())}var s=this;if(this.left_symbol){var n=this.getLeft();this.left_symbol.isPositioned||(this.left_symbol.setY(n.y-this.left_symbol.height/2),this.left_symbol.shiftX(-(this.group.getBBox().x+this.width+t)),function i(){for(var e,n=!1,h=0,o=s.chart.symbols.length;h<o;h++)if(e=s.chart.symbols[h],!s.params["align-next"]||"no"!==s.params["align-next"]){var r=Math.abs(e.getCenter().x-s.left_symbol.getCenter().x);if(e.getCenter().y>s.left_symbol.getCenter().y&&r<=s.left_symbol.width/2){n=!0;break}}if(n){if("end"===s.left_symbol.symbolType)return;s.left_symbol.setX(e.getX()+e.width+t),i()}}(),this.left_symbol.isPositioned=!0,this.left_symbol.render())}if(this.right_symbol){var h=this.getRight();this.right_symbol.isPositioned||(this.right_symbol.setY(h.y-this.right_symbol.height/2),this.right_symbol.shiftX(this.group.getBBox().x+this.width+t),function i(){for(var e,n=!1,h=0,o=s.chart.symbols.length;h<o;h++)if(e=s.chart.symbols[h],!s.params["align-next"]||"no"!==s.params["align-next"]){var r=Math.abs(e.getCenter().x-s.right_symbol.getCenter().x);if(e.getCenter().y>s.right_symbol.getCenter().y&&r<=s.right_symbol.width/2){n=!0;break}}if(n){if("end"===s.right_symbol.symbolType)return;s.right_symbol.setX(e.getX()+e.width+t),i()}}(),this.right_symbol.isPositioned=!0,this.right_symbol.render())}},s.prototype.renderLines=function(){this.path1_symbol&&this.drawLineTo(this.path1_symbol,"",this.path1_direction),this.path2_symbol&&this.drawLineTo(this.path2_symbol,"",this.path2_direction),this.path3_symbol&&this.drawLineTo(this.path3_symbol,"",this.path3_direction)},t.exports=s},function(t,i,e){function s(t,i){i=i||{},this.paper=new n(t),this.options=h(i,o),this.symbols=[],this.lines=[],this.start=null}var n=e(16),h=e(1).defaults,o=e(8),r=e(5),a=e(6);s.prototype.handle=function(t){this.symbols.indexOf(t)<=-1&&this.symbols.push(t);var i=this;return t instanceof r?(t.yes=function(e){return t.yes_symbol=e,t.no_symbol&&(t.pathOk=!0),i.handle(e)},t.no=function(e){return t.no_symbol=e,t.yes_symbol&&(t.pathOk=!0),i.handle(e)}):t instanceof a?(t.path1=function(e){return t.path1_symbol=e,t.path2_symbol&&(t.pathOk=!0),i.handle(e)},t.path2=function(e){return t.path2_symbol=e,t.path3_symbol&&(t.pathOk=!0),i.handle(e)},t.path3=function(e){return t.path3_symbol=e,t.path1_symbol&&(t.pathOk=!0),i.handle(e)}):t.then=function(e){return t.next=e,t.pathOk=!0,i.handle(e)},t},s.prototype.startWith=function(t){return this.start=t,this.handle(t)},s.prototype.render=function(){var t,i,e=0,s=0,n=0,h=0,o=0,r=0,a=0,l=0;for(n=0,h=this.symbols.length;n<h;n++)t=this.symbols[n],t.width>e&&(e=t.width),t.height>s&&(s=t.height);for(n=0,h=this.symbols.length;n<h;n++)t=this.symbols[n],t.shiftX(this.options.x+(e-t.width)/2+this.options["line-width"]),t.shiftY(this.options.y+(s-t.height)/2+this.options["line-width"]);for(this.start.render(),n=0,h=this.symbols.length;n<h;n++)t=this.symbols[n],t.renderLines();o=this.maxXFromLine;var p,y;for(n=0,h=this.symbols.length;n<h;n++){t=this.symbols[n];var x=t.getX();p=x+t.width,y=t.getY()+t.height,x<a&&(a=x),p>o&&(o=p),y>r&&(r=y)}for(n=0,h=this.lines.length;n<h;n++){i=this.lines[n].getBBox(),p=i.x,y=i.y;var g=i.x2,f=i.y2;p<a&&(a=p),y<l&&(l=y),g>o&&(o=g),f>r&&(r=f)}var c=this.options.scale,d=this.options["line-width"];this.minXFromSymbols<a&&(a=this.minXFromSymbols),a<0&&(a-=d),l<0&&(l-=d);var m=o+d-a,u=r+d-l;this.paper.setSize(m*c,u*c),this.paper.setViewBox(a,l,m,u,!0)},s.prototype.clean=function(){if(this.paper){var t=this.paper.canvas;t.parentNode&&t.parentNode.removeChild(t)}},t.exports=s},function(t,i){t.exports={x:0,y:0,"line-width":3,"line-length":50,"text-margin":10,"font-size":14,"font-color":"black","line-color":"black","element-color":"black",fill:"white","yes-text":"yes","no-text":"no","arrow-end":"block",class:"flowchart",scale:1,symbols:{start:{},end:{},condition:{},inputoutput:{},operation:{},subroutine:{},parallel:{}}}},function(t,i){Array.prototype.indexOf||(Array.prototype.indexOf=function(t){if(null===this)throw new TypeError;var i=Object(this),e=i.length>>>0;if(0===e)return-1;var s=0;if(arguments.length>0&&(s=Number(arguments[1]),s!=s?s=0:0!==s&&s!=1/0&&s!=-(1/0)&&(s=(s>0||-1)*Math.floor(Math.abs(s)))),s>=e)return-1;for(var n=s>=0?s:Math.max(e-Math.abs(s),0);n<e;n++)if(n in i&&i[n]===t)return n;return-1}),Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(t){if(null===this)throw new TypeError;var i=Object(this),e=i.length>>>0;if(0===e)return-1;var s=e;arguments.length>1&&(s=Number(arguments[1]),s!=s?s=0:0!==s&&s!=1/0&&s!=-(1/0)&&(s=(s>0||-1)*Math.floor(Math.abs(s))));for(var n=s>=0?Math.min(s,e-1):e-Math.abs(s);n>=0;n--)if(n in i&&i[n]===t)return n;return-1}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")})},function(t,i,e){function s(t,i){var e=t.paper.rect(0,0,0,0,20);i=i||{},i.text=i.text||"End",n.call(this,t,i,e)}var n=e(2),h=e(1).inherits;h(s,n),t.exports=s},function(t,i,e){function s(t,i){i=i||{},n.call(this,t,i),this.textMargin=this.getAttr("text-margin"),this.text.attr({x:3*this.textMargin});var e=this.text.getBBox().width+4*this.textMargin,s=this.text.getBBox().height+2*this.textMargin,h=this.textMargin,o=s/2,a={x:h,y:o},l=[{x:h-this.textMargin,y:s},{x:h-this.textMargin+e,y:s},{x:h-this.textMargin+e+2*this.textMargin,y:0},{x:h-this.textMargin+2*this.textMargin,y:0},{x:h,y:o}],p=r(t,a,l);p.attr({stroke:this.getAttr("element-color"),"stroke-width":this.getAttr("line-width"),fill:this.getAttr("fill")}),i.link&&p.attr("href",i.link),i.target&&p.attr("target",i.target),i.key&&(p.node.id=i.key),p.node.setAttribute("class",this.getAttr("class")),this.text.attr({y:p.getBBox().height/2}),this.group.push(p),p.insertBefore(this.text),this.initialize()}var n=e(2),h=e(1).inherits,o=e(3),r=o.drawPath;h(s,n),s.prototype.getLeft=function(){var t=this.getY()+this.group.getBBox().height/2,i=this.getX()+this.textMargin;return{x:i,y:t}},s.prototype.getRight=function(){var t=this.getY()+this.group.getBBox().height/2,i=this.getX()+this.group.getBBox().width-this.textMargin;return{x:i,y:t}},t.exports=s},function(t,i,e){function s(t,i){var e=t.paper.rect(0,0,0,0);i=i||{},n.call(this,t,i,e)}var n=e(2),h=e(1).inherits;h(s,n),t.exports=s},function(t,i,e){function s(t,i){var e=t.paper.rect(0,0,0,0,20);i=i||{},i.text=i.text||"Start",n.call(this,t,i,e)}var n=e(2),h=e(1).inherits;h(s,n),t.exports=s},function(t,i,e){function s(t,i){var e=t.paper.rect(0,0,0,0);i=i||{},n.call(this,t,i,e),e.attr({width:this.text.getBBox().width+4*this.getAttr("text-margin")}),this.text.attr({x:2*this.getAttr("text-margin")});var s=t.paper.rect(0,0,0,0);s.attr({x:this.getAttr("text-margin"),stroke:this.getAttr("element-color"),"stroke-width":this.getAttr("line-width"),width:this.text.getBBox().width+2*this.getAttr("text-margin"),height:this.text.getBBox().height+2*this.getAttr("text-margin"),fill:this.getAttr("fill")}),i.key&&(s.node.id=i.key+"i");var h=this.getAttr("font"),o=this.getAttr("font-family"),r=this.getAttr("font-weight");h&&s.attr({font:h}),o&&s.attr({"font-family":o}),r&&s.attr({"font-weight":r}),i.link&&s.attr("href",i.link),i.target&&s.attr("target",i.target),this.group.push(s),s.insertBefore(this.text),this.initialize()}var n=e(2),h=e(1).inherits;h(s,n),t.exports=s},function(t,i,e){if("undefined"!=typeof jQuery){var s=e(4);!function(t){function i(t,i){return t==i||Array.isArray(i)&&(i.includes(t)||i.includes(Number(t)))}var e={init:function(i){return this.each(function(){var e=t(this);this.chart=s(e.text()),e.html(""),this.chart.drawSVG(this,i)})},setFlowStateByParam:function(t,e,s){return this.each(function(){var n=this.chart,h=["next","yes","no","path1","path2","path3"];for(var o in n.symbols)if(n.symbols.hasOwnProperty(o)){var r=n.symbols[o],a=r.params[t];if(i(a,e)){r.flowstate=s;for(var l=0;l<h.length;l++){var p=h[l];r[p]&&r[p].params&&r[p].params[t]&&i(r[p].params[t],e)&&(r.lineStyle[r[p].key]={stroke:n.options().flowstate[s].fill})}}}n.clean(),n.drawSVG(this)})},clearFlowState:function(){return this.each(function(){var t=this.chart;for(var i in t.symbols)if(t.symbols.hasOwnProperty(i)){var e=t.symbols[i];e.flowstate=""}t.clean(),t.drawSVG(this)})}};t.fn.flowChart=function(i){return e[i]?e[i].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof i&&i?void t.error("Method "+i+" does not exist on jQuery.flowChart"):e.init.apply(this,arguments)}}(jQuery)}},i=>{i.exports=t}]))(raphael)
