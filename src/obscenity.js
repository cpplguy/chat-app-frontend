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
const censor = new TextCensor();
export default function filterObscenity(text) {
  
  let replaced = text
    .replace(/[˙•+\-<>()&[\]{}`.,'";:/?0-9@#$%^ ]/g, "")
    // eslint-disable-next-line
    .replace(/[^\u0000-\u007F]/g, "");
  const replacedExclaim = replaced.replace(/[!1]/g, "i");
  replaced = matcher.hasMatch(replacedExclaim)
    ? replacedExclaim
    : replaced.replace(/[!1]/g, "");

  const m = matcher.getAllMatches(replaced);
  return m?.length > 0 ? censor.applyTo(replaced, m) : text;
}
