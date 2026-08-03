// Grid columns: ★ · # · title · [band] · key · bpm · status · duration · actions
// "All bands" view includes the band column; specific band view omits it.
//
// The header and the rows are separate grid containers, so every column must
// have an explicit width — `auto` columns would size to their own content and
// the two grids would drift apart.

export const ALL_BANDS_ROW_GRID =
  'grid grid-cols-[16px_1fr_80px_28px] sm:grid-cols-[16px_32px_3fr_2fr_60px_40px_100px_64px_28px] items-center gap-3';

export const SPECIFIC_BAND_ROW_GRID =
  'grid grid-cols-[16px_1fr_80px_28px] sm:grid-cols-[16px_32px_3fr_60px_40px_100px_64px_28px] items-center gap-3';
