type PlaybookInput = {
  robot: any;
  fusion: any;
  ideator: any;
  marketTwin: any;
};

export function generatePlaybook(_input: PlaybookInput) {
  return {
    pillar: "Professional Cleaning Services",
    clusters: [
      { keyword: "deep cleaning", intent: "commercial" },
      { keyword: "move out cleaning", intent: "commercial" },
      { keyword: "eco friendly cleaning", intent: "informational" },
    ],
  };
}
