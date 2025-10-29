import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
const fontMap = {
  "𝖺": "a",
  "𝖻": "b",
  "𝖼": "c",
  "𝖽": "d",
  "𝖾": "e",
  "𝖿": "f",
  "𝗀": "g",
  "𝗁": "h",
  "𝗂": "i",
  "𝗃": "j",
  "𝗄": "k",
  "𝗅": "l",
  "𝗆": "m",
  "𝗇": "n",
  "𝗈": "o",
  "𝗉": "p",
  "𝗊": "q",
  "𝗋": "r",
  "𝗌": "s",
  "𝗍": "t",
  "𝗎": "u",
  "𝗏": "v",
  "𝗐": "w",
  "𝗑": "x",
  "𝗒": "y",
  "𝗓": "z",
  "𝖠": "A",
  "𝖡": "B",
  "𝖢": "C",
  "𝖣": "D",
  "𝖤": "E",
  "𝖥": "F",
  "𝖦": "G",
  "𝖧": "H",
  "𝖨": "I",
  "𝖩": "J",
  "𝖪": "K",
  "𝖫": "L",
  "𝖬": "M",
  "𝖭": "N",
  "𝖮": "O",
  "𝖯": "P",
  "𝖰": "Q",
  "𝖱": "R",
  "𝖲": "S",
  "𝖳": "T",
  "𝖴": "U",
  "𝖵": "V",
  "𝖶": "W",
  "𝖷": "X",
  "𝖸": "Y",
  "𝖹": "Z",
};

const censor = new TextCensor();
export default function filterObscenity(text) {
  let replaced = text.replace(/./gu, (c) => fontMap[c] || c);
  const replacedExclaim = replaced.replace(/[!1]/g, "i");
  replaced = matcher.hasMatch(replacedExclaim)
    ? replacedExclaim
    : replaced.replace(/[!1]/g, "");
  replaced = replaced.replace(/[˙•+\-<>()&[\]{}`.,'";:/?0-9@#$%^ ]/g, "");
  // eslint-disable-next-line
  /*.replace(/[^\u0000-\u007F]/g, "");*/
  

  const m = matcher.getAllMatches(replaced);
  return m?.length > 0 ? censor.applyTo(replaced, m) : text;
}
