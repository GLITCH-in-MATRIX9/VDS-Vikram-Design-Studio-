const RESERVED_KEYS = ["hero", "metrics", "sections"];

/* ---------- TYPES ---------- */
type ParagraphInput = {
  id?: number;
  text?: string;
};

type CarouselCardInput = {
  id?: number;
  img_src?: string;
  text?: string;
  project_name?: string;
  project_location?: string;
};

type SectionInput = {
  heading?: string;
  paragraphs?: ParagraphInput[];
  carousel_cards?: CarouselCardInput[];
};

/* ---------- NORMALIZER ---------- */
export const normalizeSections = (
  sections: Record<string, SectionInput>
): Record<
  string,
  {
    heading: string;
    paragraphs: { id: number; text: string }[];
    carousel_cards: {
      id: number;
      img_src?: string;
      text?: string;
      project_name?: string;
      project_location?: string;
    }[];
  }
> => {
  const normalized: Record<string, any> = {};

  Object.entries(sections || {}).forEach(([key, section]) => {
    // BLOCK RESERVED KEYS
    if (RESERVED_KEYS.includes(key)) return;

    normalized[key] = {
      heading: section.heading || "",
      paragraphs: Array.isArray(section.paragraphs)
        ? section.paragraphs.map((p: ParagraphInput) => ({
            id: p.id ?? Date.now(),
            text: p.text || "",
          }))
        : [],
      carousel_cards: Array.isArray(section.carousel_cards)
        ? section.carousel_cards.map((c: CarouselCardInput) => ({
            id: c.id ?? Date.now(),
            img_src: c.img_src,
            text: c.text,
            project_name: c.project_name,
            project_location: c.project_location,
          }))
        : [],
    };
  });

  return normalized;
};
