import{j as e}from"./charts-L6FsWgqu.js";import{r as T}from"./vendor-l9rrfVDV.js";import{c as F,u as R,a as C,R as H,F as E,d as P,L as A,b as L,g as z}from"./index-CsV4c2pm.js";import{u as G}from"./useWeatherData-Ci3RhHcR.js";import{c as S}from"./windowCalculator-C9UUcMc3.js";import{a as k}from"./dateUtils-C0Z1jtkc.js";import{C as N}from"./Card-mKvuYzky.js";import{E as U}from"./ErrorMessage-cUXnMwDz.js";import"./cacheService-CRyDOt_3.js";import"./alert-circle-BzvAsrgg.js";/**
 * @license lucide-react v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=F("FileSpreadsheet",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M14 17h2",key:"10kma7"}]]);/**
 * @license lucide-react v0.309.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=F("Printer",[["polyline",{points:"6 9 6 2 18 2 18 9",key:"1306q4"}],["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["rect",{width:"12",height:"8",x:"6",y:"14",key:"5ipwut"}]]),$=(a,p="export.csv")=>{if(!a||!a.length)return;const t=Object.keys(a[0]),o=[t.join(","),...a.map(i=>t.map(x=>{const c=i[x];if(c==null)return"";const m=String(c);return m.includes(",")||m.includes('"')||m.includes(`
`)?`"${m.replace(/"/g,'""')}"`:m}).join(","))],d=new Blob([o.join(`
`)],{type:"text/csv;charset=utf-8;"});_(d,p)},D=(a,p)=>{if(!(a!=null&&a.length))return;const t=a.map(d=>{var i,x,c,m,h,v,f;return{"Time (UTC)":k(d.time,"yyyy-MM-dd HH:mm"),"Wave Height (m)":((i=d.waveHeight)==null?void 0:i.toFixed(2))??"","Swell Height (m)":((x=d.swellHeight)==null?void 0:x.toFixed(2))??"","Wave Period (s)":((c=d.wavePeriod)==null?void 0:c.toFixed(1))??"","Wind Speed (m/s)":((m=d.windSpeed)==null?void 0:m.toFixed(1))??"","Wind Gusts (m/s)":((h=d.windGusts)==null?void 0:h.toFixed(1))??"","Wind Direction (°)":d.windDirection??"","Temperature (°C)":((v=d.temperature)==null?void 0:v.toFixed(1))??"","Pressure (hPa)":((f=d.pressure)==null?void 0:f.toFixed(1))??"","Visibility (m)":d.visibility??""}}),o=k(new Date,"yyyy-MM-dd");$(t,`weather-forecast-${p}-${o}.csv`)},V=(a,p,t)=>{var m,h,v,f,w,j,s;if(!((m=a==null?void 0:a.hourly)!=null&&m.length))return;const o=a.hourly[0],d=k(new Date,"MMMM d, yyyy HH:mm"),i=[];for(let r=0;r<a.hourly.length;r+=24){const l=a.hourly.slice(r,r+24);if(!l.length)break;const g=l.map(n=>n.waveHeight).filter(n=>n!=null),b=l.map(n=>n.windSpeed).filter(n=>n!=null),u=l.map(n=>n.temperature).filter(n=>n!=null);i.push({date:k(l[0].time,"EEE, MMM d"),maxWave:g.length?Math.max(...g).toFixed(1):"N/A",minWave:g.length?Math.min(...g).toFixed(1):"N/A",maxWind:b.length?Math.max(...b).toFixed(1):"N/A",avgTemp:u.length?(u.reduce((n,y)=>n+y,0)/u.length).toFixed(1):"N/A"})}const x=`
<!DOCTYPE html>
<html>
<head>
  <title>Weather Report - ${p}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    h2 { font-size: 16px; margin-top: 24px; margin-bottom: 8px; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; }
    .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
    .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .stat-label { font-size: 11px; color: #64748b; }
    .stat-value { font-size: 20px; font-weight: 600; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th { text-align: left; padding: 8px; background: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: 600; }
    td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
    tr:hover td { background: #f8fafc; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Weather Forecast Report</h1>
  <p class="meta">${p} | Generated: ${d} UTC | Source: Open-Meteo</p>

  <h2>Current Conditions</h2>
  <div class="grid">
    <div class="stat"><div class="stat-label">Wave Height</div><div class="stat-value">${((h=o.waveHeight)==null?void 0:h.toFixed(1))??"N/A"} m</div></div>
    <div class="stat"><div class="stat-label">Wind Speed</div><div class="stat-value">${((v=o.windSpeed)==null?void 0:v.toFixed(1))??"N/A"} m/s</div></div>
    <div class="stat"><div class="stat-label">Temperature</div><div class="stat-value">${((f=o.temperature)==null?void 0:f.toFixed(1))??"N/A"} °C</div></div>
    <div class="stat"><div class="stat-label">Swell Height</div><div class="stat-value">${((w=o.swellHeight)==null?void 0:w.toFixed(1))??"N/A"} m</div></div>
    <div class="stat"><div class="stat-label">Wind Gusts</div><div class="stat-value">${((j=o.windGusts)==null?void 0:j.toFixed(1))??"N/A"} m/s</div></div>
    <div class="stat"><div class="stat-label">Pressure</div><div class="stat-value">${((s=o.pressure)==null?void 0:s.toFixed(0))??"N/A"} hPa</div></div>
  </div>

  <h2>7-Day Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Wave Min (m)</th>
        <th>Wave Max (m)</th>
        <th>Max Wind (m/s)</th>
        <th>Avg Temp (°C)</th>
      </tr>
    </thead>
    <tbody>
      ${i.map(r=>`
      <tr>
        <td>${r.date}</td>
        <td>${r.minWave}</td>
        <td>${r.maxWave}</td>
        <td>${r.maxWind}</td>
        <td>${r.avgTemp}</td>
      </tr>`).join("")}
    </tbody>
  </table>

  <div class="footer">
    <p>OffshoreWatch - Global Offshore Operations Weather & Safety Planning Platform</p>
    <p>This report is generated from Open-Meteo forecast data and is for planning purposes only.</p>
  </div>
</body>
</html>`,c=window.open("","_blank");c&&(c.document.write(x),c.document.close(),setTimeout(()=>c.print(),500))},_=(a,p)=>{const t=URL.createObjectURL(a),o=document.createElement("a");o.href=t,o.download=p,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(t)},Y=[{key:"weather",name:"Weather Forecast Report",description:"Current conditions and 7-day marine/atmospheric forecast.",icon:L,formats:["pdf","csv"]},{key:"operations",name:"Operations Window Report",description:"Weather windows for all operation types with go/no-go assessment.",icon:z,formats:["csv"]}],W={helicopterOps:"Helicopter Operations",craneLift:"Crane Lift",divingOps:"Diving Operations",rigMove:"Rig Move",personnelTransferBoat:"Personnel Transfer (Boat)",personnelTransferW2W:"Personnel Transfer (W2W)"},ie=()=>{var w,j;const{state:a}=R(),{settings:p}=C(),t=H[a.currentRegion],[o,d]=(t==null?void 0:t.center)||[27.5,-90.5],{data:i,isLoading:x,error:c,refetch:m}=G(o,d),[h,v]=T.useState(null),f=(s,r)=>{if(i!=null&&i.hourly){v(`${s}-${r}`);try{if(s==="weather"&&r==="csv")D(i.hourly,(t==null?void 0:t.shortName)||"region");else if(s==="weather"&&r==="pdf")V(i,(t==null?void 0:t.name)||"Region",p.thresholds);else if(s==="operations"&&r==="csv"){const l=Object.keys(W),g=[];l.forEach(u=>{S(i.hourly,p.thresholds,u).forEach((y,M)=>{g.push({"Operation Type":W[u],"Window #":M+1,"Start Time":y.startTime,"End Time":y.endTime,"Duration (hours)":y.durationHours})})});const b=new Date().toISOString().split("T")[0];if(g.length>0)$(g,`operations-windows-${(t==null?void 0:t.shortName)||"region"}-${b}.csv`);else{const u=l.map(n=>{const y=S(i.hourly,p.thresholds,n);return{"Operation Type":W[n],"Windows Found":y.length,"Total Hours":y.reduce((M,O)=>M+O.durationHours,0)}});$(u,`operations-summary-${(t==null?void 0:t.shortName)||"region"}-${b}.csv`)}}}catch(l){console.error("Export error:",l)}setTimeout(()=>v(null),1e3)}};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-start justify-between flex-wrap gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(E,{className:"w-8 h-8 text-primary-600"}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Reports"}),e.jsxs("p",{className:"text-gray-600",children:["Generate and export weather and operations reports for ",t==null?void 0:t.name]})]})]}),e.jsx("button",{onClick:m,disabled:x,className:"p-2 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50",children:e.jsx(P,{className:`w-5 h-5 ${x?"animate-spin":""}`})})]}),x?e.jsx(A,{message:"Loading data for report generation..."}):c?e.jsx(U,{error:c,onRetry:m}):i?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"space-y-4",children:Y.map(s=>{const r=s.icon;return e.jsx(N,{children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"p-3 bg-primary-50 rounded-lg",children:e.jsx(r,{className:"w-6 h-6 text-primary-600"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-900",children:s.name}),e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:s.description}),e.jsxs("div",{className:"flex flex-wrap gap-2 mt-3",children:[s.formats.includes("pdf")&&e.jsxs("button",{onClick:()=>f(s.key,"pdf"),disabled:h===`${s.key}-pdf`,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50",children:[e.jsx(I,{className:"w-4 h-4"}),h===`${s.key}-pdf`?"Generating...":"PDF / Print"]}),s.formats.includes("csv")&&e.jsxs("button",{onClick:()=>f(s.key,"csv"),disabled:h===`${s.key}-csv`,className:"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50",children:[e.jsx(B,{className:"w-4 h-4"}),h===`${s.key}-csv`?"Exporting...":"CSV Export"]})]})]})]})},s.key)})}),e.jsx(N,{title:"Data Summary",subtitle:"Overview of available data for export",children:e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"p-3 bg-gray-50 rounded-lg",children:[e.jsx("p",{className:"text-xs text-gray-500",children:"Forecast Hours"}),e.jsx("p",{className:"text-lg font-semibold text-gray-900",children:((w=i.hourly)==null?void 0:w.length)||0})]}),e.jsxs("div",{className:"p-3 bg-gray-50 rounded-lg",children:[e.jsx("p",{className:"text-xs text-gray-500",children:"Forecast Days"}),e.jsx("p",{className:"text-lg font-semibold text-gray-900",children:Math.ceil((((j=i.hourly)==null?void 0:j.length)||0)/24)})]}),e.jsxs("div",{className:"p-3 bg-gray-50 rounded-lg",children:[e.jsx("p",{className:"text-xs text-gray-500",children:"Data Source"}),e.jsx("p",{className:"text-lg font-semibold text-gray-900",children:"Open-Meteo"})]})]})}),e.jsx(N,{title:"Operations Windows Summary",subtitle:"Quick overview of available windows by operation type",children:e.jsx("div",{className:"space-y-2",children:Object.entries(W).map(([s,r])=>{const l=S(i.hourly,p.thresholds,s),g=l.reduce((b,u)=>b+u.durationHours,0);return e.jsxs("div",{className:"flex items-center justify-between py-2 border-b border-gray-100 last:border-0",children:[e.jsx("span",{className:"text-sm text-gray-700",children:r}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("span",{className:`text-sm font-medium ${l.length>0?"text-green-700":"text-red-600"}`,children:[l.length," window",l.length!==1?"s":""]}),e.jsxs("span",{className:"text-xs text-gray-500",children:[g,"h total"]})]})]},s)})})})]}):e.jsx(N,{children:e.jsx("p",{className:"text-gray-500",children:"No data available. Weather data is needed to generate reports."})})]})};export{ie as default};
