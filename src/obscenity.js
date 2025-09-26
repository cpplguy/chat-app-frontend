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
  const replaced = text.replaceAll(
    /[-•+<>()& [ \] { }`.,'";:/?\u200B-\u200D\uFEFF\u00A0\u2000-\u200F\u202A-\u202E\u2066-\u2069\u0020 ]/g,
    ""
  );
  const m = matcher.getAllMatches(replaced);
  return m?.length > 0 ? censor.applyTo(replaced, m) : text;
}
