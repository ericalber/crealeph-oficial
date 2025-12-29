type PlaybookInput = {
  robot: any;
  fusion: any;
  ideator: any;
  marketTwin: any;
};

export function generatePlaybook(_input: PlaybookInput) {
  return {
    funnels: {
      cold: {
        angles: ["Trust", "Speed"],
        creatives: ["UGC video", "Before/After"],
      },
      warm: {
        retargeting: ["Site visitors", "Engagers"],
      },
      bof: {
        offer: "15% off first clean",
      },
    },
  };
}
