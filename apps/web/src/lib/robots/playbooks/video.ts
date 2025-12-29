type PlaybookInput = {
  robot: any;
  fusion: any;
  ideator: any;
  marketTwin: any;
};

export function generatePlaybook(_input: PlaybookInput) {
  return {
    scripts: [
      {
        format: "short",
        hook: "Still wasting weekends cleaning?",
        structure: ["Hook", "Pain", "Solution", "CTA"],
      },
    ],
  };
}
