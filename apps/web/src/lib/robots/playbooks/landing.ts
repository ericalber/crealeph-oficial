type PlaybookInput = {
  robot: any;
  fusion: any;
  ideator: any;
  marketTwin: any;
};

export function generatePlaybook(_input: PlaybookInput) {
  return {
    sections: [
      "Hero",
      "Problem",
      "Proof",
      "How it works",
      "Guarantee",
      "CTA",
    ],
    copyNotes: ["Use transparent pricing", "Highlight punctuality"],
  };
}
