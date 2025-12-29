type PlaybookInput = {
  robot: any;
  fusion: any;
  ideator: any;
  marketTwin: any;
};

export function generatePlaybook({ robot }: PlaybookInput) {
  const niche = typeof robot?.config?.niche === "string" ? robot.config.niche : "Service";
  return {
    campaigns: [
      {
        name: `High Intent – ${niche}`,
        goal: "Leads",
        structure: {
          adGroups: [
            {
              name: "Deep Cleaning",
              keywords: ["deep cleaning service", "house deep clean"],
              ads: [
                { headline: "Deep Cleaning You Can Trust", description: "Flat-rate. No contracts." },
                { headline: "Book a Deep Clean Today", description: "Reliable team. Clear pricing." },
              ],
            },
            {
              name: "Recurring Service",
              keywords: ["weekly cleaning service", "monthly home cleaning"],
              ads: [
                { headline: "Consistent Cleaning, Zero Stress", description: "Flexible scheduling. Trusted crews." },
              ],
            },
          ],
        },
      },
    ],
  };
}
