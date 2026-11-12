const fs = require("fs");
const zlib = require("zlib");
const log = [];
function say(x) { log.push(String(x)); }

function ascii85Decode(input) {
  let t = input.replace(/\s/g, "");
  if (t.startsWith("<~")) t = t.slice(2);
  if (t.endsWith("~>")) t = t.slice(0, -2);
  const out = [];
  for (let p = 0; p < t.length; ) {
    if (t[p] === "z") {
      out.push(0, 0, 0, 0);
      p++;
      continue;
    }
    const chunk = t.slice(p, p + 5);
    p += chunk.length;
    let val = 0;
    for (let k = 0; k < 5; k++) {
      val = val * 85 + ((k < chunk.length ? chunk.charCodeAt(k) : 117) - 33);
    }
    const bytes = chunk.length - 1;
    for (let k = 0; k < bytes; k++) out.push((val >>> ((3 - k) * 8)) & 255);
  }
  return Buffer.from(out);
}

say("start");
let b;
try {
b = fs.readFileSync("C:/Users/SG ASUS/Downloads/Aung_Aung_CV_CMC_Global.pdf");
} catch (e) {
  say("read fail " + e.message);
  fs.writeFileSync("C:/AUNGAUNG/portfolio/tmp-pdf-out.txt", log.join("\n"));
  process.exit(1);
}
const s = b.toString("latin1");
say("idx stream " + s.indexOf("stream"));
say("idx stream-n " + s.indexOf("stream\n"));
say("idx stream-r " + s.indexOf("stream\r"));
say("slice " + JSON.stringify(s.slice(2140, 2220)));
let search = 0;
let n = 0;
try {
while (true) {
  const start = s.indexOf("stream", search);
  if (start < 0) break;
  const end = s.indexOf("endstream", start);
  say("hit start " + start + " end " + end);
  if (end < 0) break;
  const header = s.slice(Math.max(0, start - 120), start);
  let contentStart = start + 6;
  if (s[contentStart] === "\r") contentStart++;
  if (s[contentStart] === "\n") contentStart++;
  let data = Buffer.from(s.slice(contentStart, end).replace(/\r?\n$/, ""), "latin1");
  n++;
  say("\n======== STREAM " + n + " bytes " + data.length + " ========");
  say("HEADER " + header.replace(/\s+/g, " "));
  if (header.includes("ASCII85Decode")) data = ascii85Decode(data.toString("latin1"));
  if (header.includes("FlateDecode")) {
    try {
      data = zlib.inflateSync(data);
    } catch (e) {
      say("inflate failed " + e.message);
    }
  }
  const text = data.toString("utf8");
  const readable = text.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ");
  say(readable);
  search = end + 9;
}
} catch (e) {
  say("loop fail " + e.stack);
}
say("streams found " + n + " pdf bytes " + b.length);
fs.writeFileSync("C:/AUNGAUNG/portfolio/tmp-pdf-out.txt", log.join("\n"));
