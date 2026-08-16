# MAP — project inventory

> **Generated automatically. Do not edit by hand** — changes are overwritten.
> Regenerate with `pnpm ai:map`.
>
> This is the "where is what" reference. Rules live in `CLAUDE.md` and the
> `nonsololarco-conventions` skill; step-by-step task guides in
> [`RECIPES.md`](./RECIPES.md).

Updated: 2026-08-16

## Coverage at a glance

| Category | Total | Tested | With story |
| --- | --- | --- | --- |
| Web components | 164 | 31 (19%) | 27 (16%) |
| Utils + hooks | 19 | 9 (47%) | — |
| API services | 4 | 2 unit / 0 integration | — |

Stories live centrally in `apps/web/stories/` (28 files), not next to components.

## API routes

| Method | Path | Handler | File |
| --- | --- | --- | --- |
| GET | `/api/auth/github` | githubLogin | `apps/api/src/auth/auth.controller.ts` |
| GET | `/api/auth/github/callback` | githubCallback | `apps/api/src/auth/auth.controller.ts` |
| GET | `/api/auth/google` | googleLogin | `apps/api/src/auth/auth.controller.ts` |
| GET | `/api/auth/google/callback` | googleCallback | `apps/api/src/auth/auth.controller.ts` |
| POST | `/api/auth/logout` | logout | `apps/api/src/auth/auth.controller.ts` |
| GET | `/api/auth/me` | getMe | `apps/api/src/auth/auth.controller.ts` |
| GET | `/api/bands/:id/repertoire` | getBandRepertoire | `apps/api/src/repertoire/controllers/band-repertoire.controller.ts` |
| GET | `/api/users/me/bands` | getMyBands | `apps/api/src/bands/bands.controller.ts` |
| GET | `/api/users/me/repertoire` | getMyRepertoire | `apps/api/src/repertoire/controllers/user-repertoire.controller.ts` |
| GET | `/api/users/me/repertoire/solo` | getMySoloRepertoire | `apps/api/src/repertoire/controllers/user-repertoire.controller.ts` |

## API services

| Service | unit | int | File |
| --- | --- | --- | --- |
| auth.service | · | · | `apps/api/src/auth/auth.service.ts` |
| bands.service | ✓ | · | `apps/api/src/bands/bands.service.ts` |
| prisma.service | · | · | `apps/api/src/prisma/prisma.service.ts` |
| repertoire.service | ✓ | · | `apps/api/src/repertoire/repertoire.service.ts` |

## Database

**Models:** `User`, `Account`, `Band`, `BandMember`, `Track`, `TrackPerformer`

**Enums:** `TrackStatus`, `TrackSide`, `MusicalKey`

Schema: `packages/db/prisma/schema.prisma` · Reference: `docs/architecture/data-model.md`

## Shared types (`@nonsololarco/types`)

- `packages/types/src/common/common.types.ts` — `MusicalKey`
- `packages/types/src/common/pagination.types.ts` — `PaginatedResult`
- `packages/types/src/repertoire/band.types.ts` — `Band`, `RepertoireStats`
- `packages/types/src/repertoire/repertoire.types.ts` — `Track`, `TrackBand`, `TrackFilter`, `TrackMember`, `TrackSide`, `TrackStatus`, `TrackSummary`
- `packages/types/src/user/user.types.ts` — `User`

## Web components

Flags: first `✓` = has a unit test, second = has a Storybook story.

### `src/components/auth/`

- `··` **AuthPageLayout** — `apps/web/src/components/auth/AuthPageLayout/AuthPageLayout.tsx`
- `··` **LoginFooter** — `apps/web/src/components/auth/LoginFooter/LoginFooter.tsx`
- `✓·` **LoginHero** — `apps/web/src/components/auth/LoginHero/LoginHero.tsx`
- `✓·` **OAuthButton** — `apps/web/src/components/auth/OAuthButton/OAuthButton.tsx`

### `src/components/form/`

- `·✓` **Input** — `apps/web/src/components/form/Input/Input.tsx`
- `·✓` **Select** — `apps/web/src/components/form/Select/Select.tsx`
- `··` **SelectItem** — `apps/web/src/components/form/Select/SelectItem/SelectItem.tsx`

### `src/components/layout/`

- `··` **AppBottomNav** — `apps/web/src/components/layout/AppShell/AppBottomNav/AppBottomNav.tsx`
- `··` **AppHeaderNav** — `apps/web/src/components/layout/AppShell/AppHeaderNav/AppHeaderNav.tsx`
- `·✓` **AppShell** — `apps/web/src/components/layout/AppShell/AppShell.tsx`

### `src/components/metronome/`

- `✓·` **BeatDots** — `apps/web/src/components/metronome/BeatDots/BeatDots.tsx`
- `✓·` **BpmControl** — `apps/web/src/components/metronome/BpmControl/BpmControl.tsx`
- `✓·` **BpmRuler** — `apps/web/src/components/metronome/BpmControl/BpmRuler/BpmRuler.tsx`
- `✓·` **HistoryDrawer** — `apps/web/src/components/metronome/HistoryDrawer/HistoryDrawer.tsx`
- `✓·` **HistoryGroup** — `apps/web/src/components/metronome/HistoryDrawer/HistoryGroup/HistoryGroup.tsx`
- `✓·` **MetronomeFab** — `apps/web/src/components/metronome/MetronomeFab/MetronomeFab.tsx`
- `✓·` **MetronomeScreen** — `apps/web/src/components/metronome/MetronomeScreen/MetronomeScreen.tsx`
- `✓·` **MetronomeTopBar** — `apps/web/src/components/metronome/MetronomeTopBar/MetronomeTopBar.tsx`
- `✓·` **MetronomeTransport** — `apps/web/src/components/metronome/MetronomeTransport/MetronomeTransport.tsx`
- `✓·` **Pendulum** — `apps/web/src/components/metronome/Pendulum/Pendulum.tsx`
- `✓·` **SongChooser** — `apps/web/src/components/metronome/SongChooser/SongChooser.tsx`
- `✓·` **SigDropdown** — `apps/web/src/components/metronome/TimeSignatureSelect/SigDropdown/SigDropdown.tsx`
- `✓·` **TimeSignatureSelect** — `apps/web/src/components/metronome/TimeSignatureSelect/TimeSignatureSelect.tsx`
- `✓·` **TrackBadge** — `apps/web/src/components/metronome/TrackBadge/TrackBadge.tsx`

### `src/components/profile/`

- `··` **Profile** — `apps/web/src/components/profile/Profile.tsx`
- `··` **ProfileHero** — `apps/web/src/components/profile/ProfileHero/ProfileHero.tsx`
- `··` **MomentCard** — `apps/web/src/components/profile/ProfileMoments/MomentCard/MomentCard.tsx`
- `··` **ProfileMoments** — `apps/web/src/components/profile/ProfileMoments/ProfileMoments.tsx`
- `··` **LeadRow** — `apps/web/src/components/profile/ProfileRepertoire/LeadRow/LeadRow.tsx`
- `··` **ProfileRepertoire** — `apps/web/src/components/profile/ProfileRepertoire/ProfileRepertoire.tsx`
- `··` **WishlistRow** — `apps/web/src/components/profile/ProfileRepertoire/WishlistRow/WishlistRow.tsx`
- `··` **AchievementsSection** — `apps/web/src/components/profile/ProfileSidebar/AchievementsSection/AchievementsSection.tsx`
- `··` **BandRow** — `apps/web/src/components/profile/ProfileSidebar/BandsSection/BandRow/BandRow.tsx`
- `··` **BandsSection** — `apps/web/src/components/profile/ProfileSidebar/BandsSection/BandsSection.tsx`
- `··` **InstrumentsSection** — `apps/web/src/components/profile/ProfileSidebar/InstrumentsSection/InstrumentsSection.tsx`
- `··` **ProfileSidebar** — `apps/web/src/components/profile/ProfileSidebar/ProfileSidebar.tsx`
- `··` **ProfileStats** — `apps/web/src/components/profile/ProfileStats/ProfileStats.tsx`
- `··` **MediaChip** — `apps/web/src/components/profile/shared/MediaChip/MediaChip.tsx`
- `··` **SectionHeader** — `apps/web/src/components/profile/shared/SectionHeader/SectionHeader.tsx`

### `src/components/repertoire/`

- `··` **AddTrackButton** — `apps/web/src/components/repertoire/buttons/AddTrackButton/AddTrackButton.tsx`
- `✓·` **AiButton** — `apps/web/src/components/repertoire/buttons/AiButton/AiButton.tsx`
- `··` **Repertoire** — `apps/web/src/components/repertoire/Repertoire.tsx`
- `··` **FilterPill** — `apps/web/src/components/repertoire/RepertoireFilterBar/FilterPill/FilterPill.tsx`
- `✓·` **RepertoireFilterBar** — `apps/web/src/components/repertoire/RepertoireFilterBar/RepertoireFilterBar.tsx`
- `··` **ActionButtons** — `apps/web/src/components/repertoire/RepertoireHeader/ActionButtons/ActionButtons.tsx`
- `··` **BandStats** — `apps/web/src/components/repertoire/RepertoireHeader/BandStats/BandStats.tsx`
- `··` **BandTabs** — `apps/web/src/components/repertoire/RepertoireHeader/BandTabs/BandTabs.tsx`
- `··` **RepertoireHeader** — `apps/web/src/components/repertoire/RepertoireHeader/RepertoireHeader.tsx`
- `··` **TrackColumnHeader** — `apps/web/src/components/repertoire/TracksTable/TrackListHeader/TrackColumnHeader/TrackColumnHeader.tsx`
- `··` **TrackListHeader** — `apps/web/src/components/repertoire/TracksTable/TrackListHeader/TrackListHeader.tsx`
- `··` **TrackListRow** — `apps/web/src/components/repertoire/TracksTable/TrackListRow/TrackListRow.tsx`
- `··` **TrackListSkeleton** — `apps/web/src/components/repertoire/TracksTable/TrackListSkeleton/TrackListSkeleton.tsx`
- `✓·` **TrackPerformerNames** — `apps/web/src/components/repertoire/TracksTable/TrackPerformerNames/TrackPerformerNames.tsx`
- `··` **TracksTable** — `apps/web/src/components/repertoire/TracksTable/TracksTable.tsx`

### `src/components/shared/`

- `··` **Breadcrumb** — `apps/web/src/components/shared/Breadcrumb/Breadcrumb.tsx`
- `··` **SeeMoreButton** — `apps/web/src/components/shared/buttons/SeeMoreButton/SeeMoreButton.tsx`
- `··` **EmptyState** — `apps/web/src/components/shared/EmptyState/EmptyState.tsx`
- `··` **InstrumentChip** — `apps/web/src/components/shared/InstrumentChip/InstrumentChip.tsx`
- `✓·` **LocaleStamp** — `apps/web/src/components/shared/LocaleSwitcher/LocaleStamp/LocaleStamp.tsx`
- `✓✓` **LocaleSwitcher** — `apps/web/src/components/shared/LocaleSwitcher/LocaleSwitcher.tsx`
- `✓✓` **MetronomeButton** — `apps/web/src/components/shared/MetronomeButton/MetronomeButton.tsx`
- `··` **NoDataCard** — `apps/web/src/components/shared/NoDataCard/NoDataCard.tsx`
- `✓·` **PageLoader** — `apps/web/src/components/shared/PageLoader/PageLoader.tsx`
- `··` **ThemeToggle** — `apps/web/src/components/shared/ThemeToggle/ThemeToggle.tsx`

### `src/components/typography/`

- `·✓` **Heading** — `apps/web/src/components/typography/Heading/Heading.tsx`
- `·✓` **Text** — `apps/web/src/components/typography/Text/Text.tsx`

### `src/components/ui/`

- `·✓` **Avatar** — `apps/web/src/components/ui/Avatar/Avatar.tsx`
- `·✓` **AvatarButton** — `apps/web/src/components/ui/AvatarButton/AvatarButton.tsx`
- `·✓` **Badge** — `apps/web/src/components/ui/Badge/Badge.tsx`
- `·✓` **Button** — `apps/web/src/components/ui/Button/Button.tsx`
- `·✓` **Card** — `apps/web/src/components/ui/Card/Card.tsx`
- `·✓` **Chip** — `apps/web/src/components/ui/Chip/Chip.tsx`
- `·✓` **Divider** — `apps/web/src/components/ui/Divider/Divider.tsx`
- `✓✓` **Dropdown** — `apps/web/src/components/ui/Dropdown/Dropdown.tsx`
- `✓✓` **Logo** — `apps/web/src/components/ui/Logo/Logo.tsx`
- `··` **Lockup** — `apps/web/src/components/ui/Logo/svgs/Lockup.tsx`
- `··` **Mark** — `apps/web/src/components/ui/Logo/svgs/Mark.tsx`
- `··` **Wordmark** — `apps/web/src/components/ui/Logo/svgs/Wordmark.tsx`
- `·✓` **NavLink** — `apps/web/src/components/ui/NavLink/NavLink.tsx`
- `··` **PageArrow** — `apps/web/src/components/ui/Pagination/PageArrow/PageArrow.tsx`
- `··` **PageButton** — `apps/web/src/components/ui/Pagination/PageButton/PageButton.tsx`
- `✓✓` **Pagination** — `apps/web/src/components/ui/Pagination/Pagination.tsx`
- `·✓` **Skeleton** — `apps/web/src/components/ui/Skeleton/Skeleton.tsx`
- `·✓` **Spinner** — `apps/web/src/components/ui/Spinner/Spinner.tsx`
- `✓·` **TabItem** — `apps/web/src/components/ui/Tabs/TabItem/TabItem.tsx`
- `✓✓` **Tabs** — `apps/web/src/components/ui/Tabs/Tabs.tsx`
- `··` **TabsIndicator** — `apps/web/src/components/ui/Tabs/TabsIndicator/TabsIndicator.tsx`
- `✓✓` **Toast** — `apps/web/src/components/ui/Toast/Toast.tsx`

### `src/icons/achievements/`

- `··` **BoltOutlineIcon** — `apps/web/src/icons/achievements/BoltOutlineIcon.tsx`
- `··` **ClockOutlineIcon** — `apps/web/src/icons/achievements/ClockOutlineIcon.tsx`
- `··` **CrownOutlineIcon** — `apps/web/src/icons/achievements/CrownOutlineIcon.tsx`
- `··` **DiamondOutlineIcon** — `apps/web/src/icons/achievements/DiamondOutlineIcon.tsx`
- `··` **FlameOutlineIcon** — `apps/web/src/icons/achievements/FlameOutlineIcon.tsx`
- `··` **HeartOutlineIcon** — `apps/web/src/icons/achievements/HeartOutlineIcon.tsx`
- `··` **StarOutlineIcon** — `apps/web/src/icons/achievements/StarOutlineIcon.tsx`
- `··` **TeamOutlineIcon** — `apps/web/src/icons/achievements/TeamOutlineIcon.tsx`

### `src/icons/base/`

- `··` **ArrowLeftSolidIcon** — `apps/web/src/icons/base/ArrowLeftSolidIcon.tsx`
- `··` **ArrowRightSolidIcon** — `apps/web/src/icons/base/ArrowRightSolidIcon.tsx`
- `··` **BellIcon** — `apps/web/src/icons/base/BellIcon.tsx`
- `··` **CalendarIcon** — `apps/web/src/icons/base/CalendarIcon.tsx`
- `··` **ChatOutlineIcon** — `apps/web/src/icons/base/ChatOutlineIcon.tsx`
- `··` **ChatSolidIcon** — `apps/web/src/icons/base/ChatSolidIcon.tsx`
- `··` **CheckCircleIcon** — `apps/web/src/icons/base/CheckCircleIcon.tsx`
- `··` **CheckSolidIcon** — `apps/web/src/icons/base/CheckSolidIcon.tsx`
- `··` **ChevronIcon** — `apps/web/src/icons/base/ChevronIcon.tsx`
- `··` **CloseCircleIcon** — `apps/web/src/icons/base/CloseCircleIcon.tsx`
- `··` **CloseSolidIcon** — `apps/web/src/icons/base/CloseSolidIcon.tsx`
- `··` **DisconnectOutlineIcon** — `apps/web/src/icons/base/DisconnectOutlineIcon.tsx`
- `··` **DisconnectSolidIcon** — `apps/web/src/icons/base/DisconnectSolidIcon.tsx`
- `··` **DotsIcon** — `apps/web/src/icons/base/DotsIcon.tsx`
- `··` **DownloadIcon** — `apps/web/src/icons/base/DownloadIcon.tsx`
- `··` **EditIcon** — `apps/web/src/icons/base/EditIcon.tsx`
- `··` **EyeOffIcon** — `apps/web/src/icons/base/EyeOffIcon.tsx`
- `··` **GlobeOutlineIcon** — `apps/web/src/icons/base/GlobeOutlineIcon.tsx`
- `··` **HomeOutlineIcon** — `apps/web/src/icons/base/HomeOutlineIcon.tsx`
- `··` **HomeSolidIcon** — `apps/web/src/icons/base/HomeSolidIcon.tsx`
- `··` **ImageIcon** — `apps/web/src/icons/base/ImageIcon.tsx`
- `··` **LinkIcon** — `apps/web/src/icons/base/LinkIcon.tsx`
- `··` **LocationPinIcon** — `apps/web/src/icons/base/LocationPinIcon.tsx`
- `··` **LogOutIcon** — `apps/web/src/icons/base/LogOutIcon.tsx`
- `✓·` **MenuIcon** — `apps/web/src/icons/base/MenuIcon.tsx`
- `··` **MetronomeIcon** — `apps/web/src/icons/base/MetronomeIcon.tsx`
- `··` **MicrophoneIcon** — `apps/web/src/icons/base/MicrophoneIcon.tsx`
- `··` **MinusIcon** — `apps/web/src/icons/base/MinusIcon.tsx`
- `··` **MoonOutlineIcon** — `apps/web/src/icons/base/MoonOutlineIcon.tsx`
- `··` **NotesIcon** — `apps/web/src/icons/base/NotesIcon.tsx`
- `··` **PauseIcon** — `apps/web/src/icons/base/PauseIcon.tsx`
- `··` **PickIcon** — `apps/web/src/icons/base/PickIcon.tsx`
- `··` **PlayIcon** — `apps/web/src/icons/base/PlayIcon.tsx`
- `··` **PlusSolidIcon** — `apps/web/src/icons/base/PlusSolidIcon.tsx`
- `··` **ProfileOutlineIcon** — `apps/web/src/icons/base/ProfileOutlineIcon.tsx`
- `··` **ProfileSolidIcon** — `apps/web/src/icons/base/ProfileSolidIcon.tsx`
- `··` **RepertoireIcon** — `apps/web/src/icons/base/RepertoireIcon.tsx`
- `··` **SaveIcon** — `apps/web/src/icons/base/SaveIcon.tsx`
- `··` **SearchOutlineIcon** — `apps/web/src/icons/base/SearchOutlineIcon.tsx`
- `··` **SearchSolidIcon** — `apps/web/src/icons/base/SearchSolidIcon.tsx`
- `··` **SettingsOutlineIcon** — `apps/web/src/icons/base/SettingsOutlineIcon.tsx`
- `··` **SettingsSolidIcon** — `apps/web/src/icons/base/SettingsSolidIcon.tsx`
- `··` **ShareOutlineIcon** — `apps/web/src/icons/base/ShareOutlineIcon.tsx`
- `··` **ShareSolidIcon** — `apps/web/src/icons/base/ShareSolidIcon.tsx`
- `··` **SortIcon** — `apps/web/src/icons/base/SortIcon.tsx`
- `··` **SunOutlineIcon** — `apps/web/src/icons/base/SunOutlineIcon.tsx`
- `··` **TrashIcon** — `apps/web/src/icons/base/TrashIcon.tsx`
- `··` **UploadIcon** — `apps/web/src/icons/base/UploadIcon.tsx`
- `··` **VinylIcon** — `apps/web/src/icons/base/VinylIcon.tsx`

### `src/icons/brand/`

- `··` **GithubIcon** — `apps/web/src/icons/brand/GithubIcon.tsx`
- `··` **GoogleIcon** — `apps/web/src/icons/brand/GoogleIcon.tsx`

### `src/icons/colorful/`

- `··` **BouquetIcon** — `apps/web/src/icons/colorful/BouquetIcon.tsx`
- `··` **FireIcon** — `apps/web/src/icons/colorful/FireIcon.tsx`
- `··` **MusicPlantIcon** — `apps/web/src/icons/colorful/MusicPlantIcon.tsx`
- `··` **PianoKeysIcon** — `apps/web/src/icons/colorful/PianoKeysIcon.tsx`

### `src/icons/status/`

- `··` **EighthRestIcon** — `apps/web/src/icons/status/EighthRestIcon.tsx`
- `··` **HalfRestIcon** — `apps/web/src/icons/status/HalfRestIcon.tsx`
- `··` **OnlineIcon** — `apps/web/src/icons/status/OnlineIcon.tsx`
- `··` **QuarterRestIcon** — `apps/web/src/icons/status/QuarterRestIcon.tsx`
- `··` **WholeRestIcon** — `apps/web/src/icons/status/WholeRestIcon.tsx`

### `src/illustrations/achievements/`

- `·✓` **AchievementBadge** — `apps/web/src/illustrations/achievements/AchievementBadge/AchievementBadge.tsx`

### `src/illustrations/metronome/`

- `··` **MetronomeArm** — `apps/web/src/illustrations/metronome/VintageMetronome/MetronomeArm/MetronomeArm.tsx`
- `··` **MetronomeScale** — `apps/web/src/illustrations/metronome/VintageMetronome/MetronomeScale/MetronomeScale.tsx`
- `✓✓` **VintageMetronome** — `apps/web/src/illustrations/metronome/VintageMetronome/VintageMetronome.tsx`

### `src/illustrations/picks/`

- `·✓` **MediatorBadge** — `apps/web/src/illustrations/picks/MediatorBadge/MediatorBadge.tsx`

### `src/illustrations/vinyl/`

- `··` **DiscIllustration** — `apps/web/src/illustrations/vinyl/VinylRecord/DiscIllustration.tsx`
- `·✓` **VinylRecord** — `apps/web/src/illustrations/vinyl/VinylRecord/VinylRecord.tsx`

### `src/illustrations/vinyl-crate/`

- `·✓` **VinylCrate** — `apps/web/src/illustrations/vinyl-crate/VinylCrate.tsx`

## Utils, hooks, queries

| T | Kind | Name | File |
| --- | --- | --- | --- |
| · | hook | useActiveBand | `apps/web/src/hooks/global/useActiveBand/useActiveBand.tsx` |
| · | hook | useAuth | `apps/web/src/hooks/global/useAuth/useAuth.tsx` |
| · | hook | useBandColors | `apps/web/src/hooks/global/useBandColors/useBandColors.tsx` |
| · | hook | useTheme | `apps/web/src/hooks/global/useTheme/useTheme.tsx` |
| ✓ | hook | useLockedHeight | `apps/web/src/hooks/useLockedHeight/useLockedHeight.ts` |
| ✓ | hook | useMetronomeClicker | `apps/web/src/hooks/useMetronomeClicker/useMetronomeClicker.ts` |
| ✓ | hook | useMetronomeEngine | `apps/web/src/hooks/useMetronomeEngine/useMetronomeEngine.ts` |
| ✓ | hook | useTapTempo | `apps/web/src/hooks/useTapTempo/useTapTempo.ts` |
| · | query | useBands | `apps/web/src/lib/hooks/useBands.ts` |
| · | query | useRepertoire | `apps/web/src/lib/hooks/useRepertoire.ts` |
| ✓ | util | audio.utils | `apps/web/src/utils/audio.utils.ts` |
| · | util | cn | `apps/web/src/utils/cn.ts` |
| · | util | duration.utils | `apps/web/src/utils/duration.utils.ts` |
| ✓ | util | metronome.utils | `apps/web/src/utils/metronome.utils.ts` |
| ✓ | util | pagination.utils | `apps/web/src/utils/pagination.utils.ts` |
| · | util | svg.utils | `apps/web/src/utils/svg.utils.ts` |
| ✓ | util | track-performers.utils | `apps/web/src/utils/track-performers.utils.ts` |
| · | util | tracks-sort.utils | `apps/web/src/utils/tracks-sort.utils.ts` |
| ✓ | util | vinyl.utils | `apps/web/src/utils/vinyl.utils.ts` |

## Stories without a matching component

Either the story covers several components, or the component was renamed.

- **Icons** — `apps/web/stories/icons/Icons.stories.tsx`

## Translations

| Namespace | en | it | uk |
| --- | --- | --- | --- |
| auth.json | 14 | 14 | 14 |
| common.json | 26 | 26 | 26 |
| pages.json | 133 | 133 | 133 |

⚠ = key count differs from `en`. English is the source of truth, so a
mismatch means a missing key — that is a bug, not a fallback.
