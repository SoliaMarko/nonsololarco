// Grid columns: ★ · # · title · [band] · key · bpm · status · duration · actions
// "All bands" view includes the band column; specific band view omits it.
//
// The header and the rows are separate grid containers, so every column must
// have an explicit width — `auto` columns would size to their own content and
// the two grids would drift apart.
//
// Column widths are sized for the *longest translation of the header*, not for
// the cell value. The key column holds two characters ("Am") but its header is
// "Тональність" in Ukrainian — at 60px that wrapped to a second line, which
// made the header row taller in one locale and shifted every border below it.
//
// 104px rather than a tight fit: "ТОНАЛЬНІСТЬ" measures ~85px, and the slack
// keeps it from crowding the BPM column next to it. Its content is centred
// (see TrackListHeader / TrackListRow) so the slack sits on both sides.

export const ALL_BANDS_ROW_GRID =
  'grid grid-cols-[16px_1fr_80px_28px] sm:grid-cols-[16px_32px_3fr_2fr_104px_56px_100px_64px_28px] items-center gap-3';

export const SPECIFIC_BAND_ROW_GRID =
  'grid grid-cols-[16px_1fr_80px_28px] sm:grid-cols-[16px_32px_3fr_104px_56px_100px_64px_28px] items-center gap-3';
