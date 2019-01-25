/*
The MIT License (MIT)

Copyright (c) 2015 OneNoteDev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.OneNoteApi=t()}}(function(){return function t(e,r,n){function o(i,s){if(!r[i]){if(!e[i]){var u="function"==typeof require&&require;if(!s&&u)return u(i,!0);if(a)return a(i,!0);var p=new Error("Cannot find module '"+i+"'");throw p.code="MODULE_NOT_FOUND",p}var c=r[i]={exports:{}};e[i][0].call(c.exports,function(t){var r=e[i][1][t];return o(r?r:t)},c,c.exports,t,e,r,n)}return r[i].exports}for(var a="function"==typeof require&&require,i=0;i<n.length;i++)o(n[i]);return o}({1:[function(t,e,r){"use strict";var n=function(){function t(){this.operations=[],this.boundaryName="batch_"+Math.floor(1e3*Math.random())}return t.prototype.addOperation=function(t){this.operations.push(t)},t.prototype.getOperation=function(t){return this.operations[t]},t.prototype.getNumOperations=function(){return this.operations.length},t.prototype.getRequestBody=function(){var t=this,e="";return this.operations.forEach(function(r){var n="";n+="--"+t.boundaryName+"\r\n",n+="Content-Type: application/http\r\n",n+="Content-Transfer-Encoding: binary\r\n",n+="\r\n",n+=r.httpMethod+" "+r.uri+" HTTP/1.1\r\n",n+="Content-Type: "+r.contentType+"\r\n",n+="\r\n",n+=(r.content?r.content:"")+"\r\n",n+="\r\n",e+=n}),e+="--"+this.boundaryName+"--\r\n"},t.prototype.getContentType=function(){return'multipart/mixed; boundary="'+this.boundaryName+'"'},t}();r.BatchRequest=n},{}],2:[function(t,e,r){"use strict";!function(t){t[t.Html=0]="Html",t[t.Image=1]="Image",t[t.EnhancedUrl=2]="EnhancedUrl",t[t.Url=3]="Url",t[t.Onml=4]="Onml"}(r.ContentType||(r.ContentType={}));r.ContentType},{}],3:[function(t,e,r){"use strict";!function(t){t[t.NETWORK_ERROR=0]="NETWORK_ERROR",t[t.UNEXPECTED_RESPONSE_STATUS=1]="UNEXPECTED_RESPONSE_STATUS",t[t.REQUEST_TIMED_OUT=2]="REQUEST_TIMED_OUT",t[t.UNABLE_TO_PARSE_RESPONSE=3]="UNABLE_TO_PARSE_RESPONSE"}(r.RequestErrorType||(r.RequestErrorType={}));var n=r.RequestErrorType,o=function(){function t(){}return t.createRequestErrorObject=function(e,r){if(void 0!==e&&null!==e)return t.createRequestErrorObjectInternal(e.status,e.readyState,e.response,e.getAllResponseHeaders(),e.timeout,r)},t.createRequestErrorObjectInternal=function(e,r,o,a,i,s){var u=t.formatRequestErrorTypeAsString(s);s===n.NETWORK_ERROR&&(u+=t.getAdditionalNetworkErrorInfo(r)),s===n.REQUEST_TIMED_OUT&&(e=408);var p={error:u,statusCode:e,responseHeaders:t.convertResponseHeadersToJsonInternal(a),response:o};return i>0&&!(e>=200&&e<300)&&(p.timeout=i),p},t.convertResponseHeadersToJson=function(e){if(void 0!==e&&null!==e){var r=e.getAllResponseHeaders();return t.convertResponseHeadersToJsonInternal(r)}},t.convertResponseHeadersToJsonInternal=function(t){for(var e,r=/([^:]+):\s?(.*)/g,n={};e=r.exec(t);){e.index===r.lastIndex&&r.lastIndex++;var o=e[1].trim(),a=e[2].trim();n[o]=a}return n},t.getAdditionalNetworkErrorInfo=function(t){return": "+JSON.stringify({readyState:t})},t.formatRequestErrorTypeAsString=function(t){var e=n[t];return e.charAt(0).toUpperCase()+e.replace(/_/g," ").toLowerCase().slice(1)},t}();r.ErrorUtils=o},{}],4:[function(t,e,r){"use strict";var n=function(){function t(){}return t.sectionExistsInNotebooks=function(e,r){if(!e||!r)return!1;for(var n=0;n<e.length;n++)if(t.sectionExistsInParent(e[n],r))return!0;return!1},t.sectionExistsInParent=function(e,r){if(!e||!r)return!1;if(e.sections)for(var n=0;n<e.sections.length;n++){var o=e.sections[n];if(o&&o.id===r)return!0}if(e.sectionGroups)for(var n=0;n<e.sectionGroups.length;n++)if(t.sectionExistsInParent(e.sectionGroups[n],r))return!0;return!1},t.getPathFromNotebooksToSection=function(e,r){if(e&&r)for(var n=0;n<e.length;n++){var o=e[n],a=t.getPathFromParentToSection(o,r);if(a)return a}},t.getPathFromParentToSection=function(e,r){if(e&&r){if(e.sections)for(var n=0;n<e.sections.length;n++){var o=e.sections[n];if(r(o))return[e,o]}if(e.sectionGroups)for(var n=0;n<e.sectionGroups.length;n++){var a=e.sectionGroups[n],i=t.getPathFromParentToSection(a,r);if(i)return i.unshift(e),i}}},t.getDepthOfNotebooks=function(e){return e&&0!==e.length?e.map(function(e){return t.getDepthOfParent(e)}).reduce(function(t,e){return Math.max(t,e)}):0},t.getDepthOfParent=function(e){if(!e)return 0;var r=e.sections&&e.sections.length>0,n=r?1:0;if(e.sectionGroups)for(var o=0;o<e.sectionGroups.length;o++)n=Math.max(t.getDepthOfParent(e.sectionGroups[o]),n);return n+1},t}();r.NotebookUtils=n},{}],5:[function(t,e,r){"use strict";var n=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},o=t("./oneNoteApiBase"),a=function(t){function e(e,r,n){void 0===r&&(r=3e4),void 0===n&&(n={}),t.call(this,e,r,n)}return n(e,t),e.prototype.createNotebook=function(t){var e=JSON.stringify({name:t});return this.requestPromise(this.getNotebooksUrl(),e)},e.prototype.createPage=function(t,e){var r=e?"/sections/"+e:"",n=r+"/pages",o=t.getTypedFormData();return this.requestPromise(n,o.asBlob(),o.getContentType())},e.prototype.sendBatchRequest=function(t){return this.enableBetaApi(),this.requestBasePromise("/$batch",t.getRequestBody(),t.getContentType(),"POST").then(this.disableBetaApi.bind(this))},e.prototype.getPage=function(t){var e="/pages/"+t;return this.requestPromise(e)},e.prototype.getPageContent=function(t){var e="/pages/"+t+"/content";return this.requestPromise(e)},e.prototype.getPages=function(t){var e="/pages";return t.top>0&&t.top===Math.floor(t.top)&&(e+="?top="+t.top),t.sectionId&&(e="/sections/"+t.sectionId+e),this.requestPromise(e)},e.prototype.updatePage=function(t,e){var r="/pages/"+t,n=r+"/content";return this.requestPromise(n,JSON.stringify(e),"application/json","PATCH")},e.prototype.createSection=function(t,e){var r={name:e},n=JSON.stringify(r);return this.requestPromise("/notebooks/"+t+"/sections/",n)},e.prototype.getNotebooks=function(t){return void 0===t&&(t=!0),this.requestPromise(this.getNotebooksUrl(null,t))},e.prototype.getNotebooksWithExpandedSections=function(t,e){return void 0===t&&(t=2),void 0===e&&(e=!0),this.requestPromise(this.getNotebooksUrl(t,e))},e.prototype.getNotebookByName=function(t){return this.requestPromise("/notebooks?filter=name%20eq%20%27"+encodeURI(t)+"%27&orderby=createdTime")},e.prototype.pagesSearch=function(t){return this.requestPromise(this.getSearchUrl(t))},e.prototype.getExpands=function(t){if(t<=0)return"";var e="$expand=sections,sectionGroups";return 1===t?e:e+"("+this.getExpands(t-1)+")"},e.prototype.getNotebooksUrl=function(t,e){void 0===t&&(t=0),void 0===e&&(e=!0);var r=e?"$filter=userRole%20ne%20Microsoft.OneNote.Api.UserRole'Reader'":"";return"/notebooks?"+r+(t?"&"+this.getExpands(t):"")},e.prototype.getSearchUrl=function(t){return"/pages?search="+t},e.prototype.enableBetaApi=function(){this.useBetaApi=!0},e.prototype.disableBetaApi=function(){this.useBetaApi=!1},e}(o.OneNoteApiBase);r.OneNoteApi=a;var i=t("./contentType");r.ContentType=i.ContentType;var s=t("./oneNotePage");r.OneNotePage=s.OneNotePage;var u=t("./batchRequest");r.BatchRequest=u.BatchRequest;var p=t("./errorUtils");r.ErrorUtils=p.ErrorUtils,r.RequestErrorType=p.RequestErrorType;var c=t("./notebookUtils");r.NotebookUtils=c.NotebookUtils},{"./batchRequest":1,"./contentType":2,"./errorUtils":3,"./notebookUtils":4,"./oneNoteApiBase":6,"./oneNotePage":7}],6:[function(t,e,r){"use strict";var n=t("./errorUtils"),o=t("content-type"),a=function(){function t(t,e,r){void 0===r&&(r={}),this.useBetaApi=!1,this.token=t,this.timeout=e,this.headers=r}return t.prototype.requestBasePromise=function(t,e,r,n){var o=this.generateFullBaseUrl(t);return null===r&&(r="application/json"),this.makeRequest(o,e,r,n)},t.prototype.requestPromise=function(t,e,r,n){var o=this,a=this.generateFullUrl(t);return null===r&&(r="application/json"),new Promise(function(t,i){o.makeRequest(a,e,r,n).then(function(e){t(e)},function(t){i(t)})})},t.prototype.generateFullBaseUrl=function(t){var e=this.useBetaApi?"https://www.onenote.com/api/beta":"https://www.onenote.com/api/v1.0";return e+t},t.prototype.generateFullUrl=function(t){var e=this.useBetaApi?"https://www.onenote.com/api/beta/me/notes":"https://www.onenote.com/api/v1.0/me/notes";return e+t},t.prototype.makeRequest=function(e,r,a,i){var s=this;return new Promise(function(u,p){var c,f=new XMLHttpRequest;c=i?i:r?"POST":"GET",f.open(c,e),f.timeout=s.timeout,f.onload=function(){if(200===f.status||201===f.status||204===f.status)try{var t={type:""};try{t=o.parse(f.getResponseHeader("Content-Type"))}catch(e){}var r=f.response;switch(t.type){case"application/json":r=JSON.parse(f.response?f.response:"{}");break;case"text/html":default:r=f.response}u({parsedResponse:r,request:f})}catch(a){p(n.ErrorUtils.createRequestErrorObject(f,n.RequestErrorType.UNABLE_TO_PARSE_RESPONSE))}else p(n.ErrorUtils.createRequestErrorObject(f,n.RequestErrorType.UNEXPECTED_RESPONSE_STATUS))},f.onerror=function(){p(n.ErrorUtils.createRequestErrorObject(f,n.RequestErrorType.NETWORK_ERROR))},f.ontimeout=function(){p(n.ErrorUtils.createRequestErrorObject(f,n.RequestErrorType.REQUEST_TIMED_OUT))},a&&f.setRequestHeader("Content-Type",a),f.setRequestHeader("Authorization","Bearer "+s.token),t.addHeadersToRequest(f,s.headers),f.send(r)})},t.addHeadersToRequest=function(t,e){if(e)for(var r in e)e.hasOwnProperty(r)&&t.setRequestHeader(r,e[r])},t}();r.OneNoteApiBase=a},{"./errorUtils":3,"content-type":9}],7:[function(t,e,r){"use strict";var n=t("./typedFormData"),o=function(){function t(t,e,r,n){void 0===t&&(t=""),void 0===e&&(e=""),void 0===r&&(r="en-us"),void 0===n&&(n=void 0),this.dataParts=[],this.title=t,this.presentationBody=e,this.locale=r,this.pageMetadata=n}return t.prototype.getEntireOnml=function(){return'<html xmlns="http://www.w3.org/1999/xhtml" lang='+this.locale+">"+this.getHeadAsHtml()+"<body>"+this.presentationBody+"</body></html>"},t.prototype.getHeadAsHtml=function(){var t=this.getPageMetadataAsHtml(),e=this.formUtcOffsetString(new Date);return"<head><title>"+this.escapeHtmlEntities(this.title)+'</title><meta name="created" content="'+e+' ">'+t+"</head>"},t.prototype.getPageMetadataAsHtml=function(){var t="";if(this.pageMetadata)for(var e in this.pageMetadata)t+='<meta name="'+e+'" content="'+this.escapeHtmlEntities(this.pageMetadata[e])+'" />';return t},t.prototype.formUtcOffsetString=function(t){var e=t.getTimezoneOffset(),r=e>=0?"-":"+";e=Math.abs(e);var n=Math.floor(e/60)+"",o=Math.round(e%60)+"";return parseInt(n,10)<10&&(n="0"+n),parseInt(o,10)<10&&(o="0"+o),r+n+":"+o},t.prototype.generateMimePartName=function(t){return t+Math.floor(1e4*Math.random()).toString()},t.prototype.escapeHtmlEntities=function(t){var e=document.createElement("div");return e.innerText=t,e.innerHTML},t.prototype.getTypedFormData=function(){var t=new n.TypedFormData;t.append("Presentation",this.getEntireOnml(),"application/xhtml+xml");for(var e=0;e<this.dataParts.length;e++){var r=this.dataParts[e];t.append(r.name,r.content,r.type)}return t},t.prototype.addOnml=function(t){this.presentationBody+=t},t.prototype.addHtml=function(t){var e=this.generateMimePartName("Html");return this.dataParts.push({content:t,name:e,type:"text/HTML"}),this.addOnml('<img data-render-src="name:'+e+'"/>'),e},t.prototype.addImage=function(t){this.addOnml('<img src="'+t+'"/>')},t.prototype.addObjectUrlAsImage=function(t){this.addOnml('<img data-render-src="'+t+'"/>')},t.prototype.addAttachment=function(t,e){var r=this.generateMimePartName("Attachment");return this.dataParts.push({content:t,name:r,type:"application/pdf"}),this.addOnml('<object data-attachment="'+e+'" data="name:'+r+'" type="application/pdf" />'),r},t.prototype.addUrl=function(t){this.addOnml('<div data-render-src="'+t+'" data-render-method="extract" data-render-fallback="none"></div>')},t.prototype.addCitation=function(t,e,r){this.addOnml(t.replace("{0}",'<a href="'+(r?r:e)+'">'+e+"</a>"))},t}();r.OneNotePage=o},{"./typedFormData":8}],8:[function(t,e,r){"use strict";var n=function(){function t(){this.contentTypeMultipart="multipart/form-data; boundary=",this.dataParts=[],this.boundaryName="OneNoteTypedDataBoundary"+Math.floor(1e3*Math.random())}return t.prototype.getContentType=function(){return this.contentTypeMultipart+this.boundaryName},t.prototype.append=function(t,e,r){this.dataParts.push({content:e,name:t,type:r})},t.prototype.asBlob=function(){for(var t="--"+this.boundaryName,e=[t],r=0;r<this.dataParts.length;r++){var n=this.dataParts[r],o="\r\nContent-Type: "+n.type+'\r\nContent-Disposition: form-data; name="'+n.name+'"\r\n\r\n';e.push(o),e.push(n.content),e.push("\r\n"+t)}return e.push("--\r\n"),new Blob(e)},t}();r.TypedFormData=n},{}],9:[function(t,e,r){/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
"use strict";function n(t){if(!t||"object"!=typeof t)throw new TypeError("argument obj is required");var e=t.parameters,r=t.type;if(!r||!h.test(r))throw new TypeError("invalid type");var n=r;if(e&&"object"==typeof e)for(var o,a=Object.keys(e).sort(),s=0;s<a.length;s++){if(o=a[s],!c.test(o))throw new TypeError("invalid parameter name");n+="; "+o+"="+i(e[o])}return n}function o(t){if(!t)throw new TypeError("argument string is required");if("object"==typeof t&&(t=a(t),"string"!=typeof t))throw new TypeError("content-type header is missing from object");if("string"!=typeof t)throw new TypeError("argument string is required to be a string");var e=t.indexOf(";"),r=e!==-1?t.substr(0,e).trim():t.trim();if(!h.test(r))throw new TypeError("invalid media type");var n,o,i,p=new s(r.toLowerCase());for(u.lastIndex=e;o=u.exec(t);){if(o.index!==e)throw new TypeError("invalid parameter format");e+=o[0].length,n=o[1].toLowerCase(),i=o[2],'"'===i[0]&&(i=i.substr(1,i.length-2).replace(f,"$1")),p.parameters[n]=i}if(e!==-1&&e!==t.length)throw new TypeError("invalid parameter format");return p}function a(t){return"function"==typeof t.getHeader?t.getHeader("content-type"):"object"==typeof t.headers?t.headers&&t.headers["content-type"]:void 0}function i(t){var e=String(t);if(c.test(e))return e;if(e.length>0&&!p.test(e))throw new TypeError("invalid parameter value");return'"'+e.replace(d,"\\$1")+'"'}function s(t){this.parameters=Object.create(null),this.type=t}var u=/; *([!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+) */g,p=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,c=/^[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+$/,f=/\\([\u000b\u0020-\u00ff])/g,d=/([\\"])/g,h=/^[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+\/[!#$%&'\*\+\-\.\^_`\|~0-9A-Za-z]+$/;r.format=n,r.parse=o},{}]},{},[5])(5)});