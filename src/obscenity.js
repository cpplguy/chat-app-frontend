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
  const replaced = text.replaceAll(/[`.,'";:/?]/g,"")
  const m = matcher.getAllMatches(replaced);
  return m?.length > 0 ? censor.applyTo(replaced, m) : text;
}
