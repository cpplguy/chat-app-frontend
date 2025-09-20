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
  const m = matcher.getAllMatches(text);
  return m?.length > 0 ? censor.applyTo(text.replaceAll(/[`.,'";:/?]/g, ""), m) : text;
}
