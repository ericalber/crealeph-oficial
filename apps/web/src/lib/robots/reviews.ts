export async function harvestReviewsForCompetitor({
  name,
  url,
  reviewsUrl,
}: {
  name: string;
  url: string;
  reviewsUrl?: string | null;
}) {
  void name;
  return {
    positives: ["Customers mention punctuality", "Good smell after cleaning"],
    negatives: ["High price perception", "Slow scheduling"],
    themes: ["Speed", "Smell", "Professionalism", "Price"],
    source: reviewsUrl ?? url,
  };
}
