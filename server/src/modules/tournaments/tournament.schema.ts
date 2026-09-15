import { z } from 'zod';
const date = z.string().datetime();
const id = z.string().uuid();
const reason = z.string().trim().min(3).max(1000);
export const tournamentConfigSchema = z.object({
  name: z.string().trim().min(3).max(160), description: z.string().max(5000), location: z.string().trim().min(1).max(300),
  timezone: z.string().refine((v) => { try { new Intl.DateTimeFormat('en', { timeZone: v }); return true; } catch { return false; } }),
  startsAt: date, endsAt: date.optional(), rosterDeadlineAt: date, rostersPublicAt: date, rulesCutoffAt: date,
  capacity: z.number().int().min(2).max(128), rounds: z.number().int().min(1).max(7), roundMinutes: z.number().int().min(30).max(180),
  kind: z.enum(['COMMUNITY', 'COMPETITIVE']), scale: z.enum(['standard', 'skirmish']),
  registrationMode: z.enum(['OPEN', 'INVITE_ONLY']), listFormat: z.enum(['SINGLE', 'DUAL']),
  rules: z.string().max(10000), maps: z.string().max(3000).default(''), conductContact: z.string().max(300).default(''), accessibility: z.string().max(2000).optional(),
}).strict().superRefine((c, ctx) => {
  if (c.endsAt && c.endsAt < c.startsAt) ctx.addIssue({ code: 'custom', message: 'El fin del torneo debe ser posterior al comienzo.' });
  if (c.kind === 'COMPETITIVE' && (c.scale !== 'standard' || c.roundMinutes !== 150 || c.capacity < 12)) ctx.addIssue({ code: 'custom', message: 'Competitive: Standard, 150 minutes, 12–128 players.' });
  if (c.rulesCutoffAt > c.startsAt) ctx.addIssue({ code: 'custom', message: 'Rules cutoff must precede the event.' });
});
export const tournamentCommandSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('CONFIGURE'), config: tournamentConfigSchema }),
  z.object({ type: z.literal('DEADLINE'), deadline: date }),
  z.object({ type: z.literal('ROUND_COUNT'), rounds: z.number().int().min(1).max(7), reason }),
  z.object({ type: z.literal('PUBLISH') }),
  z.object({ type: z.literal('INVITATION'), revoke: z.boolean() }),
  z.object({ type: z.literal('JOIN'), race: z.enum(['ZERG', 'TERRAN', 'PROTOSS']), token: z.string().max(100).optional() }),
  z.object({ type: z.literal('ADD_GUEST'), name: z.string().trim().min(1).max(100), race: z.enum(['ZERG', 'TERRAN', 'PROTOSS']) }),
  z.object({ type: z.literal('GUEST_ROSTER'), playerId: id, slot: z.number().int().min(1).max(2), listId: id }),
  z.object({ type: z.literal('WITHDRAW'), playerId: id }),
  z.object({ type: z.literal('CHECK_IN'), playerId: id, checkedIn: z.boolean() }),
  z.object({ type: z.literal('ROSTER'), slot: z.number().int().min(1).max(2), listId: id }),
  z.object({ type: z.literal('CORRECT_ROSTER'), playerId: id, slot: z.number().int().min(1).max(2), listId: id, reason }),
  z.object({ type: z.literal('APPROVE'), playerId: id, rosterId: id, approved: z.boolean() }),
  z.object({ type: z.literal('START') }),
  z.object({ type: z.literal('GENERATE') }),
  z.object({ type: z.literal('EDIT_PAIRINGS'), round: z.number().int().min(1).max(7), matches: z.array(z.object({ id, table: z.number().int().min(1).max(128), players: z.tuple([id, id.nullable()]) })).min(1).max(64), reason, resetResults: z.boolean() }),
  z.object({ type: z.literal('PUBLISH_ROUND'), acceptWarning: z.boolean() }),
  z.object({ type: z.literal('START_ROUND') }),
  z.object({ type: z.literal('CLOSE_ROUND') }),
  z.object({ type: z.literal('RESULT'), matchId: id, missionId: z.string().min(1).max(200).nullable().optional(), vp: z.tuple([z.number().int().min(0).max(999), z.number().int().min(0).max(999)]), end: z.enum(['NORMAL', 'TIME', 'CONCESSION', 'NO_SHOW', 'GAME_LOSS']), winner: z.union([z.literal(0), z.literal(1)]).nullable(), rosterIds: z.tuple([id.nullable(), id.nullable()]), reason: z.string().max(1000) }),
  z.object({ type: z.literal('DISPUTE'), matchId: id, reason }),
  z.object({ type: z.literal('RESOLVE'), matchId: id, missionId: z.string().min(1).max(200).nullable().optional(), vp: z.tuple([z.number().int().min(0).max(999), z.number().int().min(0).max(999)]), end: z.enum(['NORMAL', 'TIME', 'CONCESSION', 'NO_SHOW', 'GAME_LOSS']), winner: z.union([z.literal(0), z.literal(1)]).nullable(), reason }),
  z.object({ type: z.literal('PENALTY'), playerId: id, penalty: z.enum(['CAUTION', 'WARNING', 'GAME_LOSS', 'DISQUALIFICATION']), reason }),
  z.object({ type: z.literal('COMPLETE') }),
  z.object({ type: z.literal('APPROVE_DQ'), index: z.number().int().nonnegative() }),
  z.object({ type: z.literal('CANCEL'), reason }),
  z.object({ type: z.literal('REOPEN'), reason }),
]);
export type TournamentCommand = z.infer<typeof tournamentCommandSchema>;
