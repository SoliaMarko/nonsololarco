# Recipe: a write endpoint, end to end

`docs/ai/RECIPES.md` §3 covers a read endpoint. This is the longer path — a
write that round-trips from a button to the database and back — broken into
nine commits that each build, test and review on their own.

Worked example: **adding a track to a band's repertoire**,
`POST /bands/:bandId/repertoire`.

> Read `CLAUDE.md` § API conventions first. Method semantics, the error
> contract, fractional ordering and idempotency are decided there; this recipe
> assumes them rather than repeating them.

---

## Why nine commits

One commit would be ~500 lines across 20 files, which is unreviewable and
un-bisectable. Split this way, each commit is a complete thought:

| #   | Commit                                                 | Files | Builds alone |
| --- | ------------------------------------------------------ | ----- | ------------ |
| 1   | `feat(types): add CreateTrackInput contract`           | 1–2   | yes          |
| 2   | `feat(db): <schema change>`                            | 2–3   | yes          |
| 3   | `feat(api): add CreateTrackDto with validation`        | 2     | yes          |
| 4   | `feat(api): add RepertoireService.create`              | 2     | yes          |
| 5   | `test(api): integration test for create`               | 1     | yes          |
| 6   | `feat(api): expose POST /bands/:bandId/repertoire`     | 2     | yes          |
| 7   | `test(api): e2e contract for the create endpoint`      | 1     | yes          |
| 8   | `feat(web): add useCreateTrack with optimistic insert` | 3     | yes          |
| 9   | `feat(web): add track form + docs`                     | 4–6   | yes          |

Skip step 2 when no schema change is needed. Steps 5 and 7 are not optional for
a write — see [why](#5-integration-test).

---

## 1. The contract

Start at `packages/types`, because both apps import it and it forces the shape
to be decided before any implementation leans on a guess.

```ts
// packages/types/src/repertoire/repertoire.types.ts

/** Payload for creating a track. `position` is assigned by the server. */
export interface CreateTrackInput {
  bpm: number;
  musicalKey: MusicalKey;
  side: TrackSide;
  title: string;
  durationSeconds?: number;
  leadMemberId?: string;
  performerIds?: string[];
}
```

Required keys first, then optional, alphabetical inside each group.

**Decide what the server owns and leave it out of the input.** `position`,
`createdAt` and any computed field are not the client's to send. A field the
client cannot set is a field it cannot get wrong.

## 2. Schema and migration

Only when the change needs new columns. Follow `docs/ai/RECIPES.md` §4 —
`db:migrate` **and** `db:generate`, both, every time.

New ordered list? Use a fractional `position String`, never an integer `order`
column. `CLAUDE.md` § Ordering explains why, and the client sends neighbours
rather than a computed key.

## 3. DTO and validation

```ts
// apps/api/src/repertoire/dto/create-track.dto.ts
export class CreateTrackDto {
  @ApiProperty({ example: 'Yard in the fog' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ enum: MusicalKeyEnum })
  @IsEnum(MusicalKeyEnum)
  musicalKey!: MusicalKeyEnum;

  @ApiProperty({ example: 120, minimum: 20, maximum: 300 })
  @IsInt()
  @Min(20)
  @Max(300)
  bpm!: number;

  @ApiPropertyOptional({ example: 190 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;
}
```

The global `ValidationPipe` already runs with `whitelist`, `transform` and
`forbidNonWhitelisted`, so an unknown property is rejected rather than ignored.
That is what makes the DTO the security boundary: **anything not declared here
cannot reach the service.**

Bound every number. `bpm` without `@Max` accepts `999999`, and nothing
downstream will question it.

Re-export from `dto/index.ts` in the same commit, or the next one has a
mysterious import.

## 4. The service method

```ts
/**
 * Creates a track in a band's repertoire and returns it in API shape.
 *
 * `position` is assigned server-side as the fractional key after the current
 * last item, so concurrent creates cannot collide on an integer.
 *
 * Throws NotFoundException when the band does not exist. Membership is
 * enforced by the guard on the controller, not here — the service assumes an
 * authorised caller.
 */
async create(
  bandId: string,
  input: CreateTrackDto,
): Promise<Track> { … }
```

**Rules that bite here:**

- **Write the unit spec in the same commit.** Happy path, the empty/zero case,
  and each error branch.
- **One round trip where possible.** Creating a track plus its performers is
  one nested `create`, not a create followed by N inserts.
- **Wrap multi-statement writes in `$transaction`.** A track created without
  its performers is a worse state than no track.
- **Return the mapped API shape**, not the Prisma row. `mapTrack` exists;
  reuse it rather than building a second mapper that will drift.

## 5. Integration test

**Not optional for a write.** A unit test with mocked Prisma proves you called
Prisma the way you intended; it cannot prove the database accepted it. Every
failure mode below is invisible to a mock:

- a unique constraint the input can violate,
- a foreign key pointing at something that does not exist,
- the fractional position actually sorting between its neighbours,
- a cascade deleting more, or less, than expected,
- the Prisma enum round-tripping to its API notation.

```ts
// apps/api/src/repertoire/repertoire.service.int-spec.ts
it('assigns a position after the current last track', async () => {
  const created = await service.create(BAND_QUIET_YARD, { … });
  const list = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA);

  expect(list.data.at(-1)?.id).toBe(created.id);
});

it('rejects a track for a band that does not exist', async () => {
  await expect(service.create('nope', { … })).rejects.toThrow(NotFoundException);
});
```

## 6. The controller

```ts
@Post()
@UseGuards(JwtAuthGuard, BandMembershipGuard)
@ApiOperation({ summary: 'Add a track to a band repertoire' })
@ApiCreatedResponse({ type: TrackDto })
create(
  @Param('bandId') bandId: string,
  @CurrentUser() user: SessionUser,
  @Body() body: CreateTrackDto,
): Promise<Track> {
  return this.repertoireService.create(bandId, body);
}
```

**Authorisation lives here, not in the service.** `JwtAuthGuard` answers "is
this a real user"; a membership guard answers "may this user write to this
band". Putting the second check inside the service means every new caller has
to remember it.

**Pick the method deliberately** — `CLAUDE.md` § Method semantics. If repeating
the call would duplicate a row, either key it naturally or accept an
`Idempotency-Key`. A lost response followed by a retry is a normal event on
mobile, not an edge case.

## 7. E2E contract test

`apps/api/test/`, supertest. This is the layer that proves the guard is wired
up — a unit test of the controller has the guard mocked away.

Cover: `201` and the response shape · `400` for invalid input · `401`
unauthenticated · `403` for a non-member · `404` for an unknown band.

**The `403` case is the important one.** Everything else fails loudly; a
missing authorisation check fails silently and correctly-looking.

## 8. Client data layer

```ts
// apps/web/src/lib/api/repertoire.api.ts
export function createTrack(bandId: string, input: CreateTrackInput): Promise<Track>;
```

```ts
// apps/web/src/lib/hooks/useCreateTrack.ts
onMutate: async (input) => {
  await queryClient.cancelQueries({ queryKey: ['repertoire', bandId] });
  const previous = queryClient.getQueryData(['repertoire', bandId]);
  queryClient.setQueryData(['repertoire', bandId], (old) => insert(old, input));
  return { previous };
},
onError: (_e, _input, ctx) =>
  queryClient.setQueryData(['repertoire', bandId], ctx.previous),
onSettled: () => queryClient.invalidateQueries({ queryKey: ['repertoire', bandId] }),
```

Optimistic by default — `CLAUDE.md` § Mutations and cache. Cancelling in-flight
queries first is the step people skip: a response already on the wire otherwise
lands after your optimistic write and silently reverts it.

Skip the optimism only where the server decides the outcome — payment, invite
acceptance, anything the client cannot predict.

## 9. UI, translations, docs

- The form, per `docs/ai/RECIPES.md` §2. Check `MAP.md` first — `Input`,
  `Select` and `Button` already exist.
- **Error text comes from `code`, not `message`.** The error contract says
  `message` is English and for developers. Map `code` to a translated string.
- All three locales in the same commit.
- `docs/architecture/api-repertoire.md` — **required**, the endpoint list is
  part of the contract.
- An ADR if a real alternative was rejected.
- `pnpm ai:map`, then `pnpm check`.

---

## Checklist

```
[ ] Shared type added, server-owned fields excluded
[ ] Migration applied AND client regenerated
[ ] DTO bounds every field; unknown properties rejected
[ ] Service method has JSDoc, unit spec, and a transaction if multi-statement
[ ] Integration test covers constraints, ordering and cascades
[ ] Guard on the controller, not in the service
[ ] E2E asserts 401 and 403, not just the happy path
[ ] Mutation cancels in-flight queries before writing optimistically
[ ] Error UI maps `code`, never renders `message`
[ ] api-*.md updated, ai:map regenerated, pnpm check green
```
