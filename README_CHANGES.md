# Appraise frontend changes

This build has been repositioned from generic AI memory/vector retrieval to Appraise's stronger wedge: operational context and decision-ready reasoning for AI workflows.

## Changed
- Homepage hero now leads with contextual decision reasoning.
- Interactive demo now shows a recruiting workflow using `track()` and `context()`.
- SDK examples now use operational workflow signals instead of `memory.store()` and vector retrieval.
- Docs now focus on Track API + Context API.
- Dashboard and pricing copy were adjusted from memory/vector language to context/workflow language.
- Lint errors introduced by the edits were fixed. Existing lint warnings remain from unused imports/variables in the original dashboard files.

## Run locally
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

If you want to use Supabase auth locally, fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` inside `.env.local`.
