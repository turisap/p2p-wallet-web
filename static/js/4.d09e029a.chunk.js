(this["webpackJsonpp2p-wallet-web"]=this["webpackJsonpp2p-wallet-web"]||[]).push([[4],{1095:function(e,a,t){},1098:function(e,a,t){"use strict";t.d(a,"a",(function(){return p}));var n=t(0),l=t.n(n),c=t(1092),r=t(13),s=Object(c.a)("div")({name:"Wrapper",class:"wrdya2m"}),o=Object(c.a)("div")({name:"Header",class:"h1vh307k"}),m=Object(c.a)("div")({name:"Title",class:"t1qfjroh"}),i=Object(c.a)("div")({name:"Description",class:"d8b2mdb"}),u=Object(c.a)("div")({name:"CloseWrapper",class:"c135gzia"}),d=Object(c.a)(r.c)({name:"CloseIcon",class:"c1whuod3"}),b=Object(c.a)("div")({name:"Content",class:"c12kmdhp"}),E=Object(c.a)("div")({name:"Footer",class:"f1oi5t7m"}),p=function(e){var a=e.title,t=e.description,n=e.footer,c=e.close,r=e.children,p=e.className;return l.a.createElement(s,{className:p},l.a.createElement(o,null,a?l.a.createElement(m,null,a):void 0,t?l.a.createElement(i,null,t):void 0,c?l.a.createElement(u,{onClick:c},l.a.createElement(d,{name:"close"})):void 0),r?l.a.createElement(b,null,r):void 0,n?l.a.createElement(E,null,n):void 0)};t(1095)},1102:function(e,a,t){},1108:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return S}));var n=t(2),l=t.n(n),c=t(6),r=t(10),s=t(0),o=t.n(s),m=t(17),i=t(1092),u=t(25),d=t(67),b=t(282),E=t(143),p=t(1098),f=t(226),v=t(59),j=t(13),w=Object(i.a)(p.a)({name:"WrapperModal",class:"wagrybf"}),O=Object(i.a)("div")({name:"Section",class:"s174q8v8"}),h=Object(i.a)("div")({name:"SectionTitle",class:"stv7ewi"}),k=Object(i.a)("div")({name:"FieldInfo",class:"fzqjr6w"}),y=Object(i.a)(j.c)({name:"WalletIcon",class:"wme6loh"}),T=Object(i.a)("div")({name:"IconWrapper",class:"i11uhwtr"}),C=Object(i.a)("div")({name:"InfoWrapper",class:"i1yhd9jn"}),g=Object(i.a)("div")({name:"InfoTitle",class:"i1ydpu80"}),I=Object(i.a)("div")({name:"InfoValue",class:"inbro1a"}),N=Object(i.a)("span")({name:"SubTitle",class:"s1q7om9d"}),A=Object(i.a)(f.a)({name:"PasswordInputStyled",class:"p1cgmewo"}),S=function(e){var a=e.type,t=e.params,n=e.close,i=Object(s.useState)(""),p=Object(r.a)(i,2),f=p[0],S=p[1],W=Object(s.useState)(!1),M=Object(r.a)(W,2),z=M[0],B=M[1],D=Object(m.d)((function(e){return e.wallet.type})),F=function(){var e=Object(c.a)(l.a.mark((function e(a){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,Object(d.e)(a);case 3:B(!1),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),e.t0.message===b.a&&B(!0);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(a){return e.apply(this,arguments)}}(),q=function(){n(!0)},x=function(){n(!1)},J=D===u.a.MANUAL&&(!f||z);return o.a.createElement(w,{title:"Double check and confirm",description:function(){switch(a){case"swap":return"Swap transaction";case"send":return"Send transaction";default:return"Transaction"}}(),close:x,footer:function(){var e;switch(a){case"swap":e="Confirm and swap";break;case"send":default:e="Confirm and send"}return o.a.createElement(o.a.Fragment,null,o.a.createElement(j.b,{primary:!0,disabled:J,onClick:q},e),o.a.createElement(j.b,{lightGray:!0,onClick:x},"Cancel"))}()},"send"===a?o.a.createElement(O,{className:"send"},o.a.createElement(k,null,o.a.createElement(v.a,{symbol:t.source.mint.symbol,address:t.source.mint.address.toBase58(),size:44}),o.a.createElement(C,null,o.a.createElement(g,null,"Check the amount"),o.a.createElement(I,null,t.amount," ",t.source.mint.symbol))),o.a.createElement(k,null,o.a.createElement(T,null,o.a.createElement(y,{name:"wallet"})),o.a.createElement(C,null,o.a.createElement(g,null,"Check recepient\u2019s address"),o.a.createElement(I,null,t.destination.toBase58())))):void 0,"swap"===a?o.a.createElement(o.a.Fragment,null,o.a.createElement(O,{className:"swap"},o.a.createElement(h,null,"From"),o.a.createElement(k,null,o.a.createElement(v.a,{symbol:t.firstToken.symbol,address:t.firstToken.address.toBase58(),size:44}),o.a.createElement(C,null,o.a.createElement(g,null,"Check the amount"),o.a.createElement(I,null,t.firstToken.toMajorDenomination(t.firstAmount).toNumber()," ",t.firstToken.symbol)))),o.a.createElement(O,{className:"top"},o.a.createElement(h,null,"To"),o.a.createElement(k,null,o.a.createElement(v.a,{symbol:t.secondToken.symbol,address:t.secondToken.address.toBase58(),size:44}),o.a.createElement(C,null,o.a.createElement(g,null,"Minimum receive"),o.a.createElement(I,null,t.secondToken.toMajorDenomination(t.secondAmount).toNumber()," ",t.secondToken.symbol))),o.a.createElement(k,null,o.a.createElement(T,null,o.a.createElement(y,{name:"wallet"})),o.a.createElement(C,null,o.a.createElement(g,null,"Destination wallet"),o.a.createElement(I,null,t.secondTokenAccount?t.secondTokenAccount.address.toBase58():"Will be created after transaction processing"))))):void 0,D===u.a.MANUAL?o.a.createElement(O,null,o.a.createElement(N,null,"Enter password to confirm"),o.a.createElement(A,{value:f,onChange:function(e){S(e),e&&F(e)}}),z?o.a.createElement(E.a,{error:"Incorrect password, try again",noIcon:!0}):void 0):void 0)};t(1102)}}]);
//# sourceMappingURL=4.d09e029a.chunk.js.map